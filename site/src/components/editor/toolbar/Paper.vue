<template>
  <EditorToolbarBox :text="$t('toolbar.paper_size')" icon="i-majesticons:paper-fold-line">
    <ClientOnly>
      <SharedUiCombobox
        id="paper-size"
        class="capitalize"
        :items="items"
        :default-value="styles.paper"
      />
    </ClientOnly>
  </EditorToolbarBox>
</template>

<script lang="ts" setup>
import type { ValidPaperSize } from "~/composables/constant";

const { styles, setStyle } = useStyleStore();
const { PAPER } = useConstant();

const items = Object.keys(PAPER.SIZES).map((paper) => ({
  label: paper,
  value: paper,
  onSelect: () => setStyle("paper", paper as ValidPaperSize)
}));
</script>
