import React, { useState, useEffect } from "react";

const PollForm = () => {
  const [pollsData, setPollsData] = useState([]);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/polls/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("hsapss_tokens"))?.access_token
        }`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPollsData(data?.data);
      });
  }, []);
  return (
    <div className="p-3">
      <p className="font-haspss text-3xl text-primary-700">Polls</p>
      <div className="flex gap-3 w-full overflow-x-auto pb-2">
        {pollsData?.map((pollData, index) => (
          <div
            key={index}
            className="max-w-96 w-[calc(100vw-1.5rem)] flex-none bg-white rounded-lg shadow-md p-3 mt-3"
          >
            <div className=" flex flex-col items-center justify-between h-full">
              <div className="space-y-4 h-full">
                <div>
                  <div className="flex items-center justify-start gap-3">
                    <img
                      src={pollData?.created_by?.profile_image}
                      alt="profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <p className="text-primary-800 font-semibold">
                      {pollData?.created_by?.first_name}{" "}
                      {pollData?.created_by?.last_name}
                    </p>
                  </div>
                  <p className="w-full mt-1  font-semibold text-primary-800">
                    {pollData?.question}
                  </p>
                </div>

                <div className="space-y-3">
                  {pollData?.options.map((option, index2) => (
                    <div className="flex items-center gap-3" key={index2}>
                      <div className="relative flex items-center justify-center w-7 h-7">
                        <input
                          type="radio"
                          id={"poll_" + index2}
                          name="poll"
                          className="peer h-7 w-7 scale-50 checked:scale-100 cursor-pointer appearance-none rounded-full border border-primary-400 checked:border-primary-400 transition-all"
                        />
                        <span class="absolute flex items-center justify-center text-white bg-primary-600 w-5 h-5 rounded-full opacity-0 scale-50 peer-checked:scale-100 peer-checked:opacity-100 transition-all duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                            className="w-3 h-3"
                          >
                            <path
                              fill="currentColor"
                              d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
                            />
                          </svg>
                        </span>
                      </div>
                      <label
                        for={"poll_" + index2}
                        className="flex flex-col items-center justify-between gap-2 w-full"
                      >
                        <div className="flex items-center justify-between w-full">
                          <p className="text-left w-full text-primary-800">
                            {option?.optionText}
                          </p>
                          <div className="flex items-center justify-center">
                            {option?.voters.map((voter, index3) => (
                              <img
                                key={index3}
                                src={voter?.profile_image}
                                alt="profile"
                                style={{ zIndex: 3 - index3 }}
                                className={
                                  "w-7 h-7 scale-125 hover:!z-[5] rounded-full object-cover -ml-1 border-2 border-white"
                                }
                              />
                            ))}
                            <p className="text-primary-600 ml-2">
                              {option?.count}
                            </p>
                          </div>
                        </div>
                        <div className="relative gap-2 w-full h-2 rounded-full overflow-hidden bg-primary-200/75">
                          <div
                            className="bg-gradient-to-tr from-primary-500 to-primary-800 h-full rounded-full"
                            style={{ width: option?.precentage + "%" }}
                          ></div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full flex flex-col gap-2 mt-4">
                <hr className="border-primary-200" />
                <button
                  type="button"
                  className="p-1 border border-primary-800 bg-primary-500 hover:bg-primary-600 text-white rounded-lg  transition-all w-full"
                >
                  View Votes
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PollForm;
