import List "mo:core/List";
import Types "../types/quiz";
import Array "mo:core/Array";

// Pure domain logic for quiz attempts (no IO, no state — state injected via callers).
module {
  // Sort a list of attempts by percentage descending and return the top `limit` entries.
  public func topByPercentage(
    attempts : List.List<Types.QuizAttempt>,
    quiz_id : Text,
    limit : Nat,
  ) : [Types.QuizAttempt] {
    // Filter to the requested quiz, then sort descending by percentage
    let filtered = attempts.filter(func(a : Types.QuizAttempt) : Bool {
      a.quiz_id == quiz_id
    });
    let arr = filtered.toArray();
    // Insertion sort (list is typically small — exam leaderboard)
    let sorted = arr.sort(
      func(a, b) {
        if (a.percentage > b.percentage) #less
        else if (a.percentage < b.percentage) #greater
        else #equal
      },
    );
    // Take at most `limit` entries
    let takeN = if (limit < sorted.size()) limit else sorted.size();
    Array.tabulate<Types.QuizAttempt>(takeN, func i = sorted[i]);
  };
};
