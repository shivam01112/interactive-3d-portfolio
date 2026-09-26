import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/TechStackNew.css";

gsap.registerPlugin(ScrollTrigger);

interface Tech {
  name: string;
  icon: string;
  note: string;
  /** Dark/monochrome logo that needs to be rendered white */
  mono?: boolean;
}

interface Group {
  id: string;
  title: string;
  caption: string;
  items: Tech[];
}

const devicon = (path: string) => `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${path}`;

const core: Tech[] = [
  { name: "React", icon: devicon("react/react-original.svg"), note: "Component-driven UIs" },
  { name: "TypeScript", icon: devicon("typescript/typescript-original.svg"), note: "Type-safe codebases" },
  { name: "JavaScript", icon: devicon("javascript/javascript-original.svg"), note: "ES6+ everywhere" },
  { name: "Next.js", icon: devicon("nextjs/nextjs-original.svg"), note: "SSR & full-stack React", mono: true },
];

const groups: Group[] = [
  {
    id: "ui",
    title: "Styling & UI",
    caption: "Layouts that feel right on every screen",
    items: [
      { name: "Tailwind CSS", icon: devicon("tailwindcss/tailwindcss-original.svg"), note: "Utility-first" },
      { name: "HTML5", icon: devicon("html5/html5-original.svg"), note: "Semantic markup" },
      { name: "CSS3", icon: devicon("css3/css3-original.svg"), note: "Grid · Flex · Motion" },
      { name: "Bootstrap", icon: devicon("bootstrap/bootstrap-original.svg"), note: "Rapid layouts" },
      { name: "Figma", icon: devicon("figma/figma-original.svg"), note: "Design handoff" },
    ],
  },
  {
    id: "state",
    title: "State & Data",
    caption: "Predictable data flow",
    items: [
      { name: "Redux Toolkit", icon: devicon("redux/redux-original.svg"), note: "Global state" },
      { name: "Axios", icon: devicon("axios/axios-plain.svg"), note: "REST APIs", mono: true },
      { name: "Vite", icon: devicon("vitejs/vitejs-original.svg"), note: "Build tooling" },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    caption: "End-to-end features",
    items: [
      { name: "Node.js", icon: devicon("nodejs/nodejs-original.svg"), note: "Runtime" },
      { name: "Express", icon: devicon("express/express-original.svg"), note: "APIs", mono: true },
      { name: "MongoDB", icon: devicon("mongodb/mongodb-original.svg"), note: "Database" },
    ],
  },
  {
    id: "workflow",
    title: "Workflow",
    caption: "Ship it, version it, host it",
    items: [
      { name: "Git", icon: devicon("git/git-original.svg"), note: "Version control" },
      { name: "GitHub", icon: devicon("github/github-original.svg"), note: "Collaboration", mono: true },
      { name: "Vercel", icon: devicon("vercel/vercel-original.svg"), note: "Deployments", mono: true },
    ],
  },
];

const total = core.length + groups.reduce((n, g) => n + g.items.length, 0);

const TechStackNew = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(".ts-head > *", {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ".ts-head", start: "top 80%" },
      });
      gsap.from(".ts-panel", {
        opacity: 0,
        y: 60,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".ts-bento", start: "top 80%" },
      });
      gsap.from(".ts-row, .ts-core-item", {
        opacity: 0,
        x: -14,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.03,
        delay: 0.3,
        scrollTrigger: { trigger: ".ts-bento", start: "top 80%" },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  // One spotlight that travels across every panel border
  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.querySelectorAll<HTMLElement>(".ts-panel").forEach((panel) => {
      const rect = panel.getBoundingClientRect();
      panel.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      panel.style.setProperty("--my", `${e.clientY - rect.top}px`);
    });
  };

  return (
    <div className="techstack-new" ref={sectionRef}>
      <div className="ts-bg" aria-hidden="true" />

      <div className="techstack-content">
        <header className="ts-head">
          <p className="ts-eyebrow">
            <span /> Toolkit
          </p>
          <h2 className="ts-title">
            Tech <em>stack</em>
          </h2>
          <p className="ts-sub">
            {total} tools I rely on every day — a focused stack for building fast, scalable and
            beautiful frontends.
          </p>
        </header>

        <div className="ts-bento" onPointerMove={handleMove}>
          <section className="ts-panel ts-panel-core">
            <div className="ts-panel-head">
              <div>
                <h3>Core</h3>
                <p>My daily drivers</p>
              </div>
              <span className="ts-count">{String(core.length).padStart(2, "0")}</span>
            </div>
            <div className="ts-core">
              {core.map((tech) => (
                <div className={`ts-core-item${tech.mono ? " is-mono" : ""}`} key={tech.name}>
                  <span className="ts-core-icon">
                    <img src={tech.icon} alt="" loading="lazy" decoding="async" />
                  </span>
                  <div>
                    <strong>{tech.name}</strong>
                    <small>{tech.note}</small>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {groups.map((group) => (
            <section className={`ts-panel ts-panel-${group.id}`} key={group.id}>
              <div className="ts-panel-head">
                <div>
                  <h3>{group.title}</h3>
                  <p>{group.caption}</p>
                </div>
                <span className="ts-count">{String(group.items.length).padStart(2, "0")}</span>
              </div>
              <ul className="ts-list">
                {group.items.map((tech) => (
                  <li className={`ts-row${tech.mono ? " is-mono" : ""}`} key={tech.name}>
                    <span className="ts-row-icon">
                      <img src={tech.icon} alt="" loading="lazy" decoding="async" />
                    </span>
                    <strong>{tech.name}</strong>
                    <small>{tech.note}</small>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechStackNew;
