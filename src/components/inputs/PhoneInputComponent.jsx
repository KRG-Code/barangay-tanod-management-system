import React, { useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'; // Styles for the phone input

const PhoneInputComponent = ({ phone, setPhone, selectedCountry }) => {
  // When selectedCountry changes, update the country code in the phone input
  useEffect(() => {
    if (selectedCountry) {
      setPhone(`+${selectedCountry.phoneCode}`); // Set the phone code based on the selected country
    }
  }, [selectedCountry, setPhone]);  // Add setPhone to the dependency array
  

  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm font-medium text-gray-700">Phone Number</label>
      <PhoneInput
        country={selectedCountry ? selectedCountry.shortName.toLowerCase() : 'us'} // Default to US if no country is selected
        value={phone}
        onChange={setPhone}
        inputProps={{
          name: 'phone',
          required: true,
          autoFocus: true,
        }}
      />
    </div>
  );
};

export default PhoneInputComponent;
