import List "mo:core/List";
import QuizTypes "types/quiz";

// Migration: UPSC Quiz backend → UPSC Quiz backend (stable field carry-over).
// The currently deployed canister has: attempts, nextAttemptId.
// OldActor must exactly match the deployed stable signature to prevent M0169.
module {
  // ── Old and New actor field types ────────────────────────────────────────
  // OldActor mirrors the previously deployed actor's stable fields.

  public type OldActor = {
    attempts : List.List<QuizTypes.QuizAttempt>;
    nextAttemptId : { var value : Nat };
  };

  public type NewActor = {
    attempts : List.List<QuizTypes.QuizAttempt>;
    nextAttemptId : { var value : Nat };
  };

  // Carry existing quiz attempts and attempt counter forward.
  public func run(old : OldActor) : NewActor {
    {
      attempts      = old.attempts;
      nextAttemptId = old.nextAttemptId;
    };
  };
};
