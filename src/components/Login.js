import { useState } from 'react';
import { loginFields } from "../constants/formFields";
import { useNavigate } from 'react-router-dom';
import FormAction from "./FormAction";
import FormExtra from "./FormExtra";
import Input from "./Input";

const fieldsState = loginFields.reduce((acc, field) => {
  acc[field.id] = '';
  return acc;
}, {});

export default function Login() {
  const [loginState, setLoginState] = useState(fieldsState);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setLoginState({ ...loginState, [e.target.id]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginState),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage('Logged in successfully!');
        localStorage.setItem('token', data.token);
        navigate('/Homepage');
      } else {
        setErrorMessage(data.message || 'Invalid login credentials');
      }
    } catch {
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="-space-y-px">
        {loginFields.map(field => (
          <Input
            key={field.id}
            handleChange={handleChange}
            value={loginState[field.id]}
            {...field}
          />
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
