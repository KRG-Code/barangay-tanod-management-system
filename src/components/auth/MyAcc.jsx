import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { compressImage } from '../../utils/ImageCompression';
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

export default function MyAcc() {
  const navigate = useNavigate();
  const [accountState, setAccountState] = useState({
    firstName: "",
    lastName: "",
    address: "",
    contactNumber: "",
    birthday: "",
    gender: "",
    profilePicture: null,
  });
  const [age, setAge] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const calculateAge = (birthday) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    const fetchData = async () => {
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
          setAccountState({
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            contactNumber: data.contactNumber,
            birthday: data.birthday
              ? new Date(data.birthday).toISOString().split("T")[0]
              : "",
            gender: data.gender || "",
            profilePicture: data.profilePicture || null,
          });
          setAge(calculateAge(data.birthday));
        } else {
          toast.error(data.message || "Failed to load user data");
        }
      } catch (error) {
        toast.error("An error occurred while fetching user data.");
      }
    };

    fetchData();
  }, [navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setAccountState((prevState) => ({ ...prevState, [id]: value }));
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressedFile = await compressImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setAccountState((prevState) => ({ ...prevState, profilePicture: reader.result }));
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        toast.error("Image compression failed. Please try again with a smaller image.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/auth/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(accountState),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      } else if (response.status === 400) {
        toast.error("Validation error. Please check the data and try again.");
      } else if (response.status === 413) {
        toast.error("Image too large. Please try with a smaller image.");
      } else {
        toast.error(data.message || "Failed to update profile.");
      }
    } catch (error) {
      toast.error("An error occurred while updating the profile.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/auth/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(passwords),
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success("Password changed successfully!");
        setIsChangingPassword(false);
      } else if (response.status === 401) {
        toast.error("Current password is incorrect.");
      } else {
        toast.error(data.message || "Failed to change password.");
      }
    } catch (error) {
      toast.error("An error occurred while changing the password.");
    }
  };

  return (
    <div className="container mx-auto mt-8 space-y-6 ">
      <ToastContainer /> {/* Include the ToastContainer */}
      <div className="flex">
        <div className="w-1/3">
          <div className="relative">
            <img
              src={accountState.profilePicture || "/default-user-icon.png"}
              alt="Profile"
              className="rounded-full w-32 h-32 object-cover border-2 border-gray-200"
            />
            {isEditing && (
              <label
                htmlFor="profilePicture"
                className="absolute bottom-0 left-24 bg-white text-black border border-gray-300 p-1 rounded-full cursor-pointer"
              >
                <FaEdit />
                <input
                  type="file"
                  id="profilePicture"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePictureChange}
                />
              </label>
            )}
          </div>

          <div className="mt-4">
            <span className="text-lg font-semibold">Age: </span>
            <span>{age || "N/A"}</span>
          </div>

          <div className="mt-4">
            <span className="text-lg font-semibold">Gender: </span>
            {isEditing ? (
              <select
                id="gender"
                value={accountState.gender}
                onChange={handleChange}
                className="border px-2 py-1 text-black"
              >
                <option value="">Not Specified</option>
                <option value="Male">♂ Male</option>
                <option value="Female">♀ Female</option>
                <option value="Others">⚧ Others</option>
                <option value="None">❌ None</option>
              </select>
            ) : (
              <span>{accountState.gender || "Not Specified"}</span>
            )}
          </div>

          {!isEditing && !isChangingPassword && (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-6 mr-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Edit Profile
            </button>
          )}

          {!isEditing && (
            <button
              onClick={() => setIsChangingPassword(true)}
              className="mt-6 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Change Password
            </button>
          )}
        </div>

        <div className="w-2/3">
          <h1 className="text-3xl font-bold">My Profile</h1>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="text-lg">
              <span className="font-semibold">Full Name: </span>
              {isEditing ? (
                <input
                  type="text"
                  id="firstName"
                  value={accountState.firstName}
                  onChange={handleChange}
                  className="border px-2 py-1 text-black"
                />
              ) : (
                <span>{`${accountState.firstName} ${accountState.lastName}`}</span>
              )}
            </div>

            <div className="text-lg">
              <span className="font-semibold">Address: </span>
              {isEditing ? (
                <input
                  type="text"
                  id="address"
                  value={accountState.address}
                  onChange={handleChange}
                  className="border px-2 py-1 text-black"
                />
              ) : (
                <span>{accountState.address}</span>
              )}
            </div>

            <div className="text-lg">
              <span className="font-semibold">Contact Number: </span>
              {isEditing ? (
                <input
                  type="text"
                  id="contactNumber"
                  value={accountState.contactNumber}
                  onChange={handleChange}
                  className="border px-2 py-1 text-black"
                />
              ) : (
                <span>{accountState.contactNumber}</span>
              )}
            </div>

            <div className="text-lg">
              <span className="font-semibold">Birthday: </span>
              {isEditing ? (
                <input
                  type="date"
                  id="birthday"
                  value={accountState.birthday}
                  onChange={handleChange}
                  className="border px-2 py-1 text-black"
                />
              ) : (
                <span>{accountState.birthday}</span>
              )}
            </div>

            {loading && <p>Loading...</p>}

            {isEditing && (
              <>
                <button
                  type="submit"
                  className="mt-6 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="mt-6 ml-6 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </>
            )}
          </form>

          {isChangingPassword && (
            <form className="mt-8 space-y-6" onSubmit={handlePasswordChange}>
              <div className="text-lg">
                <label htmlFor="currentPassword" className="font-semibold">
                  Current Password:{" "}
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={passwords.currentPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      currentPassword: e.target.value,
                    })
                  }
                  className="border px-2 py-1 text-black"
                />
              </div>

              <div className="text-lg">
                <label htmlFor="newPassword" className="font-semibold">
                  New Password:{" "}
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, newPassword: e.target.value })
                  }
                  className="border px-2 py-1 text-black"
                />
              </div>

              <div className="text-lg">
                <label htmlFor="confirmNewPassword" className="font-semibold">
                  Confirm New Password:{" "}
                </label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  value={passwords.confirmNewPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      confirmNewPassword: e.target.value,
                    })
                  }
                  className="border px-2 py-1 text-black"
                />
              </div>

              <button
                type="submit"
                className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Change Password
              </button>
              <button
                type="button"
                onClick={() => setIsChangingPassword(false)}
                className="mt-6 ml-6 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
