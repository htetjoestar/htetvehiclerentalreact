import React, { useState,useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate,useParams } from 'react-router-dom';

import visaLogo from "../../visa_logo.png";
import mastercardLogo from "../../mastercard_logo.png";
import amexLogo from "../../amex.png";
const InvoicePayment = () => {
    const { id } = useParams();
  const [invoice, setInvoice] = useState({
    damageDescription: '',
  }); 
    const navigate = useNavigate();
    const customerId = localStorage.getItem("customerId");
    const [existingCards, setExistingCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [useNewCard, setUseNewCard] = useState(true);
      const [isOpen, setIsOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState("new");
    const [cvv, setCvv] = useState("");
    const [cardType, setCardType] = useState(null);
    const [saveCard, setSaveCard] = useState(false);    
    
    const [newCardType, setNewCardType] = useState(null);
    const [newPaymentMethod, setNewPaymentMethod] = React.useState({
        customer: customerId,
        card_number: '',
        card_expiry_date: '',
        card_cvv: '',
        card_postal_code: ''
    });
    const getCardLogo = (number) => {
    const type = detectCardType(number);
        if (type === "visa") return <img src={visaLogo} alt="Visa" className="h-5 ml-2" />;
        if (type === "mastercard") return <img src={mastercardLogo} alt="MasterCard" className="h-5 ml-2" />;
        if (type === "amex") return <img src={amexLogo} alt="American Express" className="h-5 ml-2" />;
        return null;
    };
      const [reservation, setReservation] = useState({});
    const [error, setError] = useState('');

    const detectCardType = (number) => {
    if (/^4/.test(number)) return "visa";
    if (/^5[1-5]/.test(number) || /^2(2[2-9]|[3-6]|7[01]|720)/.test(number)) return "mastercard";
    if (/^3[47]/.test(number)) return "amex";
    return null;
    };
    const getCardBrand = (number) => {
    if (!number) return "";
    const firstDigit = number[0];
    if (firstDigit === "4") return "Visa";
    if (firstDigit === "5") return "MasterCard";
    if (firstDigit === "3") return "AmEx";
    return "Card";
    };



    const handleCardInputChange = (e) => {
    handleChange(e); // Keep original behavior
    const value = e.target.value.replace(/\D/g, "");
    const type = detectCardType(value);
    setNewCardType(type);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewPaymentMethod({ ...newPaymentMethod, [name]: value });
    };

    useEffect(() => {
     axios.get(`http://localhost:8080/api/invoice/reservation/${id}`)
    .then(response => {
      setInvoice(response.data);
            axios.get(`http://localhost:8080/api/reservation/${id}`)
    .then(response => {
      setReservation(response.data);
      console.log(response.data.res_status);
    })
    });

    axios.get(`http://localhost:8080/api/payment/customer/${customerId}`)
        .then((response) => {
      const cards = response.data || []; // fallback to empty array
      setExistingCards(cards);
                  if (cards.length > 0) {
        setSelectedCard(cards[0].payment_id); // make sure to set the id, not whole object
        setCardType(detectCardType(cards[0].card_number))
        setUseNewCard(false);
      } else {
        setSelectedCard(null); // or "new" if you want to default to new card
        setUseNewCard(true);
      }
        }).catch((error) => {
            console.error("Error fetching payment methods:", error);
        });  
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Save to context
        setLoading(true);
       const now = new Date().toISOString();

    if (saveCard){
        // Validate card number length (Visa/MasterCard)
        console.log("New Payment Method:", newPaymentMethod);
        const { card_number, card_expiry_date, card_cvv } = newPaymentMethod;
        const cleanedCardNumber = card_number.replace(/\D/g, '');
        if (cleanedCardNumber.length < 13 || cleanedCardNumber.length > 19) {
            setError("Card number must be between 13 and 19 digits.");
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
        await axios.post(`http://localhost:8080/api/payment`, newPaymentMethod)
        .then((response) => {
            setNewPaymentMethod({
                customer: customerId,
                card_number: '',
                card_expiry_date: '',
                card_cvv: ''
            });
        }).catch((error) => {
            console.error("Error adding payment method:", error);
        });
    }
        const invoiceData = {
            ...invoice,
            paid: true
        }
        await axios.put(`http://localhost:8080/api/invoice/${invoice.invoice_id}`, invoiceData);
        navigate('/customer-review-invoice/'+ reservation.reservation_id);
    }
  const cardBrandLogos = {
    Visa: "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png",
    MasterCard: "https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png",
    AmEx: "https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg",
    Card: "https://upload.wikimedia.org/wikipedia/commons/8/89/Credit_card_font_awesome.svg",
  };

  const handleSelect = (card) => {
    setSelectedCard(card?.payment_id || "new");
    setUseNewCard(card === null);
    setIsOpen(false);
  };
    const selectedCardData = existingCards.find((c) => c.payment_id === selectedCard);
  return (
    <div className="min-h-screen p-8">


        <div>
            <button 
                onClick={() => navigate(-1)} 
                className="mb-4 px-4 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200 transition"
            >
            Back
        </button>
        </div>
      <div className="max-w-7xl mx-auto bg-green-100 rounded-lg shadow-md p-6 flex flex-col lg:flex-row gap-6">

        {/* Left Section: Summary */}

        <div className="w-full lg:w-1/2 pl-6">
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dropdown for card selection */}
    <div className="relative w-full">
      <label className="block mb-1">Payment Method</label>

      <button
      type='button'
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border border-gray-300 text-black rounded px-3 py-2 bg-white text-left flex items-center justify-between hover:bg-green-300 focus:outline-none focus:ring-0 transition-colors"      >
        {selectedCard === "new" || !selectedCard ? (
          <span>➕ Add New Card</span>
        ) : (
          <div className="flex items-center gap-2">
                        {cardType === "visa" && <img src={visaLogo} alt="Visa" className="h-5" />}
                        {cardType === "mastercard" && (
                            <img src={mastercardLogo} alt="Mastercard" className="h-5" />
                        )}
                        {cardType === "amex" && (
                    <img src={amexLogo} alt="Amerrican Express" className="h-5" />
                  )}
            <span>
              **** {selectedCardData.card_number.slice(-4)} 
            </span>
          </div>
        )}
        <span className='text-black'>▼</span>
      </button>

      {isOpen && (
        <ul className="absolute z-10 bg-white border border-gray-300 rounded w-full mt-1 shadow-lg max-h-60 overflow-y-auto">

          {existingCards.map((card) => (
            <li
              key={card.id}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(card)}
            >
              {getCardLogo(card.card_number)}
              <span>
                **** {card.card_number.slice(-4)} ({getCardBrand(card.card_number)})
              </span>
            </li>
          ))}
                    <li
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            type="button"
            onClick={() => handleSelect(null)}
          >
            ➕ Add New Card
          </li>
        </ul>
      )}
    </div>

        {useNewCard ? (
            <>
            {/* New card inputs */}
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
                    {newCardType && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {newCardType === "visa" && <img src={visaLogo} alt="Visa" className="h-5" />}
                        {newCardType === "mastercard" && (
                            <img src={mastercardLogo} alt="Mastercard" className="h-5" />
                        )}
                                                {newCardType === "amex" && (
                    <img src={amexLogo} alt="Amerrican Express" className="h-5" />
                  )}
                        </div>
                    )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Expiry Date</label>
                    <input
                    type="date"
                    name="card_expiry_date"
                    value={newPaymentMethod.card_expiry_date}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                    />
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
                    placeholder="12345"
                />
                </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <label className="text-sm items-center text-gray-700">Save this card for future use</label>
        <button
          type="button"
          onClick={() => setSaveCard(!saveCard)}
          className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none ${
            saveCard ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-300 ease-in-out ${
              saveCard ? "translate-x-3" : "-translate-x-3"
            }`}
          />
        </button>
        </div>
            </>
        ) : (
            <>
            {/* Existing card CVV input only */}
            <div>
                <label className="block mb-1">Enter CVV for verification</label>
                <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="w-1/4 border rounded px-3 py-2"
                placeholder="CVV"
                maxLength={4}
                />
            </div>
            </>
        )}

        <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
            Confirm Payment
        </button>
                {error && (
          <div className="text-red-600 font-medium mt-4 w-full text-center">
            {error}
          </div>
        )}       
        </form>
        </div>

                <div className="w-full lg:w-1/2 border-r pr-6">
          <h2 className="text-xl font-semibold mb-4">Reservation Summary</h2>
          <div className="space-y-4">
            {/* Replace with dynamic items */}
              <div className="flex justify-between">
              <span>Total Price:</span>
              <span className="font-semibold text-green-600">${reservation.late_fee|| 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Damages:</span>
              <span className="font-semibold text-green-600">${reservation.damages|| 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Price:</span>
              <span className="font-semibold text-green-600">${reservation.late_fee + reservation.damages || 0}</span>
            </div>
          </div>
        </div>

        {/* Right Section: Payment Methods */}
      </div>
    </div>
  )
}

export default InvoicePayment
