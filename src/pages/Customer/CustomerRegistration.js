import React, { useState } from 'react';
import axios from 'axios';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'
import { useNavigate } from 'react-router-dom';
import { handleInputChange } from '../../formUtils';

const CustomerRegistration = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
      const [imageFile, setImageFile] = useState(null);
      const [uploading, setUploading] = useState(false);
      const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    cust_email: '',
    cust_password: '',
    cust_first_name: '',
    cust_last_name: '',
    cust_date_of_birth: '',
    cust_phone_number: '',
    cust_emergency_contact_name: '',
    cust_emergency_contact_number: '',
    cust_id_doc: '',
    cust_license_number: '',
    cust_license_expiry_date: '',
    cust_active: true,
    cust_created_date: '',
    cust_modified_date: '',
    cust_last_action: 'Created',
    cust_deactivated_date: null
  });

      
  const uploadImage = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  }

  const isAtLeast21 = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age > 21 || (age == 21);
  };

  function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
  }
  const validateStep = () => {
  setError(''); 
  if (step === 1) {
    const { cust_email, cust_password, cust_first_name, cust_last_name, cust_date_of_birth, cust_phone_number } = formData;
    if (!cust_email || !cust_password || !cust_first_name || !cust_last_name || !cust_date_of_birth || !cust_phone_number) {
      setError("Please fill all fields on this step.");
      return false;
    }
    if(!isValidEmail(cust_email))
      {
        setError("Please enter a valid email.");
        return false;
       }
    if (!isAtLeast21(cust_date_of_birth)) {
      setError("You must be at least 21 years old.");
      return false;
    }
  }

  if (step === 2) {
    const { cust_emergency_contact_name, cust_emergency_contact_number } = formData;
    if (!cust_emergency_contact_name || !cust_emergency_contact_number) {
      setError("Please fill in emergency contact details.");
      return false;
    }
  }


  return true;
};

  const handleChange = handleInputChange(setFormData);

  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
    setLoading(false);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handlePhoneChange = (value) => {
    setFormData({
      ...formData,
      ['cust_phone_number']: value
    });
  };

  const handleEmergencyPhoneChange = (value) => {
    setFormData({
      ...formData,
      ['cust_emergency_contact_number']: value
    });
  };
  const [showVerificationModal, setShowVerificationModal] = useState(false);

