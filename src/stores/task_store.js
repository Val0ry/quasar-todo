import { defineStore } from 'pinia'

// L'URL de base de votre future API REST
const API_URL = 'http://localhost:3000/api/tasks'

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: []
  }),
  actions: {
    async fetchTasks() {
      try {
        const response = await fetch(API_URL)
        if (!response.ok) throw new Error('Erreur réseau')
        const data = await response.json()
        this.tasks = data
      } catch (error) {
        console.error('Erreur de chargement des tâches:', error)
      }
    },

    async addTask(taskPayload) {
      if (!taskPayload || !taskPayload.title || !taskPayload.title.trim()) {
        console.error("Le titre de la tâche est requis.");
        return;
      }
      // Ajout de la validation pour la date et l'heure
      if (!taskPayload.dueDate || !taskPayload.dueTime) {
        console.error("La date et l'heure sont requises.");
        return;
      }

      const insertObj = {
        title: taskPayload.title,
        done: false,
        dueDate: taskPayload.dueDate, // Format YYYY-MM-DD
        dueTime: taskPayload.dueTime  // Format HH:mm
      };

      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(insertObj)
        })
        if (!response.ok) throw new Error('Erreur réseau')
        const newTask = await response.json()
        await this.fetchTasks(); // Recharge les tâches pour conserver le tri
      } catch (error) {
        console.error("Erreur d'ajout:", error)
      }
    },

    async deleteTask(taskToDelete) {
      if (!taskToDelete || !taskToDelete.id) {
        console.error("Tâche invalide pour la suppression:", taskToDelete);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/${taskToDelete.id}`, {
          method: 'DELETE'
        })
        if (!response.ok) throw new Error('Erreur réseau')
        await this.fetchTasks(); // Recharge les tâches pour conserver le tri
      } catch (error) {
        console.error('Erreur de suppression:', error)
      }
    },

    async deleteSelectedTasks() {
      const tasksToDelete = this.tasks.filter(task => task.done);
      if (tasksToDelete.length === 0) return;

      const idsToDelete = tasksToDelete.map(task => task.id);

      try {
        const response = await fetch(`${API_URL}/delete-multiple`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: idsToDelete })
        })
        if (!response.ok) throw new Error('Erreur réseau')
        await this.fetchTasks(); // Recharge les tâches pour conserver le tri
      } catch (error) {
        console.error('Erreur de suppression des tâches sélectionnées:', error)
      }
    },

    async toggleDone(task) {
      if (!task) {
        console.error("Tâche invalide pour le basculement:", task); // Ligne 97
        return;
      }

      try {
        const response = await fetch(`${API_URL}/${task.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ done: task.done })
        })
        if (!response.ok) throw new Error('Erreur réseau')
        const taskIndex = this.tasks.findIndex(t => t.id === task.id);
        if (taskIndex !== -1) this.tasks[taskIndex].done = task.done;
      } catch (error) {
        console.error('Erreur de mise à jour:', error)
      }
    }
  }
})
