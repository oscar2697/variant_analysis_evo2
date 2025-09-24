'use client'

import Header from "~/components/Header";
import SelectHeader from "~/components/SelectHeader";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#e9eeea]">
      <Header />
      <SelectHeader />
    </div>
  );
}
