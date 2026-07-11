---
title: <KLineChart.Overlay>
description: Declarative overlay (drawing tool) management.
---

`<KLineChart.Overlay>` manages the lifecycle of an overlay (drawing tool). It renders nothing — purely manages the overlay via KlineCharts.

```tsx
<KLineChart data={data}>
  {/* Built-in by name */}
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

## Props

| Prop    | Type                                                  | Description                              |
| ------- | ----------------------------------------------------- | ---------------------------------------- |
| `value` | `string \| OverlayCreate \| Array<string \| OverlayCreate>` | Overlay name, config, or batch array. |

## Behavior

- **Mount** → `createOverlay(value)`. A stable id is injected for single object configs so they can be overridden later.
- **`value` change** (single object form) → `overrideOverlay`. The first run is skipped.
- **Unmount** → `removeOverlay({ id })` for each created id.

## Hook equivalent

```tsx
import { useOverlay } from "react-klinecharts";

function MyOverlay() {
  const id = useOverlay({ value: { name: "priceLine", points: [{ value: 50000 }] } });
  return null;
}
```

`useOverlay` returns the overlay id (or an array of ids for batch creation).
