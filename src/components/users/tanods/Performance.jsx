import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 


export default function Perform() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
      profilePicture: null,
      fullName: "",
    });
  const tanod = {
    profilePicture: "https://via.placeholder.com/150", // Placeholder image
    fullName: "Juan Dela Cruz",
    overallRating: 4.2,
    ratingCounts: [5, 10, 15, 5, 2], // Ratings from 1 to 5
    badges: ["Excellent Service", "Community Helper", "Top Rated"],
    comments: [
      "Great job on maintaining peace!",
      "Very helpful during emergencies.",
      "Could improve response time.",
    ],
  };
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/auth/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setUser({
            profilePicture: data.profilePicture || null,
            fullName: `${data.firstName} ${data.lastName}`,
          });
        } else {
          toast.error(data.message || "Failed to load user data");
        }
      } catch (error) {
        toast.error("An error occurred while fetching user data.");
      }
    };
    fetchUserData();
}, [navigate]);
  // Maximum rating count for scaling
  const maxCount = Math.max(...tanod.ratingCounts);

  return (
    <div className="flex flex-col md:flex-row justify-between items-start p-4">
      <div className="flex flex-col items-center md:items-start md:w-1/2 mb-4 md:mb-0">
        <div className="flex items-center mb-4">
        <img
              src={user.profilePicture || "/default-user-icon.png"}
              alt="User Profile"
              className="rounded-full w-32 h-32 object-cover border-2 border-gray-200"
            />
          <h2 className="mt-4 ml-6 text-xl font-bold">{user.fullName}</h2>
        </div>

        <div className="flex justify-between w-full max-w-md mb-4">
          <div className="text-center flex flex-auto items-center justify-center">
            <p className="text-lg font-semibold">Overall Rating <br /> {tanod.overallRating}</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold">Rating Counts</p>
            <div className="flex flex-col items-center">
              {tanod.ratingCounts.map((count, index) => (
                <div key={index} className="flex items-center mb-1 w-full max-w-md">
                  <span className="mr-2">{index + 1}:</span>
                  <div className="flex-1 bg-gray-300 rounded-full h-4">
                    <div
                      className="bg-blue-500 h-full rounded-full"
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 font-bold">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="md:w-1/2">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Badges</h3>
          <div className="flex flex-wrap space-x-2">
            {tanod.badges.map((badge, index) => (
              <span key={index} className="bg-blue-500 text-white px-2 py-1 rounded">
                {badge}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Residents' Comments</h3>
          <ul className="list-disc pl-5">
            {tanod.comments.map((comment, index) => (
              <li key={index} className="mb-2">{comment}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
