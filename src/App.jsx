import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./Utils/ScrollToTop";

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
import Books from "./Pages/Books";
import InstallPWA from "./Components/InstallPWA";
import ChangePassword from "./Pages/ChangePassword";
import NotificationProvider from "./Components/NotificationProvider";
import Toast from "./Components/Toast";
import FloatingAudioPlayer from "./Components/FloatingAudioPlayer";
import { userAtom, notificationAtom, newNotificationAtom } from "./Variable";
import { useAtom } from "jotai";
import BhajanCategory from "./Pages/BhajanCategory";
import BooksDetails from "./Pages/BooksDetails";
import BookChapter from "./Pages/BookChapter";
import CreatePoll from "./Pages/CreatePoll";
import MeditationDhun from "./Pages/MeditationDhun";
import MeditationChesta from "./Pages/MeditationChesta";
import MeditationSwamiVato from "./Pages/MeditationSwamiVato";
import MeditationShikshapatri from "./Pages/MeditationShikshapatri";
import GalleryAll from "./Pages/GalleryAll";

function App() {
	const [user] = useAtom(userAtom);
	const [notification, setNotification] = useAtom(notificationAtom);
	const [newNotification, setNewNotification] = useAtom(newNotificationAtom);
	const [loading, setLoading] = useState(true);

	return (
		<div className="overflow-x-hidden bg-background w-screen h-full min-h-screen">
			<NotificationProvider />
			{newNotification && user && <Toast message={newNotification} onClose={() => setNewNotification(null)} />}
			<Splash loading={loading} />
			<InstallPWA />
			<FloatingAudioPlayer />
			<Router>
				<ScrollToTop />
				<Routes>
					<Route element={<UserLayout loading={loading} setLoading={setLoading} isPlain={false} />}>
						<Route path="/" element={<Home />} />
						<Route path="/calendar" element={<Calendar />} />
						<Route path="/bhajan" element={<BhajanCategory />} />
						<Route path="/bhajan/:catLink" element={<BhajanHome />} />
						<Route path="/bhajan/:catLink/:id" element={<BhajanDetail />} />
						<Route path="/settings" element={<Setting />} />
						<Route path="/books" element={<Books />} />
						<Route path="/book/:urlId" element={<BooksDetails />} />
						<Route path="/book/:urlId/:chapterId" element={<BookChapter />} />
						<Route path="/meditation/dhun" element={<MeditationDhun />} />
						<Route path="/meditation/chesta" element={<MeditationChesta />} />
						<Route path="/meditation/swami-vato" element={<MeditationSwamiVato />} />
						<Route path="/meditation/shikshapatri-slok" element={<MeditationShikshapatri />} />
						<Route path="/gallery/all" element={<GalleryAll />} />
					</Route>
					<Route element={<UserLayout loading={loading} setLoading={setLoading} isPlain={true} />}>
						<Route path="/change-password" element={<ChangePassword />} />
						<Route path="/notification" element={<Notification />} />
						<Route path="/notification-setting" element={<Notification />} />
						<Route path="/profile" element={<Profile />} />
						<Route path="/create-poll" element={<CreatePoll />} />
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
