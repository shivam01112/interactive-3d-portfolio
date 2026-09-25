import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/TechStackNew.css";

gsap.registerPlugin(Flip, ScrollTrigger);

type Category = "Languages" | "Frontend" | "Backend" | "AI & Data" | "Data & Cloud" | "Tools";

interface TechItem {
  name: string;
  icon: string;
  url: string;
  category: Category;
  /** Icon is dark/monochrome and needs to be rendered white on the dark background */
  mono?: boolean;
}

const devicon = (path: string) => `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${path}`;

const techStack: TechItem[] = [
  { name: "JavaScript", icon: devicon("javascript/javascript-original.svg"), url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript", category: "Languages" },
  { name: "TypeScript", icon: devicon("typescript/typescript-original.svg"), url: "https://typescriptlang.org", category: "Languages" },
  { name: "Python", icon: devicon("python/python-original.svg"), url: "https://python.org", category: "Languages" },
  { name: "HTML", icon: devicon("html5/html5-original.svg"), url: "https://developer.mozilla.org/en-US/docs/Web/HTML", category: "Languages" },
  { name: "CSS", icon: devicon("css3/css3-original.svg"), url: "https://developer.mozilla.org/en-US/docs/Web/CSS", category: "Languages" },
  { name: "C", icon: devicon("c/c-original.svg"), url: "https://en.cppreference.com/w/c", category: "Languages" },
  { name: "C++", icon: devicon("cplusplus/cplusplus-original.svg"), url: "https://isocpp.org", category: "Languages" },
  { name: "Kotlin", icon: devicon("kotlin/kotlin-original.svg"), url: "https://kotlinlang.org", category: "Languages" },
  { name: "Bash", icon: devicon("bash/bash-original.svg"), url: "https://www.gnu.org/software/bash/", category: "Languages", mono: true },

  { name: "React", icon: devicon("react/react-original.svg"), url: "https://react.dev", category: "Frontend" },
  { name: "Next.js", icon: devicon("nextjs/nextjs-original.svg"), url: "https://nextjs.org", category: "Frontend", mono: true },
  { name: "Tailwind", icon: devicon("tailwindcss/tailwindcss-original.svg"), url: "https://tailwindcss.com", category: "Frontend" },
  { name: "Bootstrap", icon: devicon("bootstrap/bootstrap-original.svg"), url: "https://getbootstrap.com", category: "Frontend" },
  { name: "Figma", icon: devicon("figma/figma-original.svg"), url: "https://figma.com", category: "Frontend" },
  { name: "Photoshop", icon: devicon("photoshop/photoshop-original.svg"), url: "https://adobe.com/products/photoshop", category: "Frontend" },

  { name: "Node.js", icon: devicon("nodejs/nodejs-original.svg"), url: "https://nodejs.org", category: "Backend" },
  { name: "Django", icon: devicon("django/django-plain.svg"), url: "https://djangoproject.com", category: "Backend", mono: true },
  { name: "Flask", icon: devicon("flask/flask-original.svg"), url: "https://flask.palletsprojects.com", category: "Backend", mono: true },
  { name: "FastAPI", icon: devicon("fastapi/fastapi-original.svg"), url: "https://fastapi.tiangolo.com", category: "Backend" },
  { name: "Postman", icon: devicon("postman/postman-original.svg"), url: "https://postman.com", category: "Backend" },

  { name: "TensorFlow", icon: devicon("tensorflow/tensorflow-original.svg"), url: "https://tensorflow.org", category: "AI & Data" },
  { name: "PyTorch", icon: devicon("pytorch/pytorch-original.svg"), url: "https://pytorch.org", category: "AI & Data" },
  { name: "Scikit-learn", icon: devicon("scikitlearn/scikitlearn-original.svg"), url: "https://scikit-learn.org", category: "AI & Data" },
  { name: "OpenCV", icon: devicon("opencv/opencv-original.svg"), url: "https://opencv.org", category: "AI & Data" },
  { name: "NumPy", icon: devicon("numpy/numpy-original.svg"), url: "https://numpy.org", category: "AI & Data" },
  { name: "Pandas", icon: devicon("pandas/pandas-original.svg"), url: "https://pandas.pydata.org", category: "AI & Data" },
  { name: "Jupyter", icon: devicon("jupyter/jupyter-original.svg"), url: "https://jupyter.org", category: "AI & Data" },
  { name: "Hugging Face", icon: "https://huggingface.co/front/assets/huggingface_logo-noborder.svg", url: "https://huggingface.co", category: "AI & Data" },

  { name: "MySQL", icon: devicon("mysql/mysql-original.svg"), url: "https://mysql.com", category: "Data & Cloud" },
  { name: "PostgreSQL", icon: devicon("postgresql/postgresql-original.svg"), url: "https://postgresql.org", category: "Data & Cloud" },
  { name: "MongoDB", icon: devicon("mongodb/mongodb-original.svg"), url: "https://mongodb.com", category: "Data & Cloud" },
  { name: "Firebase", icon: devicon("firebase/firebase-plain.svg"), url: "https://firebase.google.com", category: "Data & Cloud" },
  { name: "Redis", icon: devicon("redis/redis-original.svg"), url: "https://redis.io", category: "Data & Cloud" },
  { name: "Docker", icon: devicon("docker/docker-original.svg"), url: "https://docker.com", category: "Data & Cloud" },
  { name: "AWS", icon: devicon("amazonwebservices/amazonwebservices-original-wordmark.svg"), url: "https://aws.amazon.com", category: "Data & Cloud", mono: true },
  { name: "Azure", icon: devicon("azure/azure-original.svg"), url: "https://azure.microsoft.com", category: "Data & Cloud" },
  { name: "Vercel", icon: devicon("vercel/vercel-original.svg"), url: "https://vercel.com", category: "Data & Cloud", mono: true },

  { name: "Git", icon: devicon("git/git-original.svg"), url: "https://git-scm.com", category: "Tools" },
  { name: "GitHub", icon: devicon("github/github-original.svg"), url: "https://github.com", category: "Tools", mono: true },
  { name: "Linux", icon: devicon("linux/linux-original.svg"), url: "https://linux.org", category: "Tools" },
  { name: "VS Code", icon: devicon("vscode/vscode-original.svg"), url: "https://code.visualstudio.com", category: "Tools" },
  { name: "MS Office", icon: "https://img.icons8.com/color/48/microsoft-office-2019.png", url: "https://www.microsoft.com/microsoft-365", category: "Tools" },
];

const categories: ("All" | Category)[] = ["All", "Languages", "Frontend", "Backend", "AI & Data", "Data & Cloud", "Tools"];

const marqueeTop = ["React", "TypeScript", "Next.js", "Tailwind", "Node.js", "Python", "FastAPI", "Docker"];
const marqueeBottom = ["PyTorch", "TensorFlow", "MongoDB", "PostgreSQL", "Redis", "Firebase", "AWS", "Git"];

const TechStackNew = () => {
  const [active, setActive] = useState<(typeof categories)[number]>("All");
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const prevHeight = useRef(0);
  const entranceTween = useRef<gsap.core.Tween | null>(null);

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: techStack.length };
    techStack.forEach((t) => (map[t.category] = (map[t.category] || 0) + 1));
    return map;
  }, []);

  // Scroll-in choreography
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ".ts-head", start: "top 80%" },
      });
      tl.from(".ts-title .ts-char", {
        yPercent: 120,
        opacity: 0,
        rotateX: -80,
        duration: 1,
        ease: "expo.out",
        stagger: 0.035,
      })
        .from([".ts-eyebrow", ".ts-sub"], { opacity: 0, y: 20, duration: 0.8, stagger: 0.1, ease: "power3.out" }, 0.2)
        .from(".ts-tab", { opacity: 0, y: 16, duration: 0.6, stagger: 0.04, ease: "power3.out" }, 0.35);

      entranceTween.current = gsap.from(".ts-card", {
        opacity: 0,
        y: 40,
        scale: 0.92,
        duration: 0.9,
        ease: "power3.out",
        stagger: { each: 0.018, from: "start" },
        scrollTrigger: { trigger: ".ts-grid", start: "top 85%" },
      });

      gsap.to(".ts-marquee-track.is-left", {
        xPercent: -12,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 0.5 },
      });
      gsap.fromTo(
        ".ts-marquee-track.is-right",
        { xPercent: -12 },
        {
          xPercent: 0,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 0.5 },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  // Sliding tab indicator
  useEffect(() => {
    const tabs = tabsRef.current;
    const indicator = indicatorRef.current;
    if (!tabs || !indicator) return;
    const move = () => {
      const el = tabs.querySelector<HTMLElement>(".ts-tab.is-active");
      if (!el) return;
      gsap.to(indicator, {
        x: el.offsetLeft,
        width: el.offsetWidth,
        duration: 0.55,
        ease: "power4.out",
      });
    };
    move();
    window.addEventListener("resize", move);
    return () => window.removeEventListener("resize", move);
  }, [active]);

  // FLIP-animate the grid whenever the filter changes
  useEffect(() => {
    const state = flipState.current;
    const grid = gridRef.current;
    if (!state || !grid) return;
    flipState.current = null;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduced ? 0 : 0.7;
    // Ease the container height too so the content below doesn't jump
    gsap.fromTo(
      grid,
      { height: prevHeight.current },
      { height: grid.offsetHeight, duration, ease: "power3.inOut", clearProps: "height" }
    );
    Flip.from(state, {
      targets: grid.querySelectorAll(".ts-card"),
      duration,
      ease: "power3.inOut",
      stagger: 0.012,
      absolute: true,
      onEnter: (els) =>
        gsap.fromTo(els, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.6)" }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.6, duration: 0.35, ease: "power2.in" }),
      onComplete: () => ScrollTrigger.refresh(),
    });
  }, [active]);

  const selectCategory = (cat: (typeof categories)[number]) => {
    if (cat === active || !gridRef.current) return;
    // Finish the scroll-in reveal first so it can't fight the FLIP transforms
    entranceTween.current?.progress(1);
    flipState.current = Flip.getState(gridRef.current.querySelectorAll(".ts-card"));
    prevHeight.current = gridRef.current.offsetHeight;
    setActive(cat);
  };

  // A single spotlight that travels across every card border
  const handleGridMove = (e: React.PointerEvent<HTMLDivElement>) => {
    gridRef.current?.querySelectorAll<HTMLElement>(".ts-card").forEach((card) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      card.style.setProperty("--my", `${e.clientY - rect.top}px`);
    });
  };

  // Magnetic pull on the hovered card's icon
  const handleCardMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== "mouse") return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const dy = (e.clientY - rect.top - rect.height / 2) / rect.height;
    gsap.to(card.querySelector(".ts-icon"), { x: dx * 14, y: dy * 14, duration: 0.4, ease: "power3.out" });
  };

  const handleCardLeave = (e: React.PointerEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget.querySelector(".ts-icon"), { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
  };

  return (
    <div className="techstack-new" ref={sectionRef}>
      <div className="ts-bg" aria-hidden="true">
        <div className="ts-grid-lines" />
        <div className="ts-orb ts-orb-1" />
        <div className="ts-orb ts-orb-2" />
      </div>

      <div className="ts-marquee" aria-hidden="true">
        <div className="ts-marquee-track is-left">
          {[...marqueeTop, ...marqueeTop].map((word, i) => (
            <span key={i}>
              {word} <em>✦</em>
            </span>
          ))}
        </div>
      </div>

      <div className="techstack-content">
        <header className="ts-head">
          <p className="ts-eyebrow">
            <span /> Toolkit <span />
          </p>
          <h2 className="ts-title" aria-label="Tech Stack">
            {"Tech Stack".split("").map((ch, i) => (
              <span className="ts-char" key={i} aria-hidden="true">
                {ch === " " ? " " : ch}
              </span>
            ))}
          </h2>
          <p className="ts-sub">
            {techStack.length} tools, frameworks and platforms I use to take ideas from sketch to production.
          </p>
        </header>

        <div className="ts-tabs" ref={tabsRef} role="tablist" aria-label="Filter technologies">
          <span className="ts-tab-indicator" ref={indicatorRef} aria-hidden="true" />
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={active === cat}
              className={`ts-tab${active === cat ? " is-active" : ""}`}
              onClick={() => selectCategory(cat)}
              data-cursor="disable"
            >
              {cat}
              <sup>{counts[cat]}</sup>
            </button>
          ))}
        </div>

        <div className="ts-grid" ref={gridRef} onPointerMove={handleGridMove}>
          {techStack.map((tech) => (
            <a
              key={tech.name}
              data-flip-id={tech.name}
              href={tech.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`ts-card${tech.mono ? " is-mono" : ""}${
                active !== "All" && tech.category !== active ? " is-hidden" : ""
              }`}
              data-cursor="disable"
              onPointerMove={handleCardMove}
              onPointerLeave={handleCardLeave}
            >
              <span className="ts-card-glow" aria-hidden="true" />
              <span className="ts-icon">
                <img src={tech.icon} alt="" loading="lazy" decoding="async" />
              </span>
              <span className="ts-name">{tech.name}</span>
              <span className="ts-cat">{tech.category}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="ts-marquee ts-marquee-bottom" aria-hidden="true">
        <div className="ts-marquee-track is-right">
          {[...marqueeBottom, ...marqueeBottom].map((word, i) => (
            <span key={i}>
              {word} <em>✦</em>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechStackNew;
