import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MdArrowOutward } from "react-icons/md";
import "./styles/Career.css";
import { config } from "../config";

gsap.registerPlugin(ScrollTrigger);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const parseMonth = (value: string): Date => {
  if (value.trim() === "Present") return new Date();
  const [month, year] = value.trim().split(" ");
  const index = MONTHS.indexOf(month);
  return new Date(Number(year), index < 0 ? 0 : index, 1);
};

const getRange = (period: string) => {
  const [start, end = start] = period.split(" - ");
  return { start: parseMonth(start), end: parseMonth(end), isCurrent: end.includes("Present") };
};

const formatDuration = (start: Date, end: Date) => {
  const months = Math.max(
    1,
    (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth() + 1
  );
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return [years && `${years} yr${years > 1 ? "s" : ""}`, rest && `${rest} mo${rest > 1 ? "s" : ""}`]
    .filter(Boolean)
    .join(" ");
};

const Career = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const ranges = config.experiences.map((exp) => getRange(exp.period));
  const earliest = Math.min(...ranges.map((r) => r.start.getTime()));
  const totalMonths = (Date.now() - earliest) / (1000 * 60 * 60 * 24 * 30.44);
  const technologies = new Set(config.experiences.flatMap((exp) => exp.technologies));

  const stats = [
    { value: Math.floor((totalMonths / 12) * 10) / 10, suffix: "+", decimals: 1, label: "Years building for the web" },
    { value: config.experiences.length, suffix: "", decimals: 0, label: "Companies & roles" },
    { value: technologies.size, suffix: "", decimals: 0, label: "Core technologies in daily use" },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(".career-rail-fill", { scaleY: 1 });
        section.querySelectorAll(".career-item").forEach((el) => el.classList.add("is-active"));
        return;
      }

      gsap.from(".career-title .career-word > span", {
        yPercent: 110,
        rotate: 4,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ".career-head", start: "top 80%" },
      });

      gsap.from([".career-eyebrow", ".career-lede"], {
        opacity: 0,
        y: 20,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".career-head", start: "top 80%" },
      });

      section.querySelectorAll<HTMLElement>(".career-stat").forEach((stat, i) => {
        const number = stat.querySelector<HTMLElement>(".career-stat-num")!;
        const target = Number(number.dataset.value);
        const decimals = Number(number.dataset.decimals);
        const counter = { v: 0 };
        gsap.from(stat, {
          opacity: 0,
          y: 30,
          duration: 0.9,
          delay: i * 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".career-stats", start: "top 85%" },
        });
        gsap.to(counter, {
          v: target,
          duration: 1.8,
          delay: 0.2 + i * 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: ".career-stats", start: "top 85%" },
          onUpdate: () => {
            number.textContent = counter.v.toFixed(decimals);
          },
        });
      });

      gsap.fromTo(
        ".career-rail-fill",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".career-list",
            start: "top 65%",
            end: "bottom 60%",
            scrub: 0.6,
          },
        }
      );

      section.querySelectorAll<HTMLElement>(".career-item").forEach((item) => {
        const card = item.querySelector(".career-card");
        gsap.from(card, {
          opacity: 0,
          y: 80,
          rotateX: -8,
          transformPerspective: 1000,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: item, start: "top 85%" },
        });
        gsap.from(item.querySelectorAll(".career-anim"), {
          opacity: 0,
          y: 18,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.05,
          delay: 0.25,
          scrollTrigger: { trigger: item, start: "top 85%" },
        });
        ScrollTrigger.create({
          trigger: item,
          start: "top 60%",
          end: "bottom 40%",
          onEnter: () => item.classList.add("is-active"),
          onLeaveBack: () => item.classList.remove("is-active"),
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  // Spotlight + subtle 3D tilt that follows the pointer
  const handleMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mx", `${x}px`);
    card.style.setProperty("--my", `${y}px`);
    gsap.to(card, {
      rotateY: ((x / rect.width) - 0.5) * 6,
      rotateX: -((y / rect.height) - 0.5) * 6,
      transformPerspective: 1000,
      duration: 0.6,
      ease: "power3.out",
    });
  };

  const handleLeave = (e: React.PointerEvent<HTMLElement>) => {
    gsap.to(e.currentTarget, { rotateX: 0, rotateY: 0, duration: 0.9, ease: "elastic.out(1, 0.6)" });
  };

  return (
    <div className="career-section section-container" ref={sectionRef}>
      <div className="career-container">
        <header className="career-head">
          <div>
            <p className="career-eyebrow">
              <span className="career-eyebrow-line" /> Experience
            </p>
            <h2 className="career-title">
              <span className="career-word"><span>My</span></span>{" "}
              <span className="career-word"><span>career</span></span>{" "}
              <span className="career-word"><span className="career-amp">&amp;</span></span>
              <br />
              <span className="career-word"><span className="career-accent">experience</span></span>
            </h2>
          </div>
          <p className="career-lede">
            A timeline of the teams I've worked with, the products I've shipped and the craft I've
            been sharpening along the way.
          </p>
        </header>

        <div className="career-stats">
          {stats.map((stat) => (
            <div className="career-stat" key={stat.label}>
              <div className="career-stat-value">
                <span className="career-stat-num" data-value={stat.value} data-decimals={stat.decimals}>
                  {stat.value.toFixed(stat.decimals)}
                </span>
                <span className="career-stat-suffix">{stat.suffix}</span>
              </div>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="career-list">
          <div className="career-rail" aria-hidden="true">
            <div className="career-rail-fill" />
          </div>

          {config.experiences.map((exp, index) => {
            const { start, end, isCurrent } = ranges[index];
            return (
              <article className="career-item" key={exp.company + exp.period}>
                <div className="career-node" aria-hidden="true">
                  <span />
                </div>

                <div className="career-meta career-anim">
                  <span className="career-index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="career-period">{exp.period}</span>
                  <span className="career-duration">{formatDuration(start, end)}</span>
                </div>

                <div
                  className="career-card"
                  onPointerMove={handleMove}
                  onPointerLeave={handleLeave}
                >
                  <div className="career-card-glow" aria-hidden="true" />
                  <div className="career-card-top career-anim">
                    <div>
                      <h3>{exp.position}</h3>
                      <h4>
                        {exp.company}
                        <span className="career-location"> · {exp.location}</span>
                      </h4>
                    </div>
                    {isCurrent ? (
                      <span className="career-badge career-badge-live">
                        <i /> Current
                      </span>
                    ) : (
                      <span className="career-badge">
                        Completed <MdArrowOutward />
                      </span>
                    )}
                  </div>

                  <p className="career-desc career-anim">{exp.description}</p>

                  <ul className="career-points">
                    {exp.responsibilities.map((point) => (
                      <li className="career-anim" key={point}>
                        {point}
                      </li>
                    ))}
                  </ul>

                  <div className="career-tags career-anim">
                    {exp.technologies.map((tech) => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Career;
