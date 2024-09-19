import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaSave, FaTimes, FaLock } from 'react-icons/fa'; // Icons for edit, save, cancel, lock

export default function MyAcc() {
  const navigate = useNavigate();
  const [accountState, setAccountState] = useState({
    firstName: '',
    lastName: '',
    address: '',
    contactNumber: '',
    birthday: '',
    gender: '', // Add gender
    profilePicture: null,
  });
  const [age, setAge] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Toggle for editing mode
  const [isChangingPassword, setIsChangingPassword] = useState(false); // Toggle for changing password
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Calculate age from birthday
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

  // Fetch user data from the backend when the page loads
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/auth/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setAccountState((prevState) => ({
            ...prevState,
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            contactNumber: data.contactNumber,
            birthday: data.birthday ? new Date(data.birthday).toISOString().split('T')[0] : '',
            gender: data.gender || '',
            profilePicture: data.profilePicture || null,
          }));
          setAge(calculateAge(data.birthday));
        } else {
          setErrorMessage(data.message || 'Failed to load user data');
        }
      } catch (error) {
        console.error(error);
        setErrorMessage('An error occurred. Please try again.');
      }
    };

    fetchData();
  }, [navigate]);

  // Handle form input change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setAccountState({ ...accountState, [id]: value });
  };

  // Handle profile picture change
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAccountState({ ...accountState, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle gender selection
  const handleGenderChange = async (gender) => {
    setAccountState({ ...accountState, gender });
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/auth/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ gender }),
      });
    } catch (error) {
      console.error('Failed to update gender:', error);
    }
  };

  // Handle form submission to update user profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5000/api/auth/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(accountState),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage('Profile updated successfully!');
        setIsEditing(false); // Exit edit mode after saving
        setErrorMessage('');
      } else {
        setErrorMessage(data.message || 'Failed to update profile');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      setErrorMessage('New passwords do not match.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwords),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage('Password changed successfully!');
        setErrorMessage('');
        setIsChangingPassword(false);
      } else {
        setErrorMessage(data.message || 'Failed to change password');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container mx-auto mt-8 space-y-6">
      <div className="flex">
        {/* Profile Section (Left-Aligned) */}
        <div className="w-1/3">
          {/* Profile Picture */}
          <div className="relative">
            <img
              src={accountState.profilePicture || '/default-user-icon.png'}
              alt="Profile"
              className="rounded-full w-32 h-32 object-cover border-2 border-gray-200"
            />
            {isEditing && (
              <div className="absolute bottom-0 right-0 bg-white border border-gray-300 p-1 rounded-full">
                <label htmlFor="profilePicture" className="cursor-pointer">
                  <FaEdit />
                  <input
                    type="file"
                    id="profilePicture"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePictureChange}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Age */}
          <div className="mt-4">
            <span className="text-lg font-semibold">Age: </span>
            <span>{age || 'N/A'}</span>
          </div>

          {/* Gender Selection */}
          <div className="mt-4">
            <span className="text-lg font-semibold">Gender: </span>
            <button
              className={`mx-2 ${accountState.gender === 'male' ? 'text-blue-500' : 'text-gray-500'}`}
              onClick={() => handleGenderChange('male')}
            >
              ♂ Male
            </button>
            <button
              className={`mx-2 ${accountState.gender === 'female' ? 'text-pink-500' : 'text-gray-500'}`}
              onClick={() => handleGenderChange('female')}
            >
              ♀ Female
            </button>
          </div>

          {/* Edit Button */}
          {!isEditing && !isChangingPassword && (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Edit Profile
            </button>
          )}

          {/* Change Password Button */}
          {!isEditing && !isChangingPassword && (
            <button
              onClick={() => setIsChangingPassword(true)}
              className="mt-6 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Change Password
            </button>
          )}
        </div>

        {/* Profile Form (Right-Aligned) */}
        <div className="w-2/3">
          <h1 className="text-3xl font-bold">My Profile</h1>

          {/* Profile Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="text-lg">
              <span className="font-semibold">Full Name: </span>
              {isEditing ? (
                <input
                  type="text"
                  id="firstName"
                  value={accountState.firstName}
                  onChange={handleChange}
                  className="border px-2 py-1"
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
                  className="border px-2 py-1"
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
                  className="border px-2 py-1"
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
                  className="border px-2 py-1"
                />
              ) : (
                <span>{accountState.birthday}</span>
              )}
            </div>

            {loading && <p>Loading...</p>}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {successMessage && <p className="text-green-500">{successMessage}</p>}

            {/* Save and Cancel buttons */}
            {isEditing && (
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>

          {/* Password Change Form */}
          {isChangingPassword && (
            <form className="mt-8 space-y-6" onSubmit={handlePasswordChange}>
              <div>
                <label htmlFor="currentPassword" className="block text-lg font-semibold">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  className="border px-2 py-1 w-full"
                  required
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-lg font-semibold">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  className="border px-2 py-1 w-full"
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmNewPassword" className="block text-lg font-semibold">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  value={passwords.confirmNewPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmNewPassword: e.target.value })}
                  className="border px-2 py-1 w-full"
                  required
                />
              </div>

              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              {successMessage && <p className="text-green-500">{successMessage}</p>}

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  Save Password
                </button>
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
