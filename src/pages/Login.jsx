import { useState } from "react";
import { useAuth } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, AlertCircle } from "lucide-react";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError("");
      await signInWithGoogle();
      navigate("/");
    } catch (error) {
      setError("Failed to sign in with Google. Please try again.");
      console.error("Google sign in error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-10 space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <div className="bg-blue-100 p-3 rounded-full mb-2">
            <ShoppingCart className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 text-center">
            Sign in to your account
          </h2>
          <p className="text-sm text-gray-500 mt-1 text-center">
            Sign in with Google to start shopping
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-md border border-red-200">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Google Sign-In Button */}
        <div>
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-4 py-3 px-6 rounded-full bg-white border border-gray-300 shadow-sm hover:shadow-md font-semibold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="text-sm">Signing in...</span>
            ) : (
              <>
                <img
                  src="https://www.citypng.com/public/uploads/preview/google-logo-icon-gsuite-hd-701751694791470gzbayltphh.png"
                  alt="Google"
                  className="w-5 h-5"
                />

                <span className="text-sm">Sign in with Google</span>
              </>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-3 text-gray-500">
              Quick and secure authentication
            </span>
          </div>
        </div>

        {/* Terms */}
        <p className="mt-4 text-center text-xs text-gray-400">
          By signing in, you agree to our{" "}
          <span className="text-blue-500 hover:underline cursor-pointer">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="text-blue-500 hover:underline cursor-pointer">
            Privacy Policy
          </span>
          .
        </p>
      </div>
    </div>
  );
};

export default Login;
