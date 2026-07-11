---
title: useYAxis
description: Manage a standalone Y axis lifecycle with a hook.
---

`useYAxis(options)` manages the lifecycle of a standalone Y axis. It's the hook equivalent of [`<KLineChart.YAxis>`](../components/y-axis/).

```tsx
import { useYAxis } from "react-klinecharts";

function MyYAxis() {
  const id = useYAxis({ value: { paneId: "candle", position: "left" } });
  return null;
}
```

## Signature

```ts
function useYAxis(options: UseYAxisOptions): Nullable<string>
```

Returns the axis id (or `null`).

## Options

| Option  | Type             | Description                                                          |
| ------- | ---------------- | -------------------------------------------------------------------- |
| `value` | `YAxisOverride`  | Y axis config. `createYAxis` is idempotent, so changing `value` is safe. |

## Behavior

- Creates the axis on mount via `createYAxis({ ...value, id })` with a stable id.
- Overrides config when `value` changes (skips the first run).
- Recreates the axis when `paneId` or `name` changes.
- Removes the axis on unmount via `removeYAxis({ id })`.

:::tip
To configure the axis of an **indicator's own pane**, use the `yAxis` option on [`useIndicator`](./use-indicator/) instead — that applies `overrideYAxis` against the axis `createIndicator` already created.
:::
