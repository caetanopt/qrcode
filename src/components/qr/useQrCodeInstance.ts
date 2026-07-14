"use client";

import { useEffect, useRef, useState } from "react";
import type QRCodeStyling from "qr-code-styling";
import type { Options } from "qr-code-styling";

interface UseQrCodeInstanceResult {
  containerRef: React.RefObject<HTMLDivElement | null>;
  instance: QRCodeStyling | null;
  ready: boolean;
}

export function useQrCodeInstance(options: Options | null): UseQrCodeInstanceResult {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<QRCodeStyling | null>(null);
  const [instance, setInstance] = useState<QRCodeStyling | null>(null);
  // Whether the async draw for the current `options` has completed. Combined
  // with `Boolean(options)` below rather than reset from inside the effect,
  // so a null `options` clears readiness immediately instead of through an
  // extra synchronous setState-in-effect render pass.
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    if (!options) return;
    let cancelled = false;

    import("qr-code-styling").then(({ default: QRCodeStyling }) => {
      if (cancelled) return;
      if (!instanceRef.current) {
        instanceRef.current = new QRCodeStyling(options);
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
          instanceRef.current.append(containerRef.current);
        }
        setInstance(instanceRef.current);
      } else {
        instanceRef.current.update(options);
      }
      setDrawn(true);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(options)]);

  return { containerRef, instance, ready: Boolean(options) && drawn };
}
