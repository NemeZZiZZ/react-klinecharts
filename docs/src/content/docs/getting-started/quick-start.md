---
title: Quick Start
description: Render your first chart with data, indicators, and event callbacks.
---

This guide walks through the most common `react-klinecharts` patterns: static data, indicators, overlays, typed events, and the imperative ref escape hatch.

## A minimal chart

```tsx
import { KLineChart } from "react-klinecharts";

const data = [
  { timestamp: 1680000000000, open: 28000, high: 28500, low: 27800, close: 28200, volume: 100 },
  // ...
];

export default function App() {
  return (
    <KLineChart
      data={data}
      symbol={{ ticker: "BTC/USDT" }}
      period={{ type: "minute", span: 15 }}
      style={{ width: "100%", height: 600 }}
    />
  );
}
```

That's it. `<KLineChart>` mounts a KlineCharts instance into a container `div`, applies your props via `useEffect`, and disposes the chart on unmount. The `style` prop (and any other `div` attribute) is passed straight through to the container.

## Indicators & overlays

Add indicators and overlays as declarative children. They manage their own lifecycle (create on mount, remove on unmount, override on change).

```tsx
<KLineChart data={data}>
  {/* MA on the main candle pane, stacked */}
  <KLineChart.Indicator value={{ name: "MA", calcParams: [5, 10, 30] }} />

  {/* VOL in its own pane with a custom height */}
  <KLineChart.Indicator value="VOL" pane={{ height: 80 }} />

  {/* A drawing overlay */}
  <KLineChart.Overlay value="priceSegment" />
</KLineChart>
```

:::tip
`pane` is a `Partial<PaneOptions>` — pass only the fields you care about (`height`, `dragEnabled`, `state`, …). It's applied to the indicator's pane via `setPaneOptions`.
:::

## Typed events

Event callbacks are strongly typed — the argument matches the payload KlineCharts emits for that action.

```tsx
<KLineChart
  data={data}
  onCrosshairChange={(crosshair) => {
    // crosshair is typed as Crosshair | null — no casts needed
    console.log(crosshair?.kLineData?.close);
  }}
  onCandleBarClick={(bar) => {
    console.log("Clicked bar close:", bar.close); // bar is KLineData
  }}
  onZoom={({ scale }) => console.log("Zoom scale:", scale)}
/>
```

See the [Events](../guide/events/) guide for the full list.

## The ref escape hatch

For anything not covered by declarative props, forward a `ref` to get the raw `Chart` instance:

```tsx
import { useRef } from "react";
import { KLineChart, type Chart } from "react-klinecharts";

export default function App() {
  const chartRef = useRef<Chart>(null);

  return (
    <>
      <button onClick={() => chartRef.current?.scrollToRealTime(300)}>
        Jump to now
      </button>
      <button onClick={() => chartRef.current?.zoomAtCoordinate(1.5)}>
        Zoom in
      </button>
      <button
        onClick={() => {
          const url = chartRef.current?.getConvertPictureUrl(true, "png");
          // ...download url
        }}
      >
        Export PNG
      </button>

      <KLineChart ref={chartRef} data={data} style={{ height: 500 }} />
    </>
  );
}
```

## Streaming / realtime data

For live data, pass a `dataLoader` instead of a static `data` array. KlineCharts owns the data flow and calls your loader on init, on scroll-back (history), and via the subscribe channel for realtime updates.

```tsx
const loader: DataLoader = {
  getBars: ({ callback }) => {
    callback(loadInitialBars(), { forward: false, backward: false });
  },
  subscribeBar: ({ callback }) => {
    const ws = openWebSocket();
    ws.onmessage = (e) => callback(parseTick(e.data));
  },
  unsubscribeBar: () => closeWebSocket(),
};

<KLineChart dataLoader={loader} symbol={{ ticker: "BTC/USDT" }} period={{ type: "minute", span: 1 }} />
```

Next, dive into the [Core Concepts](../guide/core-concepts/) to understand how the wrapper maps React onto KlineCharts.
