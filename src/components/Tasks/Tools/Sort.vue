<template>
  <div class="row items-center q-gutter-sm">
    <q-select
      v-model="sortBy"
      :options="options"
      dense
      square
      outlined
      style="min-width:140px"
      emit-value
      map-options
    />

    <q-btn dense round color="secondary" :icon="orderIcon" @click="toggleOrder"/>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const emit = defineEmits(['update:sort'])

const options = [
  { label: 'Titre', value: 'title' },
  { label: 'Date', value: 'dueDate' }
]

const sortBy = ref('title')
const order = ref('asc')

watch([sortBy, order], () => {
  emit('update:sort', { by: sortBy.value, order: order.value })
}, { immediate: true })

function toggleOrder() {
  order.value = order.value === 'asc' ? 'desc' : 'asc'
}

const orderIcon = computed(() => order.value === 'asc' ? 'arrow_upward' : 'arrow_downward')
</script>

<style scoped>
.q-select { background: white }
</style>
