<template>
  <div class="image-url-preview-interface">
    <!-- URL input -->
    <v-input
      v-if="editable"
      :model-value="draft"
      placeholder="https://example.com/image.jpg"
      @update:model-value="onInput"
    >
      <template #prepend>
        <v-icon name="link" />
      </template>
      <template v-if="value" #append>
        <v-icon
          v-tooltip="'Clear'"
          name="close"
          clickable
          @click="onInput('')"
        />
      </template>
    </v-input>

    <!-- Preview area -->
    <div
      class="preview-container"
      :style="{ height, borderRadius: radius }"
    >
      <!-- Empty -->
      <div v-if="!debouncedValue" class="state state-empty">
        <v-icon name="image" large />
        <p>No image URL provided</p>
      </div>

      <!-- Invalid URL -->
      <div v-else-if="!isValidUrl" class="state state-error">
        <v-icon name="link_off" large />
        <p>Invalid URL</p>
        <small>{{ debouncedValue }}</small>
      </div>

      <!-- Loading -->
      <div v-else-if="loading" class="state state-loading">
        <v-progress-circular indeterminate />
      </div>

      <!-- Error -->
      <div v-else-if="error" class="state state-error">
        <v-icon name="broken_image" large />
        <p>Failed to load image</p>
        <small>{{ debouncedValue }}</small>
      </div>

      <!-- Image -->
      <img
        v-if="debouncedValue && isValidUrl"
        v-show="!loading && !error"
        :key="debouncedValue"
        :src="debouncedValue"
        :alt="debouncedValue"
        :style="{ objectFit: fit, borderRadius: radius }"
        :class="{ clickable: enable_lightbox }"
        referrerpolicy="no-referrer"
        @load="onLoad"
        @error="onError"
        @click="openLightbox"
      />
    </div>

    <!-- Lightbox -->
    <v-dialog v-if="enable_lightbox" v-model="lightboxOpen">
      <v-card class="lightbox-card">
        <v-card-title>
          <span class="lightbox-url">{{ debouncedValue }}</span>
          <v-icon name="close" clickable @click="lightboxOpen = false" />
        </v-card-title>
        <div class="lightbox-image-wrap">
          <img :src="debouncedValue || ''" referrerpolicy="no-referrer" />
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';

interface Props {
  value: string | null;
  editable?: boolean;
  height?: string;
  fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  radius?: string;
  enable_lightbox?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  value: null,
  editable: true,
  height: '300px',
  fit: 'contain',
  radius: '8px',
  enable_lightbox: true,
});

const emit = defineEmits<{ input: [value: string | null] }>();

const loading = ref(false);
const error = ref(false);
const lightboxOpen = ref(false);
const draft = ref<string>(props.value ?? '');
const debouncedValue = ref<string | null>(props.value);
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

const isValidUrl = computed(() => {
  if (!debouncedValue.value) return false;
  try {
    const u = new URL(debouncedValue.value);
    return u.protocol === 'http:' || u.protocol === 'https:' || u.protocol === 'data:';
  } catch {
    return false;
  }
});

watch(
  () => props.value,
  (val) => {
    draft.value = val ?? '';
    debouncedValue.value = val;
  }
);

watch(debouncedValue, (val) => {
  if (val && isValidUrl.value) {
    loading.value = true;
    error.value = false;
  } else {
    loading.value = false;
    error.value = false;
  }
}, { immediate: true });

function onInput(val: string) {
  draft.value = val;
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const next = val ? val : null;
    debouncedValue.value = next;
    emit('input', next);
  }, 400);
}

function onLoad() {
  loading.value = false;
  error.value = false;
}

function onError() {
  loading.value = false;
  error.value = true;
}

function openLightbox() {
  if (props.enable_lightbox && debouncedValue.value && isValidUrl.value && !error.value) {
    lightboxOpen.value = true;
  }
}
</script>

<style scoped>
.image-url-preview-interface {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.preview-container {
  position: relative;
  width: 100%;
  background: var(--theme--background-subdued);
  border: var(--theme--border-width) solid var(--theme--form--field--input--border-color);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-container img {
  width: 100%;
  height: 100%;
}

.preview-container img.clickable {
  cursor: zoom-in;
}

.state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--theme--foreground-subdued);
  text-align: center;
  padding: 16px;
}

.state-error small {
  word-break: break-all;
  max-width: 80%;
  opacity: 0.7;
  font-family: var(--theme--fonts--monospace--font-family, monospace);
  font-size: 12px;
}

.lightbox-card {
  padding: 0;
  max-width: 92vw;
  max-height: 92vh;
  display: flex;
  flex-direction: column;
}

.lightbox-card :deep(.v-card-title) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: var(--theme--border-width) solid var(--theme--border-color-subdued);
  gap: 12px;
}

.lightbox-url {
  font-size: 13px;
  color: var(--theme--foreground-subdued);
  word-break: break-all;
  font-family: var(--theme--fonts--monospace--font-family, monospace);
}

.lightbox-image-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: var(--theme--background-subdued);
  overflow: auto;
}

.lightbox-image-wrap img {
  max-width: 100%;
  max-height: 80vh;
  display: block;
}
</style>
