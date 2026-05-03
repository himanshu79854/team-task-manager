import { useState } from "react";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
  if (!email || !password) {
    toast.error("Please fill all fields");
    return;
  }

  if (!email.includes("@")) {
    toast.error("Enter a valid email");
    return;
  }

  if (password.length < 6) {
    toast.error("Password must be at least 6 characters");
    return;
  }

  try {
    setLoading(true);

    const res = await axios.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("token", res.data.token);
    const decoded = jwtDecode(res.data.token);
    console.log(decoded);  
    localStorage.setItem("role", decoded.role);
    toast.success("Login successful 🎉");
    navigate("/dashboard");

  } catch (err) {
    toast.error("Invalid credentials ❌");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-cyan-500 to-green-500">

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md transform hover:scale-105 transition">

        <h2 className="text-2xl font-bold text-center mb-6">
          Welcome Back 👋
        </h2>

        {/* FORM START */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition disabled:bg-gray-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>
        {/* FORM END */}

        {/* Signup link */}
        <p className="text-center mt-4 text-sm">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 font-semibold">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;