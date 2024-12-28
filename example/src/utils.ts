import { KLineData } from "../../src";

// Constants
const PRICE_VARIATION = 20;
const PRICE_OFFSET = 10;
const PRICE_COUNT = 4;
const VOLUME_BASE = 10;
const VOLUME_VARIATION = 50;
const MINUTE_MS = 60 * 1000;

/**
 * Generates synthetic K-line (candlestick) market data
 * @param baseTimestamp - Starting timestamp (default: current time)
 * @param basePrice - Initial price point (default: 5000)
 * @param dataSize - Number of data points to generate (default: 800)
 * @returns Array of KLineData sorted by timestamp ascending
 */
export function generatedKLineDataList(
  baseTimestamp: number = Date.now(),
  basePrice: number = 5000,
  dataSize: number = 800
): KLineData[] {
  const dataList: KLineData[] = new Array(dataSize);
  const timestamp = Math.floor(baseTimestamp / MINUTE_MS) * MINUTE_MS;
  let currentPrice = basePrice;

  const prices = new Array(PRICE_COUNT);

  for (let i = 0; i < dataSize; i++) {
    // Generate base price with random walk
    currentPrice += Math.random() * PRICE_VARIATION - PRICE_OFFSET;

    // Generate price variations
    for (let j = 0; j < PRICE_COUNT; j++) {
      prices[j] = currentPrice + (Math.random() - 0.5) * 12;
    }
    prices.sort((a, b) => a - b);

    const openIdx = Math.round(Math.random() * 3);
    let closeIdx = Math.round(Math.random() * 2);
    closeIdx = closeIdx === openIdx ? closeIdx + 1 : closeIdx;

    const volume = VOLUME_BASE + Math.random() * VOLUME_VARIATION;

    const kLineData: KLineData = {
      timestamp: timestamp - i * MINUTE_MS,
      open: prices[openIdx],
      low: prices[0],
      high: prices[3],
      close: prices[closeIdx],
      volume,
      turnover:
        ((prices[openIdx] + prices[closeIdx] + prices[3] + prices[0]) / 4) *
        volume,
    };

    dataList[dataSize - 1 - i] = kLineData;
  }

  return dataList;
}

/**
 * Simulates a real-time tick by generating a new bar or updating the current one.
 * @param lastBar - The most recent bar to base the tick on
 * @param periodMs - Period duration in ms (default: 1 minute)
 * @returns A new KLineData tick
 */
export function generateRealtimeTick(
  lastBar: KLineData,
  periodMs: number = MINUTE_MS
): KLineData {
  const now = Date.now();
  const currentPeriodStart =
    Math.floor(now / periodMs) * periodMs;
  const lastPeriodStart =
    Math.floor(lastBar.timestamp / periodMs) * periodMs;

  const priceDelta = (Math.random() - 0.5) * 4;
  const newClose = lastBar.close + priceDelta;

  if (currentPeriodStart > lastPeriodStart) {
    // New bar
    const volume = VOLUME_BASE + Math.random() * VOLUME_VARIATION;
    return {
      timestamp: currentPeriodStart,
      open: newClose,
      high: newClose,
      low: newClose,
      close: newClose,
      volume,
      turnover: newClose * volume,
    };
  }

  // Update current bar
  return {
    ...lastBar,
    timestamp: currentPeriodStart,
    high: Math.max(lastBar.high, newClose),
    low: Math.min(lastBar.low, newClose),
    close: newClose,
    volume: (lastBar.volume ?? 0) + Math.random() * 2,
    turnover: (lastBar.turnover ?? 0) + newClose * Math.random() * 2,
  };
}
