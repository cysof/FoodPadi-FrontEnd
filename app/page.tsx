import { Footer, Navbar } from "@/components";
import { Header, HowItWorks, JoinTheWaitList } from "@/features/home";

export default function Home() {
  return (
    <div className={`relative pt-27 bg-white`}>
      <Navbar />
      <Header />
      <HowItWorks />
      <JoinTheWaitList />
      <Footer />
    </div>
  );
}
