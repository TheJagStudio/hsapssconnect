import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../Components/Loading";
import Splash from "../Components/Splash";

const Logout = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        try{
            let formData = new FormData();  
            formData.append("refresh_token", JSON.parse(localStorage.getItem("hsapss_tokens"))?.refresh_token);
            fetch(`${import.meta.env.VITE_BACKEND_URL}/api/logout/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("hsapss_tokens"))?.access_token}`,
                },
                body: formData,
            }).then((res) => res.json())
            .then((data) => {
                if (data.status === "success") {
                    localStorage.removeItem("hsapss_user_data");
                    localStorage.removeItem("hsapss_tokens");
                    localStorage.removeItem("pwa-prompt-last-shown");
                } else {
                    alert(data.error);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            })
            .finally(() => {
                setLoading(false);
                navigate("/login");
            });
        }
        catch(e){
            localStorage.removeItem("hsapss_user_data");
            localStorage.removeItem("hsapss_tokens");
            navigate("/login");
        }
    }, []);
    return <div>{loading&&(<Splash loading={true}/>)}</div>;
};

export default Logout;
