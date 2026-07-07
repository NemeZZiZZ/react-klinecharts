import type {
  ActionType,
  Crosshair,
  KLineData,
  VisibleRange,
} from "klinecharts";

/**
 * Maps each {@link ActionType} to the payload type its callback receives.
 *
 * These are derived from the values klinecharts passes to
 * `chart.executeAction(type, data)`:
 * - `onCrosshairChange` → current `Crosshair`
 * - `onCandleBarClick` → the clicked `KLineData`
 * - `onZoom` → `{ scale }`
 * - `onScroll` → `{ distance }`
 * - `onVisibleRangeChange` → current `VisibleRange`
 * - `onPaneDrag` → `{ paneId }`
 * - feature-click events → the klinecharts "feature info" object (treated as
 *   `unknown` because klinecharts does not export the exact type).
 */
export interface ActionPayloadMap {
  onZoom: { scale: number };
  onScroll: { distance: number };
  onVisibleRangeChange: VisibleRange;
  onCrosshairChange: Crosshair;
  onCandleBarClick: KLineData;
  onPaneDrag: { paneId: string };
  onCandleTooltipFeatureClick: unknown;
  onIndicatorTooltipFeatureClick: unknown;
  onCrosshairFeatureClick: unknown;
}

/**
 * Strongly-typed callback for a given chart action.
 */
export type TypedActionCallback<T extends ActionType> = (
  data: ActionPayloadMap[T]
) => void;
