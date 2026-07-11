---
title: State-tracking hooks
description: useCrosshair, useVisibleRange, useBarSpace, useDataList, usePane, useYAxes.
---

These hooks subscribe to chart actions and re-render the host component when the tracked value changes. They return `null` (or `[]`) before the chart has initialized.

## `useCrosshair()`

Tracks the current crosshair.

```tsx
function CrosshairInfo() {
  const crosshair = useCrosshair();
  if (!crosshair?.kLineData) return <span>Hover the chart</span>;
  return <span>{crosshair.kLineData.close}</span>;
}
```

Returns `Crosshair | null`. Re-renders on `onCrosshairChange`.

## `useVisibleRange()`

Tracks the visible data range.

```tsx
function RangeInfo() {
  const range = useVisibleRange();
  return <span>{range ? `${range.from}..${range.to}` : "—"}</span>;
}
```

Returns `VisibleRange | null`. Re-renders on `onVisibleRangeChange`.

## `useBarSpace()`

Tracks the current bar spacing. KlineCharts has no dedicated "bar space changed" action, so this recomputes on every visible-range change (which fires on zoom, resize, and data load — exactly when bar space changes).

```tsx
function BarSpaceInfo() {
  const bs = useBarSpace();
  return <span>{bs ? `${bs.bar}px / bar` : "—"}</span>;
}
```

Returns `BarSpace | null`.

## `useDataList()`

Tracks the chart's full data list. Re-renders on data mutations (initial load, scroll-back pagination, realtime updates).

```tsx
function LastClose() {
  const list = useDataList();
  const last = list?.[list.length - 1];
  return <span>{last ? last.close : "—"}</span>;
}
```

Returns `KLineData[] | null`. The returned array is a snapshot reference; mutating it has no effect on the chart.

## `usePane()` / `usePane(id)`

Reads pane options.

- `usePane()` → `PaneOptions[]` (all panes).
- `usePane(id)` → `Nullable<PaneOptions>` (one pane, or `null` if not found).

```tsx
function PaneHeights() {
  const panes = usePane();
  return <span>{panes.length} panes</span>;
}

function CandlePaneHeight() {
  const opts = usePane("candle");
  return <span>{opts?.height ?? "auto"}</span>;
}
```

Re-renders on `onVisibleRangeChange`.

## `useYAxes(filter?)`

Tracks the chart's Y axes (KlineCharts v10 multi-YAxis).

```tsx
function AxisCount() {
  const axes = useYAxes({ paneId: "candle" });
  return <span>{axes.length} axis(es)</span>;
}
```

Returns `YAxis[]` (empty before init). Re-renders on `onVisibleRangeChange`. Pass a `YAxisFilter` (`{ paneId?, id?, name? }`) to scope the query; omit it for all axes.

## Summary table

| Hook                   | Returns                                    | Re-renders on                       |
| ---------------------- | ------------------------------------------ | ----------------------------------- |
| `useCrosshair()`       | `Crosshair \| null`                        | `onCrosshairChange`                 |
| `useVisibleRange()`    | `VisibleRange \| null`                     | `onVisibleRangeChange`              |
| `useBarSpace()`        | `BarSpace \| null`                         | `onVisibleRangeChange`              |
| `useDataList()`        | `KLineData[] \| null`                      | `onVisibleRangeChange`              |
| `usePane()` / `(id)`   | `PaneOptions[]` or `Nullable<PaneOptions>` | `onVisibleRangeChange`              |
| `useYAxes(filter?)`    | `YAxis[]`                                  | `onVisibleRangeChange`              |
