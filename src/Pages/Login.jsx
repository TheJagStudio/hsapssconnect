import React, { useState,useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import Loading from "../Components/Loading";
import { useNavigate, Link } from "react-router-dom";

const Login = ({ loading, setLoading }) => {
    const recaptchaRef = useRef();
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false); 
    const navigate = useNavigate();
    return (
        <div className="flex items-center relative justify-center min-h-screen bg-background " style={{ backgroundImage: "url(/static/images/backgroundLight.png)", backgroundRepeat: "repeat", backgroundSize: 200 }}>
            <div className="bg-white relative overflow-hidden p-8 rounded-lg shadow-xl w-96 opacity-100">
                {loading && <Loading />}
                <h2 className="text-4xl font-haspss text-primary-700 mb-6">Login</h2>
                <div className="mb-4">
                    <label className="block text-primary-800 text-sm font-bold mb-2" htmlFor="username">
                        Email
                    </label>
                    <input className="border rounded-lg shadow-inner w-full py-2 px-3 text-primary-800 leading-tight focus:outline-none focus:shadow-outline" id="username" type="email" placeholder="hari@gmail.com" />
                </div>
                <div className="mb-3 relative">
                    {/* Added relative class for positioning the button */}
                    <label className="block text-primary-800 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input className="border rounded-lg shadow-inner w-full py-2 pr-12 px-3 text-primary-800 leading-tight focus:outline-none focus:shadow-outline" id="password" type={showPassword ? "text" : "password"} placeholder="Password" />
                    <button
                        className="absolute right-3 top-8 text-primary-600 font-bold py-1 px-2 rounded-lg opacity-70 hover:opacity-100 focus:outline-none focus:shadow-outline"
                        type="button"
                        onClick={() => {
                            setShowPassword(!showPassword);
                        }}
                    >
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
                {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
                <ReCAPTCHA sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} size="invisible" ref={recaptchaRef} />
                <Link to="/register" className="text-primary-800/80 hover:text-primary-800 flex items-center justify-end pb-1 cursor-pointer hover:italic hover:underline">
                    Don't have a account?
                </Link>
                <button
                    onClick={async () => {
                        setLoading(true);
                        let formData = new FormData();
                        formData.append("username", document.getElementById("username").value);
                        formData.append("password", document.getElementById("password").value);
                        formData.append("captcha_response", await recaptchaRef.current.executeAsync());
                        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login/`, {
                            method: "POST",
                            body: formData,
                        })
                            .then((res) => res.json())
                            .then((data) => {
                                console.log(data);
                                if (data.status === "success") {
                                    localStorage.setItem("hsapss_user_data", JSON.stringify(data.user));
                                    localStorage.setItem("hsapss_tokens", JSON.stringify(data.tokens));
                                    navigate("/");
                                } else {
                                    setError(data.error);
                                }
                            })
                            .catch((error) => {
                                console.error("Error:", error);
                                setError("An unexpected error occurred. Please try again later.");
                            })
                            .finally(() => {
                                setLoading(false);
                            });
                    }}
                    className="bg-primary-500 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                    type="button"
                >
                    Sign In
                </button>
            </div>
        </div>
    );
};

export default Login;
