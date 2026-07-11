---
title: Installation
description: Install react-klinecharts and its peer dependencies.
---

`react-klinecharts` requires **React 17, 18, or 19** and **klinecharts v10**.

## Package manager

:::code-group

```sh [pnpm]
pnpm add react-klinecharts
```

```sh [npm]
npm install react-klinecharts
```

```sh [yarn]
yarn add react-klinecharts
```

```sh [bun]
bun add react-klinecharts
```

:::

`klinecharts` is installed automatically as a regular dependency, so you don't need to add it yourself. React and React DOM are **peer dependencies** — make sure they're installed in your app:

:::code-group

```sh [pnpm]
pnpm add react react-dom
```

```sh [npm]
npm install react react-dom
```

:::

## Requirements

| Package            | Version             |
| ------------------ | ------------------- |
| `react`            | `^17.0.0 \|\| ^18.0.0 \|\| ^19.0.0` |
| `react-dom`        | `^17.0.0 \|\| ^18.0.0 \|\| ^19.0.0` |
| `klinecharts`      | `^10.0.0` (bundled) |
| Node.js            | `>= 18`             |

## Verify the install

```tsx
import { KLineChart } from "react-klinecharts";

export default function App() {
  return (
    <KLineChart
      data={[
        { timestamp: 1, open: 1, high: 2, low: 0, close: 1.5, volume: 10 },
      ]}
      style={{ width: "100%", height: 400 }}
    />
  );
}
```

If you see a chart, you're good to go. Continue to [Quick Start](./quick-start/).
