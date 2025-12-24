import mermaid from "mermaid";

let initialized = false;

export const initMermaid = () => {
  if (initialized) return;

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    theme: "default", // позже сделать dark/light
  });

  initialized = true;
};
