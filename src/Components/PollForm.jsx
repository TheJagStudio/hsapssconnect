import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

const PollForm = () => {
  const [pollsData, setPollsData] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [votedPolls, setVotedPolls] = useState({});
  const [showVoters, setShowVoters] = useState({});

  const fetchPolls = () => {
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
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const handleVote = (pollId, optionId) => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/polls/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("hsapss_tokens"))?.access_token
        }`,
      },
      body: JSON.stringify({
        poll_id: pollId,
        option_id: optionId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setVotedPolls(prev => ({ ...prev, [pollId]: true }));
          
          // Update the specific poll data reactively instead of refetching all polls
          if (data.poll) {
            setPollsData(prev => prev.map(poll =>
              poll.id === pollId ? data.poll : poll
            ));
          } else {
            fetchPolls(); // Fallback to full refresh if no poll data returned
          }
        } else {
          alert(data.message || "Error submitting vote");
        }
      })
      .catch((error) => {
        alert("Error submitting vote: " + error.message);
      });
  };

  const handleOptionChange = (pollId, optionId) => {
    setSelectedOptions(prev => ({ ...prev, [pollId]: optionId }));
    
    // Always submit vote when option changes (handles both first vote and vote changes)
    handleVote(pollId, optionId);
  };

  const toggleVoters = (pollId) => {
    setShowVoters(prev => ({ ...prev, [pollId]: !prev[pollId] }));
  };
  const user = JSON.parse(localStorage.getItem("hsapss_user"));
  const navigate = useNavigate();
  
  // Check if user can create polls (regionadmin or karyakarta)
  const canCreatePolls = user && (user.user_type === "regionadmin" || user.user_type === "karyakarta");
  
  return (
      <PhotoProvider>
          {pollsData.length > 0 && (
              <div className="p-3">
                  <div className="flex justify-between items-center mb-4">
                      <p className="font-haspss text-3xl text-primary-700">Polls</p>
                      {canCreatePolls && (
                          <button type="button" className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-all text-sm font-medium" onClick={() => navigate("/create-poll")}>
                              Create Poll
                          </button>
                      )}
                  </div>

                  <div className="flex gap-3 w-full overflow-x-auto pb-2">
                      {pollsData?.map((pollData, index) => {
                          const hasVoted = pollData.options.some((opt) => opt.voters.some((voter) => voter?.id === user?.id));
                          // Find the option that the current user voted for
                          const userVotedOption = pollData.options.find((opt) => opt.voters.some((voter) => voter?.id === user?.id));
                          const selectedOption = userVotedOption?.id || selectedOptions[pollData.id];

                          return (
                              <div key={index} className="max-w-96 w-[calc(100vw-1.5rem)] flex-none bg-white rounded-lg shadow-md p-3 mt-3">
                                  <div className="flex flex-col items-center justify-between h-full">
                                      <div className="space-y-4 h-full">
                                          <div>
                                              <div className="flex items-center justify-start gap-3">
                                                  <img src={import.meta.env.VITE_BACKEND_URL + pollData?.created_by?.profile_image || "/placeholder-avatar.jpg"} alt="profile" className="w-10 h-10 rounded-full object-cover" />
                                                  <p className="text-primary-800 font-semibold">
                                                      {pollData?.created_by?.first_name} {pollData?.created_by?.last_name}
                                                  </p>
                                              </div>
                                              <PhotoView src={`${import.meta.env.VITE_BACKEND_URL}${pollData?.image}`}>{pollData?.image && <img src={`${import.meta.env.VITE_BACKEND_URL}${pollData?.image}`} alt="Poll" className="w-full h-48 object-cover rounded-lg mb-3" />}</PhotoView>
                                              <p className="w-full mt-1 font-semibold text-primary-800">{pollData?.question}</p>
                                          </div>

                                          <div className="space-y-3">
                                              {pollData?.options.map((option, index2) => {
                                                  return (
                                                      <div className="space-y-2" key={index2}>
                                                          <div className="flex items-center gap-3">
                                                              <div className="relative flex items-center justify-center w-7 h-7">
                                                                  <input type="radio" id={`poll_${pollData.id}_${index2}`} name={`poll_${pollData.id}`} disabled={hasVoted} checked={userVotedOption?.id === option?.id || selectedOption === option?.id} onChange={() => handleOptionChange(pollData.id, option?.id)} className="peer h-7 w-7 scale-50 checked:scale-100 cursor-pointer appearance-none rounded-full border border-primary-400 checked:border-primary-400 transition-all disabled:cursor-not-allowed disabled:opacity-50" />
                                                                  <span className="absolute flex items-center justify-center text-white bg-primary-600 w-5 h-5 rounded-full opacity-0 scale-50 peer-checked:scale-100 peer-checked:opacity-100 transition-all duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-3 h-3">
                                                                          <path fill="currentColor" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                                                                      </svg>
                                                                  </span>
                                                              </div>
                                                              <label htmlFor={`poll_${pollData.id}_${index2}`} className="flex flex-col items-center justify-between gap-2 w-full">
                                                                  <div className="flex items-center justify-between w-full pr-5">
                                                                      <p className="text-left w-full text-primary-800">{option?.optionText}</p>
                                                                      <div className="flex items-center justify-center">
                                                                          {option?.voters.slice(0, 3).map((voter, index3) => (
                                                                              <img key={index3} src={import.meta.env.VITE_BACKEND_URL + voter?.profile_image || "/placeholder-avatar.jpg"} alt="profile" style={{ zIndex: 3 - index3 }} className={"w-7 h-7 scale-125 hover:!z-[5] rounded-full object-cover -ml-1 border-2 border-white"} />
                                                                          ))}
                                                                          <p className="text-primary-600 ml-2">{option?.count}</p>
                                                                      </div>
                                                                  </div>
                                                                  <div className="relative gap-2 w-full h-2 rounded-full overflow-hidden bg-primary-200/75">
                                                                      <div className="bg-gradient-to-tr from-primary-500 to-primary-800 h-full rounded-full" style={{ width: option?.precentage + "%" }}></div>
                                                                  </div>
                                                              </label>
                                                          </div>

                                                          {/* Show voters when View Votes is toggled */}
                                                          {showVoters[pollData.id] && option?.voters.length > 0 && (
                                                              <div className="ml-10 mt-2 p-3 bg-primary-50 rounded-lg border border-primary-200">
                                                                  <p className="text-sm font-medium text-primary-800 mb-2">Voters for {option?.optionText}:</p>
                                                                  <div className="space-y-2">
                                                                      {option?.voters.map((voter, voterIndex) => (
                                                                          <div key={voterIndex} className="flex items-center gap-2">
                                                                              <img src={import.meta.env.VITE_BACKEND_URL + voter?.profile_image || "/placeholder-avatar.jpg"} alt={voter?.first_name} className="w-6 h-6 rounded-full object-cover" />
                                                                              <span className="text-sm text-primary-700">
                                                                                  {voter?.first_name} {voter?.last_name}
                                                                              </span>
                                                                          </div>
                                                                      ))}
                                                                  </div>
                                                              </div>
                                                          )}
                                                      </div>
                                                  );
                                              })}
                                          </div>
                                      </div>
                                      <div className="w-full flex flex-col gap-2 mt-4">
                                          <hr className="border-primary-200" />
                                          <button type="button" onClick={() => toggleVoters(pollData.id)} className="p-2 border border-primary-800 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-all w-full">
                                              {showVoters[pollData.id] ? "Hide Votes" : "View Votes"}
                                          </button>
                                      </div>
                                  </div>
                              </div>
                          );
                      })}
                  </div>
              </div>
          )}
      </PhotoProvider>
  );
};

export default PollForm;
