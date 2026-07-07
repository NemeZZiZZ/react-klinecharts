import { forwardRef, useEffect, useRef, useState, type Ref } from "react";
import {
  init,
  dispose,
  type ActionCallback,
  type Chart,
  type ActionType,
} from "klinecharts";

import { KLineChartContext } from "./KLineChartContext";
import { Indicator } from "./components/Indicator";
import { Overlay } from "./components/Overlay";
import { Widget } from "./components/Widget";
import { subscribeChartAction } from "./subscribeChartAction";
import type { ActionPayloadMap } from "./events";
import type { KLineChartProps } from "./types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function updateForwardedRef(ref: Ref<Chart> | undefined, chart: Chart | null) {
  if (!ref) return;
  if (typeof ref === "function") {
    ref(chart);
  } else {
    (ref as React.MutableRefObject<Chart | null>).current = chart;
  }
}

/**
 * Subscribes to a chart action using a stable handler.
 * The latest callback is always read from a ref to avoid re-subscribing on
 * every render.
 */
function useActionSubscription<T extends ActionType>(
  chart: Chart | null,
  actionType: T,
  callback: ((data: ActionPayloadMap[T]) => void) | undefined
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!chart) return;

    const handler: ActionCallback = (data) => {
      // klinecharts emits payloads of type ActionPayloadMap[T]; cast back
      // from the loose `unknown` the ActionCallback signature uses.
      callbackRef.current?.(data as ActionPayloadMap[T]);
    };

    return subscribeChartAction(chart, actionType, handler);
  }, [chart, actionType]);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const KLineChartInner = forwardRef<Chart, KLineChartProps>(
  (
    {
      // Init-only
      options,

      // Data
      data,
      dataLoader,
      symbol,
      period,

      // Reactive
      styles,
      locale,
      timezone,
      formatter,
      thousandsSeparator,
      decimalFold,
      zoomEnabled,
      scrollEnabled,
      zoomAnchor,
      offsetRightDistance,
      maxOffsetLeftDistance,
      maxOffsetRightDistance,
      leftMinVisibleBarCount,
      rightMinVisibleBarCount,
      barSpace,
      hotkey,
      xAxis,
      yAxis,

      // Events
      onReady,
      onZoom,
      onChartScroll,
      onVisibleRangeChange,
      onCrosshairChange,
      onCandleBarClick,
      onPaneDrag,
      onCandleTooltipFeatureClick,
      onIndicatorTooltipFeatureClick,
      onCrosshairFeatureClick,

      // Children (sub-components)
      children,

      // HTML div passthrough
      ...divProps
    },
    ref
  ) => {
    const chartRef = useRef<Chart | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [chart, setChart] = useState<Chart | null>(null);

    // Keep a stable ref to onReady so we don't re-trigger init
    const onReadyRef = useRef(onReady);
    onReadyRef.current = onReady;

    // ---- Initialization (mount-only, StrictMode-safe) ----
    // In React 18+ StrictMode (dev), React runs the effect, then its cleanup,
    // then the effect again. Because the cleanup below disposes the chart and
    // nulls chartRef, the second run always starts from a clean state, so no
    // explicit "dispose previous" guard is needed here.
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const instance = init(container, options);
      if (!instance) return;

      chartRef.current = instance;
      setChart(instance);
      updateForwardedRef(ref, instance);
      onReadyRef.current?.(instance);

      return () => {
        dispose(container);
        chartRef.current = null;
        setChart(null);
        updateForwardedRef(ref, null);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ---- Ref sync ----
    useEffect(() => {
      updateForwardedRef(ref, chartRef.current);
    }, [ref]);

    // ---- Data ----
    // Symbol and period use serialized keys instead of object references
    // to avoid unnecessary data reloads when consumers pass inline objects.
    const symbolKey = symbol ? JSON.stringify(symbol) : "";
    const periodKey = period ? JSON.stringify(period) : "";

    useEffect(() => {
      if (!chart) return;
      if (dataLoader) {
        // When a real loader is supplied, let klinecharts own the data flow.
        chart.setDataLoader(dataLoader);
      } else if (data) {
        // Wrap the static array in a minimal loader. `more: { forward: false }`
        // tells klinecharts there is no older history to load on scroll-left.
        chart.setDataLoader({
          getBars: ({ callback }) => {
            callback(data, { forward: false, backward: false });
          },
        });
      }
    }, [chart, data, dataLoader]);

    useEffect(() => {
      if (!chart || !symbol) return;
      chart.setSymbol(symbol);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chart, symbolKey]);

    useEffect(() => {
      if (!chart || !period) return;
      chart.setPeriod(period);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chart, periodKey]);

    // ---- Reactive props ----
    useEffect(() => {
      if (!chart || styles === undefined) return;
      chart.setStyles(styles);
    }, [chart, styles]);

    useEffect(() => {
      if (!chart || locale === undefined) return;
      chart.setLocale(locale);
    }, [chart, locale]);

    useEffect(() => {
      if (!chart || timezone === undefined) return;
      chart.setTimezone(timezone);
    }, [chart, timezone]);

    useEffect(() => {
      if (!chart || formatter === undefined) return;
      chart.setFormatter(formatter);
    }, [chart, formatter]);

    useEffect(() => {
      if (!chart || thousandsSeparator === undefined) return;
      chart.setThousandsSeparator(thousandsSeparator);
    }, [chart, thousandsSeparator]);

    useEffect(() => {
      if (!chart || decimalFold === undefined) return;
      chart.setDecimalFold(decimalFold);
    }, [chart, decimalFold]);

    useEffect(() => {
      if (!chart || zoomEnabled === undefined) return;
      chart.setZoomEnabled(zoomEnabled);
    }, [chart, zoomEnabled]);

    useEffect(() => {
      if (!chart || scrollEnabled === undefined) return;
      chart.setScrollEnabled(scrollEnabled);
    }, [chart, scrollEnabled]);

    useEffect(() => {
      // Pass-through: klinecharts' setZoomAnchor already accepts both the
      // string form and the partial object form, so do not impose defaults.
      if (!chart || zoomAnchor === undefined) return;
      chart.setZoomAnchor(zoomAnchor);
    }, [chart, zoomAnchor]);

    useEffect(() => {
      if (!chart || offsetRightDistance === undefined) return;
      chart.setOffsetRightDistance(offsetRightDistance);
    }, [chart, offsetRightDistance]);

    useEffect(() => {
      if (!chart || maxOffsetLeftDistance === undefined) return;
      chart.setMaxOffsetLeftDistance(maxOffsetLeftDistance);
    }, [chart, maxOffsetLeftDistance]);

    useEffect(() => {
      if (!chart || maxOffsetRightDistance === undefined) return;
      chart.setMaxOffsetRightDistance(maxOffsetRightDistance);
    }, [chart, maxOffsetRightDistance]);

    useEffect(() => {
      if (!chart || leftMinVisibleBarCount === undefined) return;
      chart.setLeftMinVisibleBarCount(leftMinVisibleBarCount);
    }, [chart, leftMinVisibleBarCount]);

    useEffect(() => {
      if (!chart || rightMinVisibleBarCount === undefined) return;
      chart.setRightMinVisibleBarCount(rightMinVisibleBarCount);
    }, [chart, rightMinVisibleBarCount]);

    useEffect(() => {
      if (!chart || barSpace === undefined) return;
      chart.setBarSpace(barSpace);
    }, [chart, barSpace]);

    useEffect(() => {
      if (!chart || hotkey === undefined) return;
      chart.setHotkey(hotkey);
    }, [chart, hotkey]);

    useEffect(() => {
      if (!chart || xAxis === undefined) return;
      chart.overrideXAxis(xAxis);
    }, [chart, xAxis]);

    useEffect(() => {
      if (!chart || yAxis === undefined) return;
      chart.overrideYAxis(yAxis);
    }, [chart, yAxis]);

    // ---- Event subscriptions ----
    useActionSubscription(chart, "onZoom", onZoom);
    useActionSubscription(chart, "onScroll", onChartScroll);
    useActionSubscription(chart, "onVisibleRangeChange", onVisibleRangeChange);
    useActionSubscription(chart, "onCrosshairChange", onCrosshairChange);
    useActionSubscription(chart, "onCandleBarClick", onCandleBarClick);
    useActionSubscription(chart, "onPaneDrag", onPaneDrag);
    useActionSubscription(
      chart,
      "onCandleTooltipFeatureClick",
      onCandleTooltipFeatureClick
    );
    useActionSubscription(
      chart,
      "onIndicatorTooltipFeatureClick",
      onIndicatorTooltipFeatureClick
    );
    useActionSubscription(
      chart,
      "onCrosshairFeatureClick",
      onCrosshairFeatureClick
    );

    // ---- Render ----
    return (
      <KLineChartContext.Provider value={{ chart }}>
        <div {...divProps} ref={containerRef} />
        {!!chart && children}
      </KLineChartContext.Provider>
    );
  }
);

KLineChartInner.displayName = "KLineChart";

// Attach sub-components as static properties
export const KLineChart = Object.assign(KLineChartInner, {
  Indicator,
  Overlay,
  Widget,
});
