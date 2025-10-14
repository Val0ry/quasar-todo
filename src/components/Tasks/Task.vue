<template>
	<q-card flat bordered :class="['task-card', statusClass, { 'done': task.done }]" clickable v-ripple>
		<q-card-section class="q-pa-sm">
			<div class="row items-center no-wrap">
				<q-checkbox :model-value="task.done" @update:model-value="toggleTask" color="primary" class="q-mr-sm" />
				<div class="col ellipsis" @click="toggleTask">
					<span class="text-subtitle1">{{ task.title }}</span>
				</div>
				<div class="row items-center q-ml-md" v-if="task.dueDate">
					<q-icon name="event" color="grey-7" class="q-mr-xs" />
					<div class="text-grey-7">
						<div class="text-caption">{{ formattedDueDate }}</div>
						<div class="text-caption" v-if="task.dueTime">{{ task.dueTime.slice(0, 5) }}</div>
					</div>
				</div>
				<q-space />
			</div>
		</q-card-section>
	</q-card>
</template>

<script setup>
import { computed, defineProps } from 'vue'
import { useQuasar } from 'quasar'
import { useTaskStore } from 'stores/task_store'

const props = defineProps({ task: Object })

const $q = useQuasar()
const taskStore = useTaskStore()

function toggleTask() {
	taskStore.toggleDone({ ...props.task, done: !props.task.done })
}

const formattedDueDate = computed(() => {
	if (!props.task?.dueDate) return '';

	// La date arrive de la BDD au format ISO (ex: 2025-10-13T00:00:00.000Z)
	// ou YYYY-MM-DD. On ne garde que la partie avant le 'T'.
	const [year, month, day] = props.task.dueDate.split('T')[0].split('-');
	return `${day}/${month}/${year}`
})

// Classe d'état pour la couleur de fond
const statusClass = computed(() => {
	if (props.task.done || !props.task.dueDate) return ''

  const due = new Date(props.task.dueDate)
  const today = new Date()
  due.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)

  if (due < today) return 'task-overdue'
  if (due.getTime() === today.getTime()) return 'task-inprogress'
  return ''
})

</script>

<style>
.task-card {
	border-left-width: 5px;
	transition: box-shadow 0.2s ease-in-out;
}

.task-card:hover {
	box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.task-card.done .text-subtitle1 {
	text-decoration: line-through;
	color: #9e9e9e;
}

.task-inprogress {
	border-left-color: #ffc107; /* Ambre */
}

.task-overdue {
	border-left-color: #f44336; /* Rouge */
}

.task-card.done {
	border-left-color: #4caf50; /* Vert */
	opacity: 0.7;
}
</style>
