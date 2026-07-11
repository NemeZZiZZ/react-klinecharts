import { describe, it, expect, beforeEach } from "vitest";
import { render, cleanup, act } from "@testing-library/react";
import {
  KLineChart,
  useChartEvent,
  useIndicator,
  useOverlay,
  useYAxis,
} from "../src";
import { __mockCharts } from "./setup";

beforeEach(() => {
  cleanup();
  __mockCharts.length = 0;
});

function emit(type: Parameters<typeof __mockCharts[0]["__emit"]>[0], data?: unknown) {
  act(() => {
    __mockCharts[0].__emit(type, data);
  });
}

describe("useChartEvent", () => {
  it("subscribes on mount and unsubscribes on unmount", () => {
    let calls = 0;
    function Probe() {
      useChartEvent("onZoom", () => {
        calls++;
      });
      return null;
    }

    const { unmount } = render(
      <KLineChart>
        <Probe />
      </KLineChart>
    );

    emit("onZoom", { scale: 2 });
    expect(calls).toBe(1);

    unmount();

    emit("onZoom", { scale: 3 });
    expect(calls).toBe(1);
  });

  it("passes a typed payload to the callback", () => {
    let received: { scale: number } | null = null;
    function Probe() {
      // The callback parameter is typed as `{ scale: number }`.
      useChartEvent("onZoom", (data) => {
        received = data;
      });
      return null;
    }

    render(
      <KLineChart>
        <Probe />
      </KLineChart>
    );

    emit("onZoom", { scale: 1.5 });
    expect(received).toEqual({ scale: 1.5 });
  });
});

describe("useIndicator", () => {
  it("creates an indicator on mount and removes it on unmount", () => {
    let indicatorId: string | null = null;
    function Probe() {
      indicatorId = useIndicator({ value: "MA" });
      return null;
    }

    const { rerender, unmount } = render(
      <KLineChart>
        <Probe />
      </KLineChart>
    );

    // useIndicator returns indicatorIdRef.current, which is set inside the
    // create effect. Force a second render so the ref value is read after it.
    rerender(
      <KLineChart>
        <Probe />
      </KLineChart>
    );

    const chart = __mockCharts[0];
    expect(chart.__calls.createIndicator).toHaveLength(1);
    // v10 signature: createIndicator(value, isStack) — no options object.
    expect(chart.__calls.createIndicator[0]).toHaveLength(2);
    expect(chart.__calls.createIndicator[0][1]).toBeUndefined();
    expect(indicatorId).toBe("mock-pane-id");

    unmount();

    expect(chart.__calls.removeIndicator).toHaveLength(1);
    expect(chart.__calls.removeIndicator[0][0]).toEqual({ id: expect.any(String) });
  });

  it("does not issue an override on the first render", () => {
    function Probe() {
      useIndicator({ value: { name: "MA", calcParams: [5] } });
      return null;
    }

    render(
      <KLineChart>
        <Probe />
      </KLineChart>
    );

    const chart = __mockCharts[0];
    expect(chart.__calls.createIndicator).toHaveLength(1);
    // The first override is intentionally skipped.
    expect(chart.__calls.overrideIndicator).toBeUndefined();
  });

  it("applies the `pane` option via setPaneOptions targeting the pane", () => {
    function Probe() {
      useIndicator({ value: "MA", pane: { height: 120 } });
      return null;
    }

    const { rerender } = render(
      <KLineChart>
        <Probe />
      </KLineChart>
    );

    rerender(
      <KLineChart>
        <Probe />
      </KLineChart>
    );

    const chart = __mockCharts[0];
    expect(chart.__calls.setPaneOptions).toHaveLength(1);
    const [opts] = chart.__calls.setPaneOptions[0] as [{ id: string; height: number }];
    // The pane options must carry the indicator's paneId as the target id.
    expect(opts.id).toBe("mock-pane-id");
    expect(opts.height).toBe(120);
  });

  it("does NOT recreate the indicator when only pane options change", () => {
    // Regression: changing e.g. pane.height must update the pane live via
    // setPaneOptions, not tear down and rebuild the indicator.
    function Probe({ height }: { height: number }) {
      useIndicator({ value: "MA", pane: { height } });
      return null;
    }

    const { rerender } = render(
      <KLineChart>
        <Probe height={80} />
      </KLineChart>
    );

    const chart = __mockCharts[0];
    const createCountAfterMount = chart.__calls.createIndicator.length;
    const removeCountAfterMount = chart.__calls.removeIndicator?.length ?? 0;

    // Change only the pane height — no pane id, so identity is unchanged.
    rerender(
      <KLineChart>
        <Probe height={160} />
      </KLineChart>
    );

    // No recreation: create/remove counts must not grow.
    expect(chart.__calls.createIndicator.length).toBe(createCountAfterMount);
    expect((chart.__calls.removeIndicator?.length ?? 0)).toBe(removeCountAfterMount);
    // The new height is applied live via setPaneOptions.
    const lastPaneCall = chart.__calls.setPaneOptions.at(-1) as
      | [{ id: string; height: number }]
      | undefined;
    expect(lastPaneCall?.[0].height).toBe(160);
  });

  it("configures the indicator Y axis via overrideYAxis when `yAxis` is set", () => {
    function Probe() {
      useIndicator({ value: "MA", yAxis: { reverse: true } });
      return null;
    }

    const { rerender } = render(
      <KLineChart>
        <Probe />
      </KLineChart>
    );

    rerender(
      <KLineChart>
        <Probe />
      </KLineChart>
    );

    const chart = __mockCharts[0];
    // createIndicator already creates an axis for the indicator, so the hook
    // must configure it via overrideYAxis (createYAxis would be a no-op).
    expect(chart.__calls.overrideYAxis).toHaveLength(1);
    const [yAxis] = chart.__calls.overrideYAxis[0] as [
      { reverse: boolean; paneId: string; id: string },
    ];
    expect(yAxis.reverse).toBe(true);
    expect(yAxis.paneId).toBe("mock-pane-id");
  });
});

