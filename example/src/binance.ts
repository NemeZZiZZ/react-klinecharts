import type { KLineData, Period } from "../../src";

const BASE_URL = "https://api.binance.com/api/v3";
const WS_URL = "wss://stream.binance.com:9443/ws";

/**
 * Maps a klinecharts Period to a Binance interval string.
 * e.g. { type: "minute", span: 1 } → "1m"
 */
function periodToInterval(period: Period): string {
  const suffixes: Record<string, string> = {
    second: "s",
    minute: "m",
    hour: "h",
    day: "d",
    week: "w",
    month: "M",
  };
  return `${period.span}${suffixes[period.type] ?? period.type}`;
}

// Binance REST kline array indices
const T_OPEN = 0;
const P_OPEN = 1;
const P_HIGH = 2;
const P_LOW = 3;
const P_CLOSE = 4;
const VOL = 5;
const TURNOVER = 7;

function parseKline(raw: (string | number)[]): KLineData {
  return {
    timestamp: raw[T_OPEN] as number,
    open: Number(raw[P_OPEN]),
    high: Number(raw[P_HIGH]),
    low: Number(raw[P_LOW]),
    close: Number(raw[P_CLOSE]),
    volume: Number(raw[VOL]),
    turnover: Number(raw[TURNOVER]),
  };
}

/**
 * Fetches historical klines from Binance REST API.
 * Returns bars sorted by timestamp ascending.
 */
export async function fetchKlines(
  symbol: string,
  period: Period,
  options?: { limit?: number; endTime?: number },
): Promise<KLineData[]> {
  const interval = periodToInterval(period);
  const params = new URLSearchParams({
    symbol: symbol.replace("/", "").toUpperCase(),
    interval,
    limit: String(options?.limit ?? 1000),
  });
  if (options?.endTime) {
    params.set("endTime", String(options.endTime));
  }

  const res = await fetch(`${BASE_URL}/klines?${params}`);
  if (!res.ok) throw new Error(`Binance API error: ${res.status}`);

  const raw: (string | number)[][] = await res.json();
  return raw.map(parseKline);
}

/**
 * Fetches multiple consecutive batches of klines going backwards in time.
 * Each batch is 1000 bars (Binance max per request). Batches run in sequence
 * because each one needs the previous batch's oldest timestamp as endTime.
 *
 * @param batches Number of 1000-bar batches to fetch (default 3 = 3000 bars)
 * @returns Combined bars sorted by timestamp ascending.
 */
export async function fetchKlinesBatched(
  symbol: string,
  period: Period,
  options?: { endTime?: number; batches?: number },
): Promise<KLineData[]> {
  const batches = options?.batches ?? 3;
  let endTime = options?.endTime;
  const allBars: KLineData[] = [];

  for (let i = 0; i < batches; i++) {
    const data = await fetchKlines(symbol, period, endTime ? { endTime } : undefined);
    if (data.length === 0) break;
    allBars.unshift(...data);
    endTime = data[0].timestamp - 1;
  }

  return allBars;
}

/**
 * Subscribes to real-time kline updates via Binance WebSocket.
 * Returns a cleanup function to close the connection.
 */
export function subscribeKlines(
  symbol: string,
  period: Period,
  onUpdate: (bar: KLineData) => void,
): () => void {
  const pair = symbol.replace("/", "").toLowerCase();
  const interval = periodToInterval(period);
  const ws = new WebSocket(`${WS_URL}/${pair}@kline_${interval}`);

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.e !== "kline") return;
    const k = msg.k;
    onUpdate({
      timestamp: k.t,
      open: Number(k.o),
      high: Number(k.h),
      low: Number(k.l),
      close: Number(k.c),
      volume: Number(k.v),
      turnover: Number(k.q),
    });
  };

  return () => {
    ws.close();
  };
}
