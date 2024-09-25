import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Pages/Home";
import BhajanHome from "./Pages/BhajanHome";
import Calendar from "./Pages/Calendar";
import Setting from "./Pages/Setting";
import Notification from "./Pages/Notification";
import BhajanDetail from "./Pages/BhajanDetail";
import UserLayout from "./Layouts/UserLayout";
import Login from "./Pages/Login";

function App() {

    return (
        <div className="overflow-x-hidden bg-background w-screen h-full min-h-screen">
            <Router>
                <Routes>
                    <Route element={<UserLayout/>}>
                        <Route path="/" element={<Home />} />
                        <Route path="/notification" element={<Notification />} />
                        <Route path="/calendar" element={<Calendar />} />
                        <Route path="/bhajan" element={<BhajanHome />} />
                        <Route path="/bhajan/:id" element={<BhajanDetail />} />
                        <Route path="/setting" element={<Setting />} />
                    </Route>
                    <Route path="/login" element={<Login/>}></Route>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
