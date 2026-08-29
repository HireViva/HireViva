import { DSATracker } from "@/components/dsa-tracker/DSATracker";
import Sidebar from "@/components/Sidebar";

const CodingSheet = () => {
  return (
    <div className="min-h-screen bg-background flex w-full">
      <Sidebar />
      <main className="relative flex-1 p-4 sm:p-6 lg:p-8 lg:ml-64 overflow-x-hidden bg-background">
        <DSATracker />
      </main>
    </div>
  );
};

export default CodingSheet;
