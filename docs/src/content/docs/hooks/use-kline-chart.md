---
title: useKLineChart
description: Access the Chart instance from any descendant of <KLineChart>.
---

`useKLineChart()` reads the `Chart` instance from context. Returns `null` before the chart has initialized.

```tsx
import { useKLineChart } from "react-klinecharts";

function GoToNow() {
  const chart = useKLineChart();
  return <button onClick={() => chart?.scrollToRealTime()}>Jump to now</button>;
}
```

This is the foundation hook — all other hooks and sub-components use it internally to reach the chart without prop drilling. It must be called inside a `<KLineChart>` tree.

## Returns

```ts
function useKLineChart(): Chart | null
```

## Use cases

- Calling imperative methods (`scrollToRealTime`, `getConvertPictureUrl`, `convertFromPixel`, …) from nested components.
- Building your own state-tracking hooks on top of `useChartEvent`.
- Conditional rendering based on whether the chart is ready.
