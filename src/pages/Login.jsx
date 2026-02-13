import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { getPasswordStrength, validatePassword } from "../lib/security";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [lastAttemptTime, setLastAttemptTime] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(null);

  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/admin";
  const MAX_ATTEMPTS = 3;
  const LOCKOUT_TIME = 5 * 60 * 1000; // 5 minutes

  useEffect(() => {
    // Check if user is locked out
    if (lastAttemptTime && Date.now() - lastAttemptTime < LOCKOUT_TIME && failedAttempts >= MAX_ATTEMPTS) {
      setShowWarning(true);
      setError("Account temporarily locked due to multiple failed login attempts. Please try again later.");
    }
  }, [failedAttempts, lastAttemptTime]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError("");
    
    // Calculate password strength when password field changes
    if (name === "password" && value) {
      setPasswordStrength(getPasswordStrength(value));
    } else if (name === "password" && !value) {
      setPasswordStrength(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Check for lockout
    if (lastAttemptTime && Date.now() - lastAttemptTime < LOCKOUT_TIME && failedAttempts >= MAX_ATTEMPTS) {
      setError("Account temporarily locked due to multiple failed login attempts. Please try again later.");
      setIsLoading(false);
      return;
    }

    try {
      const success = await login(formData.email, formData.password);

      if (success) {
        // Reset failed attempts on successful login
        setFailedAttempts(0);
        setShowWarning(false);
        setLastAttemptTime(null);
        navigate(from, { replace: true });
      } else {
        // Track failed attempt
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        setLastAttemptTime(Date.now());
        
        if (newAttempts >= MAX_ATTEMPTS) {
          setError("Account temporarily locked due to multiple failed login attempts. All activities are being monitored for security purposes.");
          setShowWarning(true);
        } else if (newAttempts >= 2) {
          setError(`Invalid credentials. Warning: Multiple failed attempts will result in account lockout. (${MAX_ATTEMPTS - newAttempts} attempts remaining)`);
          setShowWarning(true);
        } else {
          setError("Invalid email or password. Please try again.");
        }
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
            {/* Error/Warning Display */}
            {error && (
              <div className={`border rounded-xl p-4 mb-6 animate-scaleIn ${
                showWarning 
                  ? "bg-red-50 border-red-300" 
                  : "bg-gray-100 border-gray-300"
              }`}>
                <div className="flex items-start">
                  {showWarning ? (
                    <i className="fas fa-exclamation-triangle text-red-600 mr-3 mt-0.5"></i>
                  ) : (
                    <i className="fas fa-exclamation-circle text-black mr-3 mt-0.5"></i>
                  )}
                  <div>
                    {showWarning && failedAttempts >= MAX_ATTEMPTS && (
                      <p className="text-red-700 text-xs font-bold mb-1">
                        ⚠ SECURITY ALERT: Unauthorized access attempt detected
                      </p>
                    )}
                    {showWarning && failedAttempts >= 2 && failedAttempts < MAX_ATTEMPTS && (
                      <p className="text-amber-700 text-xs font-bold mb-1">
                        ⚠ WARNING: You are being monitored
                      </p>
                    )}
                    <p className={`text-sm ${showWarning ? "text-red-700" : "text-black"}`}>
                      {error}
                    </p>
                  </div>
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

              {/* Password Strength Indicator */}
              {passwordStrength && formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Password Strength:</span>
                    <span className={`text-xs font-semibold text-${passwordStrength.color}-600`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 bg-${passwordStrength.color}-500`}
                      style={{ width: `${passwordStrength.score}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    For admin accounts, use at least 8 characters with uppercase, lowercase, numbers, and special characters.
                  </p>
                </div>
              )}

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
