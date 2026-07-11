---
title: useIndicator
description: Manage a technical indicator's lifecycle with a hook.
---

`useIndicator(options)` manages the lifecycle of a technical indicator. It's the hook equivalent of [`<KLineChart.Indicator>`](../components/indicator/).

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

## Signature

```ts
function useIndicator(options: UseIndicatorOptions): Nullable<string>
```

Returns the **indicator id** (or `null`).

## Options

| Option       | Type                        | Description                                                              |
| ------------ | --------------------------- | ------------------------------------------------------------------------ |
| `value`      | `string \| IndicatorCreate` | Indicator name or full config.                                           |
| `isStack`    | `boolean`                   | Stack on existing indicators in the same pane.                           |
| `pane`       | `Partial<PaneOptions>`      | Options applied to the indicator pane via `setPaneOptions` (e.g. `height`). |
| `yAxis`      | `YAxisOverride`             | Y axis config for the indicator's pane, applied via `overrideYAxis`.     |
| `paneOptions`| `Partial<PaneOptions>`      | **Deprecated.** Alias for `pane`.                                        |

## Behavior

- Creates the indicator on mount via `createIndicator(value, isStack)`.
- Overrides config when `value` changes (skips the first run).
- Applies `pane` via `setPaneOptions` (live — no recreation for option-only changes).
- Applies `yAxis` via `overrideYAxis`.
- Recreates the indicator when `value.name`, `isStack`, or `pane.id` changes.
- Removes the indicator on unmount.
