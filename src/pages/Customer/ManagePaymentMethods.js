import axios from 'axios';
import React, { useState,useEffect } from 'react'
import visaLogo from "../../visa_logo.png";
import mastercardLogo from "../../mastercard_logo2.png";
import amexLogo from "../../amex.png";
import { handleInputChange } from '../../formUtils';

const ManagePaymentMethods = () => {
    const name = localStorage.getItem("customerName");
    const customerId = localStorage.getItem("customerId");
    const [showForm, setShowForm] = useState(false);
    const [cardType, setCardType] = useState(null);
    const [error, setError] = useState('');
    const [paymentMethods, setPaymentMethods] = React.useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [cardToDelete, setCardToDelete] = useState(null);
    const [newPaymentMethod, setNewPaymentMethod] = React.useState({
        customer: customerId,
        card_number: '',
        card_expiry_date: '',
        expiry_month:0,
        card_cvv: '',
        card_postal_code: ''
    });
    useEffect(() => {
        axios.get(`http://localhost:8080/api/payment/customer/${customerId}`)
        .then((response) => {
            setPaymentMethods(response.data);
        }).catch((error) => {
            console.error("Error fetching payment methods:", error);
        });
    }, [])


    const handleCardInputChange = (e) => {
    handleChange(e); // Keep original behavior
    const value = e.target.value.replace(/\D/g, "");
    const type = detectCardType(value);
    setCardType(type);
    };

        const detectCardType = (number) => {
        if (/^4/.test(number)) return "visa";
        if (/^5[1-5]/.test(number) || /^2(2[2-9]|[3-6]|7[01]|720)/.test(number)) return "mastercard";
        if (/^3[47]/.test(number)) return "amex";
        return null;
        };

    const handleChange = handleInputChange(setNewPaymentMethod);
    
    const isValidCardNumber = (number) => {
        const digits = number.replace(/\D/g, '').split('').reverse().map(Number);

        let sum = 0;
        for (let i = 0; i < digits.length; i++) {
          let digit = digits[i];
          if (i % 2 === 1) {
            digit *= 2;
            if (digit > 9) digit -= 9;
          }
          sum += digit;
        }
        return sum % 10 === 0;
      };
        const handleAdd = (e) => {
                e.preventDefault();
                const { card_number, card_expiry_date,expiry_month, card_cvv } = newPaymentMethod;
                  // Remove non-digits
          const cleanedCardNumber = card_number.replace(/\D/g, '');

          // Validate card number length (Visa/MasterCard)
          if (cleanedCardNumber.length < 13 || cleanedCardNumber.length > 19) {
            setError("Card number must be between 13 and 19 digits.");
            return;
          }
          if(expiry_month<=7){
            setError("Card cannot be expired");
            return;
          }
          // Validate expiry date is in the future
          const today = new Date();
          const expiry = new Date(card_expiry_date);
          expiry.setDate(1); // set to 1st of month just to avoid end-of-month weirdness

          if (expiry < today) {
            setError("Card expiry date must be in the future.");
            return;
          }

          // Validate CVV is 3 digits
          if (!/^\d{3}$/.test(card_cvv)) {
            setError("CVV must be 3 digits.");
            return;
          }

  
        axios.post(`http://localhost:8080/api/payment`, newPaymentMethod)
        .then((response) => {
            setPaymentMethods([...paymentMethods, response.data]);
            setNewPaymentMethod({
                customer: customerId,
                card_number: '',
                card_expiry_date: '',
                card_cvv: ''
            });
            setCardType(null);
            setShowForm(false);
        }).catch((error) => {
            console.error("Error adding payment method:", error);
        });
    }

    const handleDelete = (id) => {
      const confirmed = window.confirm("Are you sure you want to delete this payment method?");
      if (!confirmed) return;

      axios.delete(`http://localhost:8080/api/payment/${id}`)
        .then(() => {
          setPaymentMethods((prev) => prev.filter((method) => method.id !== id));
        })
        .catch((error) => {
          console.error("Error deleting payment method:", error);
          alert("Failed to delete the payment method.");
        });
        }

      const getCardLogo = (number) => {
        const type = detectCardType(number);
        if (type === "visa") return <img src={visaLogo} alt="Visa" className="h-5 ml-2" />;
        if (type === "mastercard") return <img src={mastercardLogo} alt="MasterCard" className="h-5 ml-2" />;
        if (type === "amex") return <img src={amexLogo} alt="American Express" className="h-5 ml-2" />;
        return null;
      };
  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Manage Payment Methods for {name}</h2>

      <ul className="mb-6 space-y-2">
        {paymentMethods.map((method) => (
          <li
            key={method.id}
            className="flex items-center justify-between bg-gray-50 p-3 rounded border"
          >
            <div className="flex items-center">
              <span>**** **** **** {method.card_number.slice(-4)}</span>
              {getCardLogo(method.card_number)}
            </div>
<button
  onClick={() => {
    setCardToDelete(method.payment_id);
    setShowDeleteModal(true);
  }}
  className="text-red-500 hover:underline text-sm"
>
  Delete
</button>
          </li>
        ))}
      </ul>

      <h3 className="text-xl font-medium mb-2">Add New Payment Method</h3>

      <button
  onClick={() => setShowForm(true)}
  className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
>
  Add New Card
</button>
{showForm && (
      <form onSubmit={handleAdd} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Card Number</label>
            <div className="relative">
              <input
                type="text"
                name="card_number"
                value={newPaymentMethod.card_number}
                onChange={handleCardInputChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring focus:ring-blue-200"
                placeholder="1234 5678 9012 3456"
              />
              {cardType && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {cardType === "visa" && <img src={visaLogo} alt="Visa" className="h-5" />}
                  {cardType === "mastercard" && (
                    <img src={mastercardLogo} alt="Mastercard" className="h-5" />
                  )}
                                    {cardType === "amex" && (
                    <img src={amexLogo} alt="Amerrican Express" className="h-5" />
                  )}
                </div>
              )}
            </div>
          </div>
<div>
  <label className="block text-sm font-medium mb-1">Expiry Date</label>
  <div className="flex gap-2">
    <select
      name="expiry_month"
      value={newPaymentMethod.expiry_month}
      onChange={handleChange}
      required
      className="w-1/2 border border-gray-300 rounded px-3 py-2"
    >
      {[...Array(12)].map((_, i) => {
        const month = String(i + 1).padStart(2, '0');
        return <option key={month} value={month}>{month}</option>;
      })}
    </select>
    <select
      name="expiry_year"
      value={newPaymentMethod.expiry_year}
      onChange={handleChange}
      required
      className="w-1/2 border border-gray-300 rounded px-3 py-2"
    >
      {Array.from({ length: 20 }, (_, i) => {
        const year = new Date().getFullYear() + i;
        return <option key={year} value={year}>{year}</option>;
      })}
    </select>
  </div>
</div>
        </div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">CVV</label>
          <input
            type="text"
            name="card_cvv"
            value={newPaymentMethod.card_cvv}
            onChange={handleChange}
            required
            className="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="123"
                            maxLength={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Postal Code</label>
          <input
            type="text"
            name="card_postal_code"
            value={newPaymentMethod.card_postal_code}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="123456"
            maxLength={6}
          />
        </div>
</div>
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Payment Method
        </button>

        {error && (
          <div className="text-red-600 font-medium mt-4 w-full text-center">
            {error}
          </div>
        )}        
      </form>
      )}

      {showDeleteModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
      <p className="text-gray-700 mb-6">
        Are you sure you want to delete this payment method? This action cannot be undone.
      </p>
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => setShowDeleteModal(false)}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            axios
              .delete(`http://localhost:8080/api/payment/${cardToDelete}`)
              .then(() => {
                setPaymentMethods((prev) =>
                  prev.filter((method) => method.payment_id !== cardToDelete)
                );
                setShowDeleteModal(false);
              })
              .catch((error) => {
                console.error("Delete error:", error);
                alert("Failed to delete card.");
                setShowDeleteModal(false);
              });
          }}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
        >
          Delete
        </button>
      </div>

      {/* Close icon (optional) */}
      <button
        onClick={() => setShowDeleteModal(false)}
        className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-xl"
      >
        &times;
      </button>
    </div>
  </div>
)}
    </div>
  )
}

export default ManagePaymentMethods;
