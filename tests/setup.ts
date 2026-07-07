import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import { createMockChart, type MockChart } from "./mockChart";

// --- jsdom polyfills -------------------------------------------------------

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(globalThis as unknown as { ResizeObserver: typeof ResizeObserverMock }).ResizeObserver =
  ResizeObserverMock;

(globalThis as unknown as { requestAnimationFrame: typeof requestAnimationFrame }).requestAnimationFrame =
  (cb: FrameRequestCallback) => setTimeout(() => cb(0)) as unknown as number;
(globalThis as unknown as { cancelAnimationFrame: typeof cancelAnimationFrame }).cancelAnimationFrame =
  (id: number) => clearTimeout(id);

// --- klinecharts mock ------------------------------------------------------
//
// The real klinecharts is canvas-bound and crashes in jsdom (no 2d context).
// Replace the whole module with stubs so the React wrapper logic can be tested
// in isolation. Expose the live chart stubs on `globalThis.__charts` so tests
// can drive them.

const charts: MockChart[] = [];

const init = vi.fn((_container: HTMLElement) => {
  const c = createMockChart();
  charts.push(c);
  return c;
});
const dispose = vi.fn((..._args: unknown[]) => {});

vi.mock("klinecharts", () => {
  return {
    init: (container: HTMLElement) => init(container),
    dispose: (...args: unknown[]) => dispose(...args),
    version: () => "test",
    utils: {},
  };
});

export const __mockCharts = charts;
export const __init = init;
export const __dispose = dispose;
