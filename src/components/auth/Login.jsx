// src/pages/Login.js
import { useState } from 'react';
import { loginFields } from "../constants/formFields";
import { useNavigate } from 'react-router-dom';
import FormAction from "../forms/FormAction";
import FormExtra from "../forms/FormExtra";
import Input from "../inputs/Input";
import { validateLogin } from '../../utils/validation';


const fieldsState = loginFields.reduce((acc, field) => {
  acc[field.id] = '';
  return acc;
}, {});

export default function Login() {
  const [loginState, setLoginState] = useState(fieldsState);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = e => {
    setLoginState({ ...loginState, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: '' });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const { valid, errors: validationErrors } = validateLogin(loginState);
    if (!valid) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginState),
      });
      const data = await response.json();

      if (response.ok) {
        // Save the token to localStorage
        localStorage.setItem('token', data.token);
        setSuccessMessage('Logged in successfully!');
        setErrorMessage('');

        // Navigate to the dashboard or protected route
        navigate('/Dashboard');
      } else {
        setErrorMessage(data.message || 'Invalid login credentials');
        setSuccessMessage('');
      }
    } catch {
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="-space-y-px text-black">
        {loginFields.map(field => (
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
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      <FormExtra />
      <FormAction handleSubmit={handleSubmit} text="Login" />

    </form>
  );
}
