<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click="$emit('close')">
      <div class="modal-container" @click.stop>
        <header class="modal-header">
          <h2>{{ store.currentTask?.title }}</h2>
          <div class="progress-steps">
            <div 
              v-for="step in 2" 
              :key="step"
              :class="{ 
                'active': currentStep === step - 1,
                'completed': currentStep > step - 1 
              }"
            >
              {{ step === 1 ? 'Questions d\'Urgence' : 'Questions d\'Importance' }}
            </div>
          </div>
        </header>

        <div class="modal-body">
          <!-- Questions d'Urgence -->
          <div v-if="currentStep === 0" class="questions-container">
            <h3>Évaluation de l'Urgence ({{ urgencyQuestions.length }} questions)</h3>
            <div 
              v-for="question in urgencyQuestions" 
              :key="question.id" 
              class="question-card"
            >
              <p class="question-text">{{ question.text }}</p>
              <div class="likert-scale">
                <div 
                  v-for="answer in question.answers"
                  :key="answer.value"
                  class="likert-option"
                >
                  <button
                    class="likert-button"
                    :class="{ selected: store.getResponse(question.id) === answer.value }"
                    @click="store.setResponse(question.id, answer.value)"
                  >
                    <span class="likert-circle"></span>
                  </button>
                  <span class="likert-label">{{ answer.text }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Questions d'Importance -->
          <div v-else class="questions-container">
            <h3>Évaluation de l'Importance ({{ importanceQuestions.length }} questions)</h3>
            <div 
              v-for="question in importanceQuestions" 
              :key="question.id" 
              class="question-card"
            >
              <p class="question-text">{{ question.text }}</p>
              <div class="likert-scale">
                <div 
                  v-for="answer in question.answers"
                  :key="answer.value"
                  class="likert-option"
                >
                  <button
                    class="likert-button"
                    :class="{ selected: store.getResponse(question.id) === answer.value }"
                    @click="store.setResponse(question.id, answer.value)"
                  >
                    <span class="likert-circle"></span>
                  </button>
                  <span class="likert-label">{{ answer.text }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer class="modal-footer">
          <button class="cancel-btn" @click="$emit('close')">
            <span class="icon">×</span>
            Annuler
          </button>
          <button 
            v-if="currentStep === 0"
            class="next-btn"
            :disabled="!isStepComplete"
            @click="currentStep++"
          >
            Suivant
            <span class="icon">→</span>
          </button>
          <button 
            v-else
            class="submit-btn"
            :disabled="!isStepComplete"
            @click="handleSubmit"
          >
            Terminer
            <span class="icon">✓</span>
          </button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEisenhowerStore } from '~/stores/eisenhower'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close'])
const store = useEisenhowerStore()
const currentStep = ref(0)

// Définition des questions directement dans le composant
const questions = [
  {
    id: 'u1',
    text: "Y a-t-il une deadline fixe ?",
    category: 'urgency',
    weight: 3,
    answers: [
      { text: 'Immédiat', value: 5 },
      { text: 'Cette semaine', value: 4 },
      { text: 'Ce mois-ci', value: 3 },
      { text: 'Ce trimestre', value: 2 },
      { text: 'Pas de deadline', value: 1 }
    ]
  },
  {
    id: 'u2',
    text: "Quel est le niveau de dépendance d'autres tâches ?",
    category: 'urgency',
    weight: 2,
    answers: [
      { text: 'Bloque plusieurs tâches', value: 5 },
      { text: 'Bloque une tâche', value: 4 },
      { text: 'Dépendance modérée', value: 3 },
      { text: 'Faible dépendance', value: 2 },
      { text: 'Aucune dépendance', value: 1 }
    ]
  },
  {
    id: 'u3',
    text: "Quel est le niveau d'attente des parties prenantes ?",
    category: 'urgency',
    weight: 2,
    answers: [
      { text: 'Attente critique', value: 5 },
      { text: 'Forte attente', value: 4 },
      { text: 'Attente modérée', value: 3 },
      { text: 'Faible attente', value: 2 },
      { text: 'Aucune attente', value: 1 }
    ]
  },
  {
    id: 'u4',
    text: "Impact sur le planning du projet ?",
    category: 'urgency',
    weight: 3,
    answers: [
      { text: 'Retard critique', value: 5 },
      { text: 'Retard important', value: 4 },
      { text: 'Retard modéré', value: 3 },
      { text: 'Retard mineur', value: 2 },
      { text: 'Pas de retard', value: 1 }
    ]
  },
  {
    id: 'u5',
    text: "Niveau de risque si reporté ?",
    category: 'urgency',
    weight: 2,
    answers: [
      { text: 'Risque critique', value: 5 },
      { text: 'Risque élevé', value: 4 },
      { text: 'Risque modéré', value: 3 },
      { text: 'Risque faible', value: 2 },
      { text: 'Aucun risque', value: 1 }
    ]
  },
  {
    id: 'i1',
    text: "Impact sur les objectifs stratégiques ?",
    category: 'importance',
    weight: 3,
    answers: [
      { text: 'Impact majeur', value: 5 },
      { text: 'Impact significatif', value: 4 },
      { text: 'Impact modéré', value: 3 },
      { text: 'Impact mineur', value: 2 },
      { text: 'Aucun impact', value: 1 }
    ]
  },
  {
    id: 'i2',
    text: "Valeur ajoutée pour l'organisation ?",
    category: 'importance',
    weight: 3,
    answers: [
      { text: 'Valeur exceptionnelle', value: 5 },
      { text: 'Forte valeur', value: 4 },
      { text: 'Valeur moyenne', value: 3 },
      { text: 'Faible valeur', value: 2 },
      { text: 'Très faible valeur', value: 1 }
    ]
  },
  {
    id: 'i3',
    text: "Impact sur la satisfaction client ?",
    category: 'importance',
    weight: 2,
    answers: [
      { text: 'Impact majeur', value: 5 },
      { text: 'Impact significatif', value: 4 },
      { text: 'Impact modéré', value: 3 },
      { text: 'Impact mineur', value: 2 },
      { text: 'Aucun impact', value: 1 }
    ]
  },
  {
    id: 'i4',
    text: "Niveau de complexité technique ?",
    category: 'importance',
    weight: 2,
    answers: [
      { text: 'Très complexe', value: 5 },
      { text: 'Complexe', value: 4 },
      { text: 'Modéré', value: 3 },
      { text: 'Simple', value: 2 },
      { text: 'Très simple', value: 1 }
    ]
  },
  {
    id: 'i5',
    text: "Fréquence d'utilisation prévue ?",
    category: 'importance',
    weight: 2,
    answers: [
      { text: 'Utilisation quotidienne', value: 5 },
      { text: 'Utilisation hebdomadaire', value: 4 },
      { text: 'Utilisation mensuelle', value: 3 },
      { text: 'Utilisation rare', value: 2 },
      { text: 'Utilisation exceptionnelle', value: 1 }
    ]
  }
]

const urgencyQuestions = computed(() => {
  return questions.filter(q => q.category === 'urgency')
})

const importanceQuestions = computed(() => {
  return questions.filter(q => q.category === 'importance')
})

const isStepComplete = computed(() => {
  const currentQuestions = currentStep.value === 0 ? urgencyQuestions.value : importanceQuestions.value
  return currentQuestions.every(q => store.getResponse(q.id) !== undefined)
})

const handleSubmit = () => {
  // Passer les questions au store lors de la soumission
  store.submitEvaluation('', questions)
  emit('close')
  currentStep.value = 0
}

// Ajout d'un watcher pour voir quand les questions changent
watch(() => store.evaluationQuestions, (newQuestions) => {
  console.log('Questions changed:', newQuestions.length)
}, { immediate: true })
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 900px;
  height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  position: relative;
  animation: modalEnter 0.3s ease;
}

