# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
