---
title: <KLineChart.Indicator>
description: Declarative technical indicator management.
---

`<KLineChart.Indicator>` manages the lifecycle of a technical indicator. It renders nothing — purely manages the indicator via KlineCharts.

```tsx
<KLineChart data={data}>
  <KLineChart.Indicator value={{ name: "MA", calcParams: [5, 10, 30] }} />
  <KLineChart.Indicator value="VOL" pane={{ height: 80 }} />
</KLineChart>
```

## Props

| Prop          | Type                        | Description                                                              |
| ------------- | --------------------------- | ------------------------------------------------------------------------ |
| `value`       | `string \| IndicatorCreate` | Indicator name or full config.                                           |
| `isStack`     | `boolean`                   | Stack on existing indicators in the same pane.                           |
| `pane`        | `Partial<PaneOptions>`      | Options applied to the indicator pane via `setPaneOptions` (e.g. `height`). |
| `yAxis`       | `YAxisOverride`             | Y axis config for the indicator's pane, applied via `overrideYAxis`.     |
| `paneOptions` | `Partial<PaneOptions>`      | **Deprecated.** Alias for `pane`.                                        |

## Behavior

- **Mount** → `createIndicator(value, isStack)`. The hook injects a stable id (`useId()`) so cleanup always removes exactly this indicator.
- **`value` change** (object form) → `overrideIndicator`. The first run is skipped (creation already applied the value).
- **`pane.id` change** → recreates the indicator (KlineCharts can't reassign an indicator to a different pane).
- **`pane` options change** (e.g. `height`) → applied live via `setPaneOptions` **without** recreation.
- **`yAxis` change** → applied via `overrideYAxis` against the indicator's axis.
- **Unmount** → `removeIndicator({ id })`.

:::note[v10 signature]
KlineCharts v10 changed `createIndicator(value, isStack)` — `paneId`/`yAxisId` are properties of the `IndicatorCreate` value, not a separate options argument. `<KLineChart.Indicator>` handles this mapping for you.
:::

## Hook equivalent

```tsx
import { useIndicator } from "react-klinecharts";

function MyIndicator() {
  const indicatorId = useIndicator({
    value: { name: "RSI", calcParams: [14] },
    pane: { height: 100 },
  });
  return null;
}
```

`useIndicator` returns the **indicator id** (or `null`).

## Custom indicators

Register a custom indicator at the module level, then reference it by name:

```tsx
import { registerIndicator } from "react-klinecharts";

registerIndicator({
  name: "MyIndicator",
  calc: (dataList) => dataList.map((d) => ({ value: d.close })),
  figures: [{ key: "value", title: "VAL: ", type: "line" }],
});

<KLineChart.Indicator value="MyIndicator" />;
```
