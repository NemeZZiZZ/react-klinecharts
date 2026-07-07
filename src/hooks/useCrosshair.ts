import { useState } from "react";
import type { Crosshair } from "klinecharts";
import { useChartEvent } from "./useChartEvent";

/**
 * Tracks the current crosshair state.
 *
 * Returns the latest `Crosshair` (which may be `null` when the crosshair
 * leaves the chart) and re-renders the host component whenever it changes.
 *
 * @example
 * ```tsx
 * function CrosshairInfo() {
 *   const crosshair = useCrosshair();
 *   if (!crosshair?.kLineData) return <span>Hover the chart</span>;
 *   return <span>{crosshair.kLineData.close}</span>;
 * }
 * ```
 */
export function useCrosshair(): Crosshair | null {
  const [crosshair, setCrosshair] = useState<Crosshair | null>(null);
  useChartEvent("onCrosshairChange", (data) => {
    // klinecharts emits the chart's crosshair (which is null when the
    // pointer leaves the pane), so reflect that directly.
    setCrosshair(data as Crosshair);
  });
  return crosshair;
}
