import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRouter";
import { GoogleOAuthProvider } from "@react-oauth/google";

// קריאה ל־Client ID מה־.env
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
