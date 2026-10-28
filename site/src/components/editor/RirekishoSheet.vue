<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="rirekisho-overlay"
      role="dialog"
      aria-modal="true"
      :aria-label="$t('rirekisho.title')"
    >
      <div class="rirekisho-toolbar no-print">
        <UiButton size="sm" @click="print">
          <span i-mdi:printer text-base />
          {{ $t("rirekisho.print") }}
        </UiButton>
        <UiButton size="sm" variant="outline" @click="close">
          {{ $t("rirekisho.close") }}
        </UiButton>
      </div>

      <div class="rirekisho-pages">
        <!-- ===== Page 1: 履歴書 ===== -->
        <div class="rirekisho-sheet rk-page">
          <h2 class="rirekisho-sheet-title">{{ $t("rirekisho.sheet_title") }}</h2>

          <!-- Personal block -->
          <table class="rk-personal">
            <tbody>
              <tr>
                <th scope="row">{{ $t("rirekisho.furigana") }}</th>
                <td colspan="3">{{ sheet.personal.furigana }}</td>
              </tr>
              <tr>
                <th scope="row">{{ $t("rirekisho.name") }}</th>
                <td>{{ sheet.personal.name }}</td>
                <th scope="row">{{ $t("rirekisho.dob") }}</th>
                <td>{{ dobText }}</td>
              </tr>
              <tr>
                <th scope="row">{{ $t("rirekisho.address") }}</th>
                <td colspan="3">{{ sheet.personal.address }}</td>
              </tr>
              <tr>
                <th scope="row">{{ $t("rirekisho.phone") }}</th>
                <td>{{ sheet.personal.phone }}</td>
                <th scope="row">{{ $t("rirekisho.email") }}</th>
                <td>{{ sheet.personal.email }}</td>
              </tr>
              <tr>
                <th scope="row">{{ $t("rirekisho.photo") }}</th>
                <td class="rk-photo" colspan="3" rowspan="4" />
              </tr>
              <tr>
                <th class="rk-blank" />
              </tr>
              <tr>
                <th class="rk-blank" />
              </tr>
              <tr>
                <th class="rk-blank" />
              </tr>
            </tbody>
          </table>

          <!-- 学歴・職歴 -->
          <table class="rk-history">
            <colgroup>
              <col class="rk-col-year" />
              <col class="rk-col-month" />
            </colgroup>
            <thead>
              <tr>
                <th class="rk-ym" colspan="2">{{ $t("rirekisho.year_month") }}</th>
                <th>{{ $t("rirekisho.history") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in sheet.history" :key="i">
                <td class="rk-year">{{ row.date?.year }}</td>
                <td class="rk-month">{{ row.date?.month }}</td>
                <td :class="{ 'rk-above': row.kind === 'terminator' }">{{ row.text }}</td>
              </tr>
            </tbody>
          </table>

          <!-- 免許・資格 -->
          <table class="rk-licenses">
            <colgroup>
              <col class="rk-col-year" />
              <col class="rk-col-month" />
            </colgroup>
            <thead>
              <tr>
                <th class="rk-ym" colspan="2">{{ $t("rirekisho.year_month") }}</th>
                <th>{{ $t("rirekisho.licenses") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="sheet.licenses.length === 0">
                <td class="rk-year" />
                <td class="rk-month" />
                <td />
              </tr>
              <tr v-for="(row, i) in sheet.licenses" :key="i">
                <td class="rk-year">{{ row.date?.year }}</td>
                <td class="rk-month">{{ row.date?.month }}</td>
                <td>{{ row.text }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- ===== Page 2: 職務経歴書 ===== -->
        <div class="rirekisho-sheet rk-page sk-page">
          <h2 class="rirekisho-sheet-title">職務経歴書</h2>

          <table class="sk-head">
            <tbody>
              <tr>
                <th scope="row">氏名</th>
                <td>{{ sk.name }}</td>
              </tr>
            </tbody>
          </table>

          <p class="sk-note">
            ※
            提出から3ヶ月を経過した職務経歴書は、3ヶ月ごとに更新のうえ再提出してください。
          </p>

          <h3 class="sk-h">職務経歴（時系列）</h3>
          <table class="sk-jobs">
            <thead>
              <tr>
                <th class="sk-period">期間</th>
                <th class="sk-cat">区分</th>
                <th>職務内容</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(job, i) in sk.work" :key="i">
                <td class="sk-period">{{ job.period }}</td>
                <td class="sk-cat">会社員</td>
                <td class="sk-desc">
                  <div class="sk-job-title">{{ job.title }} — {{ job.org }}</div>
                  <ul v-if="job.bullets.length" class="sk-bullets">
                    <li v-for="(b, j) in job.bullets" :key="j">{{ b }}</li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>

          <h3 class="sk-h">テクニカルスキル</h3>
          <table class="sk-skills">
            <tbody>
              <tr v-for="(s, i) in sk.skills" :key="i">
                <th scope="row">{{ s.category }}</th>
                <td>{{ s.items }}</td>
              </tr>
            </tbody>
          </table>

          <h3 class="sk-h">自己PR</h3>
          <p class="sk-summary">{{ sk.summary }}</p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { buildRirekisho, buildShokumukeirekisho } from "~/utils/rirekisho";

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
}>();
void props;

const { data } = useDataStore();
const sheet = computed(() => buildRirekisho(data.markdown));
const sk = computed(() => buildShokumukeirekisho(data.markdown));

// Start loading the CJK font as soon as the sheet opens so both the
// on-screen preview and print have glyphs.
watch(
  () => props.open,
  (open) => {
    if (open) ensureSheetFont();
  },
  { immediate: true }
);
const dobText = computed(() => {
  const dob = sheet.value.personal.dob;
  if (!dob) return "";
  return `${dob.year}年${dob.month}月`;
});

const close = () => emit("update:open", false);

// Load a CJK webfont for the sheet — the app's font loader only serves the
// resume preview, so the sheet must load its own or CJK kanji render as
// tofu when the host system has no Japanese fonts.
let fontLoadPromise: Promise<void> | null = null;
const ensureSheetFont = async (): Promise<void> => {
  if (!fontLoadPromise) {
    fontLoadPromise = (async () => {
      // First check if system already has a CJK-capable font
      const cjkFamilies = [
        "Noto Sans JP",
        "Noto Sans CJK JP",
        "Source Han Sans JP",
        "Hiragino Kaku Gothic ProN",
        "Yu Gothic",
        "MS PGothic"
      ];
      for (const fam of cjkFamilies) {
        if (document.fonts.check(`10pt "${fam}"`)) return;
      }

      // Inject @font-face with local() fallback + Google Fonts webfont
      const style = document.createElement("style");
      style.textContent = `
        @font-face {
          font-family: "RirekishoNoto";
          src: local("Noto Sans JP"), local("Noto Sans CJK JP"),
               local("Source Han Sans JP"),
               url("https://fonts.gstatic.com/s/notosansjp/v46/-F60fjPtHn9ktqR8TZ8gbVWFwsB7G7QCvg.eot") format("eot"),
               url("https://fonts.gstatic.com/s/notosansjp/v46/-F60fjPtHn9ktqR8TZ8gbVWFwsB7G7QCvg.woff2") format("woff2"),
               url("https://fonts.gstatic.com/s/notosansjp/v46/-F60fjPtHn9ktqR8TZ8gbVWFwsB7G7QCvg.woff") format("woff");
          font-weight: 400 700;
          font-display: swap;
        }
      `;
      document.head.appendChild(style);

      // Also preload the woff2 for faster load
      const preload = document.createElement("link");
      preload.rel = "preload";
      preload.as = "font";
      preload.type = "font/woff2";
      preload.crossOrigin = "anonymous";
      preload.href =
        "https://fonts.gstatic.com/s/notosansjp/v46/-F60fjPtHn9ktqR8TZ8gbVWFwsB7G7QCvg.woff2";
      document.head.appendChild(preload);

      // Wait for the webfont to actually load and be ready
      await document.fonts.ready;
      await document.fonts.load('10pt "RirekishoNoto"');
      await new Promise((r) => setTimeout(r, 150));
    })();
  }
  return fontLoadPromise;
};

const print = async () => {
  await ensureSheetFont();
  const title = document.title;
  document.title = `${data.resumeName.trim().replace(/\s+/g, "_")}_rirekisho`;
  document.documentElement.classList.add("rirekisho-active");
  window.print();
  document.documentElement.classList.remove("rirekisho-active");
  document.title = title;
};
</script>

<style scoped>
.rirekisho-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgb(0 0 0 / 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  padding: 3rem 1rem;
}
.rirekisho-toolbar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.rirekisho-pages {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.rirekisho-sheet {
  width: 210mm;
  min-height: 297mm;
  background: white;
  color: black;
  padding: 12mm;
  font-family:
    "RirekishoNoto", "Noto Sans JP", "Hiragino Kaku Gothic ProN", "Yu Gothic",
    "MS PGothic", sans-serif;
  font-size: 10pt;
  line-height: 1.7;
}
.rirekisho-sheet-title {
  text-align: center;
  font-size: 16pt;
  font-weight: 700;
  letter-spacing: 0.5em;
  margin: 0 0 4mm;
  padding-bottom: 2mm;
  border-bottom: 1.5pt solid black;
}
.rk-personal,
.rk-history,
.rk-licenses,
.sk-head,
.sk-jobs,
.sk-skills {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  margin-bottom: 5mm;
}
.rk-personal th,
.rk-history th,
.rk-licenses th,
.sk-head th,
.sk-jobs th,
.sk-skills th {
  border: 0.75pt solid black;
  padding: 1.5mm 2mm;
  font-weight: 600;
  background: #f3f4f6;
  text-align: left;
}
.rk-personal td,
.rk-history td,
.rk-licenses td,
.sk-head td,
.sk-jobs td,
.sk-skills td {
  border: 0.75pt solid black;
  padding: 1.5mm 2mm;
  text-align: left;
  vertical-align: top;
  height: 7mm;
  overflow: hidden;
  word-wrap: break-word;
}
.rk-personal th {
  width: 22mm;
}
.rk-photo {
  height: 36mm;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 8px,
    #f9fafb 8px,
    #f9fafb 16px
  );
}
.rk-blank {
  border: none !important;
  background: transparent !important;
}
.rk-ym {
  width: 28mm;
  text-align: center;
}
/* Column widths: year 18mm, month 10mm (colgroup drives table-layout) */
.rk-col-year {
  width: 18mm;
}
.rk-col-month {
  width: 10mm;
}
.rk-year {
  width: 18mm;
  text-align: center;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.rk-month {
  width: 10mm;
  text-align: center;
  white-space: nowrap;
}
.rk-above {
  text-align: right;
  padding-right: 6mm;
}

/* ===== 職務経歴書 (page 2) ===== */
.sk-head th {
  width: 22mm;
}
.sk-note {
  font-size: 8pt;
  margin: 0 0 4mm;
  color: #374151;
}
.sk-h {
  font-size: 12pt;
  font-weight: 700;
  margin: 4mm 0 2mm;
}
.sk-period {
  width: 38mm;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.sk-cat {
  width: 16mm;
  text-align: center;
}
.sk-desc {
  height: auto;
}
.sk-job-title {
  font-weight: 700;
}
.sk-bullets {
  margin: 1mm 0 0;
  padding-left: 5mm;
}
.sk-bullets li {
  margin: 0;
}
.sk-skills th {
  width: 40mm;
}
.sk-summary {
  border: 0.75pt solid black;
  padding: 3mm;
  min-height: 30mm;
  margin: 0;
  white-space: pre-line;
}
</style>

<style>
/* Print mode: when rirekisho-active, only the sheet prints. */
@media print {
  html.rirekisho-active body > *:not(.rirekisho-overlay) {
    display: none !important;
  }
  html.rirekisho-active .rirekisho-overlay {
    position: static;
    background: none;
    padding: 0;
    overflow: visible;
  }
  html.rirekisho-active .rirekisho-toolbar {
    display: none !important;
  }
  html.rirekisho-active .rirekisho-pages {
    display: block;
  }
  html.rirekisho-active .rirekisho-sheet {
    width: 100%;
    min-height: auto;
    box-shadow: none;
    padding: 0;
  }
  /* Page 2 (職務経歴書) always starts on a fresh sheet of paper. */
  html.rirekisho-active .sk-page {
    page-break-before: always;
    break-before: page;
  }
  /* Page-break hygiene: compact tables stay intact; long tables (jobs,
     skills) break BETWEEN rows only — real 職務経歴書 spans multiple pages. */
  html.rirekisho-active .rk-personal,
  html.rirekisho-active .rk-history,
  html.rirekisho-active .rk-licenses,
  html.rirekisho-active .sk-head {
    break-inside: avoid;
  }
  /* Headings never orphan at a page bottom — move with their table. */
  html.rirekisho-active .sk-h {
    break-after: avoid;
  }
  html.rirekisho-active .rk-history tr,
  html.rirekisho-active .rk-licenses tr,
  html.rirekisho-active .sk-jobs tr,
  html.rirekisho-active .sk-skills tr {
    break-inside: avoid;
  }
  html.rirekisho-active .rk-history thead,
  html.rirekisho-active .rk-licenses thead,
  html.rirekisho-active .sk-jobs thead {
    display: table-row-group;
  }
  html.rirekisho-active .rk-history tbody tr,
  html.rirekisho-active .rk-licenses tbody tr,
  html.rirekisho-active .sk-jobs tbody tr {
    break-after: auto;
  }
}
</style>
