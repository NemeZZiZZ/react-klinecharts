# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
