import { createActor } from "@/backend";
import type { LeaderboardEntry, QuizAttempt } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
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

// ── Mock leaderboard fallback ─────────────────────────────────────────────────
const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    score: 10,
    total: 10,
    percentage: 100,
    time_taken_seconds: 142,
    completed_at: Date.now() - 3600000,
  },
  {
    rank: 2,
    score: 9,
    total: 10,
    percentage: 90,
    time_taken_seconds: 198,
    completed_at: Date.now() - 7200000,
  },
  {
    rank: 3,
    score: 8,
    total: 10,
    percentage: 80,
    time_taken_seconds: 267,
    completed_at: Date.now() - 14400000,
  },
];

// ── Hooks ───────────────────────────────────────────────────────────────────────

/** Save a completed quiz attempt. Falls back to localStorage when backend unavailable. */
export function useSaveQuizAttempt() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (attempt: QuizAttempt) => {
      saveLocalAttempt(attempt);
      if (!actor) return;
      try {
        await actor.saveQuizAttempt({
          quiz_id: attempt.quiz_id,
          score: BigInt(attempt.score),
          total: BigInt(attempt.total),
          percentage: attempt.percentage,
          time_taken_seconds: BigInt(attempt.time_taken_seconds),
          correct_by_difficulty: Object.entries(
            attempt.correct_by_difficulty,
          ).map(
            ([diff, val]) =>
              [diff, BigInt(val.correct), BigInt(val.total)] as [
                string,
                bigint,
                bigint,
              ],
          ),
        });
      } catch {
        // localStorage fallback already saved
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myAttempts"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });
}

/** Get all quiz attempts for the current user. */
export function useGetMyAttempts() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<QuizAttempt[]>({
    queryKey: ["myAttempts"],
    queryFn: async () => {
      if (!actor) return getLocalAttempts();
      try {
        const raw = await actor.getMyAttempts();
        const mapped: QuizAttempt[] = raw.map((a) => ({
          id: String(a.id),
          quiz_id: a.quiz_id,
          score: Number(a.score),
          total: Number(a.total),
          percentage: a.percentage,
          time_taken_seconds: Number(a.time_taken_seconds),
          correct_by_difficulty: Object.fromEntries(
            (a.correct_by_difficulty as [string, bigint, bigint][]).map(
              ([d, c, t]) => [d, { correct: Number(c), total: Number(t) }],
            ),
          ),
          completed_at: Number(a.completed_at),
        }));
        const local = getLocalAttempts();
        return [...mapped, ...local].filter(
          (item, i, arr) => arr.findIndex((b) => b.id === item.id) === i,
        );
      } catch {
        return getLocalAttempts();
      }
    },
    enabled: !isFetching,
    placeholderData: [],
  });
}

/** Get leaderboard entries for a specific quiz. */
export function useGetLeaderboard(quizId: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<LeaderboardEntry[]>({
    queryKey: ["leaderboard", quizId],
    queryFn: async () => {
      if (!actor) return MOCK_LEADERBOARD;
      try {
        const raw = await actor.getLeaderboard(quizId, BigInt(10));
        type RawEntry = {
          score: bigint;
          total: bigint;
          percentage: number;
          time_taken_seconds: bigint;
          completed_at: bigint;
        };
        return (raw as RawEntry[]).map((entry, i) => ({
          rank: i + 1,
          score: Number(entry.score),
          total: Number(entry.total),
          percentage: entry.percentage,
          time_taken_seconds: Number(entry.time_taken_seconds),
          completed_at: Number(entry.completed_at),
        }));
      } catch {
        return MOCK_LEADERBOARD;
      }
    },
    enabled: !isFetching && !!quizId,
    placeholderData: MOCK_LEADERBOARD,
  });
}
