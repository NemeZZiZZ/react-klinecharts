---
title: Type Re-exports
description: All KlineCharts types plus wrapper-specific helper types.
---

All KlineCharts types are re-exported for convenience, plus the wrapper's own helper types. Import everything from `react-klinecharts`:

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
  // wrapper-specific
  ActionPayloadMap,
  TypedActionCallback,
  // ...all KlineCharts types
} from "react-klinecharts";
```

## Wrapper-specific types

| Type                                  | Description                                                        |
| ------------------------------------- | ------------------------------------------------------------------ |
| `KLineChartProps`                     | Props of `<KLineChart>`.                                            |
| `UseIndicatorOptions`                 | Options for `useIndicator` / `<KLineChart.Indicator>`.             |
| `UseOverlayOptions`                   | Options for `useOverlay` / `<KLineChart.Overlay>`.                 |
| `UseYAxisOptions`                     | Options for `useYAxis` / `<KLineChart.YAxis>`.                     |
| `IndicatorProps` / `OverlayProps` / `YAxisProps` / `WidgetProps` | Sub-component prop aliases.               |
| `ActionPayloadMap`                    | Maps each `ActionType` to its payload type.                        |
| `TypedActionCallback<T extends ActionType>` | Strongly-typed callback for a chart action.                  |

## `ActionPayloadMap`

```ts
interface ActionPayloadMap {
  onZoom: { scale: number };
  onScroll: { distance: number };
  onVisibleRangeChange: VisibleRange;
  onCrosshairChange: Crosshair;
  onCandleBarClick: KLineData;
  onPaneDrag: { paneId: string };
  onCandleTooltipFeatureClick: unknown;
  onIndicatorTooltipFeatureClick: unknown;
  onCrosshairFeatureClick: unknown;
}
```

This is what makes the event callbacks and `useChartEvent` strongly typed.

## Context type

```ts
interface KLineChartContextValue {
  chart: Chart | null;
}
```

Exposed via `KLineChartContext` and consumed by `useKLineChart`.
