export type Difficulty = "Easy" | "Medium" | "Hard" | "Very Hard";

export interface Question {
  difficulty: Difficulty;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface Quiz {
  quiz_id: string;
  quiz_title: string;
  questions: Question[];
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  score: number;
  total: number;
  percentage: number;
  time_taken_seconds: number;
  correct_by_difficulty: Record<string, { correct: number; total: number }>;
  completed_at: number;
}

export interface QuizState {
  currentQuizId: string | null;
  currentQuestionIndex: number;
  answers: Record<number, string>;
  startTime: number | null;
  questionTimers: Record<number, number>;
}

export interface LeaderboardEntry {
  rank: number;
  score: number;
  total: number;
  percentage: number;
  time_taken_seconds: number;
  completed_at: number;
}
