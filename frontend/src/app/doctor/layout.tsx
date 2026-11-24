import type { ReactNode } from "react";
import { DoctorGate } from "@/components/doctor-gate";

export default function DoctorLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f7f9ff]">
      <DoctorGate>{children}</DoctorGate>
    </div>
  );
}