---
title: useChartEvent
description: Subscribe to any chart action with a typed, ref-stable callback.
---

`useChartEvent(type, callback)` subscribes to a chart action. The callback is stored in a ref, so its identity can change every render without re-subscribing. The argument is strongly typed based on the action type.

```tsx
import { useChartEvent } from "react-klinecharts";

function Logger() {
  useChartEvent("onCrosshairChange", (crosshair) => {
    console.log("Crosshair:", crosshair?.x, crosshair?.y);
  });
  useChartEvent("onZoom", ({ scale }) => {
    console.log("Zoom scale:", scale);
  });
  return null;
}
```

## Signature

```ts
function useChartEvent<T extends ActionType>(
  type: T,
  callback: TypedActionCallback<T>,
): void
```

## Available action types

`"onZoom"`, `"onScroll"`, `"onVisibleRangeChange"`, `"onCrosshairChange"`, `"onCandleBarClick"`, `"onPaneDrag"`, `"onCandleTooltipFeatureClick"`, `"onIndicatorTooltipFeatureClick"`, `"onCrosshairFeatureClick"`.

## Why this instead of props?

Use `useChartEvent` when you need to react to a chart action from a **nested component** that isn't `<KLineChart>` itself. The state-tracking hooks (`useCrosshair`, `useVisibleRange`, …) are built on top of it.
