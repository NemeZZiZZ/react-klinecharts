import { useEffect, useState } from "react";
import type { VisibleRange } from "klinecharts";
import { useKLineChart } from "./useKLineChart";
import { useChartEvent } from "./useChartEvent";

/**
 * Tracks the currently visible data range.
 *
 * Re-renders the host component whenever the visible range changes
 * (zoom, scroll, data load, etc.). Returns `null` before the chart has
 * laid out for the first time.
 *
 * @example
 * ```tsx
 * function RangeInfo() {
 *   const range = useVisibleRange();
 *   return <span>{range ? `${range.from}..${range.to}` : "—"}</span>;
 * }
 * ```
 */
export function useVisibleRange(): VisibleRange | null {
  const chart = useKLineChart();
  const [range, setRange] = useState<VisibleRange | null>(null);

  // Seed from the current chart whenever the chart instance changes.
  useEffect(() => {
    setRange(chart?.getVisibleRange() ?? null);
  }, [chart]);

  useChartEvent("onVisibleRangeChange", (data) => {
    setRange(data as VisibleRange);
  });

  return range;
}
