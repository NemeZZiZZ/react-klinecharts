import { useRef, useState, useMemo, useCallback } from "react";
import {
  Chart,
  KLineChart,
  useKLineChart,
  useChartEvent,
  type Crosshair,
  type DataLoader,
} from "../../src";
import { generatedKLineDataList, generateRealtimeTick } from "./utils";
import { fetchKlinesBatched, subscribeKlines } from "./binance";

// ---------------------------------------------------------------------------
// Data source types
// ---------------------------------------------------------------------------

type DataSource = "none" | "generated" | "binance";

// ---------------------------------------------------------------------------
// Custom child components using hooks
// ---------------------------------------------------------------------------

function CrosshairTracker() {
  const chart = useKLineChart();
  const [info, setInfo] = useState("Move crosshair over chart...");

  useChartEvent("onCrosshairChange", (data) => {
    if (!chart) return;
    const crosshair = data as Crosshair;
    // Resolve kLineData from pixel coordinates
    if (crosshair.x != null) {
      const points = chart.convertFromPixel([{ x: crosshair.x }], {
        paneId: "candle_pane",
      }) as Array<{ dataIndex?: number }>;
      const idx = points[0]?.dataIndex;
      if (idx != null) {
        const d = chart.getDataList()[idx];
        if (d) {
          setInfo(
            `O: ${d.open.toFixed(2)}  H: ${d.high.toFixed(2)}  L: ${d.low.toFixed(2)}  C: ${d.close.toFixed(2)}`,
          );
          return;
        }
      }
    }
    setInfo("Move crosshair over chart...");
  });

  return (
    <div style={{ padding: "8px 0", fontFamily: "monospace", fontSize: 13 }}>
      {info}
    </div>
  );
}

