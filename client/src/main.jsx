import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import "./index.css";

// Fallback provided to prevent "Missing required parameter: client_id" error on Vercel
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "155292512345-kqcb51evg5k3mkah4c21mrvm8c97no48.apps.googleusercontent.com";

createRoot(document.getElementById("root")).render(
    <GoogleOAuthProvider clientId={googleClientId}>
        <App />
    </GoogleOAuthProvider>
);
