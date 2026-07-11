import { useYAxis } from "../hooks/useYAxis";
import type { UseYAxisOptions } from "../hooks/useYAxis";

export type YAxisProps = UseYAxisOptions;

/**
 * Declarative Y axis management as a child of `<KLineChart>`.
 * Renders nothing — purely manages the Y axis lifecycle.
 *
 * KLineCharts v10 supports multiple Y axes per pane. Use this to add an extra
 * axis to a pane (e.g. a secondary price scale on an indicator pane).
 *
 * @example
 * ```tsx
 * <KLineChart data={data}>
 *   <KLineChart.YAxis value={{ paneId: "pane_indicator_1", position: "left" }} />
 * </KLineChart>
 * ```
 */
export function YAxis(props: YAxisProps): null {
  useYAxis(props);
  return null;
}

YAxis.displayName = "KLineChart.YAxis";
