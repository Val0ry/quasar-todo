<template>
	<q-item @click="toggleTask" :class="[statusClass, { done: task.done }]" clickable v-ripple>
		<q-item-section avatar>
			<q-checkbox v-model="task.done" class="no-pointer-events" color="primary" />
		</q-item-section>
		<q-item-section>
			<q-item-label>{{ task.title }}</q-item-label>
		</q-item-section>
		<q-item-section v-if="task.done" side>
			<q-btn flat round dense color="primary" icon="delete" @click.stop="deleteTask(task)" />
		</q-item-section>
		<q-item-section side top style="display:flex; flex-direction:row; align-items:center; gap:8px;">
					<q-icon name="event" color="primary" style="width:20px; height:20px;" />
					<div style="display:flex; flex-direction:column;">
						<q-item-label caption class="task-date">{{ formattedDueDate }}</q-item-label>
						<q-item-label caption class="text-caption" style="opacity:0.85">{{ task.dueTime ? task.dueTime.slice(0, 5) : '' }}</q-item-label>
					</div>
				</q-item-section>
	</q-item>
</template>

<script setup>
import { computed } from 'vue'
import { useQuasar } from 'quasar'
import { useTaskStore } from 'stores/task_store'

const props = defineProps({ task: Object, index: Number })

const $q = useQuasar()
const taskStore = useTaskStore()

function toggleTask() {
	props.task.done = !props.task.done
	taskStore.toggleDone(props.task)
}

function deleteTask(task) {
	$q.dialog({
		title: 'Confirmation',
		message: 'Voulez-vous vraiment supprimer cette tâche ?',
		cancel: true,
		persistent: true,
	}).onOk(() => {
		taskStore.deleteTask(task)
		$q.notify('Tâche supprimée')
	})
}

const formattedDueDate = computed(() => {
	const due = props.task?.dueDate
	if (!due) return ''
	if (/^\d{4}-\d{2}-\d{2}$/.test(due)) {
		const [y, m, d] = due.split('-')
		return `${d}/${m}/${y}`
	}
	const dt = new Date(due)
	if (isNaN(dt.getTime())) return due
	const day = String(dt.getDate()).padStart(2, '0')
	const month = String(dt.getMonth() + 1).padStart(2, '0')
	const year = dt.getFullYear()
	return `${day}/${month}/${year}`
})

// Classe d'état pour la couleur de fond
const statusClass = computed(() => {
	if (props.task?.done) return 'task-done'

	const due = props.task?.dueDate
	if (due) {
		// accepte YYYY-MM-DD ou ISO
		let dt = null
		if (/^\d{4}-\d{2}-\d{2}$/.test(due)) {
			const [y, m, d] = due.split('-')
			dt = new Date(Number(y), Number(m) - 1, Number(d))
		} else {
			dt = new Date(due)
		}
		if (!isNaN(dt.getTime())) {
			const today = new Date()
			// comparer uniquement la date (sans heure)
			const td = new Date(today.getFullYear(), today.getMonth(), today.getDate())
			const dd = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate())
			if (dd < td) return 'task-overdue'
		}
	}

	// par défaut, tâche en cours
	return 'task-inprogress'
})

</script>

<style>
.task-date {
	font-size: 1.05rem;
	font-weight: 600;
}

.task-done {
	background-color: #dff0d8; /* vert clair */
}
.task-inprogress {
	background-color: #fff3cd; /* jaune clair */
}
.task-overdue {
	background-color: #f8d7da; /* rouge clair */
}
.q-item.task-done,
.q-item.task-inprogress,
.q-item.task-overdue {
	padding: 6px 8px;
}
</style>
