<template>
  <q-page class="bg-grey-3 column">
    <div class="row q-pa-sn bg-primary">
      <q-input class="col" square filled bg-color="white" v-model="newTask" placeholder="Add a new task" dense @keyup.enter="addTask()" />
    </div>
    <q-list class="bg-white" separator bordered>
      <q-item
        v-for="(task, index) in tasks"
        :key="task.title"
        @click="task.done = !task.done"
        :class="{ ' done bg-blue-1': task.done }"
        clickable
        v-ripple
      >
        <q-item-section avatar>
          <q-checkbox v-model="task.done" class="no-pointer-events" color="primary" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ task.title }}</q-item-label>
        </q-item-section>
        <q-item-section v-if="task.done" side>
          <q-btn @click.stop="deleteTask(index)" rounded dense color="primary" icon="delete" />
        </q-item-section>
      </q-item>
    </q-list>
    <div v-if="tasks.length === 0">
      <div class="no-tasks absolute-center">
        <q-icon name="check" size="100px" color="primary" />
        <div class="text-h5 text-primary text-center">No tasks</div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, defineComponent } from 'vue'
import { useQuasar } from 'quasar'

defineComponent({ name: 'TodoPage' })

const newTask = ref('')

const tasks = ref([])

const $q = useQuasar()

function deleteTask(index) {
  $q.dialog({
    title: 'Confirm',
    message: 'Really delete?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    tasks.value.splice(index, 1)
    $q.notify('Task deleted')
  })
}

function addTask() {
  tasks.value.push({
    title: newTask.value,
    done: false,
  })
  newTask.value = ''
}
</script>

<style lang="scss">
.done {
  .q-item__label {
    text-decoration: line-through;
    color: grey;
  }
}
.no-tasks {
  opacity: 0.5;
}
</style>
