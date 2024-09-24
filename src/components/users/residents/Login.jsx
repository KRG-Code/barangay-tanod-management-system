// src/pages/Login.js
import { useState } from 'react';
import { loginFieldsResident } from "../../constants/formFields";
import { useNavigate } from 'react-router-dom';
import FormAction from "../../forms/FormAction";
import FormExtra from "../../forms/FormExtra";
import Input from "../../inputs/Input";
import { validateLoginResident } from '../../../utils/validation';
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

const fieldsState = loginFieldsResident.reduce((acc, field) => {
  acc[field.id] = '';
  return acc;
}, {});

export default function Login() {
  const [loginState, setLoginState] = useState(fieldsState);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = e => {
    setLoginState({ ...loginState, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: '' });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const { valid, errors: validationErrors } = validateLoginResident(loginState);
    if (!valid) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login/resident', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginState),
      });
      const data = await response.json();

      if (response.ok) {
        // Save the token to localStorage
        localStorage.setItem('token', data.token);
        toast.success('Logged in successfully!'); // Use Toastify for success

        // Navigate to the dashboard or protected route
        navigate('/Dashboard');
      } else {
        toast.error(data.message || 'Invalid login credentials'); // Use Toastify for error
      }
    } catch {
      toast.error('An error occurred. Please try again.'); // Use Toastify for errors
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer /> {/* Include the ToastContainer */}
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="-space-y-px text-black">
          {loginFieldsResident.map(field => (
            <div key={field.id}>
              <Input
                handleChange={handleChange}
                value={loginState[field.id]}
                {...field}
              />
              {errors[field.id] && <p className="text-red-500">{errors[field.id]}</p>}
            </div>
          ))}
        </div>
        {loading && <p>Loading...</p>}
        <FormExtra />
        <FormAction handleSubmit={handleSubmit} text="Login" />
      </form>
    </>
  );
}
