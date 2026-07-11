import { useMemo, useRef, useState } from "react";
import {
  KLineChart,
  useKLineChart,
  useCrosshair,
  type Chart,
  type DataLoader,
} from "react-klinecharts";
import { generatedKLineDataList, generateRealtimeTick } from "./data";

// ---------------------------------------------------------------------------
// A child component that reads chart state via hooks
// ---------------------------------------------------------------------------

function CrosshairTracker() {
  const chart = useKLineChart();
  const crosshair = useCrosshair();
  const [info, setInfo] = useState("Move the crosshair over the chart…");

  if (!chart) return null;

  // Resolve the bar under the crosshair from its pixel x coordinate.
  if (crosshair?.x != null) {
    const points = chart.convertFromPixel([{ x: crosshair.x }], {
      paneId: "candle_pane",
    }) as Array<{ dataIndex?: number }>;
    const idx = points[0]?.dataIndex;
    const d = idx != null ? chart.getDataList()[idx] : undefined;
    const text = d
      ? `O: ${d.open.toFixed(2)}  H: ${d.high.toFixed(2)}  L: ${d.low.toFixed(2)}  C: ${d.close.toFixed(2)}`
      : "Move the crosshair over the chart…";
    if (text !== info) setInfo(text);
  } else if (info !== "Move the crosshair over the chart…") {
    setInfo("Move the crosshair over the chart…");
  }

  return <div className="live-demo__info">{info}</div>;
}

// ---------------------------------------------------------------------------
// Realtime data loader (synthetic data)
// ---------------------------------------------------------------------------

function createRealtimeLoader(): DataLoader {
  let intervalId: ReturnType<typeof setInterval> | null = null;
  let lastBar: ReturnType<typeof generatedKLineDataList>[number] | null = null;

  return {
    getBars: ({ callback }) => {
      const data = generatedKLineDataList();
      lastBar = data[data.length - 1];
      callback(data, { forward: false, backward: false });
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

// ---------------------------------------------------------------------------
// Export button — uses the imperative ref escape hatch
// ---------------------------------------------------------------------------

function ExportButton({ chartRef }: { chartRef: React.RefObject<Chart | null> }) {
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
// Demo
// ---------------------------------------------------------------------------

export default function ChartDemo() {
  const chartRef = useRef<Chart>(null);
  const [realtime, setRealtime] = useState(true);
  const [showMA, setShowMA] = useState(true);
  const [showVOL, setShowVOL] = useState(true);
  const [leftAxis, setLeftAxis] = useState(false);

  // The loader identity is stable, so the chart doesn't re-subscribe on render.
  const loader = useMemo(() => createRealtimeLoader(), []);

  return (
    <div className="live-demo">
      <div className="live-demo__toolbar">
        <button onClick={() => setRealtime((v) => !v)}>
          Realtime: {realtime ? "ON" : "OFF"}
        </button>
        <button onClick={() => setShowMA((v) => !v)}>
          MA: {showMA ? "ON" : "OFF"}
        </button>
        <button onClick={() => setShowVOL((v) => !v)}>
          VOL: {showVOL ? "ON" : "OFF"}
        </button>
        <button onClick={() => setLeftAxis((v) => !v)}>
          Left YAxis: {leftAxis ? "ON" : "OFF"}
        </button>
        <button onClick={() => chartRef.current?.resetData()}>Reset</button>
        <ExportButton chartRef={chartRef} />
      </div>

      <KLineChart
        ref={chartRef}
        dataLoader={realtime ? loader : undefined}
        data={realtime ? undefined : generatedKLineDataList()}
        symbol={{ ticker: "DEMO" }}
        period={{ type: "minute", span: 1 }}
        options={{
          styles: {
            candle: { tooltip: { showRule: "follow_cross" } },
          },
        }}
        onCandleBarClick={(d) => console.log("Candle clicked:", d)}
        className="live-demo__chart"
      >
        {showMA && (
          <KLineChart.Indicator value={{ name: "MA", calcParams: [5, 10, 30] }} />
        )}
        {showVOL && (
          <KLineChart.Indicator value="VOL" pane={{ height: 80 }} />
        )}
        {/* KLineCharts v10 multi-YAxis: a secondary left axis on the candle pane */}
        {leftAxis && (
          <KLineChart.YAxis value={{ paneId: "candle", position: "left" }} />
        )}
        <CrosshairTracker />
      </KLineChart>
    </div>
  );
}
