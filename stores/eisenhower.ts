// stores/eisenhower.ts
import { defineStore } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'


export interface Task {
  id: string
  title: string
  description: string
  importanceScore: number
  urgencyScore: number
  quadrant: Quadrant
}

export type Quadrant = 'Q1' | 'Q2' | 'Q3' | 'Q4'

interface EvaluationQuestion {
  id: string
  text: string
  category: 'importance' | 'urgency'
  weight: number
  answers: {
    text: string
    value: number
  }[]
}

export const useEisenhowerStore = defineStore('eisenhower', {
  state: () => {
    // Créons d'abord les questions séparément pour plus de clarté
    const urgencyQuestions = [
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
      }
    ]

    const importanceQuestions = [
      // ... les 5 questions d'importance
    ]

    const state = {
      tasks: [] as Task[],
      currentTask: null as Task | null,
      evaluationQuestions: [...urgencyQuestions, ...importanceQuestions] as EvaluationQuestion[],
      evaluationResponses: {} as Record<string, number>
    }

    // Ajout de logs pour déboguer
    console.log('Total questions:', state.evaluationQuestions.length)
    console.log('Urgency questions:', state.evaluationQuestions.filter(q => q.category === 'urgency').length)
    console.log('Importance questions:', state.evaluationQuestions.filter(q => q.category === 'importance').length)

    return state
  },

  getters: {
    getTasksByQuadrant: (state) => {
      return (quadrant: Quadrant) => state.tasks
        .filter(task => task.quadrant === quadrant)
        .sort((a, b) => {
          const importanceDiff = b.importanceScore - a.importanceScore
          return importanceDiff !== 0 ? importanceDiff : b.urgencyScore - a.urgencyScore
        })
    },
    
    currentQuadrant: (state) => {
      if (!state.currentTask) return null
      
      const importanceThreshold = 3.5  // Ajusté pour plus de précision
      const urgencyThreshold = 3.5     // Ajusté pour plus de précision
      
      if (state.currentTask.importanceScore >= importanceThreshold) {
        return state.currentTask.urgencyScore >= urgencyThreshold ? 'Q1' : 'Q2'
      } else {
        return state.currentTask.urgencyScore >= urgencyThreshold ? 'Q3' : 'Q4'
      }
    }
  },

  actions: {
    getResponse(questionId: string): number | undefined {
      return this.evaluationResponses[questionId]
    },

    setResponse(questionId: string, value: number) {
      this.evaluationResponses[questionId] = value
    },

    clearResponses() {
      this.evaluationResponses = {}
    },

    initializeNewTask(title: string) {
      this.currentTask = {
        id: Date.now().toString(),
        title,
        description: '',
        importanceScore: 0,
        urgencyScore: 0,
        quadrant: 'Q4'
      }
      this.clearResponses()
    },

    submitEvaluation(description: string, questions: any[]) {
      if (!this.currentTask) return

      this.currentTask.description = description
      let totalImportance = 0
      let totalUrgency = 0
      let importanceCount = 0
      let urgencyCount = 0

      // Utiliser les réponses stockées pour calculer les scores
      Object.entries(this.evaluationResponses).forEach(([questionId, response]) => {
        const question = questions.find(q => q.id === questionId)
        if (question && response !== undefined) {
          if (question.category === 'importance') {
            totalImportance += response * question.weight
            importanceCount += question.weight
          } else {
            totalUrgency += response * question.weight
            urgencyCount += question.weight
          }
        }
      })

      // Calculer les scores moyens
      this.currentTask.importanceScore = importanceCount > 0 ? totalImportance / importanceCount : 0
      this.currentTask.urgencyScore = urgencyCount > 0 ? totalUrgency / urgencyCount : 0

      // Déterminer le quadrant
      this.currentTask.quadrant = this.calculateQuadrant(
        this.currentTask.urgencyScore,
        this.currentTask.importanceScore
      )
      
      this.tasks.push({ ...this.currentTask })
      this.currentTask = null
      this.clearResponses()
    },

    updateTaskPosition(taskId: string, quadrant: 'Q1' | 'Q2' | 'Q3' | 'Q4') {
      const task = this.tasks.find(t => t.id === taskId)
      if (task) {
        task.quadrant = quadrant
      }
    },

    removeTask(taskId: string) {
      const index = this.tasks.findIndex(t => t.id === taskId)
      if (index !== -1) {
        this.tasks.splice(index, 1)
      }
    },

    calculateQuadrant(urgency: number, importance: number): 'Q1' | 'Q2' | 'Q3' | 'Q4' {
      if (urgency >= 3 && importance >= 3) return 'Q1'
      if (urgency < 3 && importance >= 3) return 'Q2'
      if (urgency >= 3 && importance < 3) return 'Q3'
      return 'Q4'
    }
  },

  persist: true
})