function ExportButton({
  chartRef,
}: {
  chartRef: React.RefObject<Chart | null>;
}) {
  return (
    <button
      onClick={() => {
        const chart = chartRef.current;
        if (!chart) return;
        const url = chart.getConvertPictureUrl(true, "png");
        const link = document.createElement("a");
        link.href = url;
        link.download = "chart.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }}
    >
      Export PNG
    </button>
  );
}

// ---------------------------------------------------------------------------
// Data loaders
// ---------------------------------------------------------------------------

function createGeneratedLoader(): DataLoader {
  let intervalId: ReturnType<typeof setInterval> | null = null;
  let lastBar: ReturnType<typeof generatedKLineDataList>[number] | null = null;

  return {
    getBars: ({ callback }) => {
      const data = generatedKLineDataList();
      lastBar = data[data.length - 1];
      callback(data, false);
    },
    subscribeBar: ({ callback }) => {
      intervalId = setInterval(() => {
        if (!lastBar) return;
        lastBar = generateRealtimeTick(lastBar);
        callback(lastBar);
      }, 500);
    },
    unsubscribeBar: () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
    },
  };
}

function createBinanceLoader(
  barsCountRef: React.RefObject<number>,
): DataLoader {
  let cleanup: (() => void) | null = null;
  let oldestTimestamp: number | null = null;

  return {
    getBars: async ({ symbol, period, type, callback }) => {
      try {
        const ticker = symbol.ticker.replace("/", "").toUpperCase();
        const batches = Math.ceil(barsCountRef.current / 1000);
        if (type === "init") {
          oldestTimestamp = null;
          const data = await fetchKlinesBatched(ticker, period, { batches });
          if (data.length > 0) {
            oldestTimestamp = data[0].timestamp;
          }
          callback(data, { forward: true, backward: false });
        } else if (type === "forward" && oldestTimestamp) {
          const data = await fetchKlinesBatched(ticker, period, {
            endTime: oldestTimestamp - 1,
            batches,
          });
          if (data.length > 0) {
            oldestTimestamp = data[0].timestamp;
          }
          callback(data, { forward: data.length > 0, backward: false });
        }
      } catch (e) {
        console.warn("[getBars]", e);
      }
    },
    subscribeBar: ({ symbol, period, callback }) => {
      const ticker = symbol.ticker.replace("/", "").toUpperCase();
      cleanup = subscribeKlines(ticker, period, callback);
    },
    unsubscribeBar: () => {
      cleanup?.();
      cleanup = null;
    },
  };
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

const App: React.FC = () => {
  const chartRef = useRef<Chart>(null);
  const [zoomEnabled, setZoomEnabled] = useState(true);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [showMA, setShowMA] = useState(true);
  const [showVOL, setShowVOL] = useState(true);
  const [dataSource, setDataSource] = useState<DataSource>("generated");
  const [barsCount, setBarsCount] = useState(5000);
  const barsCountRef = useRef(barsCount);
  barsCountRef.current = barsCount;

  const generatedLoader = useMemo(() => createGeneratedLoader(), []);
  const binanceLoader = useMemo(() => createBinanceLoader(barsCountRef), []);

  const dataLoader =
    dataSource === "generated"
      ? generatedLoader
      : dataSource === "binance"
        ? binanceLoader
        : undefined;

  const symbol = useMemo(
    () =>
      dataSource === "binance"
        ? { ticker: "BTCUSDT", pricePrecision: 2, volumePrecision: 4 }
        : { ticker: "DEMO" },
    [dataSource],
  );

  const period = useMemo(() => ({ type: "minute" as const, span: 1 }), []);

  const handleReady = useCallback((chart: Chart) => {
    console.log("Chart ready, id:", chart.id);
  }, []);

  const toggleSource = (source: DataSource) => {
    setDataSource((prev) => (prev === source ? "none" : source));
  };

  return (
    <div
      style={{
        padding: 24,
        fontFamily: "sans-serif",
      }}
    >
      <h2>
        <a
          href="https://github.com/NemeZZiZZ/react-klinecharts"
          target="_blank"
          rel="noopener noreferrer"
        >
          react-klinecharts
        </a>{" "}
        example
      </h2>

      {/* Toolbar */}
      <div
        style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}
      >
        <button onClick={() => chartRef.current?.resetData()}>
          Reset data
        </button>
        <button onClick={() => setZoomEnabled((v) => !v)}>
          Zoom: {zoomEnabled ? "ON" : "OFF"}
        </button>
        <button onClick={() => setScrollEnabled((v) => !v)}>
          Scroll: {scrollEnabled ? "ON" : "OFF"}
        </button>
        <button onClick={() => toggleSource("generated")}>
          Generated realtime data: {dataSource === "generated" ? "ON" : "OFF"}
        </button>
        <button onClick={() => toggleSource("binance")}>
          Binance historic + realtime: {dataSource === "binance" ? "ON" : "OFF"}
        </button>
        <button onClick={() => setShowMA((v) => !v)}>
          MA: {showMA ? "ON" : "OFF"}
        </button>
        <button onClick={() => setShowVOL((v) => !v)}>
          VOL: {showVOL ? "ON" : "OFF"}
        </button>
        <ExportButton chartRef={chartRef} />
        <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
          Bars:
          <input
            type="range"
            min={500}
            max={10000}
            step={500}
            value={barsCount}
            onChange={(e) => setBarsCount(Number(e.target.value))}
          />
          {barsCount}
        </label>
      </div>

      {/* Chart */}
      <KLineChart
        ref={chartRef}
        dataLoader={dataLoader}
        symbol={symbol}
        period={period}
        options={{
          styles: {
            candle: {
              tooltip: {
                showRule: "follow_cross",
              },
            },
          },
        }}
        zoomEnabled={zoomEnabled}
        scrollEnabled={scrollEnabled}
        onReady={handleReady}
        onCandleBarClick={(d) => console.log("Candle clicked:", d)}
        style={{
          width: 1200,
          height: 500,
          maxWidth: "100%",
          maxHeight: "75vh",
          resize: "both",
          overflow: "auto",
        }}
      >
        {showMA && (
          <KLineChart.Indicator
            value={{ name: "MA", calcParams: [5, 10, 30] }}
          />
        )}
        {showVOL && (
          <KLineChart.Indicator value="VOL" paneOptions={{ height: 80 }} />
        )}
        <CrosshairTracker />
      </KLineChart>
    </div>
  );
};

export default App;
