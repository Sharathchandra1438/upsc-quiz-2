import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getQuizById } from "@/data/quizzes";
import { cn } from "@/lib/utils";
import { useQuizStore } from "@/store/useQuizStore";
import { useNavigate, useParams } from "@tanstack/react-router";
import { BookOpen, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef } from "react";

const DIFFICULTY_BADGE: Record<string, string> = {
  Easy: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  Medium:
    "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Hard: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/20",
  "Very Hard":
    "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20",
};

const OPTION_LETTERS = ["A", "B", "C", "D"];

/** Countdown timer for each question (5 min = 300s). */
function useQuestionTimer(_questionIndex: number, onExpire: () => void) {
  const LIMIT = 300;
  const endRef = useRef<number>(Date.now() + LIMIT * 1000);
  const rafRef = useRef<number>(0);
  const displayRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    endRef.current = Date.now() + LIMIT * 1000;
    const tick = () => {
      const remaining = Math.max(
        0,
        Math.ceil((endRef.current - Date.now()) / 1000),
      );
      if (displayRef.current) {
        const m = Math.floor(remaining / 60);
        const s = remaining % 60;
        displayRef.current.textContent = `${m}:${s.toString().padStart(2, "0")}`;
        displayRef.current.classList.toggle("text-rose-500", remaining <= 30);
        displayRef.current.classList.toggle(
          "text-amber-500",
          remaining > 30 && remaining <= 60,
        );
      }
      if (remaining === 0) {
        onExpire();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [onExpire]);

  return displayRef;
}

export default function QuizPage() {
  const { quizId } = useParams({ from: "/quiz/$quizId" });
  const navigate = useNavigate();

  const {
    currentQuizId,
    currentQuestionIndex,
    answers,
    isComplete,
    startQuiz,
    selectAnswer,
    nextQuestion,
    prevQuestion,
    completeQuiz,
    getCurrentQuestion,
    getProgress,
    isAnswered,
  } = useQuizStore();

  // Start or resume quiz
  useEffect(() => {
    if (!currentQuizId || currentQuizId !== quizId) {
      startQuiz(quizId);
    }
  }, [quizId, currentQuizId, startQuiz]);

  // Navigate to results when complete
  useEffect(() => {
    if (isComplete) {
      navigate({ to: "/quiz/$quizId/results", params: { quizId } });
    }
  }, [isComplete, navigate, quizId]);

  const quiz = getQuizById(quizId);
  const question = getCurrentQuestion();
  const progress = getProgress();

  const handleExpire = useCallback(() => {
    const quiz = getQuizById(quizId);
    if (!quiz) return;
    if (currentQuestionIndex >= quiz.questions.length - 1) {
      completeQuiz();
    } else {
      nextQuestion();
    }
  }, [quizId, currentQuestionIndex, completeQuiz, nextQuestion]);

  const timerRef = useQuestionTimer(currentQuestionIndex, handleExpire);

  if (!quiz || !question) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Loading quiz...</p>
      </div>
    );
  }

  const selectedAnswer = answers[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  const handleOptionClick = (option: string) => {
    selectAnswer(currentQuestionIndex, option);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      completeQuiz();
    } else {
      nextQuestion();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar + timer */}
      <div className="sticky top-[56px] z-40 bg-card border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
          <span className="text-sm font-medium text-muted-foreground shrink-0">
            Question {currentQuestionIndex + 1} / {quiz.questions.length}
          </span>
          <Progress
            value={progress}
            className="h-2 flex-1"
            data-ocid="quiz.progress_bar"
          />
          <div
            className="flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-lg bg-muted/60 border border-border"
            data-ocid="quiz.timer"
          >
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <span
              ref={timerRef}
              className="text-sm font-mono font-semibold text-foreground tabular-nums"
            >
              5:00
            </span>
          </div>
        </div>
      </div>

      {/* Question card */}
      <div className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              {/* Question */}
              <div
                className="bg-card rounded-2xl border border-border p-6 md:p-8 mb-4 shadow-sm"
                data-ocid="quiz.question_card"
              >
                <div className="flex items-start gap-3 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <BookOpen className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Badge
                      variant="outline"
                      className={cn(
                        "mb-3 text-xs border",
                        DIFFICULTY_BADGE[question.difficulty],
                      )}
                      data-ocid="quiz.difficulty_badge"
                    >
                      {question.difficulty}
                    </Badge>
                    <p
                      className="text-lg font-semibold text-foreground leading-relaxed"
                      data-ocid="quiz.question_text"
                    >
                      {question.question}
                    </p>
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-3" data-ocid="quiz.options_list">
                  {question.options.map((option, i) => {
                    const letter = OPTION_LETTERS[i];
                    const isSelected = selectedAnswer === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleOptionClick(option)}
                        data-ocid={`quiz.option.${i + 1}`}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all duration-200",
                          "hover:border-primary/50 hover:bg-primary/5",
                          isSelected
                            ? "border-primary bg-primary/10 shadow-sm"
                            : "border-border bg-background",
                        )}
                      >
                        <span
                          className={cn(
                            "w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition-colors",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          {letter}
                        </span>
                        <span
                          className={cn(
                            "text-sm font-medium",
                            isSelected
                              ? "text-foreground"
                              : "text-muted-foreground",
                          )}
                        >
                          {option}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => prevQuestion()}
                  disabled={currentQuestionIndex === 0}
                  data-ocid="quiz.prev_button"
                  className="gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </Button>

                <span className="text-xs text-muted-foreground">
                  {Object.keys(answers).length}/{quiz.questions.length} answered
                </span>

                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!isAnswered(currentQuestionIndex)}
                  data-ocid={
                    isLastQuestion ? "quiz.submit_button" : "quiz.next_button"
                  }
                  className="gap-1.5"
                >
                  {isLastQuestion ? "Submit Quiz" : "Next"}
                  {!isLastQuestion && <ChevronRight className="w-4 h-4" />}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
