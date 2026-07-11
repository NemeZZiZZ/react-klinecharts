---
title: Hooks Overview
description: All react-klinecharts hooks at a glance.
---

`react-klinecharts` ships two kinds of hooks:

- **Lifecycle hooks** mirror the declarative sub-components and are useful when you want the behavior without rendering a child (`useIndicator`, `useOverlay`, `useYAxis`).
- **State-tracking hooks** subscribe to chart actions and re-render the host component when the tracked value changes.

## Lifecycle hooks

| Hook                                   | Returns                       | Manages                                              |
| -------------------------------------- | ----------------------------- | ---------------------------------------------------- |
| [`useIndicator`](./use-indicator/)     | `Nullable<string>` (id)       | Indicator create/override/remove.                    |
| [`useOverlay`](./use-overlay/)         | `Nullable<string> \| Array`   | Overlay create/override/remove.                      |
| [`useYAxis`](./use-y-axis/)            | `Nullable<string>` (id)       | Standalone Y axis create/override/remove.            |

## State-tracking hooks

These re-render the host component when the tracked value changes. They return `null` (or `[]`) before the chart has initialized.

| Hook                                   | Returns                       | Re-renders on                                       |
| -------------------------------------- | ----------------------------- | --------------------------------------------------- |
| [`useKLineChart`](./use-kline-chart/)  | `Chart \| null`               | (static — context read)                             |
| [`useCrosshair`](./state/)             | `Crosshair \| null`           | `onCrosshairChange`                                 |
| [`useVisibleRange`](./state/)          | `VisibleRange \| null`        | `onVisibleRangeChange`                              |
| [`useBarSpace`](./state/)              | `BarSpace \| null`            | `onVisibleRangeChange` (covers zoom/resize)         |
| [`useDataList`](./state/)              | `KLineData[] \| null`         | `onVisibleRangeChange`                              |
| [`usePane`](./state/)                  | `PaneOptions[] \| Nullable<PaneOptions>` | `onVisibleRangeChange`                   |
| [`useYAxes`](./state/)                 | `YAxis[]`                     | `onVisibleRangeChange`                              |

## Event subscription

| Hook                                   | Description                                              |
| -------------------------------------- | -------------------------------------------------------- |
| [`useChartEvent`](./use-chart-event/)  | Subscribe to any chart action with a typed, ref-stable callback. |

## Common patterns

```tsx
function CrosshairInfo() {
  const chart = useKLineChart();
  const crosshair = useCrosshair();
  const range = useVisibleRange();

  if (!chart) return <span>Loading…</span>;
  return (
    <span>
      {crosshair?.kLineData?.close ?? "—"} · view {range?.from}..{range?.to}
    </span>
  );
}
```

All hooks must be called **inside** a `<KLineChart>` tree (they read the chart from context).
