import React, { useState } from "react";
import {
  DollarSign,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
// Utility function for className merging
const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
  const newErrors = {};

  if (!formData.username) {
    newErrors.username = "Username is required";
  }

  if (!formData.password) {
    newErrors.password = "Password is required";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  setIsLoading(true);

  try {
    const params = new URLSearchParams();
    params.append("username", formData.username);
    params.append("password", formData.password);

    const response = await axios.post("http://localhost:8080/api/login", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const { access_token } = response.data;
    localStorage.setItem("token", access_token);
    window.location.href = "/";
  } catch (err) {
    console.error("Login failed:", err);
    alert("Login failed: Invalid credentials or server error.");
  } finally {
    setIsLoading(false);
  }
};


  const handleForgotPassword = () => {
    // Handle forgot password logic
    alert("Password reset functionality would be implemented here.");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo and Branding */}
        <div className="flex flex-col items-center">
          <a href="/" className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 shadow-lg">
            <DollarSign className="h-8 w-8 text-white" />
          </a>
          <div className="mt-4 text-center">
            <h1 className="text-3xl font-bold text-slate-800">FinSight</h1>
            <p className="text-lg text-slate-600">Microfinance</p>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-semibold text-slate-800">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to access your microfinance dashboard
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700"
              >
                Username
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400"/>
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={cn(
                    "appearance-none block w-full pl-10 pr-3 py-3 border rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors",
                    errors.email
                      ? "border-red-300 bg-red-50"
                      : "border-slate-300 bg-white",
                  )}
                  placeholder="Enter your Name"
                />
              </div>
              {errors.email && (
                <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={cn(
                    "appearance-none block w-full pl-10 pr-12 py-3 border rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors",
                    errors.password
                      ? "border-red-300 bg-red-50"
                      : "border-slate-300 bg-white",
                  )}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-slate-700"
                >
                  Remember me
                </label>
              </div>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-emerald-600 hover:text-emerald-500 font-medium"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-colors",
                  isLoading
                    ? "bg-emerald-400 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500",
                )}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>Sign in to Dashboard</span>
                  </div>
                )}
              </button>
            </div>
          </form>

          {/* Security Notice */}
          <div className="mt-8 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-emerald-800">
                  Secure Access
                </h4>
                <p className="mt-1 text-sm text-emerald-700">
                  Your data is protected with bank-level encryption and security
                  protocols. All sessions are monitored for your protection.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-500">
            Protected by advanced security measures
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-400">
            <a href="#" className="hover:text-slate-600">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="#" className="hover:text-slate-600">
              Terms of Service
            </a>
            <span>•</span>
            <a href="#" className="hover:text-slate-600">
              Support
            </a>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-emerald-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-emerald-100 rounded-full opacity-20 blur-3xl"></div>
      </div>
    </div>
  );
};

export default Login;
