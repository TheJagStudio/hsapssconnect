import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../Components/Footer";

const UserLayout = () => {
    return (
        <div>
            <Outlet />
            <Footer />
        </div>
    );
};

export default UserLayout;
