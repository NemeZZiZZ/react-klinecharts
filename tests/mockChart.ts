import type { Chart, ActionType, ActionCallback } from "klinecharts";

/**
 * An in-memory Chart stub that records calls and supports action subscriptions.
 * Only the surface area exercised by the React wrapper is implemented.
 */
export interface MockChart extends Chart {
  /** Recorded calls to public setters, keyed by method name. */
  __calls: Record<string, unknown[][]>;
  /** Reset all recorded calls. */
  __reset(): void;
  /** Emit an action payload to all current subscribers. */
  __emit(type: ActionType, data?: unknown): void;
}

export function createMockChart(): MockChart {
  const calls: Record<string, unknown[][]> = {};
  const actions = new Map<ActionType, Set<ActionCallback>>();

  const record = (name: string) => (...args: unknown[]) => {
    (calls[name] ??= []).push(args);
    // Return sensible defaults matching the real return types.
    switch (name) {
      case "createIndicator":
      case "createOverlay":
        return "mock-pane-id";
      case "createYAxis":
        return "mock-yAxis-id";
      case "getIndicators":
        // Mimic v10: createIndicator stores paneId/yAxisId on the indicator.
        return [
          {
            id: "mock-pane-id",
            paneId: "mock-pane-id",
            yAxisId: "mock-yAxis-id",
            name: "MA",
          },
        ];
      case "getVisibleRange":
        return { from: 0, to: 10, realFrom: 0, realTo: 10 };
      case "getBarSpace":
        return { bar: 8, halfBar: 4, gapBar: 2, halfGapBar: 1 };
      case "getDataList":
        return [
          {
            timestamp: 1,
            open: 1,
            high: 2,
            low: 0,
            close: 1,
            volume: 1,
          },
        ];
      case "getPaneOptions":
        // No id (or explicit undefined) → all panes (array). With an id → not found (null).
        return args[0] == null ? [] : null;
      case "getYAxes":
        return [];
      case "removeYAxis":
        return true;
      default:
        return undefined;
    }
  };

  const chart = {
    id: "mock-chart",
    __calls: calls,
    __reset() {
      for (const k of Object.keys(calls)) delete calls[k];
      actions.clear();
    },
    __emit(type: ActionType, data?: unknown) {
      actions.get(type)?.forEach((cb) => cb(data));
    },
  } as unknown as MockChart;

  // Build method stubs for every Chart/Store method we care about.
  const methods: Array<keyof Chart> = [
    "setStyles",
    "getStyles",
    "setFormatter",
    "getFormatter",
    "setLocale",
    "getLocale",
    "setTimezone",
    "getTimezone",
    "setThousandsSeparator",
    "getThousandsSeparator",
    "setDecimalFold",
    "getDecimalFold",
    "setHotkey",
    "getHotkey",
    "getHotKey",
    "setSymbol",
    "getSymbol",
    "setPeriod",
    "getPeriod",
    "getDataList",
    "setOffsetRightDistance",
    "getOffsetRightDistance",
    "setMaxOffsetLeftDistance",
    "setMaxOffsetRightDistance",
    "setLeftMinVisibleBarCount",
    "setRightMinVisibleBarCount",
    "setBarSpace",
    "getBarSpace",
    "getVisibleRange",
    "setDataLoader",
    "overrideIndicator",
    "removeIndicator",
    "overrideOverlay",
    "removeOverlay",
    "setZoomEnabled",
    "isZoomEnabled",
    "setZoomAnchor",
    "getZoomAnchor",
    "setScrollEnabled",
    "isScrollEnabled",
    "resetData",
    "getDom",
    "getSize",
    "createIndicator",
    "getIndicators",
    "createOverlay",
    "getOverlays",
    "setPaneOptions",
    "createYAxis",
    "removeYAxis",
    "getYAxes",
    "overrideYAxis",
    "overrideXAxis",
    "getPaneOptions",
    "scrollByDistance",
    "scrollToRealTime",
    "scrollToDataIndex",
    "scrollToTimestamp",
    "zoomAtCoordinate",
    "zoomAtDataIndex",
    "zoomAtTimestamp",
    "convertToPixel",
    "convertFromPixel",
    "executeAction",
    "getConvertPictureUrl",
    "resize",
  ];

  for (const m of methods) {
    // @ts-expect-error — dynamic assignment onto the stub
    chart[m] = record(m as string);
  }

  // subscribeAction / unsubscribeAction need real behavior for event tests.
  chart.subscribeAction = ((type: ActionType, cb: ActionCallback) => {
    const set = actions.get(type) ?? new Set();
    set.add(cb);
    actions.set(type, set);
  }) as Chart["subscribeAction"];
  chart.unsubscribeAction = ((type: ActionType, cb?: ActionCallback) => {
    if (cb === undefined) {
      actions.delete(type);
    } else {
      actions.get(type)?.delete(cb);
    }
  }) as Chart["unsubscribeAction"];

  return chart;
}
