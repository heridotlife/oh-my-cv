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
      <div class="rirekisho-sheet">
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
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { buildRirekisho } from "~/utils/rirekisho";

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
}>();
void props;

const { data } = useDataStore();
const sheet = computed(() => buildRirekisho(data.markdown));
const dobText = computed(() => {
  const dob = sheet.value.personal.dob;
  if (!dob) return "";
  return `${dob.year}年${dob.month}月`;
});

const close = () => emit("update:open", false);

const print = () => {
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
.rirekisho-sheet {
  width: 210mm;
  min-height: 297mm;
  background: white;
  color: black;
  padding: 12mm;
  font-family:
    "Noto Sans JP", "Hiragino Kaku Gothic ProN", "Yu Gothic", "MS PGothic", sans-serif;
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
.rk-licenses {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  margin-bottom: 5mm;
}
.rk-personal th,
.rk-history th,
.rk-licenses th {
  border: 0.75pt solid black;
  padding: 1.5mm 2mm;
  font-weight: 600;
  background: #f3f4f6;
  text-align: left;
}
.rk-personal td,
.rk-history td,
.rk-licenses td {
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
  width: 24mm;
  text-align: center;
}
.rk-year,
.rk-month {
  width: 12mm;
  text-align: center;
}
.rk-above {
  text-align: right;
  padding-right: 6mm;
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
  html.rirekisho-active .rirekisho-sheet {
    width: 100%;
    min-height: auto;
    box-shadow: none;
  }
}
</style>