describe("useOverlay", () => {
  it("creates an overlay on mount and removes it on unmount", () => {
    function Probe() {
      useOverlay({ value: "segment" });
      return null;
    }

    const { unmount } = render(
      <KLineChart>
        <Probe />
      </KLineChart>
    );

    const chart = __mockCharts[0];
    expect(chart.__calls.createOverlay).toHaveLength(1);

    unmount();

    expect(chart.__calls.removeOverlay).toHaveLength(1);
  });

  it("skips the first override after creation", () => {
    function Probe() {
      useOverlay({ value: { name: "priceLine", points: [{ value: 100 }] } });
      return null;
    }

    render(
      <KLineChart>
        <Probe />
      </KLineChart>
    );

    const chart = __mockCharts[0];
    expect(chart.__calls.createOverlay).toHaveLength(1);
    expect(chart.__calls.overrideOverlay).toBeUndefined();
  });
});

describe("useYAxis", () => {
  it("creates a Y axis on mount and removes it on unmount", () => {
    let yAxisId: string | null = null;
    function Probe() {
      yAxisId = useYAxis({ value: { paneId: "candle", position: "left" } });
      return null;
    }

    const { rerender, unmount } = render(
      <KLineChart>
        <Probe />
      </KLineChart>
    );

    // useYAxis returns yAxisIdRef.current, set inside the create effect.
    // Force a second render so the ref value is read after the effect.
    rerender(
      <KLineChart>
        <Probe />
      </KLineChart>
    );

    const chart = __mockCharts[0];
    expect(chart.__calls.createYAxis).toHaveLength(1);
    const [created] = chart.__calls.createYAxis[0] as [
      { paneId: string; position: string; id: string },
    ];
    expect(created.paneId).toBe("candle");
    expect(created.position).toBe("left");
    expect(created.id).toEqual(expect.any(String));
    expect(yAxisId).toBe("mock-yAxis-id");

    unmount();

    expect(chart.__calls.removeYAxis).toHaveLength(1);
    expect(chart.__calls.removeYAxis[0][0]).toEqual({ id: expect.any(String) });
  });

  it("does not issue an override on the first render", () => {
    function Probe() {
      useYAxis({ value: { paneId: "candle" } });
      return null;
    }

    render(
      <KLineChart>
        <Probe />
      </KLineChart>
    );

    const chart = __mockCharts[0];
    expect(chart.__calls.createYAxis).toHaveLength(1);
    // The first override is intentionally skipped.
    expect(chart.__calls.overrideYAxis).toBeUndefined();
  });
});
