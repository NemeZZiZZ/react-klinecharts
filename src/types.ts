import type {
  Options,
  Styles,
  IndicatorCreate,
  OverlayCreate,
  PaneOptions,
  YAxisOverride,
  XAxisOverride,
  Formatter,
  SymbolInfo,
  Period,
  ThousandsSeparator,
  DecimalFold,
  DataLoader,
  ActionType,
  ZoomAnchor,
  ZoomAnchorType,
  DeepPartial,
  Hotkey,
  KLineData,
  PickPartial,
} from "klinecharts";
import type { HTMLAttributes, ReactNode, Ref } from "react";
import type { Chart } from "klinecharts";
import type { ActionPayloadMap, TypedActionCallback } from "./events";

// ---------------------------------------------------------------------------
// KLineChart component props
// ---------------------------------------------------------------------------

export interface KLineChartProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  ref?: Ref<Chart>;
  children?: ReactNode;

  /** Chart initialization options (applied once on mount). */
  options?: Options;

  // -- Data ------------------------------------------------------------------

  /**
   * Static data array to apply to the chart.
   *
   * The array identity is used as the effect dependency: replacing the
   * array re-applies the data, but mutating it in place does not. For
   * streaming/realtime updates prefer {@link KLineChartProps.dataLoader}
   * with a `subscribeBar` implementation.
   */
  data?: KLineData[];

  /** Data loader for fetching and subscribing to bar data. Calls `setDataLoader`. */
  dataLoader?: DataLoader;

  /** Symbol info (ticker, precision). Calls `setSymbol`. */
  symbol?: PickPartial<SymbolInfo, "pricePrecision" | "volumePrecision">;

  /** Time period. Calls `setPeriod`. */
  period?: Period;

  // -- Reactive props --------------------------------------------------------

  /** Chart styles. Calls `setStyles` on change. */
  styles?: string | DeepPartial<Styles>;

  /** Locale identifier. Calls `setLocale` on change. */
  locale?: string;

  /** IANA timezone string. Calls `setTimezone` on change. */
  timezone?: string;

  /** Custom formatters for dates and big numbers. Calls `setFormatter`. */
  formatter?: Partial<Formatter>;

  /** Thousands separator config. Calls `setThousandsSeparator`. */
  thousandsSeparator?: Partial<ThousandsSeparator>;

  /** Decimal fold config. Calls `setDecimalFold`. */
  decimalFold?: Partial<DecimalFold>;

  /** Enable/disable zoom. Calls `setZoomEnabled`. */
  zoomEnabled?: boolean;

  /** Enable/disable scroll. Calls `setScrollEnabled`. */
  scrollEnabled?: boolean;

  /** Zoom anchor config. Calls `setZoomAnchor`. */
  zoomAnchor?: ZoomAnchorType | Partial<ZoomAnchor>;

  /** Right offset distance in pixels. Calls `setOffsetRightDistance`. */
  offsetRightDistance?: number;

  /** Maximum left offset distance. Calls `setMaxOffsetLeftDistance`. */
  maxOffsetLeftDistance?: number;

  /** Maximum right offset distance. Calls `setMaxOffsetRightDistance`. */
  maxOffsetRightDistance?: number;

  /** Minimum visible bar count on the left. */
  leftMinVisibleBarCount?: number;

  /** Minimum visible bar count on the right. */
  rightMinVisibleBarCount?: number;

  /** Width of a single bar in pixels. Calls `setBarSpace`. */
  barSpace?: number;

  /** Hot-key configuration. Calls `setHotkey`. */
  hotkey?: Partial<Hotkey>;

  /** Override the X axis. Calls `overrideXAxis`. */
  xAxis?: XAxisOverride;

  /** Override the Y axis. Calls `overrideYAxis`. */
  yAxis?: YAxisOverride;

  // -- Event callbacks -------------------------------------------------------

  /** Fired once the chart instance has been created. */
  onReady?: (chart: Chart) => void;

  /** Chart zoom event. */
  onZoom?: TypedActionCallback<"onZoom">;

  /**
   * Chart scroll event (klinecharts `onScroll` action).
   *
   * Named `onChartScroll` to avoid colliding with the native DOM
   * `onScroll` handler that is passed through to the container element.
   */
  onChartScroll?: TypedActionCallback<"onScroll">;

  /** Visible data range changed. */
  onVisibleRangeChange?: TypedActionCallback<"onVisibleRangeChange">;

  /** Crosshair position changed. */
  onCrosshairChange?: TypedActionCallback<"onCrosshairChange">;

  /** Candle bar clicked. */
  onCandleBarClick?: TypedActionCallback<"onCandleBarClick">;

  /** Pane drag event. */
  onPaneDrag?: TypedActionCallback<"onPaneDrag">;

  /** Candle tooltip feature clicked. */
  onCandleTooltipFeatureClick?: TypedActionCallback<"onCandleTooltipFeatureClick">;

  /** Indicator tooltip feature clicked. */
  onIndicatorTooltipFeatureClick?: TypedActionCallback<"onIndicatorTooltipFeatureClick">;

  /** Crosshair feature clicked. */
  onCrosshairFeatureClick?: TypedActionCallback<"onCrosshairFeatureClick">;
}

// ---------------------------------------------------------------------------
// Hook option types
// ---------------------------------------------------------------------------

export interface UseIndicatorOptions {
  /** Indicator name or full creation config. */
  value: string | IndicatorCreate;
  /** Whether to stack on existing indicators in the same pane. */
  isStack?: boolean;
  /** Pane options for the indicator pane. */
  pane?: PaneOptions;
  /** Y axis override for the indicator pane. */
  yAxis?: YAxisOverride;
  /**
   * Pane options for the indicator pane.
   * @deprecated Renamed to `pane` to match KLineCharts v10. Use `pane` instead.
   */
  paneOptions?: PaneOptions;
}

export interface UseOverlayOptions {
  /** Overlay name, creation config, or an array for batch creation. */
  value: string | OverlayCreate | Array<string | OverlayCreate>;
}

export type { ActionPayloadMap, TypedActionCallback, ActionType };
