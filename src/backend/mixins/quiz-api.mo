import List "mo:core/List";
import QuizTypes "../types/quiz";
import QuizLib "../lib/quiz";
import Time "mo:core/Time";

// Public API mixin for quiz attempt storage and retrieval.
mixin (
  attempts : List.List<QuizTypes.QuizAttempt>,
  nextAttemptId : { var value : Nat },
) {
  // Save a completed quiz attempt. Returns the new attempt id.
  public shared ({ caller }) func saveQuizAttempt(
    attempt : QuizTypes.QuizAttemptInput
  ) : async Nat {
    let id = nextAttemptId.value;
    nextAttemptId.value += 1;
    let newAttempt : QuizTypes.QuizAttempt = {
      id;
      quiz_id              = attempt.quiz_id;
      user                 = caller;
      score                = attempt.score;
      total                = attempt.total;
      percentage           = attempt.percentage;
      time_taken_seconds   = attempt.time_taken_seconds;
      correct_by_difficulty = attempt.correct_by_difficulty;
      completed_at         = Time.now();
    };
    attempts.add(newAttempt);
    id;
  };

  // Retrieve all past attempts made by the calling user.
  public shared query ({ caller }) func getMyAttempts() : async [QuizTypes.QuizAttempt] {
    let mine = attempts.filter(func(a : QuizTypes.QuizAttempt) : Bool {
      a.user == caller
    });
    mine.toArray();
  };

  // Return the top `limit` attempts for the given quiz, ranked by percentage descending.
  public query func getLeaderboard(quiz_id : Text, limit : Nat) : async [QuizTypes.QuizAttempt] {
    QuizLib.topByPercentage(attempts, quiz_id, limit);
  };
};
