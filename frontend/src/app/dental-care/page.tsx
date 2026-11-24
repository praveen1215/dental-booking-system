
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Droplets,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Smile,
  Utensils,
} from "lucide-react";

const tips = [
  {
    title: "Brush Twice a Day",
    description:
      "Brush with fluoride toothpaste for around two minutes, including before bedtime. Clean every tooth surface and the gumline.",
    icon: Sparkles,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Clean Between Teeth",
    description:
      "Use dental floss or an interdental cleaner once every day to remove plaque from areas your toothbrush cannot easily reach.",
    icon: ShieldCheck,
    color: "bg-cyan-50 text-cyan-600",
  },
  {
    title: "Use Fluoride Toothpaste",
    description:
      "Fluoride helps strengthen enamel and protects against tooth decay. After brushing, spit out excess toothpaste without immediately rinsing.",
    icon: Droplets,
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    title: "Limit Added Sugar",
    description:
      "Reduce sugary snacks and drinks. Frequent sugar exposure allows bacteria to produce acids that can damage tooth enamel.",
    icon: Utensils,
    color: "bg-amber-50 text-amber-600",
  },
  {
    title: "Replace Your Toothbrush",
    description:
      "Replace your toothbrush every three to four months, or earlier when the bristles become frayed.",
    icon: Clock3,
    color: "bg-sky-50 text-sky-600",
  },
  {
    title: "Visit Your Dentist",
    description:
      "Arrange dental checkups based on your oral health needs and your dentist's recommendation. Seek advice for persistent pain or bleeding gums.",
    icon: Stethoscope,
    color: "bg-teal-50 text-teal-600",
  },
];

const toothParts = [
  {
    number: "01",
    title: "Enamel",
    description:
      "The hard outer covering of the tooth crown. It helps protect the inner tooth from damage.",
  },
  {
    number: "02",
    title: "Dentin",
    description:
      "The layer beneath enamel. Exposed dentin may contribute to sensitivity.",
  },
  {
    number: "03",
    title: "Pulp",
    description:
      "The soft tissue inside a tooth containing nerves and blood vessels.",
  },
  {
    number: "04",
    title: "Gums",
    description:
      "Soft tissue surrounding teeth that helps protect the underlying supporting structures.",
  },
  {
    number: "05",
    title: "Roots",
    description:
      "The portions beneath the gums that are anchored within the jaw.",
  },
];

const questions = [
  {
    question: "How often should I brush my teeth?",
    answer:
      "Brush at least twice a day for approximately two minutes with fluoride toothpaste. Brushing before bedtime is particularly important.",
  },
  {
    question: "Do I need to floss every day?",
    answer:
      "Yes. Cleaning between your teeth once a day with floss or another suitable interdental cleaner helps remove plaque that brushing alone may miss.",
  },
  {
    question: "Should I rinse after brushing?",
    answer:
      "Spit out excess toothpaste, but avoid immediately rinsing with water. Leaving fluoride on the teeth helps it continue protecting enamel.",
  },
  {
    question: "When should I replace my toothbrush?",
    answer:
      "Replace your toothbrush every three to four months, or sooner if the bristles are worn or frayed.",
  },
  {
    question: "How often should I visit a dentist?",
    answer:
      "The ideal interval depends on your oral health. Your dentist can recommend an appropriate schedule based on your individual risk and needs.",
  },
];

const resources = [
  {
    label: "NHS — How to keep your teeth clean",
    url: "https://www.nhs.uk/live-well/healthy-teeth-and-gums/how-to-keep-your-teeth-clean/",
  },
  {
    label: "American Dental Association — Brushing",
    url: "https://www.mouthhealthy.org/all-topics-a-z/brushing-your-teeth/",
  },
  {
    label: "CDC — Oral health tips for adults",
    url: "https://www.cdc.gov/oral-health/prevention/oral-health-tips-for-adults.html",
  },
  {
    label: "American Dental Association — Tooth anatomy",
    url: "https://www.mouthhealthy.org/all-topics-a-z/tooth",
  },
];

