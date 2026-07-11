---
title: <KLineChart.YAxis>
description: Declarative standalone Y axis management.
---

`<KLineChart.YAxis>` manages the lifecycle of a standalone Y axis. KLineCharts v10 supports multiple Y axes per pane — use this to add an extra axis (e.g. a secondary price scale on the candle pane). It renders nothing.

```tsx
<KLineChart data={data}>
  <KLineChart.YAxis value={{ paneId: "candle", position: "left" }} />
</KLineChart>
```

## Props

| Prop    | Type             | Description                                                          |
| ------- | ---------------- | -------------------------------------------------------------------- |
| `value` | `YAxisOverride`  | Y axis config. `createYAxis` is idempotent, so changing `value` is safe. |

## Behavior

- **Mount** → `createYAxis({ ...value, id })` with a stable id (`useId()`). Since the id is fresh, a new axis is created and the config is applied.
- **`value` change** → `overrideYAxis`. The first run is skipped.
- **`paneId` / `name` change** → recreates the axis.
- **Unmount** → `removeYAxis({ id })`.

:::tip[Standalone vs. per-indicator]
This component creates an **additional** axis. To configure the axis of an **indicator's own pane**, use the [`yAxis` prop on `<KLineChart.Indicator>`](./indicator/) instead.
:::

## Hook equivalent

```tsx
import { useYAxis } from "react-klinecharts";

function MyYAxis() {
  const id = useYAxis({ value: { paneId: "candle", position: "left" } });
  return null;
}
```

`useYAxis` returns the axis id (or `null`).
