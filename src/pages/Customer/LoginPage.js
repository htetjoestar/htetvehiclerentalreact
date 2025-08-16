import React,{useState} from "react";
import { Await, useNavigate } from "react-router-dom";
import website_logo from "../../website_logo_sm.png";
import axios from "axios";
import { handleInputChange } from '../../formUtils.js';
const LoginPage = () => {
    const navigate = useNavigate();
    const[Id ,setId]=useState([])
    const[user ,setUser]=useState([])
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState("");
    const [state, setState]= useState({
      email: '',
      password:'',
    })
    
    const handleChange = handleInputChange(setState);

    const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const response = await axios.post("https://htetvehiclerental-e8g5bqfna0fpcnb3.canadacentral-01.azurewebsites.net/api/customer/login", state, {
            headers: { "Content-Type": "application/json" }
        });

        const result = response.data;

        // Success: handle login
        localStorage.setItem("isCustomer", "true");
        localStorage.setItem("token", result.token); // if token is included in CustomerDto
        localStorage.setItem("customerId", result.customer_id);
        localStorage.setItem("customerName", result.cust_first_name + " " + result.cust_last_name);
        navigate("/reservation");
    } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log(error.response.data)
            setLoginError(error.response.data || "Unauthorized");

        } else {
          setLoginError("An unexpected error occurred. Please try again.");
        }
        setLoading(false);
    }
    }

    const handleBackHome =(e)=>{
        navigate("/")
    }

    const handleRegister =(e)=>{
        navigate("/Register")
    }
    return (
<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <button 
      onClick={() => navigate('/')} 
      className="absolute top-4 left-4 mb-4 px-4 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200 transition"
    >
      Home
    </button>
  <div className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-4">
    <img
  src={website_logo}
  alt="Website Logo"
  className="w-80 mb-6 rounded"
/>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
      <input
       name="email" 
        className="form-input w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        placeholder="email"
        onChange={handleChange}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
      <input
        name="password" 
        className="form-input w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="password"
        placeholder="password"
        onChange={handleChange}
      />
    </div>
    
<div className="text-right text-sm">
  <span 
    className="text-blue-500 hover:underline cursor-pointer" 
    onClick={() => navigate("/request-password")}
  >
    Forgot Password?
  </span>
</div>
    <div className="text-center text-sm text-red-500 h-5">
      {loginError || "\u2800"}
    </div>
    
    <button
      className={`w-full py-2 rounded transition ${
        loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
      } text-white`}
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? "Logging in..." : "Log in"}
    </button>
    <div className="flex justify-between space-x-2 mt-4">
      <button
        className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
        onClick={handleRegister}
      >
        Register
      </button>
    </div>
  </div>
</div>
    );
};
 
export default LoginPage;