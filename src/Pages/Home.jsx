import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { userAtom } from "../Variable";
import { useAtom } from "jotai";
const Home = () => {
    const [bhaktoList, setBhaktoList] = useState([]);
    const [user, setUser] = useAtom(userAtom);
    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/bhakto-list/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem("hsapss_tokens")).access_token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setBhaktoList(data?.bhaktos);
            });
    }, []);
    return (
        <div className="h-screen">
            <Navbar />
            <div className="pt-20"></div>
            {user?.user_type === "regionadmin" && (
                <div className="px-3">
                    <p className="font-haspss text-3xl text-primary-700 mb-1">Karykata</p>
                    <div className="flex gap-3 items-start justify-start w-full overflow-x-auto">
                        {bhaktoList?.map((bhakto, index) => {
                            if (bhakto?.user_type === "karyakarta") {
                                return (
                                    <div key={index} className="min-w-20 max-w-20 pt-1">
                                        <img src={bhakto?.profile_image} alt="profile" className="w-20 h-20 rounded-lg object-cover" />
                                        <h1 className="text-primary-800 text-center leading-4 mt-1">
                                            {bhakto?.first_name} {bhakto?.last_name}
                                        </h1>
                                    </div>
                                );
                            }
                        })}
                    </div>
                </div>
            )}
            {user?.user_type === "karyakarta" && (
                <div className=" px-3">
                    <p className="font-haspss text-3xl text-primary-700 mb-1">Bhakto</p>
                    <div className="flex gap-3 items-start justify-start w-full overflow-x-auto">
                        {bhaktoList?.map((bhakto, index) => {
                            if (bhakto?.user_type === "user") {
                                return (
                                    <div key={index} className="min-w-20  max-w-20 pt-1">
                                        <img src={bhakto?.profile_image} alt="profile" className="w-20 h-20  rounded-lg object-cover" />
                                        <h1 className="text-primary-800 text-center leading-4 mt-1">
                                            {bhakto?.first_name} {bhakto?.last_name}
                                        </h1>
                                    </div>
                                );
                            }
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
