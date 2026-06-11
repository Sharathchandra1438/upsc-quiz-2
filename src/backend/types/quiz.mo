// Quiz domain types for UPSC Quiz platform.
module {
  // A recorded attempt at a quiz by an anonymous user (Principal).
  public type QuizAttempt = {
    id : Nat;
    quiz_id : Text;
    user : Principal;
    score : Nat;
    total : Nat;
    percentage : Float;
    time_taken_seconds : Nat;
    // [(difficulty_label, correct_count, total_for_difficulty)]
    correct_by_difficulty : [(Text, Nat, Nat)];
    completed_at : Int; // nanoseconds (Time.now())
  };

  // Input type for saving a new quiz attempt (caller is resolved server-side).
  public type QuizAttemptInput = {
    quiz_id : Text;
    score : Nat;
    total : Nat;
    percentage : Float;
    time_taken_seconds : Nat;
    correct_by_difficulty : [(Text, Nat, Nat)];
  };
};
