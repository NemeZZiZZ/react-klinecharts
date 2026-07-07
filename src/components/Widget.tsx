import { useState, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { DomPosition } from "klinecharts";
import { useKLineChart } from "../hooks/useKLineChart";

export interface WidgetProps {
  paneId?: string;
  position?: DomPosition;
  children?: ReactNode;
}

/**
 * A declarative component that injects React elements into specific chart DOM
 * layers using portals. Uses `chart.getDom(paneId, position)` under the hood.
 *
 * If the target DOM node does not exist yet (e.g. an indicator pane that has
 * not been laid out), the component retries on the next animation frame until
 * it resolves the node, then renders its children into it via a portal.
 */
export function Widget({ paneId, position = "main", children }: WidgetProps) {
  const chart = useKLineChart();
  const [targetDom, setTargetDom] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!chart) {
      setTargetDom(null);
      return;
    }

    let rafId: number | null = null;
    let cancelled = false;

    const resolve = () => {
      if (cancelled) return;
      const dom = chart.getDom(paneId, position);
      if (dom) {
        setTargetDom(dom);
      } else {
        // The pane may not be laid out yet (e.g. an indicator pane that is
        // created after this effect runs). Retry on the next frame.
        rafId = requestAnimationFrame(resolve);
      }
    };

    resolve();

    return () => {
      cancelled = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [chart, paneId, position]);

  if (!targetDom || !children) {
    return null;
  }

  return createPortal(children, targetDom);
}
