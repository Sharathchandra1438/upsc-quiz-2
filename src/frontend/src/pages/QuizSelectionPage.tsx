import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QUIZZES } from "@/data/quizzes";
import { useGetMyAttempts } from "@/hooks/useBackend";
import { useQuizStore } from "@/store/useQuizStore";
import type { Quiz } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  ChevronRight,
  Clock,
  Star,
  Target,
  Trophy,
} from "lucide-react";
import { motion } from "motion/react";

const DIFFICULTY_COLORS = {
  Easy: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  Medium: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  Hard: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
  "Very Hard": "bg-rose-500/15 text-rose-600 dark:text-rose-400",
};

function getDifficultyBreakdown(quiz: Quiz) {
  const counts: Record<string, number> = {};
  for (const q of quiz.questions) {
    counts[q.difficulty] = (counts[q.difficulty] || 0) + 1;
  }
  return counts;
}

function QuizCard({ quiz, index }: { quiz: Quiz; index: number }) {
  const navigate = useNavigate();
  const { startQuiz } = useQuizStore();
  const { data: attempts } = useGetMyAttempts();

  const myAttempts = attempts?.filter((a) => a.quiz_id === quiz.quiz_id) ?? [];
  const bestAttempt = myAttempts.sort((a, b) => b.percentage - a.percentage)[0];
  const breakdown = getDifficultyBreakdown(quiz);

  const handleStart = () => {
    startQuiz(quiz.quiz_id);
    navigate({ to: "/quiz/$quizId", params: { quizId: quiz.quiz_id } });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card
        className="group relative overflow-hidden border-border bg-card hover:border-primary/40 transition-all duration-300 hover:shadow-lg cursor-pointer"
        onClick={handleStart}
        data-ocid={`quiz.card.${index + 1}`}
      >
        {/* Top accent bar */}
        <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary/60" />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {quiz.quiz_title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                UPSC · World History · 7 Topics
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" />
              {quiz.questions.length} questions
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />~
              {Math.ceil((quiz.questions.length * 5) / 60)} min
            </span>
            {bestAttempt && (
              <span className="flex items-center gap-1.5 text-primary font-medium">
                <Star className="w-3.5 h-3.5 fill-current" />
                Best: {bestAttempt.percentage}%
              </span>
            )}
          </div>

          {/* Difficulty badges */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {Object.entries(breakdown).map(([diff, count]) => (
              <span
                key={diff}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                  DIFFICULTY_COLORS[diff as keyof typeof DIFFICULTY_COLORS] ??
                  "bg-muted text-muted-foreground"
                }`}
              >
                {diff} · {count}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {myAttempts.length > 0
                ? `${myAttempts.length} attempt${myAttempts.length > 1 ? "s" : ""}`
                : "Not attempted yet"}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-primary/40 text-primary hover:bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              data-ocid={`quiz.start_button.${index + 1}`}
            >
              {myAttempts.length > 0 ? "Retake" : "Start Quiz"}
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default function QuizSelectionPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero banner */}
      <div className="relative bg-card border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/10" />
        <div className="relative max-w-4xl mx-auto px-4 py-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="secondary"
              className="mb-4 bg-primary/10 text-primary border-primary/20"
            >
              🎯 UPSC Exam Preparation
            </Badge>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Comprehensive World History &amp; Civilizations
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Master 105 UPSC History questions across 7 topics — Paths to
              Modernisation, Mesopotamia, Roman Empire, Feudalism, Mongol
              Empires, and more. All in one comprehensive quiz.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center gap-8 mt-8"
          >
            {[
              { label: "Quiz", value: QUIZZES.length },
              {
                label: "Questions",
                value: QUIZZES.reduce((s, q) => s + q.questions.length, 0),
              },
              { label: "Topics", value: "7 Chapters" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-primary font-display">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Motivational quote */}
      <div className="bg-muted/30 border-b border-border py-3 px-4">
        <p className="text-center text-sm text-muted-foreground italic">
          “Success is not final, failure is not fatal: it is the courage to
          continue that counts.” — Winston Churchill
        </p>
      </div>

      {/* Quiz grid */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2
          className="text-xl font-display font-semibold text-foreground mb-6"
          data-ocid="quiz.selection_section"
        >
          Available Quizzes
        </h2>
        <div className="grid gap-5 max-w-2xl mx-auto">
          {QUIZZES.map((quiz, i) => (
            <QuizCard key={quiz.quiz_id} quiz={quiz} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
