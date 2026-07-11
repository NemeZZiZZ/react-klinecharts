---
title: Events
description: Subscribe to chart actions with strongly-typed callbacks.
---

KlineCharts emits "actions" (zoom, scroll, crosshair move, clicks, …). `react-klinecharts` exposes them as typed React props and a `useChartEvent` hook.

## As component props

Pass callbacks directly to `<KLineChart>`. Each is strongly typed — the argument matches the payload KlineCharts emits.

```tsx
<KLineChart
  data={data}
  onZoom={({ scale }) => console.log("scale:", scale)}
  onCrosshairChange={(crosshair) => console.log(crosshair?.kLineData?.close)}
  onCandleBarClick={(bar) => console.log("clicked:", bar.close)}
  onVisibleRangeChange={(range) => console.log(`${range.from}..${range.to}`)}
/>
```

### Available callbacks

| Prop                            | Payload              | Fires when                                   |
| ------------------------------- | -------------------- | -------------------------------------------- |
| `onReady`                       | `(chart: Chart)`     | Chart initialized (not an action).           |
| `onZoom`                        | `{ scale: number }`  | Chart zoom.                                  |
| `onChartScroll`                 | `{ distance }`       | Chart scroll (renamed to avoid clashing with the native DOM `onScroll`). |
| `onVisibleRangeChange`          | `VisibleRange`       | Visible data range changes.                  |
| `onCrosshairChange`             | `Crosshair \| null`  | Crosshair moves / leaves.                    |
| `onCandleBarClick`              | `KLineData`          | A candle bar is clicked.                     |
| `onPaneDrag`                    | `{ paneId: string }` | A pane is dragged.                           |
| `onCandleTooltipFeatureClick`   | `unknown`            | Candle tooltip feature clicked.              |
| `onIndicatorTooltipFeatureClick`| `unknown`            | Indicator tooltip feature clicked.           |
| `onCrosshairFeatureClick`       | `unknown`            | Crosshair feature clicked.                   |

:::note[`onChartScroll` vs `onScroll`]
The chart scroll action is exposed as `onChartScroll`. The native DOM `onScroll` handler is passed through to the container `<div>` unchanged — so both work independently.
:::

## As a hook

For nested components, use `useChartEvent`. The callback is stored in a ref, so its identity can change every render without re-subscribing.

```tsx
import { useChartEvent } from "react-klinecharts";

function Logger() {
  useChartEvent("onCrosshairChange", (crosshair) => {
    console.log("x:", crosshair?.x, "y:", crosshair?.y);
  });
  return null;
}
```

The callback argument is typed based on the action type — `useChartEvent("onZoom", (data) => ...)` gives you `{ scale: number }`, not `unknown`.

## Typed payload helpers

The wrapper exports `ActionPayloadMap` and `TypedActionCallback<T>` so you can reuse the payload types in your own code:

```tsx
import type { ActionPayloadMap, TypedActionCallback, ActionType } from "react-klinecharts";

type ZoomPayload = ActionPayloadMap["onZoom"]; // { scale: number }
const handler: TypedActionCallback<"onZoom"> = ({ scale }) => {};
```

## How it works

Each subscription is wired through a stable wrapper that reads the latest callback from a ref. This avoids the classic React pitfall where an inline event handler captures stale state — you always get the freshest closure, and KlineCharts never sees a subscription churn.
