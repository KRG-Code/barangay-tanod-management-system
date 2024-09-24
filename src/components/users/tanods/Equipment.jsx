import React, { useState, useEffect } from "react";
import axios from "axios";
import { storage } from "../../../firebase"; // Adjust as needed
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const Equipment = () => {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", image: null });
  const [imagePreview, setImagePreview] = useState(null);

  const baseURL = "http://localhost:5000"; // Adjust based on your backend server port

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Unauthorized: Please log in.");
          return;
        }

        const response = await axios.get(`${baseURL}/api/equipments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching equipment", error);
        if (error.response && error.response.status === 401) {
          toast.error("Unauthorized: Please log in again.");
        } else {
          toast.error("Error fetching equipment. Please try again.");
        }
      }
    };

    fetchEquipments();
  }, [baseURL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewItem({ ...newItem, image: file });
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const storageRef = ref(storage, `Equipments/${newItem.image.name}`);
    try {
      const snapshot = await uploadBytes(storageRef, newItem.image);
      const imageUrl = await getDownloadURL(snapshot.ref);

      const formData = {
        name: newItem.name,
        borrowDate: new Date().toISOString(),
        returnDate: 0, // Set returnDate to 0
        imageUrl,
      };

      const token = localStorage.getItem("token");

      const response = await axios.post(`${baseURL}/api/equipments`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setItems([...items, response.data]);
      setShowForm(false);
      setNewItem({ name: "", image: null });
      setImagePreview(null);
      toast.success("Item borrowed successfully!");
    } catch (error) {
      console.error("Error adding equipment", error);
      if (error.response && error.response.status === 401) {
        toast.error("Unauthorized: Please log in again.");
      } else {
        toast.error("Error adding equipment. Please try again.");
      }
    }
  };

  const handleReturn = (index) => {
    toast.info(
      <div>
        <p>Do you want to return this item?</p>
        <button
          className="bg-green-500 text-white p-2 rounded m-2"
          onClick={() => confirmReturn(index)}
        >
          Yes
        </button>
        <button
          className="bg-red-500 text-white p-2 rounded m-2"
          onClick={() => toast.dismiss()}
        >
          No
        </button>
      </div>,
      {
        autoClose: false,
      }
    );
  };

  const confirmReturn = async (index) => {
    try {
      const itemToReturn = items[index];
      console.log("Returning item:", itemToReturn); // Check if the ID exists
    
      if (!itemToReturn._id) {
        toast.error("Invalid item ID. Please try again.");
        return;
      }
    
      // Get the current date and time
      const currentDateTime = new Date().toISOString();
    
      const updatedItem = {
        returnDate: currentDateTime, // Set return date to current date and time
      };
    
      const token = localStorage.getItem("token");
    
      const response = await axios.put(
        `${baseURL}/api/equipments/${itemToReturn._id}`, // Ensure this ID is correct
        updatedItem,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    
      const updatedItems = [...items];
      updatedItems[index] = response.data;
      setItems(updatedItems);
      toast.dismiss();
      toast.success("Item returned successfully!");
    } catch (error) {
      console.error("Error returning equipment", error);
      toast.error("Error returning equipment. Please try again.");
    }
  };
  
  
  

  const formatDate = (date) => {
    const notReturnedDate = "1970-01-01T00:00:00.000Z"; // Use UTC format for comparison
    if (date === notReturnedDate) {
      return <span className="text-red-500">Not Yet Returned</span>; // Show this if returnDate is the default date
    }
    return dayjs(date).format("hh:mm A DD-MM-YYYY");
  };

  return (
    <div className="container mx-auto p-5">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6">Equipment</h1>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {showForm ? "Cancel" : "Add Borrowed Item"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-100 p-4 rounded shadow-md mb-6 text-black"
        >
          <div className="mb-4">
            <input
              type="text"
              name="name"
              placeholder="Item Name"
              value={newItem.name}
              onChange={handleChange}
              required
              className="border border-gray-300 p-2 w-full rounded"
            />
          </div>

          <div className="mb-4">
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              required
              className="border border-gray-300 p-2 w-full rounded"
            />
          </div>

          {imagePreview && (
            <div className="mb-4">
              <h4 className="text-lg font-bold">Image Preview:</h4>
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 w-24 h-24 object-cover"
              />
            </div>
          )}

          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Borrow Item
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="TopNav">
            <tr>
              <th className="py-2 px-4">Item Name</th>
              <th className="py-2 px-4">Borrow Date & Time</th>
              <th className="py-2 px-4">Return Date & Time</th>
              <th className="py-2 px-4">Item Image</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No borrowed items.
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr key={index} className="border-b text-black text-center">
                  <td className="py-2 px-4">{item.name}</td>
                  <td className="py-2 px-4">{formatDate(item.borrowDate)}</td>
                  <td className="py-2 px-4">{formatDate(item.returnDate)}</td>
                  <td className="py-2 px-4">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-24 h-24 object-cover"
                    />
                  </td>
                  <td className="py-2 px-4">
                    {item.returnDate === "1970-01-01T00:00:00.000Z" && (
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                        onClick={() => handleReturn(index)}
                      >
                        Return
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Equipment;