@keyframes modalEnter {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eef2f6;
  background: #f8fafc;
  flex-shrink: 0;
}

.modal-header h2 {
  font-size: 1.5rem;
  color: #1e293b;
  margin-bottom: 1rem;
}

.progress-steps {
  display: flex;
  gap: 1rem;
}

.progress-steps > div {
  padding: 0.75rem 1.25rem;
  background: #e2e8f0;
  border-radius: 30px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #64748b;
  transition: all 0.3s ease;
}

.progress-steps > div.active {
  background: #3b82f6;
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
}

.progress-steps > div.completed {
  background: #10b981;
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.questions-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-bottom: 1rem;
}

.questions-container h3 {
  color: #1e293b;
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.question-card {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.question-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.question-text {
  font-weight: 500;
  color: #334155;
  margin-bottom: 1.25rem;
  font-size: 1.1rem;
}

.likert-scale {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  padding: 1rem 0;
  position: relative;
}

/* .likert-scale::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: #e2e8f0;
  transform: translateY(-50%);
} */

.likert-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  text-align: center;
  position: relative;
  z-index: 1;
}

.likert-button {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: none;
  padding: 0;
  background: white;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
}

.likert-circle {
  display: block;
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 50%;
  background: white;
  transition: all 0.2s ease;
  margin: 0.25rem;
}

.likert-button:hover .likert-circle {
  transform: scale(1.1);
  border-color: #3b82f6;
}

.likert-button.selected .likert-circle {
  background: #3b82f6;
  border-color: #3b82f6;
  transform: scale(1);
}

.likert-button.selected::before {
  content: '';
  position: absolute;
  top: -0.25rem;
  left: -0.25rem;
  right: -0.25rem;
  bottom: -0.25rem;
  border: 2px solid #3b82f6;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

.likert-label {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
  max-width: 80px;
  line-height: 1.2;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

/* Responsive design pour mobile */
@media (max-width: 768px) {
  .modal-container {
    height: 100vh;
    width: 100%;
    border-radius: 0;
  }

  .likert-scale {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .likert-option {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 1rem;
  }

  .likert-label {
    text-align: left;
    font-size: 0.9rem;
  }
}

.modal-footer {
  padding: 1.25rem 1.5rem;
  border-top: 1px solid #eef2f6;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  background: #f8fafc;
  flex-shrink: 0;
}

.cancel-btn, .next-btn, .submit-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.cancel-btn {
  border: 2px solid #e2e8f0;
  background: white;
  color: #64748b;
}

.cancel-btn:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.next-btn, .submit-btn {
  background: #3b82f6;
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
}

.next-btn:hover, .submit-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.next-btn:disabled, .submit-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.icon {
  font-size: 1.1rem;
}
</style>
