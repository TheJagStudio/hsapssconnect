import React, { useState, useEffect,useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const Step2 = ({ formData, handleRegister, handleBack }) => {
    const [phoneNumber, setPhoneNumber] = useState(localStorage.getItem("phoneNumber") || "");
    const [region, setRegion] = useState(localStorage.getItem("region") || "");
    const [birthday, setBirthday] = useState(localStorage.getItem("birthday") || "");
    const [streetName, setStreetName] = useState(localStorage.getItem("streetName") || "");
    const [city, setCity] = useState(localStorage.getItem("city") || "");
    const [state, setState] = useState(localStorage.getItem("state") || "");
    const [pincode, setPincode] = useState(localStorage.getItem("pincode") || "");
    const [country, setCountry] = useState(localStorage.getItem("country") || "");
    const [errors, setErrors] = useState({});
    const recaptchaRef = useRef(null);
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        if (!phoneNumber.trim()) {
            newErrors.phoneNumber = "Phone number is required";
        } else if (!/^\d{10}$/.test(phoneNumber)) {
            newErrors.phoneNumber = "Invalid phone number format (must be 10 digits)";
        }
        if (!region.trim()) {
            newErrors.region = "Region is required";
        }
        if (!birthday.trim()) {
            newErrors.birthday = "Birthday is required";
        }
        if (!streetName.trim()) {
            newErrors.streetName = "Street name is required";
        }
        if (!city.trim()) {
            newErrors.city = "City is required";
        }
        if (!state.trim()) {
            newErrors.state = "State is required";
        }
        if (!pincode.trim()) {
            newErrors.pincode = "Pincode is required";
        }
        if (!country.trim()) {
            newErrors.country = "Country is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            handleRegister({
                ...formData,
                phoneNumber,
                region,
                birthday,
                streetName,
                city,
                state,
                pincode,
                country,
            });
        }
    };

    useEffect(() => {
        localStorage.setItem("phoneNumber", phoneNumber);
        localStorage.setItem("region", region);
        localStorage.setItem("birthday", birthday);
        localStorage.setItem("streetName", streetName);
        localStorage.setItem("city", city);
        localStorage.setItem("state", state);
        localStorage.setItem("pincode", pincode);
        localStorage.setItem("country", country);
    }, [phoneNumber, region, birthday, streetName, city, state, pincode, country]);

    return (
        <div className="bg-white p-8 rounded-xl shadow-xl w-96">
            <h2 className="text-4xl font-haspss text-primary-700 mb-6">Register - Step 2</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-primary-800 text-sm font-bold mb-2" htmlFor="phoneNumber">
                        Phone Number
                    </label>
                    <input className={`border rounded-lg shadow-inner w-full py-2 px-3 text-primary-800 leading-tight focus:outline-none focus:shadow-outline ${errors.phoneNumber ? "border-red-500" : ""}`} id="phoneNumber" type="tel" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                    {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-primary-800 text-sm font-bold mb-2" htmlFor="region">
                        Region
                    </label>
                    <select className={`border rounded-lg shadow-inner w-full py-2 px-3 text-primary-800 leading-tight focus:outline-none focus:shadow-outline ${errors.region ? "border-red-500" : ""}`} id="region" value={region} onChange={(e) => setRegion(e.target.value)}>
                        <option value="">Select Region</option>
                        <option value="region1">Region 1</option>
                        <option value="region2">Region 2</option>
                        {/* Add more regions as needed */}
                    </select>
                    {errors.region && <p className="text-red-500 text-xs mt-1">{errors.region}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-primary-800 text-sm font-bold mb-2" htmlFor="birthday">
                        Birthday
                    </label>
                    <input className={`border rounded-lg shadow-inner w-full py-2 px-3 text-primary-800 leading-tight focus:outline-none focus:shadow-outline ${errors.birthday ? "border-red-500" : ""}`} id="birthday" type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
                    {errors.birthday && <p className="text-red-500 text-xs mt-1">{errors.birthday}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-primary-800 text-sm font-bold mb-2" htmlFor="streetName">
                        Street Name
                    </label>
                    <input className={`border rounded-lg shadow-inner w-full py-2 px-3 text-primary-800 leading-tight focus:outline-none focus:shadow-outline ${errors.streetName ? "border-red-500" : ""}`} id="streetName" type="text" placeholder="Street Name" value={streetName} onChange={(e) => setStreetName(e.target.value)} />
                    {errors.streetName && <p className="text-red-500 text-xs mt-1">{errors.streetName}</p>}
                </div>
                <div className="mb-4 flex">
                    <div className="mr-2 w-1/2">
                        <label className="block text-primary-800 text-sm font-bold mb-2" htmlFor="city">
                            City
                        </label>
                        <input className={`border rounded-lg shadow-inner w-full py-2 px-3 text-primary-800 leading-tight focus:outline-none focus:shadow-outline ${errors.city ? "border-red-500" : ""}`} id="city" type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>
                    <div className="w-1/2">
                        <label className="block text-primary-800 text-sm font-bold mb-2" htmlFor="pincode">
                            Pincode
                        </label>
                        <input className={`border rounded-lg shadow-inner w-full py-2 px-3 text-primary-800 leading-tight focus:outline-none focus:shadow-outline ${errors.pincode ? "border-red-500" : ""}`} id="pincode" type="number" maxLength={6} placeholder="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} />
                        {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                    </div>
                </div>
                <div className="mb-4 flex">
                    <div className="mr-2 w-1/2">
                        <label className="block text-primary-800 text-sm font-bold mb-2" htmlFor="state">
                            State
                        </label>
                        <input list="states" className={`border rounded-lg shadow-inner w-full py-2 px-3 text-primary-800 leading-tight focus:outline-none focus:shadow-outline ${errors.state ? "border-red-500" : ""}`} id="state" type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} />
                        {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                        <datalist id="states">
                            <option value="State 1">State 1</option>
                            <option value="State 2">State 2</option>
                            {/* Add more states as needed */}
                        </datalist>
                    </div>
                    <div className="w-1/2">
                        <label className="block text-primary-800 text-sm font-bold mb-2" htmlFor="country">
                            Country
                        </label>
                        <input list="countries" className={`border rounded-lg shadow-inner w-full py-2 px-3 text-primary-800 leading-tight focus:outline-none focus:shadow-outline ${errors.country ? "border-red-500" : ""}`} id="country" type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
                        {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                        <datalist id="countries">
                            <option value="USA">USA</option>
                            <option value="India">India</option>
                            <option value="New Zealand">New Zealand</option>
                            <option value="South Africa">South Africa</option>
                            <option value="UK">UK</option>
                            <option value="Australia">Australia</option>
                            <option value="Dubai">Dubai</option>
                            <option value="Canada">Canada</option>
                            {/* Add more countries as needed */}
                        </datalist>
                    </div>
                </div>
                <ReCAPTCHA sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} size="invisible" ref={recaptchaRef} />
                <button
                    onClick={() => {
                        console.log("Registering");
                        // remove all the items from local storage
                        localStorage.removeItem("phoneNumber");
                        localStorage.removeItem("region");
                        localStorage.removeItem("birthday");
                        localStorage.removeItem("streetName");
                        localStorage.removeItem("city");
                        localStorage.removeItem("state");
                        localStorage.removeItem("pincode");
                        localStorage.removeItem("country");
                        localStorage.removeItem("firstName");
                        localStorage.removeItem("lastName");
                        localStorage.removeItem("email");
                        localStorage.removeItem("password");
                        navigate("/login");
                    }}
                    className="bg-primary-500 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline mr-2"
                    type="submit"
                >
                    Register
                </button>
                <button className="bg-gray-300 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline" type="button" onClick={handleBack}>
                    Back
                </button>
            </form>
        </div>
    );
};

export default Step2;
