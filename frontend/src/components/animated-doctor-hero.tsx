
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";

const doctors = [
  {
    src: "/images/doctor-1.png",
    alt: "Dental professional one",
    title: "Gentle Dental Care",
    subtitle: "Comfortable care for every visit",
  },
  {
    src: "/images/doctor-2.png",
    alt: "Dental professional two",
    title: "Healthy Smiles",
    subtitle: "Care for your dental health",
  },
  {
    src: "/images/doctor-3.png",
    alt: "Dental professional three",
    title: "Your Dental Visit",
    subtitle: "Book your appointment online",
  },
];

const DISPLAY_INTERVAL = 4800;
const TRANSITION_DURATION = 1.0;

export function AnimatedDoctorHero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (paused || reduceMotion || doctors.length < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      setActive((previous) => (previous + 1) % doctors.length);
    }, DISPLAY_INTERVAL);

    return () => window.clearInterval(timer);
  }, [paused, reduceMotion]);

  const activeDoctor = doctors[active];

  return (
    <div
      className="relative mx-auto h-[430px] w-full max-w-[580px] sm:h-[550px] lg:h-[610px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* STATIC BACKGROUND SHAPES */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Yellow blob */}
        <div className="absolute left-[10%] top-[12%] h-[55%] w-[48%] -rotate-[25deg] rounded-[45%] bg-[#FFDD43]" />

        {/* Large blue blob */}
        <div className="absolute bottom-[5%] right-[5%] h-[77%] w-[68%] rotate-[28deg] rounded-[40%] bg-[#1684F8]" />

        {/* Cyan circle */}
        <div className="absolute right-[1%] top-[2%] h-[28%] w-[28%] rounded-full bg-[#57D8F3]" />

        {/* Smaller blue blob */}
        <div className="absolute bottom-[12%] left-[5%] h-[34%] w-[35%] -rotate-[24deg] rounded-[45%] bg-[#0875EA]" />
      </div>

      {/* ROTATING DOCTOR LAYERS */}
      <div
        className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
        style={{ perspective: "1100px" }}
      >
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={activeDoctor.src}
            className="absolute inset-0"
            style={{
              transformStyle: "preserve-3d",
              transformOrigin: "50% 65%",
            }}
                        
                initial={
                reduceMotion
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        z: -250,
                        filter: "blur(8px)",
                    }
                }
                animate={{
                opacity: 1,
                z: 0,
                filter: "blur(0px)",
                }}
                exit={
                reduceMotion
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        z: -250,
                        filter: "blur(8px)",
                    }
                }
                transition={{
                duration: reduceMotion ? 0.15 : 1.5,
                ease: "easeInOut",
                }}

          >
            <Image
              src={activeDoctor.src}
              alt={activeDoctor.alt}
              fill
              priority={active === 0}
              sizes="(max-width: 768px) 100vw, 580px"
              className="object-contain object-bottom"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* DYNAMIC FLOATING CARD */}
      <div className="absolute bottom-[12%] left-[1%] z-20 min-w-[210px] rounded-2xl border border-white/80 bg-white/95 p-5 shadow-xl backdrop-blur-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDoctor.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
          >
            <h3 className="text-sm font-bold text-[#15244C]">
              {activeDoctor.title}
            </h3>

            <p className="mt-2 text-xs text-slate-500">
              {activeDoctor.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CAROUSEL INDICATORS */}
      <div className="absolute bottom-4 right-[14%] z-30 flex items-center gap-2">
        {doctors.map((doctor, index) => (
          <button
            key={doctor.src}
            type="button"
            aria-label={`Show doctor ${index + 1}`}
            aria-current={active === index ? "true" : undefined}
            onClick={() => setActive(index)}
            className={`h-2.5 rounded-full transition-all ${
              active === index
                ? "w-8 bg-blue-700"
                : "w-2.5 bg-blue-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
