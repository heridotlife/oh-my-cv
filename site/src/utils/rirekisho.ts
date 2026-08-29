/**
 * Rirekisho (履歴書) builder — converts an Oh My CV markdown resume into
 * JIS-style rirekisho sections.
 *
 * Data sources in the markdown:
 * - Front matter name / header items (phone, email)
 * - `## Experience` → `**Title**` + deflist (`~ org`, `~ dates`) → 職歴
 * - `### Education` → school + dates → 学歴
 * - `### Licenses & certifications` → 免許・資格
 *
 * Anything missing stays blank (hand-fill), like a real blank JIS sheet.
 */

export type RirekishoDate = {
  readonly year: string;
  readonly month: string;
};

export type RirekishoRow = {
  readonly date: RirekishoDate | null;
  readonly text: string;
  readonly kind: "education" | "work" | "terminator";
};

export type RirekishoPersonal = {
  readonly name: string;
  readonly furigana: string;
  readonly dob: RirekishoDate | null;
  readonly address: string;
  readonly phone: string;
  readonly email: string;
};

export type RirekishoData = {
  readonly personal: RirekishoPersonal;
  /** Chronological: education first, then work, then 以上. */
  readonly history: Array<RirekishoRow>;
  readonly licenses: Array<RirekishoRow>;
};

const MM_YYYY = /(\d{1,2})\s*\/\s*(\d{4})/;

function parseDate(raw: string): RirekishoDate | null {
  if (!raw) return null;
  const m = raw.match(MM_YYYY);
  if (m) return { month: String(Number(m[1])), year: m[2] };
  const m2 = raw.match(
    /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4})/i
  );
  if (m2) {
    const idx = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec"
    ].indexOf(m2[1].toLowerCase());
    if (idx >= 0) return { month: String(idx + 1), year: m2[2] };
  }
  const m3 = raw.match(/(\d{4})/);
  if (m3) return { month: "", year: m3[1] };
  return null;
}

function extractDateRange(raw: string): {
  start: RirekishoDate | null;
  end: RirekishoDate | null;
} {
  const parts = raw
    .split(/[-–—~→]|to/i)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length >= 2) {
    return { start: parseDate(parts[0]), end: parseDate(parts[parts.length - 1]) };
  }
  return { start: parseDate(raw), end: null };
}

/** Strip markdown emphasis/links from a label. */
function cleanLabel(raw: string): string {
  return raw
    .replace(/\*\*/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .trim();
}

type DeflistEntry = { label: string; values: string[] };

/**
 * Parse one `**Heading**` + deflist block into the heading and its
 * `~ value` items.
 */
function parseDeflistBlock(block: string): DeflistEntry | null {
  const lines = block
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  let label = "";
  const values: string[] = [];
  for (const line of lines) {
    const heading = line.match(/^\*\*(.+?)\*\*$/);
    if (heading) {
      if (label && values.length) break; // next block started
      label = cleanLabel(heading[1]);
      continue;
    }
    const item = line.match(/^~\s+(.*)$/);
    if (item && label) values.push(cleanLabel(item[1]));
  }
  return label ? { label, values } : null;
}

function splitIntoBlocks(md: string): Array<string> {
  // Split on blank lines, keeping **Heading** blocks with their deflists
  return md.split(/\n\s*\n/);
}

function findSection(md: string, heading: string): string | null {
  const re = new RegExp(`^#{2,3}\\s+${heading}\\b[^\\n]*\\n?`, "mi");
  const match = re.exec(md);
  if (!match) return null;
  const rest = md.slice(match.index + match[0].length);
  const next = /^#{2,3}\s+/m.exec(rest);
  return next ? rest.slice(0, next.index) : rest;
}

function isDateLine(value: string): boolean {
  return (
    MM_YYYY.test(value) ||
    /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}/i.test(value) ||
    /^\d{4}$/.test(value.trim())
  );
}

