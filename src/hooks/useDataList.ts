import { useEffect, useState } from "react";
import type { KLineData } from "klinecharts";
import { useKLineChart } from "./useKLineChart";
import { useChartEvent } from "./useChartEvent";

/**
 * Tracks the chart's full data list.
 *
 * Re-renders the host component whenever the data changes (initial load,
 * scroll-back pagination, realtime update). Returns `null` before the chart
 * has been initialized. The returned array is a snapshot reference; mutating
 * it has no effect on the chart.
 *
 * @example
 * ```tsx
 * function LastClose() {
 *   const list = useDataList();
 *   const last = list?.[list.length - 1];
 *   return <span>{last ? last.close : "—"}</span>;
 * }
 * ```
 */
export function useDataList(): KLineData[] | null {
  const chart = useKLineChart();
  const [dataList, setDataList] = useState<KLineData[] | null>(null);

  useEffect(() => {
    setDataList(chart ? chart.getDataList() : null);
  }, [chart]);

  // klinecharts fires onVisibleRangeChange after data mutations, so it is a
  // reliable signal that the data list reference may have changed.
  useChartEvent("onVisibleRangeChange", () => {
    setDataList(chart ? chart.getDataList() : null);
  });

  return dataList;
}
