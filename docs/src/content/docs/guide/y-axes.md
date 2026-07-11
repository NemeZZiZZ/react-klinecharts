---
title: Y Axes
description: KlineCharts v10 multi-YAxis support via declarative components and hooks.
---

KlineCharts v10 introduced explicit **multi-YAxis** support: each pane can host more than one Y axis. `react-klinecharts` exposes this through `<KLineChart.YAxis>`, `useYAxis`, and `useYAxes`.

## Standalone Y axis

Add an extra Y axis to a pane with `<KLineChart.YAxis>`. It creates the axis on mount, overrides its config on change, and removes it on unmount.

```tsx
<KLineChart data={data}>
  {/* A secondary left axis on the candle pane */}
  <KLineChart.YAxis value={{ paneId: "candle", position: "left" }} />
</KLineChart>
```

### Props

| Prop    | Type             | Description                                                                 |
| ------- | ---------------- | --------------------------------------------------------------------------- |
| `value` | `YAxisOverride`  | Y axis config. `createYAxis` is idempotent, so changing `value` is safe.    |

`useYAxis` returns the axis id (or `null`).

```tsx
import { useYAxis } from "react-klinecharts";

function MyYAxis() {
  const id = useYAxis({ value: { paneId: "candle", position: "left" } });
  return null;
}
```

### `YAxisOverride` fields

All fields are optional except when used as a template (registered axis).

| Field               | Type                    | Description                                   |
| ------------------- | ----------------------- | --------------------------------------------- |
| `id`                | `string`                | Axis id (auto-assigned if omitted).           |
| `name`              | `string`                | Axis name (for lookup/removal).               |
| `paneId`            | `string`                | Target pane (defaults to `"candle"`).         |
| `position`          | `"left" \| "right"`     | Which side of the pane to render on.          |
| `reverse`           | `boolean`               | Invert the axis.                              |
| `inside`            | `boolean`               | Render inside the plot area.                  |
| `scrollZoomEnabled` | `boolean`               | Allow scroll-to-zoom on the axis.             |
| `gap`               | `{ top?, bottom? }`     | Padding at the top/bottom of the axis range.  |
| `createRange`       | `AxisCreateRangeCallback` | Custom range calculation.                    |
| `createTicks`       | `AxisCreateTicksCallback` | Custom tick generation.                      |
| `needWidget`        | `boolean`               | (YAxis only) whether a widget is needed.      |

## Per-indicator Y axis

To configure the axis of an **indicator's own pane**, use the `yAxis` prop on `<KLineChart.Indicator>` / `useIndicator`:

```tsx
<KLineChart.Indicator
  value="RSI"
  pane={{ height: 100 }}
  yAxis={{ reverse: false, position: "right" }}
/>
```

This is applied via `overrideYAxis` against the axis that `createIndicator` created for the indicator.

## Reading Y axes reactively

`useYAxes(filter?)` reads `chart.getYAxes()` and re-renders whenever the visible range changes (which fires after axis-affecting operations).

```tsx
import { useYAxes } from "react-klinecharts";

function AxisList() {
  const axes = useYAxes({ paneId: "candle" });
  return <span>{axes.map((a) => a.id).join(", ")}</span>;
}
```

Returns `YAxis[]` (empty array before the chart initializes).

## Imperative API

For one-off operations, use the ref:

```tsx
const chartRef = useRef<Chart>(null);

chartRef.current?.createYAxis({ paneId: "candle", position: "left" });
chartRef.current?.removeYAxis({ id: "my-axis" });
chartRef.current?.getYAxes({ paneId: "candle" });
chartRef.current?.overrideYAxis({ id: "my-axis", reverse: true });
```

:::caution
`removeYAxis` requires an `id` **or** `name` in its filter — calling it with neither is a no-op (KlineCharts warns).
:::
