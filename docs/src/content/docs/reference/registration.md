---
title: Registration Functions
description: Register custom indicators, overlays, figures, locales, styles, axes, and hotkeys.
---

KlineCharts' module-level registration functions are re-exported from `react-klinecharts`. Call them once at app startup (e.g. in a module imported before your chart renders).

```tsx
import {
  registerIndicator,
  registerOverlay,
  registerFigure,
  registerLocale,
  registerStyles,
  registerXAxis,
  registerYAxis,
  registerHotkey,
} from "react-klinecharts";
```

## Custom indicator

```tsx
registerIndicator({
  name: "MyIndicator",
  calc: (dataList) => dataList.map((d) => ({ value: d.close })),
  figures: [{ key: "value", title: "VAL: ", type: "line" }],
});

// Then: <KLineChart.Indicator value="MyIndicator" />
```

Introspect what's available:

```ts
import { getSupportedIndicators } from "react-klinecharts";
console.log(getSupportedIndicators()); // ["MA", "EMA", "VOL", ...]
```

## Custom overlay

```tsx
registerOverlay({
  name: "MyOverlay",
  totalStep: 2,
  needDefaultPointFigure: true,
  createPointFigures: ({ coordinates }) => [
    { type: "line", attrs: { coordinates }, styles: { color: "#2196F3" } },
  ],
});
```

## Custom figure

```tsx
registerFigure({
  name: "smiley",
  draw: (ctx, attrs) => { /* ... */ },
  checkEventOn: (coordinate, attrs) => false,
});
```

## Locale

```tsx
registerLocale("ru-RU", { /* see Styling guide */ });
```

## Styles

```tsx
registerStyles("dark-blue", { /* DeepPartial<Styles> */ });
// <KLineChart styles="dark-blue" />
```

## Axes

```tsx
registerXAxis({ name: "myXAxis", /* ... */ });
registerYAxis({ name: "myYAxis", /* ... */ });
```

## Hotkeys

```tsx
registerHotkey({
  name: "toggle-zoom",
  keys: ["Shift", "Z"],
  handler: (event, context) => { /* ... */ },
});
```

## Introspection helpers

| Function                  | Returns       |
| ------------------------- | ------------- |
| `getSupportedFigures()`   | `string[]`    |
| `getSupportedIndicators()`| `string[]`    |
| `getSupportedLocales()`   | `string[]`    |
| `getSupportedOverlays()`  | `string[]`    |
| `getSupportedHotkeys()`   | `string[]`    |
| `getHotkey(name)`         | `Nullable<HotkeyTemplate>` |
| `getFigureClass(name)`    | `Nullable<FigureConstructor>` |
| `getOverlayClass(name)`   | `Nullable<OverlayConstructor>` |
