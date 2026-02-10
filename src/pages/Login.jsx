import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/admin";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await login(formData.email, formData.password);

      if (success) {
        navigate(from, { replace: true });
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center bg-white">
      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-black/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gray-200/50 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-md w-full mx-4">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fadeInUp animation-delay-200">
          {/* Header */}
          <div className="bg-black px-8 py-8 text-white text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
              <i className="fas fa-user-shield text-black text-2xl"></i>
            </div>
            <h1 className="text-2xl font-bold mb-2 text-white">Admin Login</h1>
            <p className="text-gray-400 text-sm">
              Access your dashboard to manage your store
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            {error && (
              <div className="bg-gray-100 border border-gray-300 rounded-xl p-4 mb-6 animate-scaleIn">
                <div className="flex items-center">
                  <i className="fas fa-exclamation-circle text-black mr-3"></i>
                  <p className="text-black text-sm">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 bg-white text-black placeholder-gray-400"
                    placeholder="admin@jhanselcementpots.com"
                    autoComplete="email"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <i className="fas fa-envelope text-gray-400"></i>
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 bg-white text-black placeholder-gray-400"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <i className="fas fa-lock text-gray-400"></i>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black transition-colors p-1"
                  >
                    <i
                      className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                    ></i>
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <a
                  href="#"
                  className="text-sm text-black hover:underline font-medium"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black hover:bg-gray-800 text-white py-3.5 text-lg rounded-xl flex items-center justify-center gap-2 disabled:opacity-70 transition-all duration-300 font-medium"
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <i className="fas fa-arrow-right"></i>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="border-t border-gray-200 my-6"></div>

            {/* Back to Home */}
            <div className="text-center">
              <p className="text-gray-600 mb-3">
                Not an administrator?
              </p>
              <Link
                to="/"
                className="inline-flex items-center text-black font-semibold hover:text-gray-600 transition-colors"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Homepage
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-500 text-sm mt-6 animate-fadeInUp animation-delay-400">
          Unauthorized access is prohibited. All activities are monitored.
        </p>
      </div>
    </div>
  );
};

export default Login;
