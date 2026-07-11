---
title: Data Loading
description: Feed the chart static data, or stream realtime bars with a DataLoader.
---

There are two ways to get data into the chart: a static `data` array, or a `dataLoader` for streaming and pagination.

## Static data

Pass an array of `KLineData`. Replacing the array re-applies the data; mutating it in place does **not**.

```tsx
const [data, setData] = useState<KLineData[]>(initialBars);

<KLineChart data={data} />;

// Later: a new reference triggers a reload
setData((prev) => [...prev, newBar]);
```

Under the hood, a static `data` array is wrapped in a minimal loader that reports `{ forward: false, backward: false }` — i.e. there is no older history to load on scroll-left.

## DataLoader (recommended for real apps)

For realtime data and history pagination, implement a `DataLoader`. KlineCharts owns the data flow and calls your methods at the right times.

```ts
interface DataLoader {
  getBars: (params: DataLoaderGetBarsParams) => void | Promise<void>;
  subscribeBar?: (params: DataLoaderSubscribeBarParams) => void;
  unsubscribeBar?: (params: DataLoaderUnsubscribeBarParams) => void;
}
```

- **`getBars`** — called on init and when the user scrolls left past the available bars (`type: "forward"`). Call `callback(data, more)` with the bars and whether more history is available in each direction.
- **`subscribeBar`** — call `callback(bar)` to push realtime updates (a new bar, or an updated current bar).
- **`unsubscribeBar`** — clean up (close sockets, clear timers).

### Example: synthetic realtime feed

```tsx
import { useMemo } from "react";
import type { DataLoader } from "react-klinecharts";

function useRealtimeLoader(): DataLoader {
  return useMemo(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let lastBar: KLineData | null = null;

    return {
      getBars: ({ callback }) => {
        const data = generateInitialBars();
        lastBar = data[data.length - 1];
        callback(data, { forward: false, backward: false });
      },
      subscribeBar: ({ callback }) => {
        intervalId = setInterval(() => {
          if (!lastBar) return;
          lastBar = nextTick(lastBar);
          callback(lastBar);
        }, 500);
      },
      unsubscribeBar: () => {
        if (intervalId) clearInterval(intervalId);
      },
    };
  }, []);
}

<KLineChart dataLoader={useRealtimeLoader()} symbol={{ ticker: "DEMO" }} period={{ type: "minute", span: 1 }} />
```

### Example: exchange REST + WebSocket (Binance)

```tsx
const loader: DataLoader = {
  getBars: async ({ type, callback }) => {
    if (type === "init") {
      const history = await fetchKlines(symbol, period);
      callback(history, { forward: true, backward: false });
    } else if (type === "forward") {
      const older = await fetchOlderBars(symbol, period);
      callback(older, { forward: older.length > 0, backward: false });
    }
  },
  subscribeBar: ({ callback }) => {
    const ws = new WebSocket(`wss://stream.exchange.com/${symbol}@kline`);
    ws.onmessage = (e) => callback(parseTick(JSON.parse(e.data)));
    return () => ws.close();
  },
};
```

## Symbol & period

`symbol` and `period` are serialized (not compared by reference) before becoming effect dependencies, so passing an inline object won't trigger a redundant reload:

```tsx
// Safe — these are stable across renders even though the object is inline
<KLineChart
  symbol={{ ticker: "BTC/USDT", pricePrecision: 2 }}
  period={{ type: "minute", span: 15 }}
/>
```

Changing the symbol or period triggers `chart.setSymbol()` / `chart.setPeriod()`, which in turn asks your `dataLoader` for fresh bars.
