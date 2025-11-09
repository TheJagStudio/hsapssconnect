import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreatePoll = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [image, setImage] = useState(null);
  const [options, setOptions] = useState(["", ""]);
  const [participants, setParticipants] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is authorized to create polls
    const user = JSON.parse(localStorage.getItem("hsapss_user"));
    if (!user || (user.user_type !== "regionadmin" && user.user_type !== "karyakarta")) {
      alert("You are not authorized to create polls");
      navigate("/");
      return;
    }

    // Fetch available users (participants)
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/bhakto-list/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("hsapss_tokens"))?.access_token
        }`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAvailableUsers(data?.bhaktos || []);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, [navigate]);

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleParticipantToggle = (userId) => {
    setParticipants(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      alert("Please enter a question");
      return;
    }
    
    const validOptions = options.filter(opt => opt.trim() !== "");
    if (validOptions.length < 2) {
      alert("Please provide at least 2 options");
      return;
    }

    setLoading(true);
    
    const user = JSON.parse(localStorage.getItem("hsapss_user"));
    const participantIds = participants.length > 0 ? participants : [user.id];

    // Create FormData for file upload
    const formData = new FormData();
    formData.append("question", question.trim());
    formData.append("options", JSON.stringify(validOptions.map(opt => opt.trim())));
    formData.append("participants", JSON.stringify(participantIds));
    
    if (image) {
      formData.append("image", image);
    }

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/create-poll/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("hsapss_tokens"))?.access_token
        }`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.status === "success") {
          alert("Poll created successfully!");
          navigate("/");
        } else {
          alert(data.message || "Error creating poll");
        }
      })
      .catch((error) => {
        setLoading(false);
        alert("Error creating poll: " + error.message);
      });
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-haspss text-primary-700">Create Poll</h1>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-primary-600 hover:text-primary-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-primary-800 mb-2">
                Poll Question
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full p-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows="3"
                placeholder="Enter your poll question..."
                required
              />
            </div>
    
            <div>
              <label className="block text-sm font-medium text-primary-800 mb-2">
                Poll Image (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full p-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-xs text-primary-600 mt-1">
                Upload an image to display above your poll question
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-primary-800">
                  Options
                </label>
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                >
                  + Add Option
                </button>
              </div>
              
              {options.map((option, index) => (
                <div key={index} className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="flex-1 p-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder={`Option ${index + 1}`}
                    required
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-800 mb-3">
                Participants (Optional)
              </label>
              <p className="text-sm text-primary-600 mb-3">
                Select users who can participate in this poll. If none selected, only you will be able to vote.
              </p>
              
              <div className="max-h-48 overflow-y-auto border border-primary-300 rounded-lg p-3">
                {availableUsers.map((user) => (
                  <div key={user.id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`user-${user.id}`}
                      checked={participants.includes(user.id)}
                      onChange={() => handleParticipantToggle(user.id)}
                      className="mr-3"
                    />
                    <img
                      src={import.meta.env.VITE_BACKEND_URL + user.profile_image}
                      alt={user.first_name}
                      className="w-8 h-8 rounded-full object-cover mr-3"
                    />
                    <label htmlFor={`user-${user.id}`} className="text-sm text-primary-800">
                      {user.first_name} {user.last_name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="flex-1 py-3 px-4 border border-primary-300 text-primary-700 rounded-lg hover:bg-primary-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white rounded-lg transition-colors font-medium"
              >
                {loading ? "Creating..." : "Create Poll"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePoll;