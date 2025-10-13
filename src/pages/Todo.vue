<template>
  <q-page class="bg-grey-3 column">
    <div class="q-pa-md">
      <q-input
        class="col"
        @keyup.enter="handleAddTask"
        square
        filled
        bg-color="white"
        v-model="newTask.title"
        placeholder="Ajouter une tâche"
        dense
      >
        <template v-slot:append>
          <q-btn @click="handleAddTask" round dense flat icon="add" />
        </template>
      </q-input>

      <div class="row q-gutter-sm q-mt-sm">
        <q-input class="col" square filled bg-color="white" dense v-model="formattedDate" mask="##/##/####" placeholder="Date">
        <template v-slot:append>
          <div class="row items-center full-height">
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="newTask.dueDate" mask="YYYY-MM-DD">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </div>
        </template>
      </q-input>

        <q-input class="col" square filled bg-color="white" dense v-model="newTask.dueTime" :rules="['time']" placeholder="Heure">
          <template v-slot:append>
            <div class="row items-center full-height">
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-time v-model="newTask.dueTime" format24h>
                    <div class="row items-center justify-end"> <q-btn v-close-popup label="Close" color="primary" flat /> </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </div>
          </template>
        </q-input>
      </div>
    </div>

    <div class="q-pa-md">
      <Task v-for="task in sortedTasks" :key="task.id" :task="task" />
    </div>
    <div v-if="!taskStore.tasks.length" class="no-tasks absolute-center">
      <q-icon name="check_circle" size="100px" color="primary" />
      <div class="text-h5 text-primary text-center">
        Aucune tâche
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-fab
        v-if="selectedTasksCount > 0"
        @click="confirmDeleteSelected"
        icon="delete"
        color="negative"
        direction="left"
        :label="`${selectedTasksCount} tâche(s)`"
      />
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { defineComponent, onMounted, ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useTaskStore } from 'stores/task_store.js'
import Task from 'src/components/Tasks/Task.vue'
import Sort from 'src/components/Tasks/Tools/Sort.vue'

// Déclaration du composant
defineComponent({ name: 'TodoPage' })

// Initialiser le task_store
const taskStore = useTaskStore()
const $q = useQuasar()

function getNow() {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  return { date: `${year}-${month}-${day}`, time: `${hour}:${minute}` }
}

const newTask = ref({
  title: '',
  dueDate: getNow().date,
  dueTime: getNow().time
})

const formattedDate = computed({
  get() {
    if (!newTask.value.dueDate) return '';
    const [year, month, day] = newTask.value.dueDate.split('-');
    return `${day}/${month}/${year}`;
  },
  set(value) {
    // Cette partie est gérée par q-date, donc on ne fait rien ici.
  }
});

function handleAddTask() {
  if (!newTask.value.title || !newTask.value.dueDate || !newTask.value.dueTime) {
    $q.notify({
      type: 'negative',
      message: 'Veuillez remplir le nom, la date et l\'heure de la tâche.'
    });
    return;
  }
  taskStore.addTask({ ...newTask.value })
  // On réinitialise le formulaire
  newTask.value.title = ''
  newTask.value.dueDate = getNow().date
  newTask.value.dueTime = getNow().time
}

const selectedTasksCount = computed(() => {
  return taskStore.tasks.filter(task => task.done).length
})

function confirmDeleteSelected() {
  $q.dialog({
    title: 'Confirmation',
    message: `Voulez-vous vraiment supprimer les ${selectedTasksCount.value} tâches sélectionnées ?`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    taskStore.deleteSelectedTasks()
    $q.notify('Tâches supprimées')
  })
}

// sorting state
const sort = ref({ by: 'title', order: 'asc' })

function onUpdateSort(payload) {
  sort.value = payload
}

const sortedTasks = computed(() => {
  const arr = [...taskStore.tasks]
  const { by, order } = sort.value
  const dir = order === 'asc' ? 1 : -1

  arr.sort((a, b) => {
    const valA = a[by] ?? ''
    const valB = b[by] ?? ''

    if (valA > valB) return dir
    if (valA < valB) return -dir
    return 0
  })
  return arr
})

onMounted(() => {
  taskStore.fetchTasks();
});
</script>
<style lang="scss">
.done {
  .q-item__label {
    text-decoration: line-through;
    color: #bbb;
  }
}

.no-tasks {
  opacity: 0.5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center
}
</style>