export default function DentalCarePage() {
  return (
    <main className="bg-white text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#f7f9ff]">
        <div className="absolute -right-24 -top-28 size-80 rounded-full bg-cyan-100" />
        <div className="absolute -bottom-40 -left-28 size-80 rounded-full bg-blue-100" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-blue-600 shadow-sm">
              <BookOpen size={17} />
              Dental Education
            </div>

            <h1 className="mt-7 text-5xl font-extrabold leading-tight tracking-tight text-[#15224D] sm:text-6xl">
              Dental Care
              <span className="mt-2 block text-blue-600">
                & Healthy Tips
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
              A healthy smile begins with everyday habits.
              Learn about your teeth, understand oral hygiene,
              and discover practical ways to protect your
              dental health.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="#daily-care"
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Explore Dental Tips
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/book"
                className="inline-flex items-center gap-2 rounded-full border border-blue-200 px-7 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
              >
                Book Appointment
              </Link>
            </div>
          </div>

          {/* Decorative illustration */}
          <div className="relative mx-auto flex min-h-[350px] w-full max-w-lg items-center justify-center sm:min-h-[460px]">
            <div className="absolute left-[10%] top-[8%] h-[55%] w-[48%] -rotate-[25deg] rounded-[45%] bg-[#ffdd43]" />
            <div className="absolute bottom-[4%] right-[6%] h-[75%] w-[65%] rotate-[25deg] rounded-[42%] bg-[#1684f8]" />
            <div className="absolute right-[3%] top-[2%] size-32 rounded-full bg-[#57d8f3]" />

            <div className="relative z-10 flex size-60 flex-col items-center justify-center rounded-full border-8 border-white bg-white/95 shadow-2xl sm:size-72">
              <Smile
                size={110}
                strokeWidth={1.2}
                className="text-blue-600"
              />
              <p className="mt-3 font-bold text-[#15224D]">
                Healthy Teeth
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Healthy Smile
              </p>
            </div>

            <div className="absolute bottom-[5%] left-0 z-20 flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-xl">
              <ShieldCheck
                size={24}
                className="text-blue-600"
              />
              <div>
                <p className="text-sm font-bold">
                  Prevention First
                </p>
                <p className="text-xs text-slate-500">
                  Everyday oral hygiene
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOOTH ANATOMY */}
      <section
        id="anatomy"
        className="mx-auto max-w-7xl scroll-mt-28 px-6 py-20 sm:py-28"
      >
        <div className="mb-12 text-center">
          <p className="font-bold uppercase tracking-widest text-blue-600">
            Understanding Your Teeth
          </p>
          <h2 className="mt-4 text-3xl font-extrabold text-[#15224D] sm:text-4xl">
            Know Your Tooth Structure
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            Every tooth has several layers and supporting
            structures that work together to help you bite,
            chew, and maintain oral health.
          </p>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="rounded-[36px] bg-gradient-to-br from-blue-50 to-cyan-50 p-8">
            <div className="mx-auto max-w-[420px]">
              <div className="flex min-h-[330px] flex-col items-center justify-center rounded-3xl border border-blue-100 bg-white p-8 text-center shadow-sm">
                <div className="flex size-28 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Smile size={62} strokeWidth={1.4} />
                </div>
                <h3 className="mt-7 text-2xl font-bold text-[#15224D]">
                  Tooth Anatomy
                </h3>
                <p className="mt-4 max-w-xs leading-7 text-slate-600">
                  Explore the layers that protect and support
                  your teeth.
                </p>
                <a
                  href="https://www.mouthhealthy.org/all-topics-a-z/tooth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 font-semibold text-blue-600 hover:underline"
                >
                  View illustrated tooth anatomy
                  <ArrowRight size={17} />
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {toothParts.map((part) => (
              <div
                key={part.number}
                className="flex gap-5 rounded-2xl border border-blue-100 bg-white p-5 transition hover:shadow-md"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-600">
                  {part.number}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#15224D]">
                    {part.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {part.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DAILY TIPS */}
      <section
        id="daily-care"
        className="scroll-mt-28 bg-[#f7f9ff] py-20 sm:py-28"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="font-bold uppercase tracking-widest text-blue-600">
              Everyday Oral Hygiene
            </p>

            <h2 className="mt-4 text-3xl font-extrabold text-[#15224D] sm:text-4xl">
              6 Essential Dental Care Tips
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              Small, consistent habits can make a significant
              difference to your long-term oral health.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tips.map((tip) => {
              const Icon = tip.icon;

              return (
                <article
                  key={tip.title}
                  className="rounded-3xl border border-blue-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div
                    className={`flex size-16 items-center justify-center rounded-2xl ${tip.color}`}
                  >
                    <Icon size={30} strokeWidth={1.8} />
                  </div>

                  <h3 className="mt-7 text-xl font-bold text-[#15224D]">
                    {tip.title}
                  </h3>

                  <p className="mt-4 leading-7 text-slate-600">
                    {tip.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* DAILY ROUTINE */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
        <div className="mb-12 text-center">
          <p className="font-bold uppercase tracking-widest text-blue-600">
            Your Dental Routine
          </p>
          <h2 className="mt-4 text-3xl font-extrabold text-[#15224D] sm:text-4xl">
            Build Better Habits Every Day
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-blue-100 bg-blue-50 p-8 sm:p-10">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-white text-blue-600">
              <Sparkles size={27} />
            </div>

            <h3 className="mt-6 text-2xl font-bold text-[#15224D]">
              Morning Routine
            </h3>

            <div className="mt-6 space-y-5">
              {[
                "Brush for two minutes with fluoride toothpaste.",
                "Gently clean all tooth surfaces and the gumline.",
                "Spit out excess toothpaste without immediately rinsing.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 size-5 shrink-0 text-blue-600" />
                  <p className="leading-7 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-cyan-100 bg-cyan-50 p-8 sm:p-10">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-white text-cyan-600">
              <Clock3 size={27} />
            </div>

            <h3 className="mt-6 text-2xl font-bold text-[#15224D]">
              Bedtime Routine
            </h3>

            <div className="mt-6 space-y-5">
              {[
                "Clean between your teeth using floss or an interdental cleaner.",
                "Brush all teeth for two minutes with fluoride toothpaste.",
                "Spit out excess toothpaste and avoid rinsing immediately.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 size-5 shrink-0 text-cyan-600" />
                  <p className="leading-7 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="bg-[#f7f9ff] py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-12 text-center">
            <p className="font-bold uppercase tracking-widest text-blue-600">
              Common Questions
            </p>

            <h2 className="mt-4 text-3xl font-extrabold text-[#15224D] sm:text-4xl">
              Dental Care FAQs
            </h2>
          </div>

          <div className="space-y-4">
            {questions.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl border border-blue-100 bg-white p-6 shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-[#15224D] [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span className="text-2xl font-normal text-blue-600 group-open:hidden">
                    +
                  </span>
                  <span className="hidden text-2xl font-normal text-blue-600 group-open:inline">
                    −
                  </span>
                </summary>

                <p className="mt-5 border-t border-blue-50 pt-5 leading-7 text-slate-600">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* EDUCATIONAL SOURCES */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-3xl border border-blue-100 bg-white p-7 sm:p-10">
          <h2 className="flex items-center gap-3 text-xl font-bold text-[#15224D]">
            <BookOpen className="text-blue-600" size={25} />
            Trusted Dental Health Resources
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
            This page provides general educational information
            based on public dental health guidance. It does not
            replace individual examination or professional advice.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {resources.map((resource) => (
              <a
                key={resource.url}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-4 rounded-xl bg-blue-50 px-5 py-4 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
              >
                {resource.label}
                <ArrowRight className="size-4 shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* APPOINTMENT CALL TO ACTION */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl rounded-[36px] bg-blue-600 px-8 py-16 text-center text-white">
          <CalendarDays className="mx-auto size-12" />

          <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-bold sm:text-4xl">
            Take the Next Step Toward Better Dental Health
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-blue-100">
            Have questions about your dental health?
            Explore available appointment times and
            arrange a dental consultation.
          </p>

          <Link
            href="/book"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            Book an Appointment
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className="border-t bg-slate-50 px-6 py-8 text-center text-sm text-slate-500">
        DentalCare — Dental Clinic Booking System
        <p className="mt-1">Portfolio demonstration website</p>
      </footer>
    </main>
  );
}
