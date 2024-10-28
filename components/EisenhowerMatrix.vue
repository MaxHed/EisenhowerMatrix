<!-- components/EisenhowerMatrix.vue -->
<template>
  <div class="eisenhower-matrix">
    <div class="matrix-grid">
      <div 
        v-for="quadrant in ['Q1', 'Q2', 'Q3', 'Q4']" 
        :key="quadrant"
        class="matrix-quadrant"
        :class="quadrant.toLowerCase()"
        @dragover.prevent
        @drop="handleDrop($event, quadrant)"
      >
        <h3>{{ getQuadrantTitle(quadrant) }}</h3>
        <div class="task-list">
          <div
            v-for="task in getTasksByQuadrant(quadrant)"
            :key="task.id"
            class="task-item"
            draggable="true"
            @dragstart="dragStart($event, task)"
          >
            {{ task.title }}
            <button @click="removeTask(task.id)" class="delete-btn">×</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Ajout de la classe no-export au conteneur du bouton -->
    <!-- <div class="matrix-controls no-export">
      <button @click="downloadMatrix" class="download-btn">
        <span class="icon">⬇</span>
        Exporter en JPG
      </button>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { useEisenhowerStore } from '~/stores/eisenhower'
import html2canvas from 'html2canvas'
import type { Task, Quadrant } from '~/stores/eisenhower'

const store = useEisenhowerStore()

const getQuadrantTitle = (quadrant: Quadrant) => {
  const titles: Record<Quadrant, string> = {
    Q1: 'Urgent et Important',
    Q2: 'Important, Non Urgent',
    Q3: 'Urgent, Non Important',
    Q4: 'Non Urgent, Non Important'
  }
  return titles[quadrant]
}

const getTasksByQuadrant = (quadrant: Quadrant) => {
  return store.tasks.filter(task => task.quadrant === quadrant)
    .sort((a, b) => {
      // Trier par importance puis urgence
      const importanceDiff = b.importanceScore - a.importanceScore
      return importanceDiff !== 0 ? importanceDiff : b.urgencyScore - a.urgencyScore
    })
}

const dragStart = (event: DragEvent, task: Task) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('taskId', task.id)
  }
}

const handleDrop = (event: DragEvent, quadrant: Quadrant) => {
  const taskId = event.dataTransfer?.getData('taskId')
  if (taskId) {
    store.updateTaskPosition(taskId, quadrant)
  }
}

const removeTask = (taskId: string) => {
  store.removeTask(taskId)
}

const downloadMatrix = async () => {
  const matrix = document.querySelector('.matrix-grid')
  if (!matrix) return
  
  const canvas = await html2canvas(matrix, {
    ignoreElements: (element) => {
      return element.classList.contains('no-export')
    },
    backgroundColor: null, // Rend le fond transparent
    scale: 2 // Améliore la qualité de l'export
  })
  
  const link = document.createElement('a')
  link.download = 'eisenhower-matrix.png' // Change l'extension en .png
  link.href = canvas.toDataURL('image/png') // Change le format en PNG
  link.click()
}
</script>

<style scoped>
.eisenhower-matrix {
  height: 100%;
  aspect-ratio: 1;
  padding: 0.5rem;
  margin: 0 auto; /* Centre la matrice */
}

.matrix-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 1rem;
  height: 100%;
  aspect-ratio: 1;
}

.matrix-quadrant {
  position: relative;
  background: rgba(255, 255, 255, 0.9);
  padding: 1rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  display: grid;
  grid-template-rows: auto 1fr;
}

.matrix-quadrant h3 {
  font-size: 1rem;          /* Titre plus grand */
  font-weight: 600;
  margin-bottom: 1rem;      /* Marge augmentée */
  color: #0f172a;          /* Couleur plus foncée */
  text-transform: uppercase; /* Texte en majuscules */
  letter-spacing: 0.5px;    /* Espacement des lettres */
}

/* Couleurs modernisées et plus contrastées pour les quadrants */
.q1 { 
  background: linear-gradient(135deg, #fff5f5 0%, #ffe4e4 100%);
  border-color: #ffa4a4;  /* Bordure plus visible */
}
.q2 { 
  background: linear-gradient(135deg, #f0fff4 0%, #dcffe4 100%);
  border-color: #93e6a0;  /* Bordure plus visible */
}
.q3 { 
  background: linear-gradient(135deg, #fff7ef 0%, #fff2e2 100%);
  border-color: #ffca80;  /* Bordure plus visible */
}
.q4 { 
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-color: #cbd5e1;  /* Bordure plus visible */
}

.task-list {
  display: grid;
  grid-auto-rows: min-content;
  gap: 0.875rem;
  overflow-y: auto;
  padding: 0.75rem;
  padding-right: 1rem;
}

.task-list::-webkit-scrollbar {
  width: 4px;
}

.task-list::-webkit-scrollbar-track {
  background: transparent;
}

.task-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.task-item {
  background: var(--secondary-color); /* Fond bleu */
  padding: 0.75rem 1.25rem;  /* Padding horizontal augmenté */
  border-radius: 9999px;     /* Bords complètement arrondis */
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.15);  /* Ombre bleue */
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  cursor: move;
  transition: all 0.2s ease;
  border: none;
  font-size: 0.95rem;
  font-weight: 500;
  min-height: 3rem;
  color: white;            /* Texte blanc */
  backdrop-filter: blur(8px);
}

.task-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(33, 150, 243, 0.25);
  background: #1e88e5;    /* Bleu légèrement plus foncé au survol */
}

.delete-btn {
  background: rgba(255, 255, 255, 0.2);  /* Fond blanc semi-transparent */
  border: none;
  color: white;           /* Icône en blanc */
  font-size: 1.25rem;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s ease;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.75rem;
}

.task-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background: rgba(255, 255, 255, 0.3);  /* Fond blanc plus visible au survol */
  color: white;
}

.matrix-controls {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.download-btn {
  padding: 0.75rem 1.5rem;
  background: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
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

/* Ajout d'une animation pour le drag and drop */
.task-item.dragging {
  opacity: 0.5;
  transform: scale(0.95);
}

@media (max-width: 768px) {
  .eisenhower-matrix {
    aspect-ratio: auto;
    height: auto;
  }

  .matrix-grid {
    aspect-ratio: auto;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, minmax(200px, 1fr));
  }

  .matrix-quadrant {
    padding: 0.75rem;
  }

  .task-item {
    padding: 0.625rem 1rem;
    min-height: 2.75rem;
  }

  .delete-btn {
    opacity: 1;
  }
}
</style>
