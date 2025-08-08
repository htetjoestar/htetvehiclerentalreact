import React, { useState,useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import AdminHeader from '../Components/AdminHeader';
//import './EmployeeEditor.css';

const PortalEditor = () => {
    const nav = useNavigate();
    const { id } = useParams();

  const [employee, setEmployee] = useState({
    emp_first_name: '',
    emp_last_name: '',
    emp_email: '',
    emp_password: '',
    emp_role: '',
    emp_phone_number: '',
    emp_emergency_contact_name: '',
    emp_emergency_contact_number: '',
    emp_active: false,
    emp_created_date: '',
    emp_modified_date: '',
    emp_last_action: '',
    emp_deactivated_date: '',
  });

  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmployee({
      ...employee,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  const handlePhoneChange = (value) => {
    setEmployee({
      ...employee,
      ['cust_phone_number']: value
    });
  };
    const handleEmergencyPhoneChange = (value) => {
    setEmployee({
      ...employee,
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
    const now = new Date().toISOString();
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      alert("New passwords do not match.");
      return;
    }
    console.log('Employee Data Submitted:', employee, passwords);
    const payload = {
        ...employee,
        emp_created_date: now,
        emp_modified_date: now,
        emp_deactivated_date: null,
        emp_last_action: "Updated"
    }
    e.preventDefault();
    await fetch(`http://localhost:8080/api/employee/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(() => {
      console.log("Vehicle updated");
      nav('/admin');
    });
  };

    useEffect(() => {
      fetch(`http://localhost:8080/api/employee/${id}`)
        .then(res => res.json())
        .then(result => setEmployee(result)).then(() => {
          console.log("Fetched employee:", employee);
        })
    }, [id]);

  return (
    <div>
      <form 
        className="flex items-center justify-center p-5 p-2"
        onSubmit={handleSubmit}>
        <div className="gap-4 mt-4 p-5 p-2">
          <div className="main-column">
            <div className="form-group">
              <label>First Name</label>
              <input name="emp_first_name" value={employee.emp_first_name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input name="emp_last_name" value={employee.emp_last_name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input name="emp_email" value={employee.emp_email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
        <PhoneInput
          country={'us'}
          value={employee.emp_phone_number}
          onChange={handlePhoneChange}
          inputStyle={{ width: '100%' }}
          className="w-full border"
        />
            </div>
          </div>

          <div className="side-column">
            <div className="form-group">
              <label>Emergency Contact Name</label>
              <input name="emp_emergency_contact_name" value={employee.emp_emergency_contact_name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Emergency Contact Number</label>
                      <PhoneInput
          country={'us'}
          value={employee.emp_emergency_contact_number}
          onChange={handleEmergencyPhoneChange}
          inputStyle={{ width: '100%' }}
          className="w-full border"
        />
            </div>
          </div>

          



          
        
        </div>
        <div className='flex flex-col justify-top justify-between gap-4 mt-2 p-5 p-2'>
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
        <button className="gap-4 mt-4 p-5 p-2" type="submit">Save</button>
        </div>
      </form>
    </div>
  );
};

export default PortalEditor;