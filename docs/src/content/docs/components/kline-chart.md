---
title: <KLineChart>
description: The core component. Manages chart lifecycle and provides context for hooks and sub-components.
---

`<KLineChart>` is the core component. It mounts a KlineCharts instance, applies reactive props via `useEffect`, and provides a context for hooks and sub-components.

All standard HTML `div` attributes (`className`, `style`, `id`, …) are passed through to the container element. The native DOM `onScroll` is passed through unchanged; chart scroll events use [`onChartScroll`](#event-callbacks).

```tsx
<KLineChart
  data={data}
  symbol={{ ticker: "BTC/USDT" }}
  period={{ type: "minute", span: 15 }}
  styles={{ candle: { type: "area" } }}
  style={{ width: "100%", height: 600 }}
  onCrosshairChange={(c) => console.log(c)}
>
  <KLineChart.Indicator value="VOL" pane={{ height: 80 }} />
</KLineChart>
```

## Init-only props

| Prop      | Type    | Description                              |
| --------- | ------- | ---------------------------------------- |
| `options` | `Options` | Chart initialization options. Applied once on mount. |

## Data props

| Prop         | Type                                                       | Description                                         |
| ------------ | ---------------------------------------------------------- | --------------------------------------------------- |
| `data`       | `KLineData[]`                                              | Static data array. Replacing it re-applies.          |
| `dataLoader` | `DataLoader`                                               | Loader for streaming/pagination. Calls `setDataLoader`. |
| `symbol`     | `PickPartial<SymbolInfo, "pricePrecision" \| "volumePrecision">` | Symbol info. Calls `setSymbol`. |
| `period`     | `Period`                                                   | Time period `{ type, span }`. Calls `setPeriod`.     |

## Reactive props

These are synced to the chart via `useEffect`. A prop is only forwarded when it is **not `undefined`**.

| Prop                      | Type                                              | Chart method                  |
| ------------------------- | ------------------------------------------------- | ----------------------------- |
| `styles`                  | `string \| DeepPartial<Styles>`                   | `setStyles()`                 |
| `locale`                  | `string`                                          | `setLocale()`                 |
| `timezone`                | `string`                                          | `setTimezone()`               |
| `formatter`               | `Partial<Formatter>`                              | `setFormatter()`              |
| `thousandsSeparator`      | `Partial<ThousandsSeparator>`                     | `setThousandsSeparator()`     |
| `decimalFold`             | `Partial<DecimalFold>`                            | `setDecimalFold()`            |
| `zoomEnabled`             | `boolean`                                         | `setZoomEnabled()`            |
| `scrollEnabled`           | `boolean`                                         | `setScrollEnabled()`          |
| `zoomAnchor`              | `ZoomAnchorType \| Partial<ZoomAnchor>`           | `setZoomAnchor()`             |
| `offsetRightDistance`     | `number`                                          | `setOffsetRightDistance()`    |
| `maxOffsetLeftDistance`   | `number`                                          | `setMaxOffsetLeftDistance()`  |
| `maxOffsetRightDistance`  | `number`                                          | `setMaxOffsetRightDistance()` |
| `leftMinVisibleBarCount`  | `number`                                          | `setLeftMinVisibleBarCount()` |
| `rightMinVisibleBarCount` | `number`                                          | `setRightMinVisibleBarCount()`|
| `barSpace`                | `number`                                          | `setBarSpace()`               |
| `hotkey`                  | `Partial<Hotkey>`                                 | `setHotkey()`                 |
| `xAxis`                   | `XAxisOverride`                                   | `overrideXAxis()`             |
| `yAxis`                   | `YAxisOverride`                                   | `overrideYAxis()`             |

## Event callbacks

Event callbacks are **strongly typed** — the argument matches the payload KlineCharts emits for that action. See the [Events guide](../guide/events/) for details.

| Prop                              | Signature                              | Description                          |
| --------------------------------- | -------------------------------------- | ------------------------------------ |
| `onReady`                         | `(chart: Chart) => void`               | Fired after chart initialization     |
| `onZoom`                          | `(data: { scale }) => void`            | Chart zoom                           |
| `onChartScroll`                   | `(data: { distance }) => void`         | Chart scroll                         |
| `onVisibleRangeChange`            | `(data: VisibleRange) => void`         | Visible range changed                |
| `onCrosshairChange`               | `(data: Crosshair) => void`            | Crosshair moved                      |
| `onCandleBarClick`                | `(data: KLineData) => void`            | Candle bar clicked                   |
| `onPaneDrag`                      | `(data: { paneId }) => void`           | Pane dragged                         |
| `onCandleTooltipFeatureClick`     | `(data: unknown) => void`              | Candle tooltip feature clicked       |
| `onIndicatorTooltipFeatureClick`  | `(data: unknown) => void`              | Indicator tooltip feature clicked    |
| `onCrosshairFeatureClick`         | `(data: unknown) => void`              | Crosshair feature clicked            |

## Ref

Forward a ref to access the raw `Chart` instance:

```tsx
const chartRef = useRef<Chart>(null);
<KLineChart ref={chartRef} data={data} />;
chartRef.current?.scrollToRealTime();
chartRef.current?.getConvertPictureUrl(true, "png");
```

## Sub-components

`<KLineChart>` has static sub-component properties:

- [`<KLineChart.Indicator>`](./indicator/)
- [`<KLineChart.Overlay>`](./overlay/)
- [`<KLineChart.YAxis>`](./y-axis/)
- [`<KLineChart.Widget>`](./widget/)
