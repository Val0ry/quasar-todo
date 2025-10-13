import { defineStore } from 'pinia'
import { supabase } from 'boot/supabase'

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: []
  }),
  actions: {
    async fetchTasks() {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) console.error('Erreur de chargement:', error);
      else this.tasks = data;
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

      const { data, error } = await supabase
        .from('tasks')
        .insert([insertObj])
        .select();

      if (error) console.error('Erreur d\'ajout:', error);
      else {
        this.tasks.unshift(data[0]); // Ajoute la nouvelle tâche en haut de la liste
      }
    },

    async deleteTask(taskToDelete) {
      if (!taskToDelete || !taskToDelete.id) {
        console.error("Tâche invalide pour la suppression:", taskToDelete);
        return;
      }

      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskToDelete.id);

      if (error) {
        console.error('Erreur de suppression:', error);
      } else {
        const taskIndex = this.tasks.findIndex(t => t.id === taskToDelete.id)
        if (taskIndex !== -1) {
          this.tasks.splice(taskIndex, 1);
        }
      }
    },

    async deleteSelectedTasks() {
      const tasksToDelete = this.tasks.filter(task => task.done);
      if (tasksToDelete.length === 0) return;

      const idsToDelete = tasksToDelete.map(task => task.id);

      const { error } = await supabase
        .from('tasks')
        .delete()
        .in('id', idsToDelete);

      if (error) {
        console.error('Erreur de suppression des tâches sélectionnées:', error);
      } else {
        this.tasks = this.tasks.filter(task => !task.done);
      }
    },

    async toggleDone(task) {
      if (!task) {
        console.error("Tâche invalide pour le basculement:", task); // Ligne 97
        return;
      }

      const { error } = await supabase
        .from('tasks')
        .update({ done: task.done })
        .eq('id', task.id);

      if (error) {
        console.error('Erreur de mise à jour:', error);
      } else {
        const taskIndex = this.tasks.findIndex(t => t.id === task.id);
        if (taskIndex !== -1) this.tasks[taskIndex].done = task.done;
      }
    }
  }
})
