import React,{useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { userAtom } from "../Variable";
import { useAtom } from "jotai";

const UserVerifier = ({loading,setLoading}) => {
    const navigate = useNavigate();
    const [user,setUser] = useAtom(userAtom);
    useEffect(() => {
        if (localStorage.getItem("hsapss_tokens")) {
            fetch(`${import.meta.env.VITE_BACKEND_URL}/api/get-user-profile/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("hsapss_tokens")).access_token}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.status === "success") {
                        setLoading(false);
                        setUser(data.user);
                        localStorage.setItem("hsapss_user_data", JSON.stringify(data.user));
                    } else {
                        setLoading(false);
                        localStorage.removeItem("hsapss_tokens");
                        localStorage.removeItem("hsapss_user_data");
                        navigate("/login");
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    localStorage.removeItem("hsapss_tokens");
                    localStorage.removeItem("hsapss_user_data");
                    navigate("/login");
                });
        } else {
            if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
                navigate("/login");
            }
            setLoading(false);
        }
    }, []);
    return <div></div>;
};

export default UserVerifier;
