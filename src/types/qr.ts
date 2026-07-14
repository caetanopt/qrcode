import { CAETANO_LOGO_DATA_URI, CAETANO_LOGO_FILE_NAME } from "@/lib/qr/defaultLogo";

export type QRCodeType =
  | "url"
  | "text"
  | "email"
  | "phone"
  | "sms"
  | "whatsapp"
  | "wifi"
  | "vcard"
  | "location"
  | "event";

export const QR_CODE_TYPES: QRCodeType[] = [
  "url",
  "text",
  "email",
  "phone",
  "sms",
  "whatsapp",
  "wifi",
  "vcard",
  "location",
  "event",
];

export type WifiSecurity = "WPA" | "WPA2" | "WPA3" | "WEP" | "nopass";

export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export type ModuleStyle = "square" | "rounded" | "dots" | "extraRounded" | "classy";

export type CornerStyle = "square" | "rounded" | "dot";

export interface GradientDesign {
  enabled: boolean;
  type: "linear" | "radial";
  startColor: string;
  endColor: string;
  rotation: number;
}

export interface LogoDesign {
  source: string;
  size: number;
  margin: number;
  backgroundEnabled: boolean;
  fileName: string;
}

export interface QRCodeDesign {
  foregroundColor: string;
  backgroundColor: string;
  gradient: GradientDesign;
  moduleStyle: ModuleStyle;
  cornerStyle: CornerStyle;
  cornerDotStyle: CornerStyle;
  errorCorrectionLevel: ErrorCorrectionLevel;
  margin: number;
  logo: LogoDesign | null;
}

export const DEFAULT_DESIGN: QRCodeDesign = {
  foregroundColor: "#002E5D",
  backgroundColor: "#FFFFFF",
  gradient: {
    enabled: false,
    type: "linear",
    startColor: "#002E5D",
    endColor: "#00AEEF",
    rotation: 0,
  },
  moduleStyle: "rounded",
  cornerStyle: "rounded",
  cornerDotStyle: "dot",
  errorCorrectionLevel: "H",
  margin: 16,
  logo: {
    source: CAETANO_LOGO_DATA_URI,
    size: 0.3,
    margin: 4,
    backgroundEnabled: false,
    fileName: CAETANO_LOGO_FILE_NAME,
  },
};

export interface QRCodeProject<TPayload = Record<string, unknown>> {
  id?: string;
  name: string;
  type: QRCodeType;
  payload: TPayload;
  encodedValue: string;
  design: QRCodeDesign;
  createdAt?: string;
  updatedAt?: string;
}

export type ExportFormat = "png" | "svg" | "jpeg";

export interface ExportSize {
  label: string;
  value: number;
}

export const EXPORT_SIZES: ExportSize[] = [
  { label: "256 × 256 px", value: 256 },
  { label: "512 × 512 px", value: 512 },
  { label: "1024 × 1024 px", value: 1024 },
  { label: "2048 × 2048 px", value: 2048 },
];
