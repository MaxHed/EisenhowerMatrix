<!-- components/TaskEvaluation.vue -->
<template>
  <div class="task-evaluation">
    <div class="new-task-form">
      <h3>Nouvelle Tâche</h3>
      <div class="form-group">
        <label for="taskTitle">Titre de la tâche</label>
        <input
          id="taskTitle"
          v-model="newTaskTitle"
          type="text"
          placeholder="Entrez le titre de la tâche"
          @keyup.enter="startEvaluation"
        >
        <button
          @click="startEvaluation"
          :disabled="!newTaskTitle.trim()"
          class="start-btn"
        >
          Commencer l'évaluation
        </button>
      </div>
    </div>

    <div class="export-controls">
      <button @click="downloadMatrix" class="download-btn">
        <span class="icon">⬇</span>
        Exporter en PNG
      </button>
    </div>

    <EvaluationModal
      :is-open="isModalOpen"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useEisenhowerStore } from '~/stores/eisenhower'
import html2canvas from 'html2canvas'

const store = useEisenhowerStore()
const newTaskTitle = ref('')
const isModalOpen = ref(false)

const startEvaluation = () => {
  if (newTaskTitle.value.trim()) {
    store.initializeNewTask(newTaskTitle.value.trim())
    isModalOpen.value = true
  }
}

const closeModal = () => {
  isModalOpen.value = false
  newTaskTitle.value = ''
}

const downloadMatrix = async () => {
  const matrix = document.querySelector('.matrix-grid')
  if (!matrix) return
  
  const canvas = await html2canvas(matrix, {
    ignoreElements: (element) => {
      return element.classList.contains('no-export')
    }
  })
  const link = document.createElement('a')
  link.download = 'eisenhower-matrix.jpg'
  link.href = canvas.toDataURL('image/jpeg', 0.9)
  link.click()
}
</script>

<style scoped>
.task-evaluation {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.new-task-form {
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.form-group label {
  font-weight: 500;
  color: var(--text-color);
}

input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.start-btn {
  padding: 0.5rem 1rem;
  background: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
}

.start-btn:disabled {
  background: #bdbdbd;
  cursor: not-allowed;
}

.export-controls {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.download-btn {
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
}

.download-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.3);
  background: #1e88e5;
}

.icon {
  font-size: 1.1rem;
}
</style>
