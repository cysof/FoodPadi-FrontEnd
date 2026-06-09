import { Footer, Navbar } from "@/components";
import { Header, HowItWorks } from "@/features/home";

export default function Home() {
  return (
    <div className="relative flex flex-col bg-white">
      <Navbar />
      <Header />
      <HowItWorks />
      <Footer />
    </div>
  );
}