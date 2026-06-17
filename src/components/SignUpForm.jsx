import { useState } from "react";

function SignUpForm() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let newErrors = {};
        // Email Validation
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        }

        // Password Validation
        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password =
                "Password must be at least 6 characters";
        }

        // Confirm Password Validation
        if (!formData.confirmPassword.trim()) {
            newErrors.confirmPassword =
                "Confirm Password is required";
        } else if (
            formData.password !== formData.confirmPassword
        ) {
            newErrors.confirmPassword =
                "Passwords do not match";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            console.log("Sign Up Data:", formData);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="h-full flex flex-col items-center justify-center px-12"
        >
            <h1 className="text-4xl font-bold mb-6">
                Create Account
            </h1>

            <p className="text-gray-500 mb-8">
                Use your email for registration
            </p>

            {/* Full Name */}
            <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full mb-2 px-4 py-3 bg-gray-100 rounded-lg outline-none"
            />

            {errors.fullName && (
                <p className="text-red-500 text-sm mb-3">
                    {errors.fullName}
                </p>
            )}

            {/* Email */}
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full mb-2 px-4 py-3 bg-gray-100 rounded-lg outline-none"
            />

            {errors.email && (
                <p className="text-red-500 text-sm mb-3">
                    {errors.email}
                </p>
            )}

            {/* Password */}
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full mb-2 px-4 py-3 bg-gray-100 rounded-lg outline-none"
            />

            {errors.password && (
                <p className="text-red-500 text-sm mb-3">
                    {errors.password}
                </p>
            )}

            {/* Confirm Password */}
            <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full mb-2 px-4 py-3 bg-gray-100 rounded-lg outline-none"
            />

            {errors.confirmPassword && (
                <p className="text-red-500 text-sm mb-4">
                    {errors.confirmPassword}
                </p>
            )}

            <button
                type="submit"
                className="bg-red-500 text-white px-10 py-3 rounded-full font-semibold hover:bg-red-600 transition"
            >
                SIGN UP
            </button>
        </form>
    );
}

export default SignUpForm;