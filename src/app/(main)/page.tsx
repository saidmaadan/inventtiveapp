import { MainNav } from "@/components/main-nav"
import { HeroSection } from "@/components/hero-section"
import { ContentDemo } from "@/components/content-demo"
import { SiteFooter } from "@/components/site-footer"
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        <HeroSection />
        <ContentDemo />
      </main>
      <SiteFooter />
      
    </div>
  );
}
