import List "mo:core/List";
import QuizTypes "types/quiz";
import QuizApi "mixins/quiz-api";
import Migration "migration";

// Composition root — no public methods here, only state wiring and mixin inclusion.
(with migration = Migration.run)
actor {
  // ── Stable state ──────────────────────────────────────────────────────────
  let attempts      = List.empty<QuizTypes.QuizAttempt>();
  let nextAttemptId = { var value : Nat = 0 };

  // ── Mixin composition ─────────────────────────────────────────────────────
  include QuizApi(attempts, nextAttemptId);
};
