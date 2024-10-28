<!-- pages/index.vue -->
<template>
  <div class="container">
    <header class="header">
      <h1>Matrice d'Eisenhower</h1>
      <p class="subtitle">Organisez vos tâches selon leur importance et leur urgence</p>
    </header>

    <div class="main-content">
      <div class="evaluation-section">
        <TaskEvaluation />
      </div>

      <div class="matrix-section">
        <EisenhowerMatrix />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useEisenhowerStore } from '~/stores/eisenhower'

const store = useEisenhowerStore()

onMounted(() => {
  // Initialisation du store si nécessaire
  
})
</script>

<style scoped>
.container {
  max-width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom right, #f8f9ff, #ffffff);
}

.header {
  text-align: center;
  margin-bottom: 1.5rem;
  padding: 0.5rem 0;
}

.header h1 {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 0.5rem;
  letter-spacing: -0.5px;
}

.subtitle {
  color: #64748b;
  font-size: 1rem;
  font-weight: 500;
}

.main-content {
  flex: 1;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 1.5rem;
  height: calc(100vh - 120px); /* Ajusté pour tenir compte du header */
  overflow: hidden;
}

@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
    height: calc(100vh - 100px);
  }
  
  .header {
    margin-bottom: 1rem;
  }
  
  .header h1 {
    font-size: 2rem;
  }
}

.evaluation-section {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  overflow-y: auto;
}

.matrix-section {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  overflow: hidden;
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
</style>
