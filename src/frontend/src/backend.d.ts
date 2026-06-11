import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface QuizAttempt {
    id: bigint;
    total: bigint;
    user: Principal;
    time_taken_seconds: bigint;
    correct_by_difficulty: Array<[string, bigint, bigint]>;
    score: bigint;
    completed_at: bigint;
    quiz_id: string;
    percentage: number;
}
export interface QuizAttemptInput {
    total: bigint;
    time_taken_seconds: bigint;
    correct_by_difficulty: Array<[string, bigint, bigint]>;
    score: bigint;
    quiz_id: string;
    percentage: number;
}
export interface backendInterface {
    getLeaderboard(quiz_id: string, limit: bigint): Promise<Array<QuizAttempt>>;
    getMyAttempts(): Promise<Array<QuizAttempt>>;
    saveQuizAttempt(attempt: QuizAttemptInput): Promise<bigint>;
}
