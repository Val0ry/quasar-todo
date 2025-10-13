<template>
  <q-page class="q-pa-md bg-grey-3 column">

    <div class="q-pa-sm bg-primary">
      <q-input
        @keyup.enter="handleAddTask"
        v-model="newTask.title"
        label="Nom de la tâche"
        filled
        bg-color="white"
        dense
      >
        <template v-slot:append>
          <q-btn @click="handleAddTask" round dense flat icon="add" />
        </template>
      </q-input>

      <div class="row q-gutter-sm q-mt-sm">
        <q-input
          v-model="newTask.dueDate"
          label="Date d'échéance"
          placeholder="Date"
          filled
          bg-color="white"
          dense
          class="col"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="newTask.dueDate" mask="YYYY-MM-DD">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-input
          v-model="newTask.dueTime"
          label="Heure d'échéance"
          placeholder="Heure"
          filled
          bg-color="white"
          dense
          class="col"
        >
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="newTask.dueTime" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div>

    <div class="q-mt-md" v-if="taskStore.tasks.length">
      <Task
        v-for="task in taskStore.tasks"
        :key="task.id"
        :task="task"
      />
    </div>

    <div v-else class="no-tasks absolute-center">
      <q-icon name="check_circle" size="100px" color="primary" />
      <div class="text-h5 text-primary text-center">Aucune tâche</div>
    </div>

  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useTaskStore } from 'stores/task-store'
import Task from 'components/Tasks/Task.vue'

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

function handleAddTask() {
  if (!newTask.value.title || !newTask.value.dueDate || !newTask.value.dueTime) {
    $q.notify({
      type: 'negative',
      message: 'Veuillez remplir le nom, la date et l\'heure de la tâche.'
    });
    return;
  }
  taskStore.addTask({ ...newTask.value });
  // On réinitialise le formulaire
  newTask.value.title = ''
  newTask.value.dueDate = getNow().date
  newTask.value.dueTime = getNow().time
}

// Récupérer les tâches au chargement de la page
onMounted(() => {
  taskStore.fetchTasks()
})
</script>

<style lang="scss">
.no-tasks {
  opacity: 0.5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
