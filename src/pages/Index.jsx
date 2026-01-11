import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ExpertSection from "@/components/ExpertSection";
import Footer from "@/components/Footer";

export default function Index() {
  return (
    <div className="min-h-screen bg-background flex w-full">
      <Sidebar />
      
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
        <div className="max-w-6xl mx-auto pt-12 lg:pt-0">
          <Header />
          <HeroSection />
          <ExpertSection />
          <Footer />
        </div>
      </main>
    </div>
  );
}
