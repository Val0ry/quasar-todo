<template>
    <q-page padding>
        <ul>
            <Techno1Components
                v-for="(item, index) in items"
                :key="item.id"
                :item="item"
                :index="index"
                @itemClick="onItemClick"
            />
        </ul>

        <div
            v-if="selectedItem"
            class="selected-item q-mt-md q-pa-md bg-blue-1 rounded-borders"
        >
            <h5 class="q-my-sm">Élément sélectionné:</h5>
            <p>Nom: {{ selectedItem.name }}</p>
            <p>ID: {{ selectedItem.id }}</p>
            <p>Position: {{ selectedIndex }}</p>
        </div>
    </q-page>
</template>

<script setup>
// Importation de notre composant enfant
import Techno1Components from '../components/Techno1Components.vue'
import { ref } from 'vue'

const items = ref([
    { id: 189, name: 'Voiture' },
    { id: 298, name: 'Bateau' },
    { id: 39541, name: 'Avion' },
    { id: 42, name: 'Hélicoptère' }
])

const selectedItem = ref(null)
const selectedIndex = ref(null)

const onItemClick = (item, index) => {
    console.log('Item cliqué:', item, 'à la position', index)
    selectedItem.value = item
    selectedIndex.value = index
}
</script>