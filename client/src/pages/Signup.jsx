import { useState } from "react";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await axios.post("/auth/signup", {
        name,
        email,
        password,
      });

      toast.success("Signup successful ✅");
      navigate("/");
    } catch (err) {
      toast.error("Signup failed ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500">

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md transform hover:scale-105 transition">

        <h2 className="text-2xl font-bold text-center mb-6">
          Create Account ✨
        </h2>

        {/* Name */}
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
          onChange={(e) => setName(e.target.value)}
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Button */}
        <button
          onClick={handleSignup}
          className="w-full bg-purple-500 text-white py-3 rounded hover:bg-purple-600 transition"
        >
          Sign Up
        </button>

        {/* Login link */}
        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/" className="text-purple-600 font-semibold">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Signup;