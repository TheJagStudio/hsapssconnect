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
import Register from "./Pages/Register";
import Profile from "./Pages/Profile";
import Logout from "./Pages/Logout";
import Splash from "./Components/Splash";


function App() {
    const [loading, setLoading] = useState(true);
    return (
        <div className="overflow-x-hidden bg-background w-screen h-full min-h-screen">
            <Splash loading={loading} />
            <Router>
                <Routes>
                    <Route element={<UserLayout loading={loading} setLoading={setLoading} isPlain={false} />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/calendar" element={<Calendar />} />
                        <Route path="/bhajan" element={<BhajanHome />} />
                        <Route path="/bhajan/:id" element={<BhajanDetail />} />
                        <Route path="/setting" element={<Setting />} />
                    </Route>
                    <Route element={<UserLayout loading={loading} setLoading={setLoading} isPlain={true} />}>
                        <Route path="/notification" element={<Notification />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/login" element={<Login loading={loading} setLoading={setLoading} />}></Route>
                        <Route path="/logout" element={<Logout />}></Route>
                        <Route path="/register" element={<Register />}></Route>
                    </Route>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
