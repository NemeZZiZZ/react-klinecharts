# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-07-11

First stable release. Targets the klinecharts **10.0.0** stable release and ships a full Starlight documentation site.

### Breaking
- Upgraded to the klinecharts **10.0.0** stable release. The `createIndicator` instance API changed from `createIndicator(value, options)` to `createIndicator(value, isStack)` — `paneId`/`yAxisId` are now properties of the `IndicatorCreate` value itself. `useIndicator` was rewritten accordingly.
- `useIndicator` now returns the **indicator id** instead of the pane id (klinecharts v10 returns an indicator id from `createIndicator`).
- The `pane` / `paneOptions` options of `<KLineChart.Indicator>` / `useIndicator` are now `Partial<PaneOptions>` (applied via `setPaneOptions`) to match the new klinecharts v10 `setPaneOptions` signature. This restores the `pane={{ height: 80 }}` shorthand that became invalid after the `PaneOptions` type gained required fields.

### Added
- New `<KLineChart.YAxis>` declarative sub-component and `useYAxis(options)` hook for managing standalone Y axes, leveraging klinecharts v10's multi-YAxis support (`createYAxis` / `removeYAxis`).
- New `useYAxes(filter?)` reactive hook that reads `chart.getYAxes()` and re-renders on visible-range change (mirrors `usePane`).

### Changed
- Bumped `klinecharts` to `^10.0.0`.
- `useIndicator` now applies the `pane` option live via `setPaneOptions` (targeting the indicator's pane id) and the `yAxis` option via `overrideYAxis` (since `createIndicator` already creates the axis, `createYAxis` would be a no-op). Recreating the indicator only triggers on identity changes (`name`, `isStack`, `pane.id`), not on pane-option tweaks.
- Expanded the test mock (`mockChart.ts`) with `createYAxis`, `removeYAxis`, `getYAxes`, and a realistic `getIndicators` stub so the indicator pane/yAxis wiring can be exercised in tests.

### Documentation
- Added a full **Starlight** documentation site in `docs/` (28 pages: getting started, guides, component & hook reference). It includes a live, interactive chart demo migrated from the old `example/` app.
- Removed the standalone `example/` Vite app — its demo now lives in the docs site (`docs/src/components/demo/`).
- Removed the dead duplicate `UseIndicatorOptions` / `UseOverlayOptions` interfaces from `src/types.ts` (the canonical versions live next to their hooks).

## [0.3.0] - 2026-07-07

### Breaking
- Renamed the `onScroll` prop to `onChartScroll`. The old name collided with the native DOM `onScroll` handler that is passed through to the container element. The chart scroll action is unaffected; only the React callback prop changed.

### Added
- Strongly typed event callbacks. `onCrosshairChange` now receives a `Crosshair`, `onCandleBarClick` a `KLineData`, `onZoom`/`onChartScroll` their `{ scale }`/`{ distance }` payloads, etc. Exposed `ActionPayloadMap` and `TypedActionCallback<T>` helper types.
- New reactive props: `hotkey` (`setHotkey`), `xAxis` (`overrideXAxis`), `yAxis` (`overrideYAxis`).
- New hooks: `useCrosshair`, `useVisibleRange`, `useBarSpace`, `useDataList`, `usePane` for reactive chart state.
- `subscribeChartAction(chart, type, handler)` internal helper exported for advanced consumers.
- `<KLineChart.Widget>` now retries resolving the target DOM node on the next animation frame when the pane is not laid out yet.
- Vitest smoke test suite covering lifecycle (incl. StrictMode), reactive props, hooks, typed events, and indicator/overlay lifecycle.

### Fixed
- `data` prop no longer recreates the internal data loader wrapper on every render; the array identity is now the effect dependency and `more` is passed as `{ forward: false, backward: false }`.
- `zoomAnchor` is now forwarded to klinecharts unchanged instead of imposing default `{ main: "cursor", xAxis: "cursor" }` values.
- `useIndicator` / `useOverlay` no longer issue a redundant `overrideIndicator` / `overrideOverlay` call immediately after creation.
- `useIndicator` now recreates the indicator when `pane` or `yAxis` change (klinecharts has no API to reassign them post-creation).
- Removed a dead StrictMode guard and the redundant external `ResizeObserver` (klinecharts v10 manages its own).
- `useChartEvent` callback parameter is now typed via `TypedActionCallback<T>`.

### Changed
- Cleaned up duplicate type re-exports in `src/types.ts` (now only defines React-specific types; klinecharts types still flow through `export * from "klinecharts"`).
- Removed unused dev dependencies (`@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`).
- Dropped the `prepare: npm run build` script so `pnpm install` no longer triggers a full build in CI.
- `tsconfig.json` now type-checks `tests/` as well; raised `lib` to `ES2022`.

## [0.2.1] - 2026-06-24

### Changed
- Bumped `klinecharts` to `^10.0.0-beta3`. No public API changes in this wrapper.

### Note
- klinecharts `beta3` adjusts the **RSI** indicator calculation, so RSI values may differ from `beta2`. It also adds custom hot keys and a continuous drawing mode (with a built-in `brush` tool), plus fixes for overlay scrolling, `createOverlay` restoration, backward data-loading callbacks, and the `resize` method.

## [0.2.0] - 2026-06-01

### Changed
- Bumped `klinecharts` to `^10.0.0-beta2`.
- Aligned `createIndicator` usage with the new v10 signature `createIndicator(value, options)`, where `isStack`, `pane`, and `yAxis` are grouped into a single options object.
- Renamed the `<KLineChart.Indicator>` / `useIndicator` `paneOptions` prop to `pane` to match KLineCharts v10. The old `paneOptions` name still works as a deprecated alias.

### Added
- `yAxis` (`YAxisOverride`) option on `<KLineChart.Indicator>` / `useIndicator` for per-indicator Y axis overrides.

## [0.1.0] - Initial Public Offering (2026-03-02)

### Added
- `<KLineChart>` core component for wrapping `klinecharts` v10 beta API.
- Support for declarative simple data using the `data: KLineData[]` prop.
- Declarative sub-components for dynamic chart composition: `<KLineChart.Indicator>`, `<KLineChart.Overlay>`, and `<KLineChart.Widget>`.
- React Hooks for imperative instances (`useKLineChart`), event subscriptions (`useChartEvent`).
- Independent UI lifecycle management utilizing React `useId()` for preventing excessive redrawing.
- Re-exports of all underlying TypeScript interfaces and typings from `klinecharts`.

### Fixed
- Action subscriptions lifecycle preventing early returns explicitly dropping callbacks.
- Hook dependency loops regenerating overly aggressive chart components upon parameter override natively.
