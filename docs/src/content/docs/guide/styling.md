---
title: Styling & Theming
description: Customize the chart appearance with styles, locales, timezones, and formatters.
---

KlineCharts appearance is controlled by a deeply-nested `Styles` object. `react-klinecharts` exposes it reactively plus related settings (locale, timezone, formatters, separators).

## Styles

Pass a full `Styles` object, a deep partial, or a named registered style:

```tsx
<KLineChart
  data={data}
  styles={{
    grid: { show: false },
    candle: {
      type: "area",
      area: {
        lineColor: "#2196F3",
        backgroundColor: [
          { offset: 0, color: "rgba(33, 150, 243, 0.3)" },
          { offset: 1, color: "rgba(33, 150, 243, 0)" },
        ],
      },
    },
  }}
/>
```

`styles` is applied via `chart.setStyles()` on every change. You can also register reusable named styles and pass the name as a string:

```tsx
import { registerStyles } from "react-klinecharts";

registerStyles("dark-blue", { /* ... */ });
<KLineChart styles="dark-blue" />;
```

## Locale

```tsx
import { registerLocale } from "react-klinecharts";

registerLocale("ru-RU", {
  time: "Время",
  open: "Откр.",
  high: "Макс.",
  low: "Мин.",
  close: "Закр.",
  volume: "Объём",
  change: "Изм.",
  turnover: "Оборот",
  second: "сек",
  minute: "мин",
  hour: "час",
  day: "дн",
  week: "нед",
  month: "мес",
  year: "год",
});

<KLineChart locale="ru-RU" />;
```

## Timezone

Pass an IANA timezone string:

```tsx
<KLineChart timezone="Europe/Moscow" />
```

## Formatters

Override date formatting and big-number formatting:

```tsx
<KLineChart
  formatter={{
    formatBigNumber: (value) => `${(Number(value) / 1000).toFixed(1)}K`,
  }}
/>
```

## Thousands separator & decimal fold

```tsx
<KLineChart
  thousandsSeparator={{ sign: "," }}
  decimalFold={{ threshold: 1000 }}
/>
```

## All reactive appearance props

| Prop                  | Type                                       | Chart method          |
| --------------------- | ------------------------------------------ | --------------------- |
| `styles`              | `string \| DeepPartial<Styles>`            | `setStyles()`         |
| `locale`              | `string`                                   | `setLocale()`         |
| `timezone`            | `string`                                   | `setTimezone()`       |
| `formatter`           | `Partial<Formatter>`                       | `setFormatter()`      |
| `thousandsSeparator`  | `Partial<ThousandsSeparator>`              | `setThousandsSeparator()` |
| `decimalFold`         | `Partial<DecimalFold>`                     | `setDecimalFold()`    |

See the [`<KLineChart>` props reference](../components/kline-chart/) for the complete list.
