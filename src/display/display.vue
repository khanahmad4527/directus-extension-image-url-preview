<template>
  <div v-if="!value" class="empty">—</div>

  <div
    v-else-if="error"
    :class="['fallback', size, shape]"
    :title="value"
  >
    <v-icon name="broken_image" small />
  </div>

  <img
    v-else
    :key="value"
    :src="value"
    :alt="value"
    :class="['preview', size, shape]"
    referrerpolicy="no-referrer"
    loading="lazy"
    @error="error = true"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  value: string | null;
  size?: 'small' | 'medium' | 'large';
  shape?: 'rounded' | 'circle' | 'square';
}

const props = withDefaults(defineProps<Props>(), {
  value: null,
  size: 'medium',
  shape: 'rounded',
});

const error = ref(false);

watch(
  () => props.value,
  () => { error.value = false; }
);
</script>

<style scoped>
.empty {
  color: var(--theme--foreground-subdued);
}

.preview,
.fallback {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  object-fit: cover;
  background: var(--theme--background-subdued);
  border: var(--theme--border-width) solid var(--theme--border-color-subdued);
  vertical-align: middle;
  flex-shrink: 0;
}

.fallback {
  color: var(--theme--danger);
}

/* Sizes */
.small  { width: 24px; height: 24px; }
.medium { width: 40px; height: 40px; }
.large  { width: 64px; height: 64px; }

/* Shapes */
.rounded { border-radius: 6px; }
.circle  { border-radius: 50%; }
.square  { border-radius: 0; }
</style>
