import { useEffect, useId, useRef } from "react";
import type { YAxisOverride, Nullable } from "klinecharts";
import { useKLineChart } from "./useKLineChart";

export interface UseYAxisOptions {
  /**
   * Y axis configuration. `createYAxis` in KLineCharts v10 is idempotent: if a
   * Y axis with the same `id` already exists on the pane, the call is a no-op.
   */
  value: YAxisOverride;
}

/**
 * Manages the lifecycle of a standalone Y axis.
 *
 * KLineCharts v10 introduced explicit multi-YAxis support. This hook creates a
 * Y axis on mount, overrides its config when `value` changes, and removes it on
 * unmount. The axis is identified by a stable `useId()`-generated id so cleanup
 * always targets exactly the axis it created.
 *
 * @returns The Y axis id, or `null`.
 */
export function useYAxis(options: UseYAxisOptions): Nullable<string> {
  const chart = useKLineChart();
  const yAxisIdRef = useRef<Nullable<string>>(null);
  const { value } = options;

  // Stable unique ID per component instance — survives re-renders,
  // guarantees cleanup removes exactly the Y axis we created.
  const yAxisId = useId();

  // Serialize value for dependency comparison. paneId/name are the base
  // identity: changing them recreates the axis (klinecharts cannot reassign an
  // existing axis to a different pane).
  const valueKey = JSON.stringify(value);
  const paneIdKey = value.paneId ?? "";
  const nameKey = value.name ?? "";

  useEffect(() => {
    if (!chart) return;

    yAxisIdRef.current = chart.createYAxis({ ...value, id: yAxisId });

    return () => {
      chart.removeYAxis({ id: yAxisId });
      yAxisIdRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chart, yAxisId, paneIdKey, nameKey]);

  // Override the Y axis config when `value` changes.
  // Skip the first run: the create-effect above already applied the value.
  const firstOverrideRef = useRef(true);
  useEffect(() => {
    if (!chart) return;
    if (firstOverrideRef.current) {
      firstOverrideRef.current = false;
      return;
    }
    chart.overrideYAxis({ ...value, id: yAxisId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chart, valueKey, yAxisId]);

  return yAxisIdRef.current;
}
