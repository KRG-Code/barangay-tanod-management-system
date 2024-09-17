import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signupFields } from "../constants/formFields";
import FormAction from "../forms/FormAction";
import Input from "../inputs/Input";
import { validateSignup } from '../../utils/validation';
import { getPasswordStrength } from '../../utils/passwordStrength';

const fieldsState = signupFields.reduce((acc, field) => {
  acc[field.id] = '';
  return acc;
}, {});

export default function Signup() {
  const navigate = useNavigate();
  const [signupState, setSignupState] = useState(fieldsState);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [age, setAge] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, strength: 'Weak', suggestions: [] });

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

  const handleChange = e => {
    const { id, value } = e.target;
    setSignupState({ ...signupState, [id]: value });

    if (id === 'birthday') {
      const calculatedAge = calculateAge(value);
      setAge(calculatedAge);
    }

    if (id === 'password') {
      const { strength, suggestions } = getPasswordStrength(value);
      setPasswordStrength({ strength, suggestions });
    }

    setErrors({ ...errors, [id]: '' });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const { valid, errors: validationErrors } = validateSignup(signupState);
    if (!valid) {
      setErrors(validationErrors);
      return;
    }

    const submissionData = { ...signupState, age };

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage('Account created successfully!');
        navigate('/');
        setErrorMessage('');
      } else {
        setErrorMessage(data.message || 'Error occurred during registration');
        setSuccessMessage('');
      }
    } catch {
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6 text-black" onSubmit={handleSubmit}>
      <div>
        {signupFields.map(field => (
          <div key={field.id}>
            <Input
              handleChange={handleChange}
              value={signupState[field.id]}
              {...field}
            />
            {errors[field.id] && <p className="text-red-500">{errors[field.id]}</p>}
          </div>
        ))}

        {/* Password Strength Feedback */}
        {signupState.password && (
          <div>
            <p className={`text-${passwordStrength.strength === 'Very Strong' ? 'green-500' : 'red-500'}`}>
              Password Strength: {passwordStrength.strength}
            </p>
            <ul className="list-disc ml-4 text-sm text-red-500">
              {passwordStrength.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Age Feedback */}
        {signupState.birthday && <p className="text-gray-500">Age: {age}</p>}

        {loading && <p>Loading...</p>}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        <FormAction handleSubmit={handleSubmit} text="Signup" />
      </div>
    </form>
  );
}
