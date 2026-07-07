import { useEffect, useState } from "react";
import type { BarSpace } from "klinecharts";
import { useKLineChart } from "./useKLineChart";
import { useChartEvent } from "./useChartEvent";

/**
 * Tracks the current bar spacing.
 *
 * klinecharts does not emit a dedicated "bar space changed" action, so this
 * hook recomputes on every visible-range change (which is fired on zoom,
 * resize, and data load — i.e. exactly when bar space can change) and on
 * chart instance change.
 *
 * @example
 * ```tsx
 * function BarSpaceInfo() {
 *   const bs = useBarSpace();
 *   return <span>{bs ? `${bs.bar}px / bar` : "—"}</span>;
 * }
 * ```
 */
export function useBarSpace(): BarSpace | null {
  const chart = useKLineChart();
  const [barSpace, setBarSpace] = useState<BarSpace | null>(null);

  useEffect(() => {
    setBarSpace(chart?.getBarSpace() ?? null);
  }, [chart]);

  useChartEvent("onVisibleRangeChange", () => {
    setBarSpace(chart?.getBarSpace() ?? null);
  });

  return barSpace;
}
