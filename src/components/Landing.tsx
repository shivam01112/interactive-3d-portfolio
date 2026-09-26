import { PropsWithChildren } from "react";
import { MdArrowOutward, MdSouth } from "react-icons/md";
import "./styles/Landing.css";
import { config } from "../config";
import { lenis } from "./Navbar";

const currentRole = config.experiences.find((exp) => exp.period.includes("Present"));

const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
  const target = document.querySelector<HTMLElement>(id);
  if (!target) return;
  e.preventDefault();
  if (lenis) lenis.scrollTo(target, { duration: 1.5 });
  else target.scrollIntoView({ behavior: "smooth" });
};

const Landing = ({ children }: PropsWithChildren) => {
  const nameParts = config.developer.fullName.split(" ");
  const firstName = nameParts[0] || config.developer.name;
  const lastName = nameParts.slice(1).join(" ") || "";

  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <p className="landing-badge">
              <i /> Based in {config.social.location}
            </p>
            <h2>Hi there, I'm</h2>
            <h1>
              {firstName.toUpperCase()}{" "}
              <br />
              {lastName && <span>{lastName.toUpperCase()}</span>}
            </h1>
            <p className="landing-desc">
              I craft fast, accessible and pixel-perfect interfaces with React & TypeScript.
            </p>
            <div className="landing-ctas">
              <a
                href="#work"
                className="landing-btn landing-btn-primary"
                data-cursor="disable"
                onClick={(e) => scrollToSection(e, "#work")}
              >
                View my work <MdArrowOutward />
              </a>
              <a
                href="#contact"
                className="landing-btn"
                data-cursor="disable"
                onClick={(e) => scrollToSection(e, "#contact")}
              >
                Let's talk
              </a>
            </div>
          </div>

          <div className="landing-info">
            <h3>Specialised as a</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">Frontend</div>
              <div className="landing-h2-2">React.js</div>
            </h2>
            <h2 className="landing-info-h2b">
              <div className="landing-h2-info">Developer</div>
              <div className="landing-h2-info-1">Specialist</div>
            </h2>
            <ul className="landing-facts">
              <li>
                <span>Now</span>
                {currentRole ? `${currentRole.position} @ ${currentRole.company}` : config.developer.title}
              </li>
              <li>
                <span>Stack</span>
                React · TypeScript · Tailwind
              </li>
            </ul>
          </div>

          <div className="landing-scroll" aria-hidden="true">
            <span>Scroll</span>
            <i>
              <MdSouth />
            </i>
          </div>

          {/* Mobile photo - shows only on mobile when 3D character is hidden */}
          <div className="mobile-photo">
            <img
              src="/images/mypicnbg.png"
              alt={config.developer.fullName}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
