import React, { useState, useEffect,useRef } from "react";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const Step1 = ({ handleNext }) => {
    const [firstName, setFirstName] = useState(localStorage.getItem("firstName") || "");
    const [lastName, setLastName] = useState(localStorage.getItem("lastName") || "");
    const [email, setEmail] = useState(localStorage.getItem("email") || "");
    const [password, setPassword] = useState(localStorage.getItem("password") || "");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const recaptchaRef = useRef(null);

    const validateForm = () => {
        const newErrors = {};
        if (!firstName.trim()) {
            newErrors.firstName = "First name is required";
        } else if (!/^[a-zA-Z]+$/.test(firstName)) {
            newErrors.firstName = "First name must contain only letters";
        }
        if (!lastName.trim()) {
            newErrors.lastName = "Last name is required";
        } else if (!/^[a-zA-Z]+$/.test(lastName)) {
            newErrors.lastName = "Last name must contain only letters";
        }
        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Invalid email format";
        }
        if (!password.trim()) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters long";
        } else if (!/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
            newErrors.password = "Password must contain at least one number and one letter";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            handleNext({ firstName, lastName, email, password });
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        localStorage.setItem("firstName", firstName);
        localStorage.setItem("lastName", lastName);
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
    }, [firstName, lastName, email, password]);

    return (
        <div className="bg-white p-8 rounded-xl shadow-xl w-96">
            <h2 className="text-4xl font-haspss text-primary-700 mb-6">Register - Step 1</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-primary-800 text-sm font-bold mb-2" htmlFor="firstName">
                        First Name
                    </label>
                    <input className={`border rounded-lg shadow-inner w-full py-2 px-3 text-primary-800 leading-tight focus:outline-none focus:shadow-outline ${errors.firstName ? "border-red-500" : ""}`} id="firstName" type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-primary-800 text-sm font-bold mb-2" htmlFor="lastName">
                        Last Name
                    </label>
                    <input className={`border rounded-lg shadow-inner w-full py-2 px-3 text-primary-800 leading-tight focus:outline-none focus:shadow-outline ${errors.lastName ? "border-red-500" : ""}`} id="lastName" type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-primary-800 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input className={`border rounded-lg shadow-inner w-full py-2 px-3 text-primary-800 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? "border-red-500" : ""}`} id="email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div className="mb-4 relative">
                    <label className="block text-primary-800 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input className={`border rounded-lg shadow-inner w-full py-2 pr-12 px-3 text-primary-800 leading-tight focus:outline-none focus:shadow-outline ${errors.password ? "border-red-500" : ""}`} id="password" type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    <button className="absolute right-3 top-8 text-primary-600 font-bold py-1 px-2 rounded-lg opacity-70 hover:opacity-100 focus:outline-none focus:shadow-outline" type="button" onClick={togglePasswordVisibility}>
                        {!showPassword ? (
                            <svg width={24} height={24} viewBox="0 -0.48 16.32 16.32" xmlns="http://www.w3.org/2000/svg">
                                <path fill="currentColor" d="m3.24 1.8 10.8 10.8-.96.96-2.22-2.22q-1.23.66-2.7.66-1.92 0-3.54-1.17-1.65-1.17-2.7-3.15.45-.81 1.14-1.62.66-.84 1.26-1.26L2.28 2.76zm7.8 5.88q0-1.2-.84-2.04T8.16 4.8L6.87 3.51q.75-.15 1.29-.15 1.95 0 3.6 1.2 1.62 1.2 2.64 3.12-.18.39-.57.96t-.81 1.02zm-2.88 2.88q.81 0 1.5-.42l-.87-.87q-.3.09-.63.09-.69 0-1.17-.48-.51-.51-.51-1.2 0-.27.12-.6l-.9-.9q-.42.69-.42 1.5 0 1.2.84 2.04t2.04.84" />
                            </svg>
                        ) : (
                            <svg height={24} width={24} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1.26 1.26" xmlSpace="preserve">
                                <path fill="currentColor" d="M.459.603c0 .093.078.171.171.171S.801.696.801.603.723.432.63.432.459.51.459.603m.243.369C.903.927 1.215.66 1.215.66S.984.3.675.261C.657.258.597.258.585.258c-.3.03-.54.411-.54.411s.261.258.51.297a.4.4 0 0 0 .147.006M.333.621C.333.465.465.339.63.339s.297.126.297.282S.795.9.63.9.333.774.333.621" />
                            </svg>
                        )}
                    </button>
                </div>
                <ReCAPTCHA sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} size="invisible" ref={recaptchaRef} />
                <Link to="/login" className="text-primary-800/80 hover:text-primary-800 flex items-center justify-end pb-1 cursor-pointer hover:italic hover:underline">
                    Already have a account?
                </Link>
                <button className="bg-primary-500 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline" type="submit">
                    Next
                </button>
            </form>
        </div>
    );
};

export default Step1;
