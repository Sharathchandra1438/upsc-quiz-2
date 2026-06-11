import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getQuizById } from "@/data/quizzes";
import { useSaveQuizAttempt } from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import { useQuizStore } from "@/store/useQuizStore";
import type { QuizAttempt } from "@/types";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  BarChart3,
  CheckCircle2,
  Clock,
  RotateCcw,
  Target,
  Trophy,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo } from "react";

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: "text-emerald-600 dark:text-emerald-400",
  Medium: "text-amber-600 dark:text-amber-400",
  Hard: "text-orange-600 dark:text-orange-400",
  "Very Hard": "text-rose-600 dark:text-rose-400",
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function getGrade(pct: number): { label: string; color: string } {
  if (pct >= 90) return { label: "Excellent!", color: "text-emerald-500" };
  if (pct >= 70) return { label: "Good Job!", color: "text-primary" };
  if (pct >= 50) return { label: "Keep Practicing", color: "text-amber-500" };
  return { label: "Needs Improvement", color: "text-rose-500" };
}

export default function ResultsPage() {
  const { quizId } = useParams({ from: "/quiz/$quizId/results" });
  const navigate = useNavigate();
  const { answers, startTime, resetQuiz } = useQuizStore();
  const { mutate: saveAttempt } = useSaveQuizAttempt();

  const quiz = getQuizById(quizId);

  const result = useMemo(() => {
    if (!quiz) return null;
    const total = quiz.questions.length;
    const score = quiz.questions.reduce(
      (acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0),
      0,
    );
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    const timeTaken = startTime
      ? Math.floor((Date.now() - startTime) / 1000)
      : 0;

    const correctByDifficulty: Record<
      string,
      { correct: number; total: number }
    > = {};
    quiz.questions.forEach((q, i) => {
      const d = q.difficulty;
      if (!correctByDifficulty[d])
        correctByDifficulty[d] = { correct: 0, total: 0 };
      correctByDifficulty[d].total++;
      if (answers[i] === q.answer) correctByDifficulty[d].correct++;
    });

    return { score, total, percentage, timeTaken, correctByDifficulty };
  }, [quiz, answers, startTime]);

  // Save attempt once on mount
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally run only once on mount
  useEffect(() => {
    if (!result || !quiz) return;
    const attempt: QuizAttempt = {
      id: `${quizId}-${Date.now()}`,
      quiz_id: quizId,
      score: result.score,
      total: result.total,
      percentage: result.percentage,
      time_taken_seconds: result.timeTaken,
      correct_by_difficulty: result.correctByDifficulty,
      completed_at: Date.now(),
    };
    saveAttempt(attempt);
  }, []);

  if (!quiz || !result) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">No quiz data found.</p>
      </div>
    );
  }

  const grade = getGrade(result.percentage);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Score card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          data-ocid="results.score_card"
        >
          <Card className="border-border bg-card overflow-hidden mb-6">
            <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary/60" />
            <CardContent className="pt-8 pb-6 text-center">
              <Trophy className="w-12 h-12 text-primary mx-auto mb-3" />
              <h1 className="font-display text-3xl font-bold text-foreground mb-1">
                {quiz.quiz_title}
              </h1>
              <p className={cn("text-lg font-semibold mb-6", grade.color)}>
                {grade.label}
              </p>

              {/* Big score */}
              <div className="inline-flex flex-col items-center bg-primary/10 rounded-2xl px-10 py-5 mb-6 border border-primary/20">
                <span className="font-display text-5xl font-bold text-primary">
                  {result.percentage}%
                </span>
                <span className="text-sm text-muted-foreground mt-1">
                  {result.score} / {result.total} correct
                </span>
              </div>

              {/* Stats row */}
              <div className="flex justify-center gap-6 flex-wrap">
                {[
                  {
                    icon: CheckCircle2,
                    label: "Correct",
                    value: result.score,
                    color: "text-emerald-500",
                  },
                  {
                    icon: XCircle,
                    label: "Wrong",
                    value: result.total - result.score,
                    color: "text-rose-500",
                  },
                  {
                    icon: Clock,
                    label: "Time",
                    value: formatTime(result.timeTaken),
                    color: "text-primary",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col items-center gap-1"
                  >
                    <stat.icon className={cn("w-5 h-5", stat.color)} />
                    <span className="text-xl font-bold text-foreground">
                      {stat.value}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Difficulty analysis */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Card className="border-border bg-card mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <BarChart3 className="w-4 h-4 text-primary" />
                Difficulty-wise Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="space-y-3"
                data-ocid="results.difficulty_analysis"
              >
                {Object.entries(result.correctByDifficulty).map(
                  ([diff, val]) => {
                    const pct =
                      val.total > 0
                        ? Math.round((val.correct / val.total) * 100)
                        : 0;
                    return (
                      <div key={diff} className="flex items-center gap-3">
                        <span
                          className={cn(
                            "text-sm font-medium w-20 shrink-0",
                            DIFFICULTY_COLOR[diff],
                          )}
                        >
                          {diff}
                        </span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-16 text-right shrink-0">
                          {val.correct}/{val.total}
                        </span>
                      </div>
                    );
                  },
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Answer review */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <Card className="border-border bg-card mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Target className="w-4 h-4 text-primary" />
                Answer Review
              </CardTitle>
            </CardHeader>
            <CardContent
              className="space-y-4"
              data-ocid="results.answer_review"
            >
              {quiz.questions.map((q, i) => {
                const userAnswer = answers[i];
                const isCorrect = userAnswer === q.answer;
                return (
                  <div
                    key={q.question.slice(0, 30)}
                    className={cn(
                      "p-4 rounded-xl border",
                      isCorrect
                        ? "border-emerald-500/20 bg-emerald-500/5"
                        : "border-rose-500/20 bg-rose-500/5",
                    )}
                    data-ocid={`results.answer_item.${i + 1}`}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-muted-foreground">
                            Q{i + 1}
                          </span>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs border-0 px-1.5 py-0",
                              DIFFICULTY_COLOR[q.difficulty],
                            )}
                          >
                            {q.difficulty}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-foreground mb-2">
                          {q.question}
                        </p>
                        {userAnswer && (
                          <p
                            className={cn(
                              "text-xs mb-1",
                              isCorrect
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-rose-500",
                            )}
                          >
                            Your answer:{" "}
                            <span className="font-medium">{userAnswer}</span>
                          </p>
                        )}
                        {!isCorrect && (
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-2">
                            Correct:{" "}
                            <span className="font-medium">{q.answer}</span>
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <div
          className="flex flex-col sm:flex-row gap-3 justify-center"
          data-ocid="results.actions"
        >
          <Button
            variant="outline"
            onClick={() => {
              resetQuiz();
              navigate({ to: "/quizzes" });
            }}
            data-ocid="results.back_button"
            className="gap-2"
          >
            All Quizzes
          </Button>
          <Button
            onClick={() => {
              navigate({ to: "/leaderboard" });
            }}
            data-ocid="results.leaderboard_button"
            className="gap-2"
          >
            <Trophy className="w-4 h-4" /> View Leaderboard
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              resetQuiz();
              navigate({ to: "/quiz/$quizId", params: { quizId } });
            }}
            data-ocid="results.retry_button"
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Retake Quiz
          </Button>
        </div>
      </div>
    </div>
  );
}
