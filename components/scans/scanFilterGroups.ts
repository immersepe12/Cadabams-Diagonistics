import {
  type LucideIcon,
  Activity,
  Baby,
  Crosshair,
  Heart,
  Layers,
  Ribbon,
  Scan,
  Stethoscope,
} from "lucide-react";

export interface ScanFilterGroup {
  key: string;
  label: string;
  Icon: LucideIcon;
  /** Matches against the UPPER-cased test name. `null` = matches everything. */
  match: RegExp | null;
}

/**
 * Local, keyword-derived filter groups for the ultrasound listing. Membership
 * is computed from the test name — a scan can belong to more than one group.
 *
 * Lives in a plain (non-"use client") module so server routes can read the
 * group keys/labels for routing while the client filter renders the icons.
 */
export const SCAN_FILTER_GROUPS: ScanFilterGroup[] = [
  { key: "all", label: "All scans", Icon: Layers, match: null },
  {
    key: "pregnancy",
    label: "Pregnancy & Obstetric",
    Icon: Baby,
    match: /PREGNAN|OBSTETRIC|FETAL|TIFFA|ANOMALY|NT SCAN|DATING|FOLLICULAR|BPP|GROWTH/,
  },
  { key: "doppler", label: "Doppler", Icon: Activity, match: /DOPPLER/ },
  { key: "breast", label: "Breast", Icon: Ribbon, match: /BREAST/ },
  {
    key: "abdomen",
    label: "Abdomen & Pelvis",
    Icon: Scan,
    match: /ABDOMEN|PELVIS/,
  },
  {
    key: "thyroid",
    label: "Thyroid & Neck",
    Icon: Stethoscope,
    match: /THYROID|NECK/,
  },
  {
    key: "cardiac",
    label: "Cardiac",
    Icon: Heart,
    match: /ECHOCARDIOGRAM|TREADMILL|CARDIAC|\bHEART\b/,
  },
  {
    key: "guided",
    label: "Guided Procedures",
    Icon: Crosshair,
    match: /GUIDED|BIOPSY|FNAC/,
  },
];

/** Group keys usable as a URL path segment (excludes the catch-all "all"). */
export function isScanFilterKey(key: string): boolean {
  return SCAN_FILTER_GROUPS.some((g) => g.key !== "all" && g.key === key);
}

export function getAllScanFilterKeys(): string[] {
  return SCAN_FILTER_GROUPS.filter((g) => g.key !== "all").map((g) => g.key);
}

export function getScanFilterLabel(key: string): string | undefined {
  return SCAN_FILTER_GROUPS.find((g) => g.key === key)?.label;
}
