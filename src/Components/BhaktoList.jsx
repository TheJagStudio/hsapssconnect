import React from "react";

const BhaktoList = ({ bhaktoList, categoryName,categoryValue }) => {
	return (
		<div className="px-3">
			<p className="font-haspss text-3xl text-primary-700 mb-1">{categoryName}</p>
			<div className="flex gap-3 items-start justify-start w-full overflow-x-auto overflow-y-hidden">
				{bhaktoList?.map((bhakto, index) => {
					if (bhakto?.user_type === categoryValue) {
						return (
							<div key={index} className="min-w-20 max-w-20 pt-1">
								<img src={import.meta.env.VITE_BACKEND_URL + bhakto?.profile_image} alt="profile" className="w-20 h-20 rounded-lg object-cover" />
								<h1 className="text-primary-800 text-center leading-4 mt-1">
									{bhakto?.first_name} {bhakto?.last_name}
								</h1>
							</div>
						);
					}
				})}
			</div>
		</div>
	);
};

export default BhaktoList;
