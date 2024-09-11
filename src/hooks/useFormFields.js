import { useState } from 'react';

export const useFormFields = (initialState) => {
  const [formState, setFormState] = useState(initialState);

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.id]: e.target.value });
  };

  return [formState, handleChange];
};
