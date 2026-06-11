import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Phone, AtSign, UserPlus } from "lucide-react";
import authService from "../services/authService";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.register(formData);

      if (response?.token) {
        localStorage.setItem("token", response.token);
      }

      navigate("/login");
    } catch (err) {
      const message =
          err.response?.data?.message ||
          err.response?.data ||
          "Registration failed. Try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl rounded-3xl border border-slate-700 bg-slate-900/80 p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600">
              <UserPlus />
            </div>

            <h1 className="text-3xl font-bold">Create Account</h1>
            <p className="mt-2 text-slate-400">
              Join MasterFix to find expert help or offer your skills
            </p>
          </div>

          {error && (
              <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
                {error}
              </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 text-slate-400" size={18} />
                  <input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      minLength={3}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-12 py-3 outline-none focus:border-violet-500"
                      placeholder="Mehriban"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 text-slate-400" size={18} />
                  <input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      minLength={3}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-12 py-3 outline-none focus:border-violet-500"
                      placeholder="Nusretova"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Username
              </label>
              <div className="relative">
                <AtSign className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    required
                    minLength={3}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-12 py-3 outline-none focus:border-violet-500"
                    placeholder="mehriban123"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-12 py-3 outline-none focus:border-violet-500"
                    placeholder="mehriban@example.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-12 py-3 outline-none focus:border-violet-500"
                    placeholder="0501234567"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-12 py-3 outline-none focus:border-violet-500"
                    placeholder="123456"
                />
              </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-violet-600 px-6 py-4 font-bold text-white transition hover:bg-violet-500 disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-violet-400 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
  );
}