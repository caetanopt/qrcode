"use client";

import { useEffect, useRef, useState } from "react";
import type QRCodeStyling from "qr-code-styling";
import type { Options } from "qr-code-styling";

interface UseQrCodeInstanceResult {
  containerRef: React.RefObject<HTMLDivElement>;
  instance: QRCodeStyling | null;
  ready: boolean;
}

export function useQrCodeInstance(options: Options | null): UseQrCodeInstanceResult {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<QRCodeStyling | null>(null);
  const [instance, setInstance] = useState<QRCodeStyling | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!options) {
      setReady(false);
      return;
    }

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
      setReady(true);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(options)]);

  return { containerRef, instance, ready };
}
