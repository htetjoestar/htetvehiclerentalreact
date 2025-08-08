import React, { useState,useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import axios from 'axios';
import 'react-phone-input-2/lib/style.css'
import './CustomerRegistration.css'
import { handleInputChange } from '../../formUtils.js';
const CustomerEditor = () => {
    const { id } = useParams();
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [licenseError, setLicenseError] = useState(false);

    
    const uploadImage = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
    }


  const [customer, setCustomer] = useState({
    cust_first_name: '',
    cust_last_name: '',
    cust_email: '',
    cust_password: '',
    cust_phone_number: '',
    cust_emergency_contact_name: '',
    cust_emergency_contact_number: '',
    cust_active: false,
    cust_created_date: '',
    cust_modified_date: '',
    cust_last_action: '',
    cust_deactivated_date: '',
    cust_id_doc: '',
    cust_license_number: '',
    cust_license_expiry_date: '',
    cust_date_of_birth: '',
  });

  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const handleChange = handleInputChange(setCustomer);
  const handlePhoneChange = (value) => {
    setCustomer({
      ...customer,
      ['cust_phone_number']: value
    });
  };
  const handleEmergencyPhoneChange = (value) => {
    setCustomer({
      ...customer,
      ['cust_emergency_contact_number']: value
    });
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({
      ...passwords,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const now = new Date();
    const expiryDate = new Date(customer.cust_license_expiry_date);
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

    if (expiryDate <= sixMonthsFromNow) {
      setLicenseError(true); // Your function to flag license issue
    }
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      alert("New passwords do not match.");
      return;
    }
    console.log('Employee Data Submitted:', customer, passwords);
    const payload = {
        ...customer,
        emp_created_date: now,
        emp_modified_date: now,
        emp_deactivated_date: null,
        emp_last_action: "Updated"
    }
        try {
            const response = await axios.put('http://localhost:8080/api/customer/'+id, payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
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
            
            alert("Vehicle uploaded successfully!");
        } catch (err) {
            console.error(err);
            alert("Upload failed.");
        }
  };

    useEffect(() => {
      fetch(`http://localhost:8080/api/customer/${id}`)
        .then(res => res.json())
        .then(result => setCustomer(result)).then(() => {
          console.log("Fetched employee:", customer);
        })
    }, [id]);

  return (
    <div className="px-5 py-2 border-b border-gray-300">
      <h2 className="flex justify-center text-lg font-bold">Account settings</h2>
      <form className="flex justify-center p-5 p-2 border-gray-300" onSubmit={handleSubmit}>
        
        <div className="flex flex-col gap-4 mt-2 p-5 p-2">
          <div>
          <div className="p-5 p-2">
            
            <h2 className="text-lg font-semibold">Account information</h2>
            <div className="form-group">
              <label>First Name</label>
              <p className="text-lg">{customer.cust_first_name}</p>
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <p className="text-lg">{customer.cust_last_name}</p>
            </div>
            <div className="form-group">
              <label>Email</label>
              <p className="text-lg">{customer.cust_email}</p>
            </div>
            <div className="form-group">
              <label>Date of birth</label>
              <p className="text-lg">{customer.cust_date_of_birth}</p>
            </div>
            <div className="form-group">
              <label>Phone Number</label>
                  <PhoneInput
                    country={'us'}
                    value={customer.cust_phone_number}
                    onChange={handlePhoneChange}
                    inputStyle={{ width: '100%' }}
                  />
            </div>
          </div>
        </div>


        <div className="bg-blue-100 p-4 rounded shadow-md px-5 py-2">
          <h3>Update Password</h3>
          <div className="form-group">
            <label>Old Password</label>
            <input type="password" name="oldPassword" value={passwords.oldPassword} onChange={handlePasswordChange} />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input type="password" name="newPassword" value={passwords.newPassword} onChange={handlePasswordChange} />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input type="password" name="confirmNewPassword" value={passwords.confirmNewPassword} onChange={handlePasswordChange} />
          </div>
        </div>

        </div>

        <div className="flex flex-col gap-4 mt-2 p-5 p-2">
          <div className="p-5 p-2">
            <h2 className="text-lg font-semibold">Emergency contact information</h2>
            <div className="form-group">
              <label>Emergency Contact Name</label>
              <input name="cust_emergency_contact_name" value={customer.cust_emergency_contact_name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Emergency Contact Number</label>
                    <PhoneInput
                    country={'us'}
                    value={customer.cust_emergency_contact_number}
                    onChange={handleEmergencyPhoneChange}
                    inputStyle={{ width: '100%' }}
                  />
            </div>
          </div>
          <div className="p-5 p-2s">
          </div>

          
        </div>


        <div className="flex flex-col justify-between gap-4 mt-2 p-5 p-2">
          <div className="p-5 p-2s">

           <h2 className="text-lg font-semibold">Documents and Identification</h2>
            <div className="form-group">
            </div>

                                    <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Identification Image:
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
                                  customer.cust_id_img ? (
                                  <img
                                        src={'http://localhost:8080' + customer.cust_id_img}
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

            <div className="form-group">
                <label>License Expiry Date</label>
                <input name="cust_license_expiry_date" type='date' value={customer.cust_license_expiry_date} onChange={handleChange} />
                {
                  licenseError && (
                    <p className="text-sm text-red-500 mt-1">License must be valid for 3 months </p>
                  )
                }
            </div>
            </div>
            <button className="gap-4 mt-4 p-5 p-2" type="submit">Save</button>
        </div>
     
        
      </form>
      
    </div>
  );
};

export default CustomerEditor;