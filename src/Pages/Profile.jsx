import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [region, setRegion] = useState("");
    const [birthday, setBirthday] = useState("");
    const [streetName, setStreetName] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [pincode, setPincode] = useState("");
    const [country, setCountry] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile-updater`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem("hsapss_tokens")).access_token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "error") {
                    alert(data.error);
                }
                else{
                    setFirstName(data?.user?.first_name);
                    setLastName(data?.user?.last_name);
                    setEmail(data?.user?.email);
                    setPhoneNumber(data?.user?.phone);
                    setRegion(data?.user?.region);
                    setBirthday(data?.user?.birth_date);
                    setStreetName(data?.user?.street_name);
                    setCity(data?.user?.city);
                    setState(data?.user?.state);
                    setPincode(data?.user?.pincode);
                    setCountry(data?.user?.country);
                    setProfileImage(data?.user?.profile_image);
                }
            });
    }, []);

    return (
        <div className="relative w-full min-h-screen bg-background" style={{ backgroundImage: "url(/static/images/backgroundLight.png)", backgroundRepeat: "repeat", backgroundSize: 200 }}>
            <div className="p-4 fixed top-0 left-0 w-full bg-white/80 backdrop-blur-lg z-50 rounded-b-xl custom-shadow flex items-center justify-start gap-3">
                <button
                    onClick={() => {
                        navigate("/");
                    }}
                    className="p-2 rounded-full"
                >
                    <svg className="w-6 h-6 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <p className="text-4xl text-primary-700 font-haspss w-full">Edit Profile</p>
            </div>
            <form
                className="px-5 py-20 grid grid-cols-1 lg:grid-cols-3 lg:gap-x-5 lg:max-w-[80%] mx-auto mt-0 lg:mt-10"
                onSubmit={(event) => {
                    let formData = new FormData();
                    formData.append("first_name", firstName);
                    formData.append("last_name", lastName);
                    formData.append("email", email);
                    formData.append("phone", phoneNumber);
                    formData.append("region", region);
                    formData.append("birth_date", birthday);
                    formData.append("street_name", streetName);
                    formData.append("city", city);
                    formData.append("state", state);
                    formData.append("pincode", pincode);
                    formData.append("country", country);
                    formData.append("profile_image", profileImage);

                    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile-updater/`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${JSON.parse(localStorage.getItem("hsapss_tokens")).access_token}`,
                        },
                        body: formData,
                    })
                        .then((res) => res.json())
                        .then((data) => {
                            if (data.status === "error") {
                                alert(data.error);
                            } else {
                                alert("Profile Updated Successfully");
                            }
                        })
                        .catch((error) => {
                            console.error("Error:", error);
                            alert("Some Error Occured");
                        });
                    event.preventDefault();
                }}
            >
                <img className="rounded-full w-24 h-24 mx-auto outline outline-4 outline-white shadow-xl border border-primary-500" src={profileImage} alt="Profile" />
                <div className="mb-4 mt-5 lg:mt-0">
                    <label className="block text-primary-700 text-sm font-bold mb-2" htmlFor="firstName">
                        First Name
                    </label>
                    <input className="border rounded-lg shadow-inner w-full py-2 px-3 text-primary-700 leading-tight focus:outline-none focus:shadow-outline" id="firstName" type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="mb-4">
                    <label className="block text-primary-700 text-sm font-bold mb-2" htmlFor="lastName">
                        Last Name
                    </label>
                    <input className="border rounded-lg shadow-inner w-full py-2 px-3 text-primary-700 leading-tight focus:outline-none focus:shadow-outline" id="lastName" type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div className="mb-4">
                    <label className="block text-primary-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input className="border rounded-lg shadow-inner w-full py-2 px-3 text-primary-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-4">
                    <label className="block text-primary-700 text-sm font-bold mb-2" htmlFor="phoneNumber">
                        Phone Number
                    </label>
                    <input className="border rounded-lg shadow-inner w-full py-2 px-3 text-primary-700 leading-tight focus:outline-none focus:shadow-outline" id="phoneNumber" type="tel" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                </div>
                <div className="mb-4">
                    <label className="block text-primary-700 text-sm font-bold mb-2" htmlFor="region">
                        Region
                    </label>
                    <select className="border rounded-lg shadow-inner w-full py-2 px-3 text-primary-700 leading-tight focus:outline-none focus:shadow-outline" id="region" value={region} onChange={(e) => setRegion(e.target.value)}>
                        <option value="">Select Region</option>
                        <option value="region1">Region 1</option>
                        <option value="region2">Region 2</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-primary-700 text-sm font-bold mb-2" htmlFor="birthday">
                        Birthday
                    </label>
                    <input className="border rounded-lg shadow-inner w-full py-2 px-3 text-primary-700 leading-tight focus:outline-none focus:shadow-outline" id="birthday" type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
                </div>
                <div className="mb-4">
                    <label className="block text-primary-700 text-sm font-bold mb-2" htmlFor="streetName">
                        Street Name
                    </label>
                    <input className="border rounded-lg shadow-inner w-full py-2 px-3 text-primary-700 leading-tight focus:outline-none focus:shadow-outline" id="streetName" type="text" placeholder="Street Name" value={streetName} onChange={(e) => setStreetName(e.target.value)} />
                </div>
                <div className="mb-4 flex">
                    <div className="mr-2 w-1/2">
                        <label className="block text-primary-700 text-sm font-bold mb-2" htmlFor="city">
                            City
                        </label>
                        <input className="border rounded-lg shadow-inner w-full py-2 px-3 text-primary-700 leading-tight focus:outline-none focus:shadow-outline" id="city" type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                    </div>
                    <div className="w-1/2">
                        <label className="block text-primary-700 text-sm font-bold mb-2" htmlFor="pincode">
                            Pincode
                        </label>
                        <input className="border rounded-lg shadow-inner w-full py-2 px-3 text-primary-700 leading-tight focus:outline-none focus:shadow-outline" id="pincode" type="number" maxLength={6} placeholder="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} />
                    </div>
                </div>
                <div className="mb-4 flex">
                    <div className="mr-2 w-1/2">
                        <label className="block text-primary-700 text-sm font-bold mb-2" htmlFor="state">
                            State
                        </label>
                        <input list="states" className="border rounded-lg shadow-inner w-full py-2 px-3 text-primary-700 leading-tight focus:outline-none focus:shadow-outline" id="state" type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} />
                        <datalist id="states">
                            <option value="State 1">State 1</option>
                            <option value="State 2">State 2</option>
                        </datalist>
                    </div>
                    <div className="w-1/2">
                        <label className="block text-primary-700 text-sm font-bold mb-2" htmlFor="country">
                            Country
                        </label>
                        <input list="countries" className="border rounded-lg shadow-inner w-full py-2 px-3 text-primary-700 leading-tight focus:outline-none focus:shadow-outline" id="country" type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
                        <datalist id="countries">
                            <option value="USA">USA</option>
                            <option value="India">India</option>
                            <option value="New Zealand">New Zealand</option>
                            <option value="South Africa">South Africa</option>
                            <option value="UK">UK</option>
                            <option value="Australia">Australia</option>
                            <option value="Dubai">Dubai</option>
                            <option value="Canada">Canada</option>
                        </datalist>
                    </div>
                </div>
                <button className="bg-primary-500 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline" type="submit">
                    Update Profile
                </button>
            </form>
        </div>
    );
};

export default Profile;
