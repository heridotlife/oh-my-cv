<template>
  <TabsRoot
    class="pane-container overflow-hidden bg-background"
    flex="~ col"
    default-value="markdown"
    @update:model-value="(payload) => activateModel(payload)"
  >
    <TabsList
      class="relative shrink-0 hstack w-full text-sm h-9 border-b px-4"
      md="text-base h-10"
    >
      <TabsIndicator
        class="absolute left-0 bottom-0 h-0.5 bg-primary rounded-full w-[--radix-tabs-indicator-size] translate-x-[--radix-tabs-indicator-position] transition-[width,transform] duration-300"
      />

      <TabsTrigger value="markdown" p="x-2" :disabled="loading">Markdown</TabsTrigger>
      <TabsTrigger value="css" p="x-4" :disabled="loading">CSS</TabsTrigger>
    </TabsList>

    <!-- Wrapper for TabsContent and editor -->
    <div class="relative flex-1 overflow-hidden">
      <!-- TabsContent for Markdown - provides proper ARIA structure -->
      <TabsContent value="markdown" class="h-full">
        <!-- Content managed by Monaco editor below -->
      </TabsContent>

      <!-- TabsContent for CSS - provides proper ARIA structure -->
      <TabsContent value="css" class="h-full">
        <!-- Content managed by Monaco editor below -->
      </TabsContent>

      <!-- Monaco editor container - positioned absolutely to overlay both panels -->
      <div ref="editor" class="absolute inset-0 z-10" />
    </div>
  </TabsRoot>
</template>

<script lang="ts" setup>
const editor = ref<HTMLDivElement>();
const { setup, activateModel, dispose, loading } = useMonaco();

onMounted(async () => {
  await setup(editor.value);
  activateModel("markdown");
});

onBeforeUnmount(dispose);
</script>
