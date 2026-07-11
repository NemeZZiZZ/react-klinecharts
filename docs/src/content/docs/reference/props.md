---
title: KLineChartProps
description: Complete reference of all <KLineChart> props.
---

The complete prop surface of `<KLineChart>`. It extends `HTMLAttributes<HTMLDivElement>` (so any `div` attribute like `className`, `style`, `id`, `onClick` works) and omits only `children` (which is redefined to accept sub-components).

## Init-only

| Prop      | Type       | Description                                |
| --------- | ---------- | ------------------------------------------ |
| `options` | `Options`  | Chart initialization options. Applied once on mount. |

## Data

| Prop         | Type            | Description                                                     |
| ------------ | --------------- | --------------------------------------------------------------- |
| `data`       | `KLineData[]`   | Static data array. Replacing it re-applies; mutating doesn't.   |
| `dataLoader` | `DataLoader`    | Loader for streaming/pagination. Calls `setDataLoader`.         |
| `symbol`     | `SymbolInfo`    | Symbol info (ticker, precision). Calls `setSymbol`.             |
| `period`     | `Period`        | Time period `{ type, span }`. Calls `setPeriod`.                |

## Reactive

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

A reactive prop is forwarded only when it is **not `undefined`**.

## Events

| Prop                              | Payload              |
| --------------------------------- | -------------------- |
| `onReady`                         | `(chart: Chart)`     |
| `onZoom`                          | `{ scale: number }`  |
| `onChartScroll`                   | `{ distance: number }` |
| `onVisibleRangeChange`            | `VisibleRange`       |
| `onCrosshairChange`               | `Crosshair`          |
| `onCandleBarClick`                | `KLineData`          |
| `onPaneDrag`                      | `{ paneId: string }` |
| `onCandleTooltipFeatureClick`     | `unknown`            |
| `onIndicatorTooltipFeatureClick`  | `unknown`            |
| `onCrosshairFeatureClick`         | `unknown`            |

See the [Events guide](../guide/events/) for details.

## Ref & children

| Prop       | Type                  | Description                                       |
| ---------- | --------------------- | ------------------------------------------------- |
| `ref`      | `Ref<Chart>`          | Forwarded ref to the raw `Chart` instance.        |
| `children` | `ReactNode`           | Sub-components (`<KLineChart.Indicator>`, etc.).  |
