import React, { useState } from "react";

const Books = () => {
	const [activeTab, setActiveTab] = useState("patrika");

	return (
		<div className="min-h-screen p-5">
			<h1 className="z-50 text-4xl text-primary-700 font-haspss w-full border-b border-primary-600">Books</h1>

			<div className="w-fit max-w-full flex flex-nowrap items-center justify-start gap-x-3 my-3 overflow-x-scroll">
				<button onClick={() => setActiveTab("patrika")} className={`px-3 py-1 text-center rounded-full w-full max-w-fit h-fit mx-auto text-nowrap border-primary-600 border-2 transition-all ${activeTab === "patrika" ? "bg-gradient-to-tr from-primary-600 to-primary-500 text-white" : "text-primary-600"}`}>
					Patrika
				</button>
				<button onClick={() => setActiveTab("shikshapatri")} className={`px-3 py-1 text-center rounded-full w-full max-w-fit h-fit mx-auto text-nowrap border-primary-600 border-2 transition-all ${activeTab === "shikshapatri" ? "bg-gradient-to-tr from-primary-600 to-primary-500 text-white" : "text-primary-600"}`}>
					Shikshapatri
				</button>
				<button onClick={() => setActiveTab("swaminiVato")} className={`px-3 py-1 text-center rounded-full w-full max-w-fit h-fit mx-auto text-nowrap border-primary-600 border-2 transition-all ${activeTab === "swaminiVato" ? "bg-gradient-to-tr from-primary-600 to-primary-500 text-white" : "text-primary-600"}`}>
					Swami Ni Vato
				</button>
			</div>

			<div className="w-full min-h-32 bg-white rounded-xl shadow-inner p-5">
				{activeTab === "patrika" && <div>Patrika Content</div>}
				{activeTab === "shikshapatri" && <div>Shikshapatri Content</div>}
				{activeTab === "swaminiVato" && <div>Swami Ni Vato Content</div>}
			</div>
		</div>
	);
};

export default Books;
