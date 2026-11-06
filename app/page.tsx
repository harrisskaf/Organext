import { Company } from "@/components/company";
import { Contact } from "@/components/contact";
import { Hero } from "@/components/hero";
import { Process } from "@/components/process";
import { Services } from "@/components/services";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <Process />
      <Company />
      <Contact />
    </>
  );
}
