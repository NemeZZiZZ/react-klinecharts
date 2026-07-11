import { useEffect, useState } from "react";
import type { YAxis, YAxisFilter } from "klinecharts";
import { useKLineChart } from "./useKLineChart";
import { useChartEvent } from "./useChartEvent";

/**
 * Tracks the chart's Y axes.
 *
 * Reads `chart.getYAxes(filter)` and re-reads on visible-range change (which
 * fires after axis-affecting operations such as indicator creation, axis
 * override, and layout). Returns an empty array before the chart initializes.
 *
 * @example
 * ```tsx
 * function AxisList() {
 *   const axes = useYAxes({ paneId: "candle" });
 *   return <span>{axes.map((a) => a.id).join(", ")}</span>;
 * }
 * ```
 */
export function useYAxes(filter?: YAxisFilter): YAxis[] {
  const chart = useKLineChart();
  const [axes, setAxes] = useState<YAxis[]>([]);

  const filterKey = filter ? JSON.stringify(filter) : "";

  useEffect(() => {
    if (!chart) {
      setAxes([]);
      return;
    }
    setAxes(chart.getYAxes(filter ?? {}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chart, filterKey]);

  useChartEvent("onVisibleRangeChange", () => {
    if (!chart) return;
    setAxes(chart.getYAxes(filter ?? {}));
  });

  return axes;
}
