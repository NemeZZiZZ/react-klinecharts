import { describe, it, expect, beforeEach } from "vitest";
import { render, cleanup, act } from "@testing-library/react";
import { KLineChart, useChartEvent, useIndicator, useOverlay } from "../src";
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
    let paneId: string | null = null;
    function Probe() {
      paneId = useIndicator({ value: "MA" });
      return null;
    }

    const { rerender, unmount } = render(
      <KLineChart>
        <Probe />
      </KLineChart>
    );

    // useIndicator returns paneIdRef.current, which is set inside the create
    // effect. Force a second render so the ref value is read after the effect.
    rerender(
      <KLineChart>
        <Probe />
      </KLineChart>
    );

    const chart = __mockCharts[0];
    expect(chart.__calls.createIndicator).toHaveLength(1);
    expect(paneId).toBe("mock-pane-id");

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
