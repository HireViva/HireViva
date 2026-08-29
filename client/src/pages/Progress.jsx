import Sidebar from '@/components/Sidebar';
import ProgressDashboard from '@/components/progress/ProgressDashboard';

const Progress = () => (
  <div className="min-h-screen bg-background flex w-full">
    <Sidebar />

    <main className="relative flex-1 p-4 sm:p-6 lg:p-8 lg:ml-64 overflow-x-hidden bg-background">
      <div className="relative max-w-6xl mx-auto pt-12 lg:pt-0">
        <ProgressDashboard />
      </div>
    </main>
  </div>
);

export default Progress;
