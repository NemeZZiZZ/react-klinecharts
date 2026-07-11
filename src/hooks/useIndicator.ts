import { useEffect, useId, useRef } from "react";
import type {
  IndicatorCreate,
  PaneOptions,
  YAxisOverride,
  Nullable,
} from "klinecharts";
import { useKLineChart } from "./useKLineChart";

export interface UseIndicatorOptions {
  /** Indicator name or full creation config. */
  value: string | IndicatorCreate;
  /** Whether to stack on existing indicators in the same pane. */
  isStack?: boolean;
  /** Options applied to the indicator pane via `setPaneOptions`. */
  pane?: Partial<PaneOptions>;
  /**
   * Y axis configuration for the indicator pane. Applied via `createYAxis`
   * (idempotent in KLineCharts v10).
   */
  yAxis?: YAxisOverride;
  /**
   * Options applied to the indicator pane.
   * @deprecated Renamed to `pane` to match KLineCharts v10. Use `pane` instead.
   */
  paneOptions?: Partial<PaneOptions>;
}

/**
 * Manages the lifecycle of a technical indicator.
 *
 * In KLineCharts v10, `createIndicator(value, isStack?)` no longer accepts a
 * separate options object: `paneId`/`yAxisId` live on the `IndicatorCreate`
 * value itself. This hook therefore:
 * 1. Creates the indicator (optionally passing a stable `paneId`/`id`).
 * 2. Applies `pane` to the resulting pane via `setPaneOptions`.
 * 3. Configures the pane's Y axis via `createYAxis` when `yAxis` is provided.
 *
 * @returns The indicator id, or `null`.
 */
export function useIndicator(options: UseIndicatorOptions): Nullable<string> {
  const chart = useKLineChart();
  const indicatorIdRef = useRef<Nullable<string>>(null);
  const { value, isStack, pane, paneOptions, yAxis } = options;

  // Stable unique ID per component instance — survives re-renders,
  // guarantees cleanup removes exactly the indicator we created.
  const indicatorId = useId();

  // Name is the base identity. If this changes, we must recreate.
  const indicatorName = typeof value === "string" ? value : value.name;

  // Serialize value for dependency comparison (small config objects)
  const valueKey = typeof value === "string" ? value : JSON.stringify(value);

  // Recreate the indicator only when its *identity* changes — the indicator
  // name, the stacking flag, or the target pane id. Pane *options* (height,
  // state, ...) are applied live via setPaneOptions below and must NOT trigger
  // a full recreation.
  const paneIdKey = pane?.id ?? paneOptions?.id ?? "";
  const yAxisKey = yAxis ? JSON.stringify(yAxis) : "";

  useEffect(() => {
    if (!chart || !indicatorName) return;

    const create: IndicatorCreate =
      typeof value === "string"
        ? { name: value, id: indicatorId }
        : { ...value, id: indicatorId };

    indicatorIdRef.current = chart.createIndicator(create, isStack);

    return () => {
      chart.removeIndicator({ id: indicatorId });
      indicatorIdRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chart, indicatorName, isStack, indicatorId, paneIdKey, yAxisKey]);

  // Apply pane options to the indicator pane. `setPaneOptions` in v10 accepts a
  // `Partial<PaneOptions>` and targets the pane whose id matches `options.id`.
  // Re-run whenever the full pane config changes so live tweaks (height, ...)
  // take effect without recreating the indicator.
  const paneOptionsKey =
    (pane ?? paneOptions) ? JSON.stringify(pane ?? paneOptions) : "";
  useEffect(() => {
    if (!chart || !indicatorIdRef.current) return;
    const resolvedPane = pane ?? paneOptions;
    if (!resolvedPane) return;

    const indicator = chart
      .getIndicators({ id: indicatorIdRef.current })
      .find((i) => i.id === indicatorIdRef.current);
    if (!indicator) return;

    chart.setPaneOptions({ id: indicator.paneId, ...resolvedPane });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chart, paneOptionsKey, paneIdKey]);

  // Configure the indicator pane's Y axis. `createIndicator` already creates an
  // axis for the indicator, so `createYAxis` would be a no-op here. Use
  // `overrideYAxis` instead, which resolves the existing axis by id and applies
  // the config. Re-run after (re)creation so a freshly created indicator's axis
  // is configured too.
  useEffect(() => {
    if (!chart || !indicatorIdRef.current || !yAxis) return;

    const indicator = chart
      .getIndicators({ id: indicatorIdRef.current })
      .find((i) => i.id === indicatorIdRef.current);
    if (!indicator) return;

    chart.overrideYAxis({
      ...yAxis,
      paneId: indicator.paneId,
      id: indicator.yAxisId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chart, yAxisKey, paneIdKey]);

  // Override indicator config when the value object changes.
  // We must skip the first run: the create-effect above already applied the
  // initial value, so overriding immediately would be a redundant call.
  const firstOverrideRef = useRef(true);
  useEffect(() => {
    if (!chart || typeof value === "string") return;
    if (firstOverrideRef.current) {
      firstOverrideRef.current = false;
      return;
    }
    chart.overrideIndicator({ ...value, id: indicatorId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chart, valueKey, indicatorId]);

  return indicatorIdRef.current;
}
