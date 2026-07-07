import { useEffect, useState } from "react";
import type { Nullable, PaneOptions } from "klinecharts";
import { useKLineChart } from "./useKLineChart";
import { useChartEvent } from "./useChartEvent";

/**
 * Reads pane options from the chart.
 *
 * - If `id` is provided, returns the options for that pane (or `null` if it
 *   does not exist).
 * - Otherwise returns the array of all pane options.
 *
 * The hook re-reads on chart instance change and on visible-range change
 * (which is emitted whenever layout-affecting operations complete).
 *
 * @example
 * ```tsx
 * function PaneHeights() {
 *   const panes = usePane();
 *   // panes is PaneOptions[]
 * }
 *
 * function CandlePaneHeight() {
 *   const opts = usePane("candle");
 *   return <span>{opts?.height ?? "auto"}</span>;
 * }
 * ```
 */
export function usePane(): PaneOptions[];
export function usePane(id: string): Nullable<PaneOptions>;
export function usePane(id?: string): Nullable<PaneOptions> | PaneOptions[] {
  const chart = useKLineChart();
  const [value, setValue] = useState<Nullable<PaneOptions> | PaneOptions[]>(
    id == null ? [] : null
  );

  useEffect(() => {
    if (!chart) {
      setValue(id == null ? [] : null);
      return;
    }
    setValue(chart.getPaneOptions(id));
  }, [chart, id]);

  useChartEvent("onVisibleRangeChange", () => {
    if (!chart) return;
    setValue(chart.getPaneOptions(id));
  });

  return value;
}
