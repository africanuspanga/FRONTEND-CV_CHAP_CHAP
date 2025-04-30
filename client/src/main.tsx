import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set document title
document.title = "CV Chap Chap - Create Professional CVs";

// Add favicon
const favicon = document.createElement("link");
favicon.rel = "icon";
favicon.href = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236D8CFF'%3E%3Cpath d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z'/%3E%3C/svg%3E";
document.head.appendChild(favicon);

// Add meta description
const metaDescription = document.createElement("meta");
metaDescription.name = "description";
metaDescription.content = "Create a professional CV in minutes with CV Chap Chap - Fast, easy and free CV builder with beautiful templates";
document.head.appendChild(metaDescription);

createRoot(document.getElementById("root")!).render(<App />);
