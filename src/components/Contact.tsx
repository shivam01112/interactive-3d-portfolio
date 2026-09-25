import { useEffect, useRef, useState } from "react";
import { MdArrowOutward, MdArrowUpward, MdCheck, MdContentCopy } from "react-icons/md";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/Contact.css";
import { config } from "../config";
import { lenis } from "./Navbar";

gsap.registerPlugin(ScrollTrigger);

const socials = [
  { label: "Github", href: config.contact.github },
  { label: "Portfolio", href: config.contact.portfolio },
  { label: "Linkedin", href: config.contact.linkedin },
  { label: "Twitter", href: config.contact.twitter },
  { label: "Facebook", href: config.contact.facebook },
  { label: "Instagram", href: config.contact.instagram },
].filter((s) => s.href);

const currentRole = config.experiences.find((exp) => exp.period.includes("Present"));

const formatTime = () =>
  new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: config.social.timezone,
  }).format(new Date());

const Contact = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const magnetRef = useRef<HTMLAnchorElement>(null);
  const [time, setTime] = useState(formatTime);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 75%" },
      });
      tl.from(".contact-eyebrow", { opacity: 0, y: 20, duration: 0.8, ease: "power3.out" })
        .from(
          ".contact-headline .contact-line > span",
          { yPercent: 115, rotate: 3, duration: 1.2, ease: "expo.out", stagger: 0.1 },
          0.1
        )
        .from(".contact-magnet", { scale: 0, rotate: -90, duration: 1.2, ease: "elastic.out(1, 0.6)" }, 0.5)
        .from(
          ".contact-col",
          { opacity: 0, y: 40, duration: 0.9, ease: "power3.out", stagger: 0.12 },
          0.5
        )
        .from(".contact-row-line", { scaleX: 0, duration: 1.2, ease: "expo.inOut", stagger: 0.08 }, 0.6);

      gsap.from(".contact-giant span", {
        yPercent: 100,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.04,
        scrollTrigger: { trigger: ".contact-giant", start: "top 95%" },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const handleMagnetMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const magnet = magnetRef.current;
    if (!magnet || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(magnet, { x: x * 0.4, y: y * 0.4, duration: 0.6, ease: "power3.out" });
    gsap.to(magnet.querySelector(".contact-magnet-label"), {
      x: x * 0.15,
      y: y * 0.15,
      duration: 0.6,
      ease: "power3.out",
    });
  };

  const handleMagnetLeave = () => {
    const magnet = magnetRef.current;
    if (!magnet) return;
    gsap.to([magnet, magnet.querySelector(".contact-magnet-label")], {
      x: 0,
      y: 0,
      duration: 1,
      ease: "elastic.out(1, 0.35)",
    });
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(config.contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${config.contact.email}`;
    }
  };

  const scrollToTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 2 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="contact-section" id="contact" ref={sectionRef}>
      <div className="contact-aurora" aria-hidden="true" />

      <div className="contact-container section-container">
        <div className="contact-hero">
          <div>
            <p className="contact-eyebrow">
              <span className="contact-dot" /> Let's work together
            </p>
            <h3 className="contact-headline">
              <span className="contact-line">
                <span>Have an idea?</span>
              </span>
              <span className="contact-line">
                <span>
                  Let's make it <em>real.</em>
                </span>
              </span>
            </h3>
          </div>

          <div
            className="contact-magnet-area"
            onPointerMove={handleMagnetMove}
            onPointerLeave={handleMagnetLeave}
          >
            <a
              ref={magnetRef}
              href={`mailto:${config.contact.email}`}
              className="contact-magnet"
              data-cursor="disable"
            >
              <span className="contact-magnet-fill" aria-hidden="true" />
              <span className="contact-magnet-label">
                Say hello <MdArrowOutward />
              </span>
            </a>
          </div>
        </div>

        <div className="contact-grid">
          <div className="contact-col">
            <h4>Email</h4>
            <button type="button" className="contact-email" onClick={copyEmail} data-cursor="disable">
              <span className="contact-email-text">{config.contact.email}</span>
              <span className={`contact-copy${copied ? " is-copied" : ""}`}>
                {copied ? <MdCheck /> : <MdContentCopy />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </span>
            </button>

            <h4>Location</h4>
            <p className="contact-location">
              {config.social.location}
              <span className="contact-clock">
                <i /> {time} local time
              </span>
            </p>
          </div>

          <div className="contact-col">
            <h4>Social</h4>
            <ul className="contact-links">
              {socials.map((s, i) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" data-cursor="disable">
                    <span className="contact-link-index">0{i + 1}</span>
                    <span className="contact-link-label">
                      <span data-text={s.label}>{s.label}</span>
                    </span>
                    <MdArrowOutward className="contact-link-arrow" />
                  </a>
                  <span className="contact-row-line" />
                </li>
              ))}
            </ul>
          </div>

          <div className="contact-col contact-col-status">
            <h4>Currently</h4>
            {currentRole && (
              <p className="contact-status">
                {currentRole.position} at <span>{currentRole.company}</span>
              </p>
            )}
            <p className="contact-credit">
              Designed &amp; developed by <span>{config.developer.fullName}</span>
            </p>
            <button type="button" className="contact-top" onClick={scrollToTop} data-cursor="disable">
              <span>Back to top</span>
              <i>
                <MdArrowUpward />
              </i>
            </button>
          </div>
        </div>
      </div>

      <div className="contact-giant" aria-hidden="true">
        {config.developer.fullName.split("").map((ch, i) => (
          <span key={i}>{ch === " " ? " " : ch}</span>
        ))}
      </div>

      <div className="contact-bottom section-container">
        <span>© {new Date().getFullYear()} {config.developer.fullName}</span>
        <span>All rights reserved</span>
      </div>
    </div>
  );
};

export default Contact;
