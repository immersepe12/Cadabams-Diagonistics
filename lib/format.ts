/**
 * Display formatters for CMS strings (§4 of the design plan).
 *
 * Test/scan names arrive from the CMS in inconsistent casing — often SHOUTING
 * ALL-CAPS ("COMPLETE BLOOD COUNT with ESR", "RENAL FUNCTION TEST"). Normalise
 * for display in the component layer (never mutate the CMS), keeping medical
 * acronyms (CBC, TSH, MRI…) and unit/marker tokens correct.
 */

/** Tokens that must keep an exact canonical casing (acronyms, markers, units). */
const ACRONYMS: Record<string, string> = {
  cbc: "CBC",
  esr: "ESR",
  tsh: "TSH",
  lft: "LFT",
  rft: "RFT",
  kft: "KFT",
  cmp: "CMP",
  crp: "CRP",
  psa: "PSA",
  ana: "ANA",
  hba1c: "HbA1c",
  mri: "MRI",
  ct: "CT",
  pet: "PET",
  ecg: "ECG",
  ekg: "EKG",
  eeg: "EEG",
  tmt: "TMT",
  bun: "BUN",
  ck: "CK",
  ckmb: "CK-MB",
  ldh: "LDH",
  hiv: "HIV",
  hcg: "HCG",
  igg: "IgG",
  igm: "IgM",
  ige: "IgE",
  iga: "IgA",
  vitd: "Vit-D",
  d3: "D3",
  b12: "B12",
  t3: "T3",
  t4: "T4",
  ft3: "FT3",
  ft4: "FT4",
  hdl: "HDL",
  ldl: "LDL",
  vldl: "VLDL",
  pcr: "PCR",
  rtpcr: "RT-PCR",
  usg: "USG",
  dexa: "DEXA",
  "2d": "2D",
  "3d": "3D",
  "4d": "4D",
  nt: "NT",
  pap: "Pap",
  hba: "HbA",
  abg: "ABG",
  pft: "PFT",
};

/** Connector words kept lowercase unless they start the string. */
const MINOR_WORDS = new Set([
  "with",
  "and",
  "of",
  "for",
  "in",
  "on",
  "to",
  "the",
  "a",
  "an",
  "or",
  "by",
]);

function formatWord(word: string, isFirst: boolean): string {
  if (!word) return word;
  const lower = word.toLowerCase();

  // Exact acronym/marker match (strip surrounding punctuation for the lookup).
  const core = lower.replace(/[^a-z0-9]/g, "");
  if (ACRONYMS[core]) {
    return word.replace(new RegExp(core, "i"), ACRONYMS[core]);
  }

  if (!isFirst && MINOR_WORDS.has(lower)) return lower;

  // X-ray, ct-scan style hyphenated compounds → title-case each part.
  if (lower.includes("-")) {
    return lower
      .split("-")
      .map((part) => formatWord(part, true))
      .join("-");
  }

  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

/**
 * Title-case a test/scan name for display, preserving medical acronyms.
 * "COMPLETE BLOOD COUNT with ESR" -> "Complete Blood Count with ESR"
 */
export function titleCaseTestName(name: string): string {
  if (!name) return name;
  // Leave names that already look mixed-case alone (avoid mangling good copy);
  // only normalise strings that are mostly UPPER or all-lower.
  const letters = name.replace(/[^a-zA-Z]/g, "");
  const upper = name.replace(/[^A-Z]/g, "").length;
  const isMostlyUpper = letters.length > 0 && upper / letters.length > 0.7;
  const isAllLower = letters.length > 0 && upper === 0;
  if (!isMostlyUpper && !isAllLower) return name;

  return name
    .trim()
    .split(/\s+/)
    .map((w, i) => formatWord(w, i === 0))
    .join(" ");
}
