import { useState } from 'react';
import { signupFields } from "../constants/formFields";
import FormAction from "./FormAction";
import Input from "./Input";

const fieldsState = signupFields.reduce((acc, field) => {
  acc[field.id] = '';
  return acc;
}, {});

export default function Signup() {
  const [signupState, setSignupState] = useState(fieldsState);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setSignupState({ ...signupState, [e.target.id]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupState),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage('Account created successfully!');
      } else {
        setErrorMessage(data.message || 'Error occurred during registration');
      }
    } catch {
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div>
        {signupFields.map(field => (
          <Input
            key={field.id}
            handleChange={handleChange}
            value={signupState[field.id]}
            {...field}
          />
        ))}
        {loading && <p>Loading...</p>}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        <FormAction handleSubmit={handleSubmit} text="Signup" />
      </div>
    </form>
  );
}
