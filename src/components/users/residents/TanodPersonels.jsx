import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TanodPersonels() {
  const [tanods, setTanods] = useState([]);
  const [selectedTanod, setSelectedTanod] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [ratings, setRatings] = useState([]); // State for user's previous ratings

  // Fetch tanods list
  useEffect(() => {
    const fetchTanods = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in.");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/auth/users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const users = await response.json();

        if (Array.isArray(users)) {
          const tanods = users.filter((user) => user.userType === "tanod");
          setTanods(tanods);
        } else {
          toast.error("Unexpected response format.");
        }
      } catch (error) {
        console.error("Error fetching tanods:", error);
        toast.error("Error fetching Tanods.");
      }
    };
    fetchTanods();
  }, []);

  // Fetch current user's ratings
  useEffect(() => {
    const fetchUserRatings = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in.");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/my-ratings",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error fetching user ratings");
        }

        const ratings = await response.json();
        console.log("User Ratings:", ratings);
        setRatings(ratings); // Store the user's ratings in state
      } catch (error) {
        console.error("Error fetching user ratings:", error);
        toast.error("Error fetching user ratings.");
      }
    };

    fetchUserRatings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTanod || rating === 0 || comment.trim() === "") {
      toast.error(
        "Please select a tanod, provide a rating, and leave a comment"
      );
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/tanods/${selectedTanod}/rate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating,
            comment,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Rating and comment submitted successfully");
        setSelectedTanod("");
        setRating(0);
        setComment("");
      } else {
        toast.error(data.message || "Failed to submit rating");
      }
    } catch (error) {
      toast.error("An error occurred while submitting rating");
    } finally {
      setLoading(false);
    }
  };

  const deleteRating = async (ratingId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this rating?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/auth/ratings/${ratingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast.success("Rating deleted successfully");
        setRatings(ratings.filter((rating) => rating._id !== ratingId)); // Update the state
      } else {
        toast.error("Failed to delete rating");
      }
    } catch (error) {
      console.error("Error deleting rating:", error);
      toast.error("Error deleting rating");
    }
  };

  const editRating = (rating) => {
    setSelectedTanod(rating.tanodId._id);
    setRating(rating.rating);
    setComment(rating.comment);
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4 text-center">Rate a Tanod</h1>

      {/* Display Tanod List */}
      <table className="min-w-full TopNav">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-center">Profile Picture</th>
            <th className="py-2 px-4 border-b text-center">Name</th>
            <th className="py-2 px-4 border-b text-center">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {tanods.map((tanod) => (
            <tr key={tanod._id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b text-center">
                <img
                  src={tanod.profilePicture || "/default-user-icon.png"}
                  alt={`${tanod.firstName} ${tanod.lastName}`}
                  className="w-12 h-12 rounded-full mx-auto"
                />
              </td>
              <td className="py-2 px-4 border-b text-center text-black">
                {tanod.firstName} {tanod.lastName}
              </td>
              <td className="py-2 px-4 border-b text-center">
                <button
                  onClick={() => setSelectedTanod(tanod._id)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Rate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Display Previous Ratings */}
      {ratings.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Your Previous Ratings</h2>
          <table className="min-w-full TopNav">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Tanod Name</th>
                <th className="py-2 px-4 border-b">Rating</th>
                <th className="py-2 px-4 border-b">Comment</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ratings.map((rating) => (
                <tr key={rating._id}>
                  <td className="py-2 px-4 border-b text-center">
                    {rating.tanodId.firstName} {rating.tanodId.lastName}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {rating.rating}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {rating.comment}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <button
                      onClick={() => editRating(rating)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteRating(rating._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Rating Form */}
      {selectedTanod && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 TopNav p-4 rounded shadow-md"
        >
          <h2 className="text-xl mb-2">Rate Tanod</h2>
          <div className="mb-4">
            <label
              htmlFor="rating"
              className="block text-lg font-semibold mb-2"
            >
              Rating (1 to 5):
            </label>
            <select
              id="rating"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border border-gray-300 p-2 rounded w-full text-black"
              required
            >
              <option value={0}>Select rating</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="comment"
              className="block text-lg font-semibold mb-2"
            >
              Comment:
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full text-black"
              required
              placeholder="Leave a comment..."
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Rating"}
          </button>
        </form>
      )}
    </div>
  );
}
