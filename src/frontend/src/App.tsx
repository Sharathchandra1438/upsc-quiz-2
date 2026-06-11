import { AppLayout } from "@/components/layout/AppLayout";
import { PageLoader } from "@/components/shared/LoadingSpinner";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { Component, Suspense, lazy } from "react";

// Lazy page imports
const QuizSelectionPage = lazy(() => import("@/pages/QuizSelectionPage"));
const QuizPage = lazy(() => import("@/pages/QuizPage"));
const ResultsPage = lazy(() => import("@/pages/ResultsPage"));
const LeaderboardPage = lazy(() => import("@/pages/LeaderboardPage"));

// ── Error Boundary ──────────────────────────────────────────────────────────
interface EBState {
  hasError: boolean;
  message: string;
}
class ErrorBoundary extends Component<{ children: React.ReactNode }, EBState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: "" };
  }
  static getDerivedStateFromError(err: unknown): EBState {
    const message = err instanceof Error ? err.message : String(err);
    return { hasError: true, message };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
            <span className="text-rose-400 text-xl">!</span>
          </div>
          <h2 className="text-lg font-semibold text-foreground">
            Something went wrong
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            {this.state.message || "An unexpected error occurred."}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, message: "" })}
            className="mt-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function wrap(Page: React.ComponentType) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Page />
      </Suspense>
    </ErrorBoundary>
  );
}

const rootRoute = createRootRoute({
  component: AppLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/quizzes" });
  },
});

const quizzesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/quizzes",
  component: () => wrap(QuizSelectionPage),
});

const quizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/quiz/$quizId",
  component: () => wrap(QuizPage),
});

const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/quiz/$quizId/results",
  component: () => wrap(ResultsPage),
});

const leaderboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/leaderboard",
  component: () => wrap(LeaderboardPage),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  quizzesRoute,
  quizRoute,
  resultsRoute,
  leaderboardRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
