import { useEffect, useRef } from "react";
import type { ActionCallback, ActionType } from "klinecharts";
import type { ActionPayloadMap, TypedActionCallback } from "../events";
import { useKLineChart } from "./useKLineChart";

/**
 * Subscribe to a chart action event.
 * Uses a stable ref-based handler to avoid re-subscribing when the callback
 * identity changes between renders.
 *
 * The callback is strongly typed based on the action type, so e.g.
 * `useChartEvent("onCrosshairChange", (crosshair) => ...)` receives a
 * {@link Crosshair} instead of `unknown`.
 *
 * @example
 * ```ts
 * useChartEvent("onCrosshairChange", (crosshair) => {
 *   console.log(crosshair.x, crosshair.y);
 * });
 * ```
 */
export function useChartEvent<T extends ActionType>(
  type: T,
  callback: TypedActionCallback<T>
): void {
  const chart = useKLineChart();
  const callbackRef = useRef<ActionCallback | undefined>(undefined);
  // Keep the ref pointing at the latest callback without changing its
  // identity in a way that would re-trigger the subscription effect.
  callbackRef.current = callback as ActionCallback;

  useEffect(() => {
    if (!chart) return;

    const handler: ActionCallback = (data) => {
      callbackRef.current?.(data);
    };

    chart.subscribeAction(type, handler);
    return () => {
      chart.unsubscribeAction(type, handler);
    };
  }, [chart, type]);
}

export type { ActionPayloadMap };
