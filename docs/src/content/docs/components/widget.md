---
title: <KLineChart.Widget>
description: Inject React elements into chart DOM layers with portals.
---

`<KLineChart.Widget>` is a declarative portal component. It injects React/HTML elements into a specific chart DOM layer using `createPortal` and `chart.getDom(paneId, position)`.

```tsx
<KLineChart data={data}>
  <KLineChart.Widget paneId="candle" position="main">
    <div className="custom-tooltip">My interactive React tooltip!</div>
  </KLineChart.Widget>
</KLineChart>
```

## Props

| Prop        | Type                          | Description                                                              |
| ----------- | ----------------------------- | ------------------------------------------------------------------------ |
| `paneId`    | `string`                      | Target pane id (e.g. `"candle"`, `"xAxis"`, or a custom indicator pane). If omitted, binds to the root container. |
| `position`  | `"root" \| "main" \| "yAxis"` | Layer position within the pane. Default `"main"`.                        |
| `children`  | `ReactNode`                   | The React content to portal into the target node.                        |

## Late-resolving panes

Indicator panes are created asynchronously. If the target DOM node doesn't exist yet, the component retries on the next animation frame until the pane is laid out, then renders its children into it. This lets you safely target a pane id that belongs to an indicator rendered alongside the widget.
