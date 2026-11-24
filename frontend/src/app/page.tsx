
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatedDoctorHero } from "@/components/animated-doctor-hero";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  HeartPulse,
  Menu,
  ShieldCheck,
  Smile,
  Sparkles,
  LockKeyhole,
} from "lucide-react";

import { Button } from "@heroui/react";

const services = [
  {
    name: "General Dentistry",
    description: "Comprehensive care for everyday dental health.",
    icon: HeartPulse,
  },
  {
    name: "Teeth Cleaning",
    description: "Professional cleaning for a healthy smile.",
    icon: Sparkles,
  },
  {
    name: "Dental Consultation",
    description: "Discuss your dental needs with our clinic.",
    icon: Smile,
  },
];

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white text-slate-900">

      {/* Hero */}
      <section className="overflow-hidden bg-[#f7f9ff]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-14 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-blue-700">
              <CheckCircle2 size={17} />
              Welcome to DentalCare
            </span>

            
          <h1 className="mt-7 text-5xl font-extrabold leading-[1.12] tracking-tight text-[#15224D] sm:text-6xl">
            We Create
            <span className="mt-3 block">
              <span className="text-[#175DFA]">
                Beautiful
              </span>{" "}
              Smiley Faces
            </span>
          </h1>

            <p className="mt-7 max-w-lg text-lg leading-8 text-slate-600">
              Explore dental care in a welcoming environment.
              Choose a service, view available times, and book
              your next appointment online.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Button
                variant="primary"
                size="lg"
                className="rounded-full bg-blue-600 px-8 text-white"
                onPress={() => router.push("/book")}
              >
                Book Appointment
                <ArrowRight size={18} />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-blue-300 px-8"
                onPress={() => {
                  document
                    .getElementById("services")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Explore Services
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-600">
              <span className="flex items-center gap-2">
                <CalendarDays size={19} className="text-blue-600" />
                Online Booking
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck size={19} className="text-blue-600" />
                Convenient Care
              </span>
            </div>
          </div>

          {/* Transparent doctor cutouts, layered shapes, and fade animation */}
          <AnimatedDoctorHero />
        </div>
      </section>

      {/* Services */}
      <section
        id="services"
        className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24"
      >
        <div className="mb-12 text-center">
          <p className="font-semibold uppercase tracking-widest text-blue-600">
            Our Services
          </p>
          <h2 className="mt-3 text-4xl font-bold">
            Dental Care for Every Smile
          </h2>
          <p className="mt-4 text-slate-600">
            Explore the treatments available at our clinic.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <article
                key={service.name}
                className="rounded-3xl border border-blue-100 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Icon size={31} />
                </div>
                <h3 className="text-xl font-bold">
                  {service.name}
                </h3>
                <p className="mt-4 leading-7 text-slate-600">
                  {service.description}
                </p>
                <Link
                  href="/book"
                  className="mt-7 inline-flex items-center gap-2 font-semibold text-blue-600"
                >
                  Book Now <ArrowRight size={17} />
                </Link>
              </article>
            );
          })}
        </div>
        <p className="mt-5 text-center text-xs text-slate-400">
          These are temporary service previews.
          Actual services will come from our backend API.
        </p>
      </section>

      {/* About */}
      <section id="about" className="scroll-mt-24 bg-blue-50 py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
          <div>
            <p className="font-semibold uppercase tracking-widest text-blue-600">
              About Our Clinic
            </p>
            <h2 className="mt-4 text-4xl font-bold leading-tight">
              A better dental experience begins here.
            </h2>
            <p className="mt-6 leading-8 text-slate-600">
              DentalCare helps patients explore dental
              treatments, check appointment availability,
              and arrange visits through a simple online
              booking experience.
            </p>
          </div>

          <div className="space-y-5">
            {[
              "Convenient appointment scheduling",
              "Available time slots",
              "Email booking confirmations",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm"
              >
                <CheckCircle2
                  className="shrink-0 text-blue-600"
                  size={24}
                />
                <span className="font-semibold">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section
        id="booking"
        className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24"
      >
        <div className="rounded-[36px] bg-blue-600 px-8 py-16 text-center text-white">
          <Clock3 size={42} className="mx-auto" />

          <h2 className="mx-auto mt-6 max-w-2xl text-4xl font-bold">
            Ready to Book Your Dental Appointment?
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-blue-100">
            Choose your dental service, select a date,
            and view the available appointment times.
          </p>

          <div className="mt-8">
            <Button
              variant="secondary"
              size="lg"
              className="rounded-full bg-white px-8 text-blue-700"
              onPress={() => router.push("/book")}
            >
              Book Your Visit
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </section>

      
<footer className="border-t border-slate-200 bg-slate-50 px-6 py-8">
  <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">

    {/* Copyright and website information */}
        
    <div className="w-full text-center">
      <p className="text-sm text-[#75777c] sm:text-base">
        © {new Date().getFullYear()} Dental Care — Dental Clinic Book Your Appointments
      </p>
    </div>

    {/* Doctor Login */}
    <Link
      href="/doctor/login"
      className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-sm font-medium text-[#75777c] transition-colors hover:text-blue-600"
    >
      <LockKeyhole size={15} />
      Doctor Login
      <ArrowRight size={15} />
    </Link>

  </div>
</footer>

    </main>
  );
}
