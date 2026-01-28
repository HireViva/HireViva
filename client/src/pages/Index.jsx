import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ExpertSection from "@/components/ExpertSection";
import Footer from "@/components/Footer";

export default function Index() {
  return (
    <div className="min-h-screen bg-background flex w-full">
      <Sidebar />

      <main className="relative flex-1 p-4 sm:p-6 lg:p-8 lg:ml-64 overflow-x-hidden bg-background">
        {/* Global background glow (keeps sections seamless) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px]">
            <div className="glow-orb w-full h-full bg-purple-glow/30" />
          </div>
          <div className="absolute right-[8%] top-[45%] w-[520px] h-[520px]">
            <div className="glow-orb w-full h-full bg-cyan-accent/20" style={{ animationDelay: "2s" }} />
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto pt-12 lg:pt-0">
          <Header />
          <HeroSection />
          <ExpertSection />
          <Footer />
        </div>
      </main>
    </div>
  );
}
