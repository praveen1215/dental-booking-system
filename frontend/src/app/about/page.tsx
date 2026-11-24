
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Heart,
  HeartHandshake,
  ShieldCheck,
  Smile,
  Stethoscope,
  Users,
} from "lucide-react";

import { Button } from "@heroui/react";

const values = [
  {
    title: "Patient-Centered Care",
    description:
      "We believe dental visits should be comfortable, informative, and focused on each patient's needs.",
    icon: HeartHandshake,
  },
  {
    title: "Healthy Smiles",
    description:
      "We encourage preventive dental care, regular checkups, and good oral hygiene habits.",
    icon: Smile,
  },
  {
    title: "Easy Appointments",
    description:
      "Our online booking system helps patients explore available appointments and arrange a visit.",
    icon: CalendarDays,
  },
];

export default function AboutPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white text-slate-900">


      {/* ABOUT HERO */}
      <section className="relative overflow-hidden bg-[#f7f9ff]">
        <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-cyan-100 opacity-80" />
        <div className="absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-blue-100 opacity-70" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-blue-600 shadow-sm">
              <Heart size={17} />
              Get to Know DentalCare
            </div>

            <h1 className="text-5xl font-extrabold leading-[1.13] tracking-tight text-[#15224D] sm:text-6xl">
              About Our
              <span className="mt-2 block text-blue-600">
                Dental Clinic
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
              We aim to make dental care information and
              appointment booking simple and accessible.
              Explore our approach to creating a welcoming
              experience for every patient.
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

              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-blue-200 px-7 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
              >
                <ArrowLeft size={17} />
                Back to Home
              </Link>
            </div>
          </div>

          {/* DECORATIVE HERO PANEL */}
          <div className="relative mx-auto flex min-h-[360px] w-full max-w-lg items-center justify-center sm:min-h-[450px]">
            <div className="absolute left-[12%] top-[12%] h-[55%] w-[48%] -rotate-[25deg] rounded-[45%] bg-[#ffdd43]" />
            <div className="absolute bottom-[7%] right-[9%] h-[72%] w-[65%] rotate-[25deg] rounded-[40%] bg-[#1684f8]" />
            <div className="absolute right-[4%] top-[3%] h-32 w-32 rounded-full bg-[#57d8f3]" />

            <div className="relative z-10 flex h-56 w-56 items-center justify-center rounded-full border-8 border-white bg-white/95 shadow-2xl sm:h-72 sm:w-72">
              <Stethoscope
                className="h-28 w-28 text-blue-600 sm:h-36 sm:w-36"
                strokeWidth={1.3}
              />
            </div>

            <div className="absolute bottom-[4%] left-[1%] z-20 rounded-2xl bg-white px-6 py-5 shadow-xl">
              <p className="font-bold text-[#15224D]">
                Better Dental Experiences
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Your comfort matters
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 lg:grid-cols-2">
        <div>
          <span className="text-sm font-bold uppercase tracking-widest text-blue-600">
            Our Story
          </span>

          <h2 className="mt-4 text-4xl font-bold leading-tight text-[#15224D]">
            Making dental care easier to access
          </h2>

          <p className="mt-6 leading-8 text-slate-600">
            DentalCare brings information about dental
            treatments and appointment availability together
            in one convenient place.
          </p>

          <p className="mt-4 leading-8 text-slate-600">
            Our booking system allows patients to choose a
            service, view available times, and arrange an
            appointment without unnecessary steps.
          </p>

          <div className="mt-7 space-y-4">
            {[
              "Simple online appointment booking",
              "Clear dental service information",
              "Email appointment confirmations",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2
                  size={21}
                  className="shrink-0 text-blue-600"
                />
                <span className="font-medium text-slate-700">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="flex min-h-56 flex-col items-center justify-center rounded-3xl bg-blue-50 p-6 text-center">
            <CalendarDays className="h-12 w-12 text-blue-600" />
            <h3 className="mt-5 font-bold">Online Booking</h3>
            <p className="mt-2 text-sm text-slate-500">
              Convenient scheduling
            </p>
          </div>

          <div className="mt-10 flex min-h-56 flex-col items-center justify-center rounded-3xl bg-cyan-50 p-6 text-center">
            <Users className="h-12 w-12 text-cyan-600" />
            <h3 className="mt-5 font-bold">Patient Focus</h3>
            <p className="mt-2 text-sm text-slate-500">
              Information and support
            </p>
          </div>

          <div className="-mt-10 flex min-h-56 flex-col items-center justify-center rounded-3xl bg-yellow-50 p-6 text-center">
            <ShieldCheck className="h-12 w-12 text-amber-600" />
            <h3 className="mt-5 font-bold">Dental Wellness</h3>
            <p className="mt-2 text-sm text-slate-500">
              Awareness and prevention
            </p>
          </div>

          <div className="flex min-h-56 flex-col items-center justify-center rounded-3xl bg-indigo-50 p-6 text-center">
            <Clock3 className="h-12 w-12 text-indigo-600" />
            <h3 className="mt-5 font-bold">Available Times</h3>
            <p className="mt-2 text-sm text-slate-500">
              Choose a suitable slot
            </p>
          </div>
        </div>
      </section>

      {/* OUR VALUES */}
      <section className="bg-[#f7f9ff] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="font-bold uppercase tracking-widest text-blue-600">
              Our Approach
            </span>

            <h2 className="mt-4 text-4xl font-bold text-[#15224D]">
              What Matters to Us
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              We believe an excellent dental experience begins
              with clear information, easy access, and
              patient-focused care.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <article
                  key={value.title}
                  className="rounded-3xl border border-blue-100 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Icon size={31} />
                  </div>

                  <h3 className="mt-7 text-xl font-bold text-[#15224D]">
                    {value.title}
                  </h3>

                  <p className="mt-4 leading-7 text-slate-600">
                    {value.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* DENTAL TEAM */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="flex min-h-[350px] items-center justify-center rounded-[36px] bg-gradient-to-br from-blue-100 to-cyan-100">
            <div className="flex h-48 w-48 items-center justify-center rounded-full bg-white/75 shadow-xl">
              <Stethoscope
                className="h-24 w-24 text-blue-600"
                strokeWidth={1.5}
              />
            </div>
          </div>

          <div>
            <span className="font-bold uppercase tracking-widest text-blue-600">
              Our Dental Team
            </span>

            <h2 className="mt-4 text-4xl font-bold text-[#15224D]">
              Meet Your Dental Care Team
            </h2>

            <p className="mt-6 leading-8 text-slate-600">
              This section will introduce the clinic's dental
              professionals, their qualifications, and their
              areas of practice.
            </p>

            <p className="mt-4 leading-8 text-slate-600">
              Doctor profiles and photographs will be added
              when the relevant details are available.
            </p>

            <Button
              variant="primary"
              size="lg"
              className="mt-8 rounded-full bg-blue-600 px-8 text-white"
              onPress={() => router.push("/book")}
            >
              Schedule a Visit
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl rounded-[36px] bg-blue-600 px-8 py-16 text-center text-white">
          <CalendarDays className="mx-auto h-12 w-12" />

          <h2 className="mx-auto mt-6 max-w-2xl text-4xl font-bold">
            Ready to Book Your Next Visit?
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-blue-100">
            Choose your dental service and explore available
            appointment times through our online booking system.
          </p>

          <Button
            variant="secondary"
            size="lg"
            className="mt-8 rounded-full bg-white px-8 text-blue-700"
            onPress={() => router.push("/book")}
          >
            Book Appointment
            <ArrowRight size={18} />
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 bg-slate-50 px-6 py-8 text-center text-sm text-slate-500">
        DentalCare — Dental Clinic Booking System
        <p className="mt-1">Portfolio demonstration website</p>
      </footer>
    </main>
  );
}
