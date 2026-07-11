---
title: useOverlay
description: Manage an overlay's lifecycle with a hook.
---

`useOverlay(options)` manages the lifecycle of an overlay. It's the hook equivalent of [`<KLineChart.Overlay>`](../components/overlay/).

```tsx
import { useOverlay } from "react-klinecharts";

function MyOverlay() {
  const id = useOverlay({ value: { name: "priceLine", points: [{ value: 50000 }] } });
  return null;
}
```

## Signature

```ts
function useOverlay(options: UseOverlayOptions): Nullable<string> | Array<Nullable<string>>
```

Returns the overlay id (or an array of ids for batch creation).

## Options

| Option  | Type                                                  | Description                              |
| ------- | ----------------------------------------------------- | ---------------------------------------- |
| `value` | `string \| OverlayCreate \| Array<string \| OverlayCreate>` | Overlay name, config, or batch array. |

## Behavior

- Creates the overlay(s) on mount via `createOverlay(value)`.
- Overrides config when `value` changes for single object configs (skips the first run).
- Removes the overlay(s) on unmount.
