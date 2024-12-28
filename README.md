# react-klinecharts

A flexible React wrapper for [KlineCharts](https://klinecharts.com) with hooks, declarative sub-components, and full TypeScript support.

[Live Demo](https://nemezzizz.github.io/react-klinecharts/)

- Declarative props for all reactive chart settings
- `<KLineChart.Indicator>` and `<KLineChart.Overlay>` sub-components
- `useKLineChart`, `useIndicator`, `useOverlay`, `useChartEvent` hooks
- Full imperative access via ref
- Re-exports all klinecharts types and utilities
- Zero extra dependencies (native `ResizeObserver`)

## Installation

```bash
pnpm add react-klinecharts
# or
npm install react-klinecharts
```

Peer dependencies: `react >= 17`, `react-dom >= 17`.

## Quick Start

```tsx
import { KLineChart, type Chart } from "react-klinecharts";
import { useRef } from "react";

function App() {
  const chartRef = useRef<Chart>(null);

  const data = [
    { timestamp: 1680000000000, open: 28000, high: 28500, low: 27800, close: 28200, volume: 100 },
    // ...
  ]

  return (
    <KLineChart
      ref={chartRef}
      data={data}
      symbol={{ ticker: "BTC/USDT" }}
      period={{ type: "minute", span: 15 }}
      style={{ width: "100%", height: 600 }}
    >
      <KLineChart.Indicator value={{ name: "MA", calcParams: [5, 10, 30] }} />
      <KLineChart.Indicator value="VOL" paneOptions={{ height: 80 }} />
    </KLineChart>
  );
}
```

## API Reference

### `<KLineChart>`

The core component. Manages chart lifecycle, provides context for hooks and sub-components.

All standard HTML `div` attributes (`className`, `style`, `id`, etc.) are passed through to the container element.

#### Init-only Props

| Prop | Type | Description |
|------|------|-------------|
| `options` | `Options` | Chart initialization options. Applied once on mount. |

#### Data Props

| Prop | Type | Description |
|------|------|-------------|
| `data` | `KLineData[]` | Static data array to apply to the chart. |
| `dataLoader` | `DataLoader` | Data loader with `getBars`, `subscribeBar`, `unsubscribeBar`. Calls `setDataLoader`. |
| `symbol` | `SymbolInfo` | Symbol info (ticker, precision). Calls `setSymbol`. |
| `period` | `Period` | Time period (`{ type, span }`). Calls `setPeriod`. |

#### Reactive Props

These props are synced to the chart instance via `useEffect`. Changing them updates the chart without re-initialization.

| Prop | Type | Chart Method |
|------|------|-------------|
| `styles` | `string \| DeepPartial<Styles>` | `setStyles()` |
| `locale` | `string` | `setLocale()` |
| `timezone` | `string` | `setTimezone()` |
| `formatter` | `Partial<Formatter>` | `setFormatter()` |
| `thousandsSeparator` | `Partial<ThousandsSeparator>` | `setThousandsSeparator()` |
| `decimalFold` | `Partial<DecimalFold>` | `setDecimalFold()` |
| `zoomEnabled` | `boolean` | `setZoomEnabled()` |
| `scrollEnabled` | `boolean` | `setScrollEnabled()` |
| `zoomAnchor` | `ZoomAnchorType \| Partial<ZoomAnchor>` | `setZoomAnchor()` |
| `offsetRightDistance` | `number` | `setOffsetRightDistance()` |
| `maxOffsetLeftDistance` | `number` | `setMaxOffsetLeftDistance()` |
| `maxOffsetRightDistance` | `number` | `setMaxOffsetRightDistance()` |
| `leftMinVisibleBarCount` | `number` | `setLeftMinVisibleBarCount()` |
| `rightMinVisibleBarCount` | `number` | `setRightMinVisibleBarCount()` |
| `barSpace` | `number` | `setBarSpace()` |

#### Event Callbacks

| Prop | Description |
|------|-------------|
| `onReady` | `(chart: Chart) => void` — fired after chart initialization |
| `onZoom` | Chart zoom event |
| `onScroll` | Chart scroll event |
| `onVisibleRangeChange` | Visible data range changed |
| `onCrosshairChange` | Crosshair position changed |
| `onCandleBarClick` | Candle bar clicked |
| `onPaneDrag` | Pane drag event |
| `onCandleTooltipFeatureClick` | Candle tooltip feature clicked |
| `onIndicatorTooltipFeatureClick` | Indicator tooltip feature clicked |
| `onCrosshairFeatureClick` | Crosshair feature clicked |

### `<KLineChart.Indicator>`

Declarative indicator management. Renders nothing — purely manages indicator lifecycle.

```tsx
<KLineChart.Indicator
  value={{ name: "MA", calcParams: [5, 10, 30] }}
  isStack={false}
  paneOptions={{ height: 100 }}
/>

// Or simply by name:
<KLineChart.Indicator value="VOL" />
```

| Prop | Type | Description |
|------|------|-------------|
| `value` | `string \| IndicatorCreate` | Indicator name or full config |
| `isStack` | `boolean` | Stack on existing indicators in same pane |
| `paneOptions` | `PaneOptions` | Options for the indicator pane |

### `<KLineChart.Overlay>`

Declarative overlay (drawing tool) management. Renders nothing — purely manages overlay lifecycle.

```tsx
<KLineChart.Overlay
  value={{
    name: "segment",
    points: [
      { timestamp: 1234567890000, value: 100 },
      { timestamp: 1234567900000, value: 200 },
    ],
  }}
/>
```

| Prop | Type | Description |
|------|------|-------------|
| `value` | `string \| OverlayCreate \| Array<string \| OverlayCreate>` | Overlay config(s) |

### `<KLineChart.Widget>`

Declarative portal component that injects standard HTML/React elements directly into the chart DOM utilizing `createPortal` and the native `chart.getDom()` method.

```tsx
<KLineChart.Widget paneId="candle" position="main">
  <div className="custom-tooltip">My interactive React tooltip!</div>
</KLineChart.Widget>
```

| Prop | Type | Description |
|------|------|-------------|
| `paneId` | `string` | ID of the pane to inject into (e.g. `"candle"`, `"xAxis"`, or custom indicator pane IDs). If undefined, binds to root container. |
| `position` | `"root" \| "main" \| "yAxis"` | Layer position relative to the pane. Default is `"main"`. |

### Hooks

#### `useKLineChart()`

Access the `Chart` instance from any descendant of `<KLineChart>`.

```tsx
function MyComponent() {
  const chart = useKLineChart();
  // chart is Chart | null
  return <button onClick={() => chart?.scrollToRealTime()}>Go to now</button>;
}
```

#### `useIndicator(options)`

Manages indicator lifecycle. Creates on mount, removes on unmount, overrides on config change.

```tsx
function MyIndicator() {
  const paneId = useIndicator({
    value: { name: "RSI", calcParams: [14] },
    paneOptions: { height: 80 },
  });
  return null;
}
```

#### `useOverlay(options)`

Manages overlay lifecycle. Creates on mount, removes on unmount, overrides on config change.

```tsx
function MyOverlay() {
  const id = useOverlay({
    value: { name: "priceLine", points: [{ value: 50000 }] },
  });
  return null;
}
```

#### `useChartEvent(type, callback)`

Subscribe to chart action events with a stable ref-based handler.

```tsx
function Logger() {
  useChartEvent("onCrosshairChange", (data) => {
    console.log("Crosshair:", data);
  });
  return null;
}
```

Available event types: `"onZoom"`, `"onScroll"`, `"onVisibleRangeChange"`, `"onCrosshairChange"`, `"onCandleBarClick"`, `"onPaneDrag"`, `"onCandleTooltipFeatureClick"`, `"onIndicatorTooltipFeatureClick"`, `"onCrosshairFeatureClick"`.

### Imperative API (ref)

For operations not covered by declarative props, use the `Chart` ref:

```tsx
const chartRef = useRef<Chart>(null);

// Navigation
chartRef.current?.scrollToRealTime(300);
chartRef.current?.scrollToTimestamp(timestamp);
chartRef.current?.zoomAtCoordinate(1.5);

// Data queries
chartRef.current?.getDataList();
chartRef.current?.getVisibleRange();
chartRef.current?.getBarSpace();

// Coordinate conversion
chartRef.current?.convertToPixel(points, filter);
chartRef.current?.convertFromPixel(coordinates, filter);

// Export
chartRef.current?.getConvertPictureUrl(true, "png");

// DOM access
chartRef.current?.getDom(paneId, position);
chartRef.current?.getSize(paneId, position);

// Pane management
chartRef.current?.setPaneOptions(options);
chartRef.current?.getPaneOptions(id);

// Imperative indicator/overlay operations
chartRef.current?.createIndicator(value, isStack, paneOptions);
chartRef.current?.getIndicators(filter);
chartRef.current?.createOverlay(value);
chartRef.current?.getOverlays(filter);
```

See the full [KlineCharts API documentation](https://klinecharts.com) for all available methods.

### Registration Functions

Module-level registration functions are re-exported from klinecharts:

```tsx
import {
  registerIndicator,
  registerOverlay,
  registerFigure,
  registerLocale,
  registerStyles,
  registerXAxis,
  registerYAxis,
} from "react-klinecharts";

// Register a custom indicator
registerIndicator({
  name: "MyIndicator",
  calc: (dataList) => {
    return dataList.map((d) => ({ value: d.close }));
  },
  figures: [{ key: "value", title: "VAL: ", type: "line" }],
});
```

### Type Re-exports

All klinecharts types are re-exported for convenience:

```tsx
import type {
  Chart,
  KLineData,
  Styles,
  Options,
  Indicator,
  IndicatorCreate,
  Overlay,
  OverlayCreate,
  Crosshair,
  ActionType,
  ActionCallback,
  DataLoader,
  SymbolInfo,
  Period,
  // ... all klinecharts types
} from "react-klinecharts";
```

## Examples

### Custom Indicator with Hooks

```tsx
function BollingerBands({ period = 20 }: { period?: number }) {
  useIndicator({
    value: { name: "BOLL", calcParams: [period, 2] },
  });
  return null;
}

function App() {
  const [period, setPeriod] = useState(20);

  return (
    <KLineChart dataLoader={loader} symbol={symbol} period={period_}>
      <BollingerBands period={period} />
    </KLineChart>
  );
}
```

### Theming

```tsx
<KLineChart
  dataLoader={loader}
  symbol={symbol}
  period={period}
  styles={{
    grid: { show: false },
    candle: {
      type: "area",
      area: {
        lineColor: "#2196F3",
        backgroundColor: [
          { offset: 0, color: "rgba(33, 150, 243, 0.3)" },
          { offset: 1, color: "rgba(33, 150, 243, 0)" },
        ],
      },
    },
  }}
/>
```

### Custom Locale

```tsx
import { registerLocale } from "react-klinecharts";

registerLocale("ru-RU", {
  time: "Время",
  open: "Откр.",
  high: "Макс.",
  low: "Мин.",
  close: "Закр.",
  volume: "Объём",
  change: "Изм.",
  turnover: "Оборот",
  second: "сек",
  minute: "мин",
  hour: "час",
  day: "дн",
  week: "нед",
  month: "мес",
  year: "год",
});

<KLineChart locale="ru-RU" ... />
```

## Architecture

```
src/
  index.ts                    # Public API barrel export
  types.ts                    # React-specific types
  KLineChartContext.ts        # React context for chart instance
  KLineChart.tsx              # Core component
  hooks/
    useKLineChart.ts          # Context-based chart access
    useChartEvent.ts          # Event subscription hook
    useIndicator.ts           # Indicator lifecycle hook
    useOverlay.ts             # Overlay lifecycle hook
  components/
    Indicator.tsx             # <KLineChart.Indicator>
    Overlay.tsx               # <KLineChart.Overlay>
```

**Design principles:**

- **Thin wrapper** — never re-implements what klinecharts already does
- **Reactive props** drive `useEffect` calls to chart methods
- **Ref escape hatch** exposes the full `Chart` instance for imperative operations
- **Context** enables hooks and sub-components in descendants
- **Stable event subscriptions** — callbacks stored in refs, no re-subscribe churn
- **Natural cleanup order** — React unmounts children before parent, so indicators/overlays clean up before `dispose()`

## Development

```bash
pnpm install
pnpm build          # Build library
pnpm dev            # Build in watch mode
pnpm typecheck      # TypeScript type check

# Run example
cd example
pnpm install
pnpm dev
```

## License

MIT
