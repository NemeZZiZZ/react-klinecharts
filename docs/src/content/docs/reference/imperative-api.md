---
title: Imperative API
description: The full Chart instance accessible via ref.
---

For operations not covered by declarative props, forward a `ref` to access the raw KlineCharts `Chart` instance.

```tsx
import { useRef } from "react";
import { KLineChart, type Chart } from "react-klinecharts";

const chartRef = useRef<Chart>(null);
<KLineChart ref={chartRef} data={data} />;
```

## Navigation

```ts
chart.scrollByDistance(distance, animationDuration?)
chart.scrollToRealTime(animationDuration?)
chart.scrollToDataIndex(dataIndex, animationDuration?)
chart.scrollToTimestamp(timestamp, animationDuration?)
```

## Zoom

```ts
chart.zoomAtCoordinate(scale, coordinate?, animationDuration?)
chart.zoomAtDataIndex(scale, dataIndex, animationDuration?)
chart.zoomAtTimestamp(scale, timestamp, animationDuration?)
```

## Data queries

```ts
chart.getDataList(): KLineData[]
chart.getVisibleRange(): VisibleRange
chart.getBarSpace(): BarSpace
```

## Coordinate conversion

```ts
chart.convertToPixel(points, filter?): Partial<Coordinate> | Array<Partial<Coordinate>>
chart.convertFromPixel(coordinates, filter?): Partial<Point> | Array<Partial<Point>>
```

## Pane management

```ts
chart.setPaneOptions(options: Partial<PaneOptions>): void
chart.getPaneOptions(id?): Nullable<PaneOptions> | PaneOptions[]
```

## Y axis management (v10 multi-YAxis)

```ts
chart.createYAxis(yAxis: YAxisOverride): Nullable<string>
chart.removeYAxis(filter: YAxisFilter): boolean   // requires id or name
chart.getYAxes(filter: YAxisFilter): YAxis[]
chart.overrideYAxis(yAxis: YAxisOverride): void
```

## Indicator & overlay operations

```ts
chart.createIndicator(value, isStack?): Nullable<string>
chart.getIndicators(filter?): Indicator[]
chart.overrideIndicator(override: IndicatorCreate): boolean
chart.removeIndicator(filter?): boolean

chart.createOverlay(value): Nullable<string> | Array<Nullable<string>>
chart.getOverlays(filter?): Overlay[]
chart.overrideOverlay(override): boolean
chart.removeOverlay(filter?): boolean
```

## DOM access

```ts
chart.getDom(paneId?, position?): Nullable<HTMLElement>
chart.getSize(paneId?, position?): Nullable<Bounding>
```

## Export & misc

```ts
chart.getConvertPictureUrl(includeOverlay?, type?, backgroundColor?): string
chart.resize(): void
```

See the [KlineCharts API documentation](https://klinecharts.com) for the authoritative reference.
