
import { useState } from "react";
import API from "../services/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await API.post("/auth/login", form);
            loginUser(res.data.user, res.data.token);
            navigate("/dashboard");
        } catch (err) {
            alert(err.response.data.msg);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form 
                onSubmit={handleSubmit} 
                className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

                <input name="email" type="email" placeholder="Email" onChange={handleChange} required 
                    className="border p-3 w-full rounded mb-3" />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} required 
                    className="border p-3 w-full rounded mb-3" />

                <button type="submit" className="bg-emerald-700 hover:bg-emerald-800 text-white w-full p-3 rounded">
                    Login
                </button>

                <p className="mt-4 text-center text-sm">
                    Don't have an account? <Link to="/signup" className="text-emerald-500 hover:underline">Sign Up</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
