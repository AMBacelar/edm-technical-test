import { useEffect, useRef, useState } from "react";
import "./App.css";
import Login from "./pages/login";
import { AuthContext } from "./context/AuthContext";
import { User } from "./hooks/useUser";
import { useAuth } from "./hooks/useAuth";
import Dashboard from "./pages/dashboard";
import { ModalContextProvider } from "./context/ModalContext";

const Routes = () => {
  // there are no routes tbf... I just need a component
  // with access to the auth context to know whether
  // the user is logged in or not

  <div className="wrapper"></div>;

  const { user } = useAuth();
  if (!user) {
    return (
      <div className="wrapper">
        <Login />
      </div>
    );
  }
  return (
    <div className="wrapper">
      <Dashboard />
    </div>
  );
};

const bubbly = () => {
  const r = () => Math.random();
  const canvas = document.createElement("canvas");
  const width = (canvas.width = window.innerWidth * 1);
  const height = (canvas.height = window.innerHeight * 1.5);
  canvas.setAttribute(
    "style",
    "position:fixed;z-index:-1;left:0;top:0;min-width:100%;min-height:100%;"
  );
  const context = canvas.getContext("2d")!;
  const gradient = context.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "#454850");
  gradient.addColorStop(0.5, "#282c34");
  gradient.addColorStop(1, "#09041C");
  document.body.appendChild(canvas);
  const nrBubbles = 10;
  const bubbles = [];

  for (let i = 0; i < nrBubbles; i++) {
    bubbles.push({
      x: r() * width, // x-position
      y: r() * height, // y-position
      r: 20 + (r() * width) / 2, // radius
      a: r() * Math.PI * 2, // angle
      v: 0.6 + r() * 0.5, // velocity
    });
  }
  (function draw() {
    if (canvas.parentNode === null) {
      return cancelAnimationFrame(draw as never as number);
    }
    requestAnimationFrame(draw);
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
    context.globalCompositeOperation = "source-over";
    const bubbleColours = ["#607d8b", "#6532B4", "#a1887f"];
    bubbles.forEach((bubble, i) => {
      const bubbleColour =
        bubbleColours[i % bubbleColours.length] || (bubbleColours[0] as string);
      const rgradient = context.createRadialGradient(
        bubble.x,
        bubble.y,
        0,
        bubble.x,
        bubble.y,
        bubble.r
      );
      rgradient.addColorStop(0, `${bubbleColour}`);
      rgradient.addColorStop(0.7, `${bubbleColour}00`);

      context.beginPath();
      context.arc(bubble.x, bubble.y, bubble.r, 0, Math.PI * 2);
      context.fillStyle = rgradient;
      context.fill();
      // update positions for next draw
      bubble.x += Math.cos(bubble.a) * bubble.v;
      bubble.y += Math.sin(bubble.a) * bubble.v;
      if (bubble.x - bubble.r > width) {
        bubble.x = -bubble.r;
      }
      if (bubble.x + bubble.r < 0) {
        bubble.x = width + bubble.r;
      }
      if (bubble.y - bubble.r > height) {
        bubble.y = -bubble.r;
      }
      if (bubble.y + bubble.r < 0) {
        bubble.y = height + bubble.r;
      }
    });
  })();
};

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const effectCalled = useRef(false);
  useEffect(() => {
    // first
    if (effectCalled.current) return;
    bubbly();
    effectCalled.current = true;
    return () => {
      // second
    };
  }, []);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <ModalContextProvider>
        <Routes />
      </ModalContextProvider>
    </AuthContext.Provider>
  );
};

export default App;
