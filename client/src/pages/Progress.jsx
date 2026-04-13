import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Bot, Brain, CheckCircle2, Gauge, LineChart, Loader2 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import api from "../api";
import { progressService } from "../services/progressService";
import { questions } from "../components/dsa-tracker/data";
import {
  AccuracyMeter,
  BarMetricChart,
  DashboardCard,
  Insight,
  LineTrendChart,
  MetricBlock,
  TrendBadge,
} from "../components/progress/AnalyticsCharts";
import {
  buildAccuracyAnalytics,
  buildCodingAnalytics,
  buildInterviewAnalytics,
  buildOverallTrend,
  buildSubjectAnalytics,
  calculateAverageScore,
  calculateImprovement,
  normalizeInterviewAttempts,
  normalizeQuizAttempts,
} from "../lib/progressAnalytics";

const emptyDashboard = {
  codingProgress: null,
  coreHistory: null,
  coreStats: null,
  aptitudeHistory: null,
  aptitudeStats: null,
  interviewHistory: null,
};

const getSettledData = (result) => (result.status === "fulfilled" ? result.value : null);

export default function Progress() {
  const [dashboardData, setDashboardData] = useState(emptyDashboard);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchProgressData = async () => {
      setLoading(true);
      setLoadError("");

      const results = await Promise.allSettled([
        progressService.getProgress(),
        api.get("/quiz/history?limit=100"),
        api.get("/quiz/stats"),
        api.get("/aptitude-quiz/history?limit=100"),
        api.get("/aptitude-quiz/stats"),
        api.get("/interview/history"),
      ]);

      if (!mounted) return;

      const [codingProgress, coreHistory, coreStats, aptitudeHistory, aptitudeStats, interviewHistory] =
        results.map(getSettledData);

      if (!codingProgress && !coreHistory && !aptitudeHistory && !interviewHistory) {
        setLoadError("We could not load progress data right now.");
      }

      setDashboardData({
        codingProgress,
        coreHistory: coreHistory?.data || null,
        coreStats: coreStats?.data || null,
        aptitudeHistory: aptitudeHistory?.data || null,
        aptitudeStats: aptitudeStats?.data || null,
        interviewHistory: interviewHistory?.data || null,
      });
      setLoading(false);
    };

    fetchProgressData();

    return () => {
      mounted = false;
    };
  }, []);

  const analytics = useMemo(() => {
    const coding = buildCodingAnalytics(dashboardData.codingProgress?.progress, questions);
    const coreAttempts = normalizeQuizAttempts(dashboardData.coreHistory, "Core Subjects");
    const aptitudeAttempts = normalizeQuizAttempts(dashboardData.aptitudeHistory, "Aptitude");
    const interviewAttempts = normalizeInterviewAttempts(dashboardData.interviewHistory);
    const scoredAttempts = [...coreAttempts, ...aptitudeAttempts, ...interviewAttempts];
    const weeklyImprovement = calculateImprovement(scoredAttempts);

    return {
      coding,
      core: buildSubjectAnalytics(coreAttempts, dashboardData.coreStats?.byTestSet),
      aptitude: buildAccuracyAnalytics(aptitudeAttempts, dashboardData.aptitudeStats?.stats),
      interview: buildInterviewAnalytics(interviewAttempts),
      overall: {
        trend: buildOverallTrend(scoredAttempts, coding.successRate),
        averageScore: calculateAverageScore(scoredAttempts, coding.successRate),
        totalAttempts:
          coreAttempts.length + aptitudeAttempts.length + interviewAttempts.length + coding.totalSolved,
        weeklyImprovement,
      },
    };
  }, [dashboardData]);

  return (
    <div className="min-h-screen bg-background flex w-full">
      <Sidebar />
      <main className="relative flex-1 overflow-auto p-4 sm:p-6 lg:ml-64 lg:p-8">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--secondary)/0.14),transparent_34%),linear-gradient(135deg,hsl(var(--primary)/0.06),transparent_42%)]" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <header className="mb-8">
            <motion.p
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary"
            >
              Performance Analytics
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-4xl font-bold text-foreground md:text-5xl"
            >
              Progress Dashboard
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-3 max-w-3xl text-base text-muted-foreground"
            >
              Track interview practice, coding momentum, core subject readiness, and aptitude accuracy in one place.
            </motion.p>
          </header>

          {loading ? (
            <div className="flex min-h-[420px] items-center justify-center rounded-lg border border-border/50 bg-card/50">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Loader2 className="animate-spin text-primary" size={22} />
                Loading your analytics...
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {loadError && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                  {loadError}
                </div>
              )}

              <DashboardCard
                title="Overall Progress"
                subtitle="Score trend across completed activities"
                icon={LineChart}
              >
                <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <MetricBlock label="Average Score" value={`${analytics.overall.averageScore}%`} helper="Across scored activity" />
                  <MetricBlock label="Total Attempts" value={analytics.overall.totalAttempts} helper="Tests, interviews, solved items" />
                  <MetricBlock label="Weekly Improvement" value={`${analytics.overall.weeklyImprovement}%`} helper="Recent vs previous window" />
                  <div className="flex items-end">
                    <TrendBadge value={analytics.overall.weeklyImprovement} />
                  </div>
                </div>
                <LineTrendChart data={analytics.overall.trend} gradientId="overallProgressGradient" />
              </DashboardCard>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <DashboardCard
                  title="AI Interview"
                  subtitle="Interview performance trend"
                  icon={Bot}
                  delay={0.05}
                >
                  <div className="mb-5 grid grid-cols-2 gap-5">
                    <MetricBlock label="Total Interviews" value={analytics.interview.totalInterviews} />
                    <MetricBlock label="Avg Score" value={`${analytics.interview.avgScore}%`} />
                  </div>
                  <LineTrendChart
                    data={analytics.interview.trend}
                    height={230}
                    gradientId="interviewTrendGradient"
                  />
                  <Insight>{analytics.interview.insight}</Insight>
                </DashboardCard>

                <DashboardCard
                  title="Coding Sheet"
                  subtitle="Solved problems by difficulty"
                  icon={CheckCircle2}
                  delay={0.1}
                >
                  <div className="mb-5 grid grid-cols-2 gap-5">
                    <MetricBlock
                      label="Total Solved"
                      value={`${analytics.coding.totalSolved}/${analytics.coding.totalQuestions}`}
                    />
                    <MetricBlock label="Success Rate" value={`${analytics.coding.successRate}%`} />
                  </div>
                  <BarMetricChart
                    data={analytics.coding.byDifficulty}
                    dataKey="solved"
                    formatter={(value) => `${value} solved`}
                  />
                  <Insight>{analytics.coding.insight}</Insight>
                </DashboardCard>

                <DashboardCard
                  title="Core Subjects"
                  subtitle="Subject-wise mock test performance"
                  icon={Brain}
                  delay={0.15}
                >
                  <div className="mb-5 grid grid-cols-2 gap-5">
                    <MetricBlock label="Strongest" value={analytics.core.strongest?.label || "No data"} />
                    <MetricBlock label="Weakest" value={analytics.core.weakest?.label || "No data"} />
                  </div>
                  <BarMetricChart
                    data={analytics.core.subjects}
                    dataKey="score"
                    formatter={(value) => `${value}%`}
                  />
                  <Insight>{analytics.core.insight}</Insight>
                </DashboardCard>

                <DashboardCard
                  title="Aptitude"
                  subtitle="Accuracy and attempt consistency"
                  icon={Gauge}
                  delay={0.2}
                >
                  <div className="mb-6 grid grid-cols-2 gap-5">
                    <MetricBlock label="Total Attempts" value={analytics.aptitude.totalAttempts} />
                    <MetricBlock label="Improvement" value={`${analytics.aptitude.improvement}%`} />
                  </div>
                  <AccuracyMeter value={analytics.aptitude.accuracy} />
                  <Insight>{analytics.aptitude.insight}</Insight>
                </DashboardCard>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
