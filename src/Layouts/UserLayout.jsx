import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../Components/Footer";
import UserVerifier from "../Pages/UserVerifier";
const UserLayout = ({ loading, setLoading, isPlain }) => {
    return (
        <div className="bg-background" style={{ backgroundImage: "url(/static/images/backgroundLight.png)", backgroundRepeat: "repeat", backgroundSize: 200 }}>
            <UserVerifier loading={loading} setLoading={setLoading} />
            <Outlet />
            {!isPlain && <Footer />}
        </div>
    );
};

export default UserLayout;