const handleProceedToLogin = () => {
  setShowVerificationModal(false);
  navigate("/customer-login");
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const now = new Date().toISOString();
    const payload = {
      ...formData,
      cust_created_date: now,
      cust_modified_date: now,
      cust_deactivated_date: null
    };

    const expiryDate = new Date(formData.cust_license_expiry_date);
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 1);

    if (expiryDate <= sixMonthsFromNow) {
      setError("License must be valid for 1 month"); // Your function to flag license issue
      setLoading("false")
      return false;
    }
  
    try {
      const response = await axios.post("http://localhost:8080/api/customer", payload);
        console.log("Customer uploaded:", response.data);
            setUploading(true);
            const imageformData = new FormData();
            imageformData.append("image", imageFile);

            try {
            const response2 = await fetch(`http://localhost:8080/api/customer/${response.data.customer_id}/upload-image`, {
            method: "POST",
            body: imageformData,
            });

            if (!response2.ok) throw new Error("Upload failed");

            const imgUrl = await response.text(); // or JSON if backend returns JSON
            console.log("Image uploaded:", imgUrl);
             } catch (error) {
            console.error("Image upload error:", error);
            } finally {
            setUploading(false);
            }
  
    setShowVerificationModal(true);
    } catch (err) {
      alert("Failed to create employee");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <button 
      onClick={() => navigate('/')} 
      className="absolute top-4 left-4 mb-4 px-4 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200 transition"
    >
      Home
    </button>
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      {/* Step Indicator */}
        <div className="flex justify-between mb-6">
          {[1, 2, 3].map((num, i) => (
            <div key={i} className="flex-1 text-center">
              <div
                className={`w-10 h-10 mx-auto mb-2 flex items-center justify-center rounded-full 
                ${step === num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                {num}
              </div>
              <div className={`text-sm font-medium ${step === num ? 'text-blue-600' : 'text-gray-500'}`}>
                {['Personal Info', 'Emergency Contact', 'License and documents'][i]}
              </div>
            </div>
          ))}
        </div>

  <h2 className="text-xl font-semibold text-center mb-4">Step {step} of 3</h2>

  <form onSubmit={handleSubmit} className="space-y-4">
    {step === 1 && (
      <>
        <div>
          <label className="flex block text-sm font-medium mb-1">
            <p className="block text-sm font-medium text-red-500">*</p>
            Email:
            
          </label>
          <input
            type="email"
            name="cust_email"
            placeholder="Email"
            value={formData.cust_email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>
        <div>
          <label className=" flex block text-sm font-medium mb-1">
             <p className="block text-sm font-medium text-red-500">*</p>
            Password:
          </label>   
                 
          <input
            type="password"
            name="cust_password"
            placeholder="Password"
            value={formData.cust_password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className=" flex block text-sm font-medium mb-1">
             <p className="block text-sm font-medium text-red-500">*</p>
            First Name:
          </label>             
        <input
          type="text"
          name="cust_first_name"
          placeholder="First Name"
          value={formData.cust_first_name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
        </div>

        <div>
          <label className=" flex block text-sm font-medium mb-1">
             <p className="block text-sm font-medium text-red-500">*</p>
            Last Name:
          </label>  
        <input
          type="text"
          name="cust_last_name"
          placeholder="Last Name"
          value={formData.cust_last_name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
        </div>

        <div>
          <label className=" flex block text-sm font-medium mb-1">
             <p className="block text-sm font-medium text-red-500">*</p>
              Date of birth:
          </label>            
        <input
          type="date"
          name="cust_date_of_birth"
          value={formData.cust_date_of_birth}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
        </div>

        <div>
          <label className=" flex block text-sm font-medium mb-1">
             <p className="block text-sm font-medium text-red-500">*</p>
              Phone number:
          </label>   
        <PhoneInput
          country={'us'}
          value={formData.cust_phone_number}
          onChange={handlePhoneChange}
          inputStyle={{ width: '100%' }}
        />
        </div>
        <div className='flex justify-end'>
        <button
          type="button"
          onClick={nextStep}
          className=" bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Next
        </button>
        </div>
      </>
    )}

    {step === 2 && (
      <>
        <div>
          <label className=" flex block text-sm font-medium mb-1">
             <p className="block text-sm font-medium text-red-500">*</p>
              Emergency Contact Name:
          </label>   
        <input
          type="text"
          placeholder="Emergency Contact Name"
          name="cust_emergency_contact_name"
          value={formData.cust_emergency_contact_name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
        </div>

        <div>
          <label className=" flex block text-sm font-medium mb-1">
             <p className="block text-sm font-medium text-red-500">*</p>
              Emergency Contact Number:
          </label>   
        <PhoneInput
          country={'us'}
          value={formData.cust_emergency_contact_number}
          onChange={handleEmergencyPhoneChange}
          inputStyle={{ width: '100%' }}
        />
        </div>
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
          >
            Back
          </button>
          <button
            type="button"
            onClick={nextStep}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Next
          </button>
        </div>
      </>
    )}

    {step === 3 && (
      <>

                                    <div className="mb-4">
          <label className="flex block text-sm font-medium mb-1">
            <p className="block text-sm font-medium text-red-500">*</p>
            License Image:
            
          </label>
                          {imageFile ? (
                            <div className="mb-2">
                                <img
                                    src={URL.createObjectURL(imageFile)}
                                    alt="Preview"
                                    className="w-80 h-auto rounded border border-gray-300"
                                />
                              </div>
                              ) : (
                                  formData.cust_id_img ? (
                                  <img
                                        src={'http://localhost:8080' + formData.cust_id_img}
                                        alt="Vehicle"
                                        className="w-80 h-auto rounded border border-gray-300"
                                      />
                                  ) : (
                                  <span>No image</span>
                                  )
                              )}

                                <input
                                        type="file"
                                        accept="image/*"
                                        onChange={uploadImage}
                                        className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                                                   file:rounded-full file:border-0
                                                   file:text-sm file:font-semibold
                                                   file:bg-blue-50 file:text-blue-700
                                                   hover:file:bg-blue-100"
                                />
                                {uploading && (
                                        <p className="text-sm text-gray-500 mt-1">
                                                Uploading image...
                                        </p>
                                )}
                        </div>  

                                  <label className="flex block text-sm font-medium mb-1">
            <p className="block text-sm font-medium text-red-500">*</p>
            Liceense Expiry:
            
          </label>
        <input
        name="cust_license_expiry_date"
          type="date"
          value={formData.cust_license_expiry_date}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
          >
            Back
          </button>
              {/* Error Message */}
            
<button
      type="submit"
      disabled={loading}
      className={`px-4 py-2 rounded-md text-white ${
        loading ? "bg-green-300 cursor-not-allowed" : "bg-green-600"
      }`}
    >
      {loading ? "Loading..." : "Submit"}
    </button>
        </div>
      </>
    )}
                {error && (
          <div className="text-red-600 font-medium mt-4 w-full text-center">
            {error}
          </div>
        )}  
  </form>

  <div className="mt-6 text-center">
    <button
      className="text-blue-600 hover:underline"
      onClick={() => navigate("/customer-login")}
    >
      Already have an account? Login
    </button>
  </div>
    </div>
{showVerificationModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-center relative animate-fade-in">
      <h2 className="text-2xl font-semibold text-green-600 mb-4">
        Email Sent
      </h2>
      <p className="text-gray-700 mb-6">
        A verification email has been sent to your registered email address.
        Please check your inbox and follow the instructions.
      </p>
      <button
        onClick={handleProceedToLogin}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded"
      >
        Proceed to Login
      </button>

    </div>
  </div>
)}
    </div>
  );
};

export default CustomerRegistration;