function isLocationLine(value: string): boolean {
  if (/(Remote|Indonesia|Yogyakarta|Tangerang|Japan)/i.test(value)) return true;
  // "Cambridge, MA" / "Shanghai, China" / "City, State|Country" shapes
  return /^[A-Z][A-Za-z .'-]+,\s*[A-Z][A-Za-z]*(?:\s+[A-Za-z]+)?$/.test(value);
}

export function buildRirekisho(markdown: string): RirekishoData {
  // --- Personal from front matter ---
  const fmMatch = /^---\n([\s\S]*?)\n---/.exec(markdown);
  const fm = fmMatch ? fmMatch[1] : "";
  const nameMatch = /^name:\s*(.+)$/m.exec(fm);
  const name = nameMatch ? nameMatch[1].trim() : "";
  let phone = "";
  let email = "";
  if (fm) {
    const phoneMatch = /\((\+?\d[\d ]*)\)[ \t]+([0-9][0-9 -]*)/.exec(fm);
    if (phoneMatch) phone = `${phoneMatch[1].trim()} ${phoneMatch[2].trim()}`;
    const emailMatch = /[\w.+-]+@[\w.-]+\.\w+/.exec(fm);
    if (emailMatch) email = emailMatch[0];
  }

  // --- History ---
  const history: Array<RirekishoRow> = [];

  const eduSection = findSection(markdown, "Education");
  if (eduSection) {
    // Education blocks may separate the school heading from its deflist:
    //   **School**\n  ~ Country\n\n Degree text\n  ~ 08/2011 - 04/2019
    // Walk lines: school = **heading** or plain line, date = first date-ish
    // value in the following deflist/plain lines.
    const lines = eduSection
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    let school = "";
    let degree = "";
    for (const line of lines) {
      const heading = line.match(/^\*\*(.+?)\*\*$/);
      if (heading) {
        school = cleanLabel(heading[1]);
        degree = "";
        continue;
      }
      const item = line.match(/^~\s+(.*)$/);
      const value = cleanLabel(item ? item[1] : line);
      if (isDateLine(value) && school) {
        const range = extractDateRange(value);
        if (range.start)
          history.push({ date: range.start, text: `${school} 入学`, kind: "education" });
        // Degree/faculty line sits between 入学 and 卒業, undated but must
        // not float to the end of the sorted list — pin it to the end date.
        if (degree && range.end)
          history.push({ date: range.end, text: degree, kind: "education" });
        if (range.end)
          history.push({ date: range.end, text: `${school} 卒業`, kind: "education" });
      } else if (school && !isLocationLine(value) && !degree) {
        degree = value;
      }
    }
  }

  const expSection = findSection(markdown, "Experience");
  if (expSection) {
    for (const block of splitIntoBlocks(expSection)) {
      const entry = parseDeflistBlock(block);
      if (!entry) continue;
      const dateVal = entry.values.find((v) => isDateLine(v));
      const org = entry.values.find((v) => !isDateLine(v) && !isLocationLine(v));
      const dateRange = dateVal ? extractDateRange(dateVal) : null;
      if (dateRange?.start && org) {
        history.push({
          date: dateRange.start,
          text: `${entry.label} として ${org} 入社`,
          kind: "work"
        });
      }
      if (dateRange?.end && org) {
        history.push({ date: dateRange.end, text: `${org} 退社`, kind: "work" });
      }
      if (!dateRange?.start && org) {
        // Present job: start date only
        const present = entry.values.find((v) => /present|now|current/i.test(v));
        if (present) {
          const startDate = extractDateRange(dateVal ?? "").start;
          if (startDate)
            history.push({
              date: startDate,
              text: `${entry.label} として ${org} 入社`,
              kind: "work"
            });
        }
      }
    }
  }

  // Chronological order (education entries pushed first per block; sort all
  // by year/month ascending, dateless rows keep relative order after their
  // dated sibling)
  history.sort((a, b) => {
    const ka = a.date?.year
      ? Number(a.date.year) * 100 + Number(a.date.month || 0)
      : Number.MAX_SAFE_INTEGER;
    const kb = b.date?.year
      ? Number(b.date.year) * 100 + Number(b.date.month || 0)
      : Number.MAX_SAFE_INTEGER;
    return ka - kb;
  });

  history.push({ date: null, text: "以上", kind: "terminator" });

  // --- Licenses ---
  const licenses: Array<RirekishoRow> = [];
  const licSection = findSection(markdown, "Licenses");
  if (licSection) {
    // Walk lines: license name (**heading** or plain), then first date-ish
    // line after it belongs to that license.
    const lines = licSection
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    let current: { name: string; date: RirekishoDate | null } | null = null;
    for (const line of lines) {
      // Skip metadata lines that belong to the previous license
      if (/^(credential|nomor|no\.?|id)\b/i.test(line)) continue;
      const heading = line.match(/^\*\*(.+?)\*\*$/);
      const plain = line.match(/^(?!~)(.+)$/);
      let name = "";
      if (heading) name = cleanLabel(heading[1]);
      else if (plain && !isDateLine(line) && !line.startsWith("#"))
        name = cleanLabel(line);
      if (name) {
        if (current)
          licenses.push({ date: current.date, text: current.name, kind: "work" });
        current = { name, date: null };
        continue;
      }
      const item = line.match(/^~\s+(.*)$/);
      if (item && current && !current.date) {
        const d = parseDate(item[1]);
        if (d) current.date = d;
      }
    }
    if (current) licenses.push({ date: current.date, text: current.name, kind: "work" });
  }

  const personal: RirekishoPersonal = {
    name,
    furigana: "",
    dob: null,
    address: "",
    phone,
    email
  };

  return { personal, history, licenses };
}
