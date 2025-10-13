<template>
    <li @click="handleClick" class="item-clickable">
        <div>{{ item.name }} [{{ item.id }}] ({{ index }})</div>
    </li>
</template>

<script setup>
const props = defineProps({
    item: {
        type: Object,
        required: true
    },
    index: {
        type: Number,
        required: true
    }
})

const emit = defineEmits(['itemClick'])
const handleClick = () => {
    emit('itemClick', props.item, props.index)
}
</script>
<style lang="scss" scoped>
.item-clickable {
    cursor: pointer;
    padding: 8px;
    transition: background-color 0.2s;
}
.item-clickable:hover {
    background-color: #f0f0f0;
}
</style>