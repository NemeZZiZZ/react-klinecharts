---
title: Migrating to KlineCharts v10
description: Breaking changes in the klinecharts 10.0.0 stable release and how this wrapper handles them.
---

This page documents the breaking changes between klinecharts `10.0.0-beta3` (the previous target) and the `10.0.0` stable release, and how `react-klinecharts` `0.4.0+` adapts to them. If you were using the wrapper's high-level API, most changes are transparent — but a few are worth knowing.

## `createIndicator` signature

**Before (beta3):** `createIndicator(value, options?: { isStack, pane, yAxis })`
**After (10.0.0):** `createIndicator(value, isStack?: boolean)`

`paneId`/`yAxisId` are now properties of the `IndicatorCreate` value itself, not a separate options argument.

**Wrapper impact:** `useIndicator` / `<KLineChart.Indicator>` were rewritten. The `pane` option is now applied via `setPaneOptions({ id: paneId, ...pane })`, and the `yAxis` option via `overrideYAxis`. From your component's perspective the API is unchanged — you still pass `pane` and `yAxis` as before.

**Behavioral change:** `useIndicator` now returns the **indicator id** (it previously returned the pane id). If you were reading the return value, adjust accordingly.

## `setPaneOptions` accepts partials

**Before:** `setPaneOptions(options: PaneOptions)` (full object).
**After:** `setPaneOptions(options: Partial<PaneOptions>)`.

**Wrapper impact:** The `pane` / `paneOptions` option type changed from `PaneOptions` to `Partial<PaneOptions>`. This **restores** the `pane={{ height: 80 }}` shorthand that became invalid after `PaneOptions` gained required fields (`id`, `minHeight`, `dragEnabled`, `order`, `state`). If you were passing a full `PaneOptions`, it still works.

## New multi-YAxis API

10.0.0 added explicit multi-YAxis support:

- `createYAxis(yAxis): Nullable<string>` — idempotent (no-op if the axis id exists).
- `removeYAxis(filter): boolean` — requires `id` **or** `name`.
- `getYAxes(filter): YAxis[]` — filter is required.

**Wrapper impact:** New [`<KLineChart.YAxis>`](../components/y-axis/) / [`useYAxis`](../hooks/use-y-axis/) for standalone axes, and [`useYAxes`](../hooks/state/) for reactive reads. Per-indicator axis config uses `overrideYAxis` (not `createYAxis`, which would be a no-op since `createIndicator` already created the axis).

## New types

10.0.0 added `BarSpaceLimit`, `DeepRequired`, `YAxisFilter`, `PaneState`, and a redesigned `Layout` type. These flow through the wrapper automatically via `export * from "klinecharts"`.

## Summary

| Change                          | Wrapper handling                          |
| ------------------------------- | ----------------------------------------- |
| `createIndicator(value, isStack)` | Transparent — `pane`/`yAxis` still work. |
| `setPaneOptions` partial         | `pane` is now `Partial<PaneOptions>`.    |
| `useIndicator` return            | Now returns indicator id (was pane id).   |
| Multi-YAxis API                  | New `<KLineChart.YAxis>`, `useYAxis`, `useYAxes`. |
| New types                        | Re-exported automatically.                |
