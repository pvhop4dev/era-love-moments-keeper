
import { useEffect } from "react";
import AuthForm from "@/components/auth/AuthForm";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const userData = localStorage.getItem("eralove-user");
    if (userData) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-love-50 to-couple-light">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-love-700 mb-2">
          EraLove
        </h1>
        <p className="text-lg text-love-600 max-w-md mx-auto">
          Preserve your precious moments and celebrate your love journey together
        </p>
      </div>

      <div className="w-full max-w-md">
        <AuthForm />
      </div>

      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>Create an account to track your relationship milestones,</p>
        <p>save memories, and celebrate your love every day.</p>
      </div>
    </div>
  );
};

export default Welcome;
