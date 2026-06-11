import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QUIZZES } from "@/data/quizzes";
import { useGetLeaderboard, useGetMyAttempts } from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import { useQuizStore } from "@/store/useQuizStore";
import { useNavigate } from "@tanstack/react-router";
import { ChevronRight, Clock, Medal, Target, Trophy } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}m ${sec}s`;
}

function getRankBadge(rank: number) {
  if (rank === 1) return "text-yellow-500";
  if (rank === 2) return "text-foreground/60";
  if (rank === 3) return "text-amber-600";
  return "text-muted-foreground";
}

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const [selectedQuiz, setSelectedQuiz] = useState(QUIZZES[0].quiz_id);
  const { data: leaderboard = [], isLoading } = useGetLeaderboard(selectedQuiz);
  const { data: myAttempts = [] } = useGetMyAttempts();
  const { startQuiz } = useQuizStore();

  const myBestAttempts = QUIZZES.map((quiz) => {
    const attempts = myAttempts.filter((a) => a.quiz_id === quiz.quiz_id);
    const best = attempts.sort((a, b) => b.percentage - a.percentage)[0];
    return { quiz, best };
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <Trophy className="w-10 h-10 text-primary mx-auto mb-3" />
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Leaderboard
          </h1>
          <p className="text-muted-foreground">Top scores across all quizzes</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Tabs defaultValue="leaderboard" data-ocid="leaderboard.tabs">
          <TabsList className="mb-6">
            <TabsTrigger value="leaderboard" data-ocid="leaderboard.global_tab">
              Global Rankings
            </TabsTrigger>
            <TabsTrigger
              value="my-scores"
              data-ocid="leaderboard.my_scores_tab"
            >
              My Scores
            </TabsTrigger>
          </TabsList>

          {/* Global leaderboard tab */}
          <TabsContent value="leaderboard">
            {/* Quiz selector */}
            <div
              className="flex flex-wrap gap-2 mb-6"
              data-ocid="leaderboard.quiz_filter"
            >
              {QUIZZES.map((quiz) => (
                <button
                  key={quiz.quiz_id}
                  type="button"
                  onClick={() => setSelectedQuiz(quiz.quiz_id)}
                  data-ocid={`leaderboard.quiz_tab.${quiz.quiz_id}`}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors",
                    selectedQuiz === quiz.quiz_id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  {quiz.quiz_title}
                </button>
              ))}
            </div>

            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Medal className="w-4 h-4 text-primary" />
                  Top Scores —{" "}
                  {QUIZZES.find((q) => q.quiz_id === selectedQuiz)?.quiz_title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div
                    className="space-y-3"
                    data-ocid="leaderboard.loading_state"
                  >
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-14 rounded-xl bg-muted animate-pulse"
                      />
                    ))}
                  </div>
                ) : leaderboard.length === 0 ? (
                  <div
                    className="text-center py-10 text-muted-foreground"
                    data-ocid="leaderboard.empty_state"
                  >
                    <Trophy className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p>No scores yet. Be the first!</p>
                  </div>
                ) : (
                  <div
                    className="space-y-2"
                    data-ocid="leaderboard.entries_list"
                  >
                    {leaderboard.map((entry, i) => (
                      <motion.div
                        key={`entry-${entry.rank}`}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="flex items-center gap-4 p-3 rounded-xl border border-border bg-background hover:bg-muted/30 transition-colors"
                        data-ocid={`leaderboard.entry.${i + 1}`}
                      >
                        <span
                          className={cn(
                            "text-lg font-bold w-8 text-center",
                            getRankBadge(entry.rank),
                          )}
                        >
                          {entry.rank === 1
                            ? "🥇"
                            : entry.rank === 2
                              ? "🥈"
                              : entry.rank === 3
                                ? "🥉"
                                : `#${entry.rank}`}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">
                              {entry.score}/{entry.total} correct
                            </span>
                            <Badge
                              variant="secondary"
                              className="text-xs bg-primary/10 text-primary border-0"
                            >
                              {entry.percentage}%
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                          <Clock className="w-3 h-3" />
                          {formatTime(entry.time_taken_seconds)}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* My scores tab */}
          <TabsContent value="my-scores">
            <div className="space-y-4">
              {myBestAttempts.map(({ quiz, best }, i) => (
                <motion.div
                  key={quiz.quiz_id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card
                    className="border-border bg-card hover:border-primary/30 transition-colors"
                    data-ocid={`leaderboard.my_score_card.${i + 1}`}
                  >
                    <CardContent className="pt-5 pb-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground mb-2">
                            {quiz.quiz_title}
                          </h3>
                          {best ? (
                            <div className="flex items-center gap-4 text-sm">
                              <span className="flex items-center gap-1 text-primary font-medium">
                                <Target className="w-3.5 h-3.5" />
                                {best.percentage}%
                              </span>
                              <span className="text-muted-foreground">
                                {best.score}/{best.total} correct
                              </span>
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="w-3.5 h-3.5" />
                                {formatTime(best.time_taken_seconds)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              Not attempted yet
                            </span>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            startQuiz(quiz.quiz_id);
                            navigate({
                              to: "/quiz/$quizId",
                              params: { quizId: quiz.quiz_id },
                            });
                          }}
                          data-ocid={`leaderboard.start_quiz_button.${i + 1}`}
                          className="shrink-0 gap-1.5 border-primary/40 text-primary hover:bg-primary/10"
                        >
                          {best ? "Retake" : "Start"}
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
