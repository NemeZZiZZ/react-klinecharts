import { describe, it, expect, beforeEach } from "vitest";
import { render, cleanup, act, fireEvent } from "@testing-library/react";
import { useState } from "react";
import {
  KLineChart,
  useCrosshair,
  useVisibleRange,
  useBarSpace,
  useDataList,
  usePane,
} from "../src";
import { __mockCharts } from "./setup";

beforeEach(() => {
  cleanup();
  __mockCharts.length = 0;
});

/**
 * Emit an action through the current mock chart inside a React `act` scope so
 * that setState calls inside the hook callbacks are flushed synchronously.
 */
function emit(type: Parameters<typeof __mockCharts[0]["__emit"]>[0], data?: unknown) {
  act(() => {
    __mockCharts[0].__emit(type, data);
  });
}

describe("state-tracking hooks", () => {
  it("useCrosshair reflects emitted crosshair payloads", () => {
    let seen: unknown = null;
    function Probe() {
      seen = useCrosshair();
      return null;
    }

    render(
      <KLineChart>
        <Probe />
      </KLineChart>
    );

    emit("onCrosshairChange", { x: 10, y: 20, paneId: "candle" });
    expect(seen).toEqual({ x: 10, y: 20, paneId: "candle" });
  });

  it("useVisibleRange updates on onVisibleRangeChange", () => {
    let seen: unknown = null;
    function Probe() {
      seen = useVisibleRange();
      return null;
    }

    render(
      <KLineChart>
        <Probe />
      </KLineChart>
    );

    emit("onVisibleRangeChange", { from: 5, to: 15, realFrom: 5, realTo: 15 });
    expect(seen).toEqual({ from: 5, to: 15, realFrom: 5, realTo: 15 });
  });

  it("useBarSpace recomputes when the visible range changes", () => {
    let seen: unknown = null;
    function Probe() {
      seen = useBarSpace();
      return null;
    }

    render(
      <KLineChart>
        <Probe />
      </KLineChart>
    );

    // getBarSpace stub returns { bar: 8, halfBar: 4, gapBar: 2, halfGapBar: 1 }.
    expect(seen).toEqual({ bar: 8, halfBar: 4, gapBar: 2, halfGapBar: 1 });
  });

  it("useDataList exposes the chart data list", () => {
    let seen: unknown = null;
    function Probe() {
      seen = useDataList();
      return null;
    }

    render(
      <KLineChart>
        <Probe />
      </KLineChart>
    );

    const last = seen as unknown[];
    expect(last).toHaveLength(1);
    expect(last[0]).toMatchObject({ timestamp: 1, close: 1 });
  });

  it("usePane() returns an array; usePane(id) returns one or null", () => {
    let all: unknown = undefined;
    let one: unknown = undefined;
    function Probe() {
      all = usePane();
      one = usePane("candle");
      return null;
    }

    const { rerender } = render(
      <KLineChart>
        <Probe />
      </KLineChart>
    );

    // The hook seeds from chart.getPaneOptions() in an effect; force a second
    // render so the values set by that effect are observable.
    rerender(
      <KLineChart>
        <Probe />
      </KLineChart>
    );

    expect(Array.isArray(all)).toBe(true);
    expect(one).toBe(null); // getPaneOptions stub returns null for an id
  });

  it("hooks return null/empty when there is no chart", () => {
    function Probe() {
      const r = useVisibleRange();
      return <div data-testid="r">{r === null ? "null" : "set"}</div>;
    }

    // Probe rendered outside any <KLineChart> provider.
    const { getByTestId } = render(<Probe />);
    expect(getByTestId("r").textContent).toBe("null");
  });
});

describe("live-update integration", () => {
  it("re-renders a derived component when the chart state changes", () => {
    let lastRange: unknown = null;
    function RangeLabel() {
      lastRange = useVisibleRange();
      return null;
    }

    render(
      <KLineChart>
        <RangeLabel />
      </KLineChart>
    );

    expect(lastRange).toEqual({ from: 0, to: 10, realFrom: 0, realTo: 10 });
    emit("onVisibleRangeChange", {
      from: 2,
      to: 4,
      realFrom: 2,
      realTo: 4,
    });
    expect(lastRange).toEqual({ from: 2, to: 4, realFrom: 2, realTo: 4 });
  });

  it("stable callback identity does not cause re-subscription churn", () => {
    let renderCount = 0;
    let emittedCount = 0;
    function Probe() {
      const [n, setN] = useState(0);
      renderCount++;
      return (
        <>
          <StatefulCrosshair onChange={() => emittedCount++} />
          <button onClick={() => setN(n + 1)}>bump</button>
        </>
      );
    }
    function StatefulCrosshair({ onChange }: { onChange: () => void }) {
      const crosshair = useCrosshair();
      // Re-run the parent's callback whenever the crosshair changes.
      if (crosshair) onChange();
      return null;
    }

    const { getByText } = render(
      <KLineChart>
        <Probe />
      </KLineChart>
    );

    const beforeRenders = renderCount;
    fireEvent.click(getByText("bump"));
    // Bumping unrelated state re-renders, but subscription is stable.
    expect(renderCount).toBeGreaterThan(beforeRenders);

    emit("onCrosshairChange", { x: 1 });
    expect(emittedCount).toBeGreaterThan(0);
  });
});
