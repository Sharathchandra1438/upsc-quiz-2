import type { LeaderboardEntry, QuizAttempt } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ── localStorage helpers ───────────────────────────────────────────────────
const STORAGE_KEY = "upsc-quiz-attempts";

function getLocalAttempts(): QuizAttempt[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as QuizAttempt[]) : [];
  } catch {
    return [];
  }
}

function saveLocalAttempt(attempt: QuizAttempt): void {
  const existing = getLocalAttempts();
  const updated = [attempt, ...existing].slice(0, 50);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

// ── Mock leaderboard ──────────────────────────────────────────────────────
const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    score: 105,
    total: 105,
    percentage: 100,
    time_taken_seconds: 420,
    completed_at: Date.now() - 3600000,
  },
  {
    rank: 2,
    score: 95,
    total: 105,
    percentage: 90,
    time_taken_seconds: 540,
    completed_at: Date.now() - 7200000,
  },
  {
    rank: 3,
    score: 84,
    total: 105,
    percentage: 80,
    time_taken_seconds: 660,
    completed_at: Date.now() - 14400000,
  },
];

// ── Hooks ─────────────────────────────────────────────────────────────────

/** Save a completed quiz attempt to localStorage. */
export function useSaveQuizAttempt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (attempt: QuizAttempt) => {
      saveLocalAttempt(attempt);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myAttempts"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });
}

/** Get all quiz attempts for the current user from localStorage. */
export function useGetMyAttempts() {
  return useQuery<QuizAttempt[]>({
    queryKey: ["myAttempts"],
    queryFn: async () => getLocalAttempts(),
    placeholderData: [],
  });
}

/** Get leaderboard entries — uses local attempts + mock top entries. */
export function useGetLeaderboard(quizId: string) {
  return useQuery<LeaderboardEntry[]>({
    queryKey: ["leaderboard", quizId],
    queryFn: async () => {
      const local = getLocalAttempts()
        .filter((a) => a.quiz_id === quizId)
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 10)
        .map((a, i) => ({
          rank: i + 1,
          score: a.score,
          total: a.total,
          percentage: a.percentage,
          time_taken_seconds: a.time_taken_seconds,
          completed_at: a.completed_at,
        }));
      return local.length > 0 ? local : MOCK_LEADERBOARD;
    },
    enabled: !!quizId,
    placeholderData: MOCK_LEADERBOARD,
  });
}
