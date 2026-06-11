import { QUIZZES, getQuizById } from "@/data/quizzes";
import type { Question, Quiz } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface QuizStore {
  currentQuizId: string | null;
  currentQuestionIndex: number;
  answers: Record<number, string>;
  startTime: number | null;
  questionStartTime: number | null;
  isComplete: boolean;

  // Actions
  startQuiz: (quizId: string) => void;
  selectAnswer: (questionIndex: number, answer: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  completeQuiz: () => void;
  resetQuiz: () => void;
  resumeQuiz: () => void;

  // Computed
  getCurrentQuiz: () => Quiz | undefined;
  getCurrentQuestion: () => Question | undefined;
  getProgress: () => number;
  isAnswered: (index: number) => boolean;
  getScore: () => { score: number; total: number; percentage: number };
  getElapsedSeconds: () => number;
}

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      currentQuizId: null,
      currentQuestionIndex: 0,
      answers: {},
      startTime: null,
      questionStartTime: null,
      isComplete: false,

      startQuiz: (quizId) =>
        set({
          currentQuizId: quizId,
          currentQuestionIndex: 0,
          answers: {},
          startTime: Date.now(),
          questionStartTime: Date.now(),
          isComplete: false,
        }),

      selectAnswer: (questionIndex, answer) =>
        set((state) => ({
          answers: { ...state.answers, [questionIndex]: answer },
        })),

      nextQuestion: () =>
        set((state) => {
          const quiz = getQuizById(state.currentQuizId ?? "");
          if (!quiz) return state;
          const next = Math.min(
            state.currentQuestionIndex + 1,
            quiz.questions.length - 1,
          );
          return { currentQuestionIndex: next, questionStartTime: Date.now() };
        }),

      prevQuestion: () =>
        set((state) => ({
          currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1),
          questionStartTime: Date.now(),
        })),

      completeQuiz: () => set({ isComplete: true }),

      resetQuiz: () =>
        set({
          currentQuizId: null,
          currentQuestionIndex: 0,
          answers: {},
          startTime: null,
          questionStartTime: null,
          isComplete: false,
        }),

      resumeQuiz: () => set({ questionStartTime: Date.now() }),

      getCurrentQuiz: () => {
        const { currentQuizId } = get();
        return currentQuizId ? getQuizById(currentQuizId) : undefined;
      },

      getCurrentQuestion: () => {
        const { currentQuizId, currentQuestionIndex } = get();
        const quiz = currentQuizId ? getQuizById(currentQuizId) : undefined;
        return quiz?.questions[currentQuestionIndex];
      },

      getProgress: () => {
        const { currentQuizId, currentQuestionIndex } = get();
        const quiz = currentQuizId ? getQuizById(currentQuizId) : undefined;
        if (!quiz) return 0;
        return ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
      },

      isAnswered: (index) => {
        const { answers } = get();
        return index in answers;
      },

      getScore: () => {
        const { currentQuizId, answers } = get();
        const quiz = currentQuizId ? getQuizById(currentQuizId) : undefined;
        if (!quiz) return { score: 0, total: 0, percentage: 0 };
        const total = quiz.questions.length;
        const score = quiz.questions.reduce(
          (acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0),
          0,
        );
        return {
          score,
          total,
          percentage: total > 0 ? Math.round((score / total) * 100) : 0,
        };
      },

      getElapsedSeconds: () => {
        const { startTime } = get();
        if (!startTime) return 0;
        return Math.floor((Date.now() - startTime) / 1000);
      },
    }),
    {
      name: "upsc-quiz-store",
      partialize: (state) => ({
        currentQuizId: state.currentQuizId,
        currentQuestionIndex: state.currentQuestionIndex,
        answers: state.answers,
        startTime: state.startTime,
        isComplete: state.isComplete,
      }),
    },
  ),
);

// Export quizzes list for convenience
export { QUIZZES };
