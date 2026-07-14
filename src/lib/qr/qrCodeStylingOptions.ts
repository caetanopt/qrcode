import type { CornerDotType, CornerSquareType, DotType, Options } from "qr-code-styling";
import type { CornerStyle, ModuleStyle, QRCodeDesign } from "@/types/qr";

const moduleStyleMap: Record<ModuleStyle, DotType> = {
  square: "square",
  rounded: "rounded",
  dots: "dots",
  extraRounded: "extra-rounded",
  classy: "classy",
};

const cornerSquareStyleMap: Record<CornerStyle, CornerSquareType> = {
  square: "square",
  rounded: "extra-rounded",
  dot: "dot",
};

const cornerDotStyleMap: Record<CornerStyle, CornerDotType> = {
  square: "square",
  rounded: "dot",
  dot: "dot",
};

export function buildQrCodeStylingOptions(data: string, design: QRCodeDesign, size: number): Options {
  const dotsOptions: Options["dotsOptions"] = design.gradient.enabled
    ? {
        type: moduleStyleMap[design.moduleStyle],
        gradient: {
          type: design.gradient.type,
          rotation: (design.gradient.rotation * Math.PI) / 180,
          colorStops: [
            { offset: 0, color: design.gradient.startColor },
            { offset: 1, color: design.gradient.endColor },
          ],
        },
      }
    : {
        type: moduleStyleMap[design.moduleStyle],
        color: design.foregroundColor,
      };

  return {
    width: size,
    height: size,
    data,
    margin: design.margin,
    qrOptions: {
      errorCorrectionLevel: design.errorCorrectionLevel,
    },
    dotsOptions,
    backgroundOptions: {
      color: design.backgroundColor,
    },
    cornersSquareOptions: {
      type: cornerSquareStyleMap[design.cornerStyle],
      color: design.foregroundColor,
    },
    cornersDotOptions: {
      type: cornerDotStyleMap[design.cornerDotStyle],
      color: design.foregroundColor,
    },
    image: design.logo?.source,
    imageOptions: {
      imageSize: design.logo?.size ?? 0.4,
      margin: design.logo?.margin ?? 0,
      hideBackgroundDots: design.logo ? !design.logo.backgroundEnabled : true,
    },
  };
}
