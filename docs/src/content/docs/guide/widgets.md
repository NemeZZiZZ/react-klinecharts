---
title: Widgets & Custom DOM
description: Inject React elements into chart DOM layers with portals.
---

`<KLineChart.Widget>` is a declarative portal component. It injects standard React/HTML elements directly into a chart's DOM layer using `createPortal` and `chart.getDom(paneId, position)`.

## Usage

```tsx
<KLineChart data={data}>
  <KLineChart.Widget paneId="candle" position="main">
    <div className="custom-tooltip">My interactive React tooltip!</div>
  </KLineChart.Widget>
</KLineChart>
```

## Props

| Prop        | Type                                  | Description                                                              |
| ----------- | ------------------------------------- | ------------------------------------------------------------------------ |
| `paneId`    | `string`                              | Target pane id (e.g. `"candle"`, `"xAxis"`, or a custom indicator pane). If omitted, binds to the root container. |
| `position`  | `"root" \| "main" \| "yAxis"`         | Layer position within the pane. Default `"main"`.                        |
| `children`  | `ReactNode`                           | The React content to portal into the target node.                        |

## Late-resolving panes

Indicator panes are created asynchronously (after `createIndicator` runs). If the target DOM node doesn't exist yet when the effect runs, `<KLineChart.Widget>` retries on the next animation frame until the pane is laid out, then renders its children into it. This means you can safely target a pane id that belongs to an indicator rendered alongside it.

## Common use cases

- **Custom tooltips** that are richer than KlineCharts' built-in tooltip legends.
- **Floating controls** (zoom buttons, period switchers) pinned to a pane corner.
- **Badges / annotations** overlaid on the main canvas.

:::tip
Because the content is real React (not canvas), it participates in React's event system, state, and context.
:::
