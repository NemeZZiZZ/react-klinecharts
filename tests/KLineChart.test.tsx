import { describe, it, expect, beforeEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { StrictMode } from "react";
import { KLineChart } from "../src";
import { __mockCharts, __init, __dispose } from "./setup";

beforeEach(() => {
  cleanup();
  __mockCharts.length = 0;
  __init.mockClear();
  __dispose.mockClear();
});

describe("KLineChart lifecycle", () => {
  it("initializes a chart on mount and disposes on unmount", () => {
    const { unmount } = render(
      <div>
        <KLineChart style={{ width: 100, height: 100 }} />
      </div>
    );

    expect(__init).toHaveBeenCalledTimes(1);
    expect(__dispose).toHaveBeenCalledTimes(0);

    unmount();

    expect(__dispose).toHaveBeenCalledTimes(1);
  });

  it("is StrictMode-safe: re-initializes after the dev double-invoke", () => {
    const { unmount } = render(
      <StrictMode>
        <KLineChart style={{ width: 100, height: 100 }} />
      </StrictMode>
    );

    // In StrictMode dev: mount → cleanup → mount. After settling, exactly one
    // live chart instance exists, and dispose was called once (the cleanup).
    expect(__init).toHaveBeenCalledTimes(2);
    expect(__dispose).toHaveBeenCalledTimes(1);

    unmount();

    expect(__init).toHaveBeenCalledTimes(2);
    expect(__dispose).toHaveBeenCalledTimes(2);
  });

  it("passes HTML attributes through to the container", () => {
    const { container } = render(
      <KLineChart className="my-chart" role="img" data-testid="chart" />
    );
    const el = container.querySelector(".my-chart");
    expect(el).not.toBeNull();
    expect(el?.getAttribute("role")).toBe("img");
  });
});

describe("KLineChart reactive props", () => {
  it("applies static data via a data loader wrapper", () => {
    const data = [{ timestamp: 1, open: 1, high: 1, low: 1, close: 1 }];
    render(<KLineChart data={data} />);

    const chart = __mockCharts[0];
    expect(chart.__calls.setDataLoader).toHaveLength(1);
    const loader = chart.__calls.setDataLoader[0][0] as {
      getBars: (p: {
        callback: (d: typeof data, more: object) => void;
      }) => void;
    };
    const received: unknown[] = [];
    loader.getBars({ callback: (d, more) => received.push(d, more) });
    expect(received[0]).toBe(data);
    expect(received[1]).toEqual({ forward: false, backward: false });
  });

  it("forwards reactive setter props to the chart", () => {
    render(
      <KLineChart
        locale="ru-RU"
        timezone="Europe/Moscow"
        zoomEnabled={false}
        scrollEnabled={false}
        barSpace={12}
        offsetRightDistance={42}
      />
    );

    const chart = __mockCharts[0];
    expect(chart.__calls.setLocale.at(-1)?.[0]).toBe("ru-RU");
    expect(chart.__calls.setTimezone.at(-1)?.[0]).toBe("Europe/Moscow");
    expect(chart.__calls.setZoomEnabled.at(-1)?.[0]).toBe(false);
    expect(chart.__calls.setScrollEnabled.at(-1)?.[0]).toBe(false);
    expect(chart.__calls.setBarSpace.at(-1)?.[0]).toBe(12);
    expect(chart.__calls.setOffsetRightDistance.at(-1)?.[0]).toBe(42);
  });

  it("does not call setters for undefined props", () => {
    render(<KLineChart />);

    const chart = __mockCharts[0];
    expect(chart.__calls.setLocale).toBeUndefined();
    expect(chart.__calls.setBarSpace).toBeUndefined();
    expect(chart.__calls.setZoomEnabled).toBeUndefined();
  });
});
