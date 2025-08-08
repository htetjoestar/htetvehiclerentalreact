import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import AdminHeader from '../Components/AdminHeader';

const EmployeeEditor = () => {
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

  useEffect(() => {
    fetch(`http://localhost:8080/api/employee/${id}`)
      .then(res => res.json())
      .then(result => setEmployee(result));
  }, [id]);

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
      emp_phone_number: value
    });
  };

  const handleEmergencyPhoneChange = (value) => {
    setEmployee({
      ...employee,
      emp_emergency_contact_number: value
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({
      ...passwords,
      [name]: value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const now = new Date().toISOString();

    const payload = {
      ...employee,
      emp_modified_date: now,
      emp_last_action: "Updated"
    };

    await fetch(`http://localhost:8080/api/employee/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(() => {
      alert("Employee updated");
      nav('/admin');
    });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      alert("New passwords do not match.");
      return;
    }

    const payload = {
      employeeId: id,
      oldPassword: passwords.oldPassword,
      newPassword: passwords.newPassword
    };

    await fetch('http://localhost:8080/api/employee/change-password', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(async (res) => {
      const text = await res.text();
      if (res.ok) {
        alert("Password updated successfully.");
        setPasswords({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
      } else {
        alert(`Error: ${text}`);
      }
    });
  };

  return (
    <div>
      <AdminHeader />
      <div className="flex flex-row justify-center items-start gap-10 p-8">
        {/* Employee Edit Form */}
        <form className="w-1/3 bg-white p-6 rounded shadow" onSubmit={handleProfileSubmit}>
          <h2 className="text-xl font-semibold mb-4">Edit Employee Profile</h2>

          <div className="form-group mb-3">
            <label>First Name</label>
            <input name="emp_first_name" value={employee.emp_first_name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>

          <div className="form-group mb-3">
            <label>Last Name</label>
            <input name="emp_last_name" value={employee.emp_last_name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>

          <div className="form-group mb-3">
            <label>Email</label>
            <input name="emp_email" value={employee.emp_email} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>

          <div className="form-group mb-3">
            <label>Phone Number</label>
            <PhoneInput
              country={'us'}
              value={employee.emp_phone_number}
              onChange={handlePhoneChange}
              inputStyle={{ width: '100%' }}
              className="w-full border"
            />
          </div>

          <div className="form-group mb-3">
            <label>Emergency Contact Name</label>
            <input name="emp_emergency_contact_name" value={employee.emp_emergency_contact_name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>

          <div className="form-group mb-3">
            <label>Emergency Contact Number</label>
            <PhoneInput
              country={'us'}
              value={employee.emp_emergency_contact_number}
              onChange={handleEmergencyPhoneChange}
              inputStyle={{ width: '100%' }}
              className="w-full border"
            />
          </div>

          <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Save Changes</button>
        </form>

        {/* Password Change Form */}
        <form className="w-1/3 bg-white p-6 rounded shadow" onSubmit={handlePasswordSubmit}>
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>

          <div className="form-group mb-3">
            <label>Old Password</label>
            <input type="password" name="oldPassword" value={passwords.oldPassword} onChange={handlePasswordChange} className="w-full border rounded px-3 py-2" />
          </div>

          <div className="form-group mb-3">
            <label>New Password</label>
            <input type="password" name="newPassword" value={passwords.newPassword} onChange={handlePasswordChange} className="w-full border rounded px-3 py-2" />
          </div>

          <div className="form-group mb-3">
            <label>Confirm New Password</label>
            <input type="password" name="confirmNewPassword" value={passwords.confirmNewPassword} onChange={handlePasswordChange} className="w-full border rounded px-3 py-2" />
          </div>

          <button type="submit" className="mt-4 bg-green-600 text-white px-4 py-2 rounded">Update Password</button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeEditor;
