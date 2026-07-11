---
title: Indicators & Overlays
description: Manage technical indicators and drawing overlays declaratively.
---

Indicators (MA, VOL, RSI, …) and overlays (drawing tools like price lines, segments, …) are managed as declarative children of `<KLineChart>`. Each manages its own lifecycle: create on mount, remove on unmount, override on change.

## Indicators

Use `<KLineChart.Indicator>` or the `useIndicator()` hook.

```tsx
<KLineChart data={data}>
  {/* By name */}
  <KLineChart.Indicator value="VOL" />

  {/* By config object */}
  <KLineChart.Indicator value={{ name: "MA", calcParams: [5, 10, 30] }} />

  {/* In its own pane with custom options */}
  <KLineChart.Indicator value="MACD" pane={{ height: 120 }} />

  {/* Stacked onto an existing pane */}
  <KLineChart.Indicator value={{ name: "EMA", calcParams: [20] }} isStack />
</KLineChart>
```

### Props

| Prop         | Type                        | Description                                                                 |
| ------------ | --------------------------- | --------------------------------------------------------------------------- |
| `value`      | `string \| IndicatorCreate` | Indicator name or full config.                                              |
| `isStack`    | `boolean`                   | Stack onto existing indicators in the same pane.                            |
| `pane`       | `Partial<PaneOptions>`      | Options applied to the indicator pane via `setPaneOptions` (e.g. `height`). |
| `yAxis`      | `YAxisOverride`             | Y axis config for the indicator's pane, applied via `overrideYAxis`.        |
| `paneOptions`| `Partial<PaneOptions>`      | **Deprecated.** Alias for `pane`.                                           |

### How it maps to KlineCharts v10

In KlineCharts v10, `createIndicator(value, isStack)` no longer accepts a separate options object — `paneId`/`yAxisId` live on the `IndicatorCreate` value itself. The hook therefore:

1. Creates the indicator, capturing its **id** (`useIndicator` returns the indicator id).
2. Applies `pane` to the resulting pane via `setPaneOptions({ id: paneId, ...pane })`.
3. Configures the pane's Y axis via `overrideYAxis` when `yAxis` is provided (`createIndicator` already creates an axis, so `createYAxis` would be a no-op).

:::note
Changing the **pane id** (`pane.id`) recreates the indicator (KlineCharts can't reassign an indicator to a different pane). Changing other pane options (like `height`) is applied **live** via `setPaneOptions` without recreation.
:::

## Overlays

Use `<KLineChart.Overlay>` or the `useOverlay()` hook.

```tsx
<KLineChart data={data}>
  {/* Built-in drawing tool by name */}
  <KLineChart.Overlay value="priceLine" />

  {/* With points */}
  <KLineChart.Overlay
    value={{
      name: "priceSegment",
      points: [
        { timestamp: 1680000000000, value: 28000 },
        { timestamp: 1680086400000, value: 29000 },
      ],
    }}
  />

  {/* Batch creation */}
  <KLineChart.Overlay value={["priceLine", "priceLine"]} />
</KLineChart>
```

### Props

| Prop    | Type                                                | Description                          |
| ------- | --------------------------------------------------- | ------------------------------------ |
| `value` | `string \| OverlayCreate \| Array<...>`             | Overlay name, config, or batch array. |

`useOverlay` returns the overlay id (or an array of ids for batch creation).

## Custom indicators & overlays

Register custom indicators/overlays at the module level (re-exported from KlineCharts):

```tsx
import { registerIndicator, registerOverlay } from "react-klinecharts";

registerIndicator({
  name: "MyIndicator",
  calc: (dataList) => dataList.map((d) => ({ value: d.close })),
  figures: [{ key: "value", title: "VAL: ", type: "line" }],
});

// Then use it like any built-in:
<KLineChart.Indicator value="MyIndicator" />
```

See the [Registration Functions](../reference/registration/) reference for the full list.
