import { useEffect, useState } from "react";
import "./styles/Loading.css";
import { useLoading } from "../context/LoadingProvider";
import { config } from "../config";

const STATUS = [
  "Warming up the pixels",
  "Loading the 3D scene",
  "Polishing interactions",
  "Almost there",
];

const Loading = ({ percent }: { percent: number }) => {
  const { setIsLoading } = useLoading();
  const [loaded, setLoaded] = useState(false);
  const [exiting, setExiting] = useState(false);

  const value = Math.min(100, Math.max(0, percent));
  const status = value >= 100 ? "Welcome" : STATUS[Math.min(STATUS.length - 1, Math.floor(value / 26))];

  useEffect(() => {
    if (value < 100 || loaded) return;
    const t = setTimeout(() => setLoaded(true), 500);
    return () => clearTimeout(t);
  }, [value, loaded]);

  useEffect(() => {
    if (!loaded) return;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    import("./utils/initialFX").then((module) => {
      if (cancelled) return;
      timers.push(
        setTimeout(() => setExiting(true), 700),
        setTimeout(() => {
          module.initialFX?.();
          setIsLoading(false);
        }, 1700)
      );
    });
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [loaded, setIsLoading]);

  const digits = String(value).padStart(3, "0").split("");

  return (
    <div
      className={`loader${loaded ? " is-loaded" : ""}${exiting ? " is-exiting" : ""}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      aria-label="Loading portfolio"
    >
      <div className="loader-curtain loader-curtain-top" />
      <div className="loader-curtain loader-curtain-bottom" />

      <div className="loader-inner">
        <div className="loader-top">
          <span className="loader-brand">
            <i /> {config.developer.fullName}
          </span>
          <span className="loader-meta">Portfolio ©{new Date().getFullYear()}</span>
        </div>

        <div className="loader-center">
          <div className="loader-orb" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p className="loader-role">{config.developer.title}</p>
          <div className="loader-count" aria-hidden="true">
            {digits.map((d, i) => (
              <span className="loader-digit" key={i}>
                <span style={{ transform: `translateY(-${Number(d) * 10}%)` }}>
                  {"0123456789".split("").map((n) => (
                    <b key={n}>{n}</b>
                  ))}
                </span>
              </span>
            ))}
            <em>%</em>
          </div>
        </div>

        <div className="loader-bottom">
          <div className="loader-status">
            <span key={status}>{status}</span>
          </div>
          <div className="loader-bar">
            <span style={{ transform: `scaleX(${value / 100})` }} />
          </div>
          <div className="loader-foot">
            <span>{config.social.location}</span>
            <span>Scroll-driven 3D experience</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;

export const setProgress = (setLoading: (value: number) => void) => {
  let percent: number = 0;

  let interval = setInterval(() => {
    if (percent <= 50) {
      let rand = Math.round(Math.random() * 5);
      percent = percent + rand;
      setLoading(percent);
    } else {
      clearInterval(interval);
      interval = setInterval(() => {
        percent = percent + Math.round(Math.random());
        setLoading(percent);
        if (percent > 91) {
          clearInterval(interval);
        }
      }, 2000);
    }
  }, 100);

  function clear() {
    clearInterval(interval);
    setLoading(100);
  }

  function loaded() {
    return new Promise<number>((resolve) => {
      clearInterval(interval);
      interval = setInterval(() => {
        if (percent < 100) {
          percent++;
          setLoading(percent);
        } else {
          resolve(percent);
          clearInterval(interval);
        }
      }, 2);
    });
  }
  return { loaded, percent, clear };
};
