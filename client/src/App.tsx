import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
import MyLinks from "@/pages/MyLinks";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import { useDispatch } from "react-redux";
import { loginSuccess } from "./store/slices/authSlice";
import { Loader2 } from "lucide-react";
import RedirectHandler from "@/pages/RedirectHandler";
import VerifyEmail from "@/pages/VerifyEmail";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";

import axios from "axios";

function App() {
  const dispatch = useDispatch();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const { user, access_token } = response.data;
        dispatch(loginSuccess({ user, token: access_token }));
      } catch {
        // Not logged in or refresh failed, which is fine for initial load
      } finally {
        setIsInitializing(false);
      }
    };

    initAuth();
  }, [dispatch]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />

        {/* Guest only routes (Redirect if logged in) */}
        <Route element={<PublicRoute />}>
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Protect the my-links route */}
        <Route element={<ProtectedRoute />}>
          <Route path="/my-links" element={<MyLinks />} />
        </Route>

        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Catch-all for short URLs (Must be last) */}
        <Route path="/:code" element={<RedirectHandler />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
