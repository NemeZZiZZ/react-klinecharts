import type { ActionCallback, ActionType, Chart } from "klinecharts";

/**
 * Subscribes `handler` to the given chart action and returns a cleanup
 * function that unsubscribes it. Returns a no-op when `chart` is null.
 *
 * The handler is invoked through a stable wrapper so callers can pass a
 * ref-stored callback without re-subscribing on every render.
 */
export function subscribeChartAction(
  chart: Chart | null,
  type: ActionType,
  handler: ActionCallback
): () => void {
  if (!chart) return () => {};
  chart.subscribeAction(type, handler);
  return () => {
    chart.unsubscribeAction(type, handler);
  };
}
