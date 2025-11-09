import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { userAtom } from "../Variable";
import { useAtom } from "jotai";
import PollForm from "../Components/PollForm";
import BhaktoList from "../Components/BhaktoList";
import Gallery from "../Components/Gallery";
import MeditationSection from "../Components/MeditationSection";

const Home = () => {
	const [bhaktoList, setBhaktoList] = useState([]);
	const [user, setUser] = useAtom(userAtom);
	useEffect(() => {
		fetch(`${import.meta.env.VITE_BACKEND_URL}/api/bhakto-list/`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${JSON.parse(localStorage.getItem("hsapss_tokens"))?.access_token}`,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				setBhaktoList(data?.bhaktos);
			});
	}, []);
	return (
        <div className="min-h-screen pb-20">
            <Navbar />
            <div className="pt-20"></div>

            {/* Gallery Section - Smruti */}
            <Gallery />

            {/* Meditation Section - Breathing/Meditation App Experience */}
            <MeditationSection />

            {/* User-specific sections */}
            {user?.user_type === "regionadmin" && <BhaktoList bhaktoList={bhaktoList} categoryName="Karyakarta" categoryValue="karyakarta" />}
            {user?.user_type === "karyakarta" && <BhaktoList bhaktoList={bhaktoList} categoryName="Bhakto" categoryValue="user" />}

            {/* Polls Section */}
            <PollForm />
        </div>
    );
};

export default Home;
