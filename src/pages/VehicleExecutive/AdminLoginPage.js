import React,{useState} from "react";
import { Await, useNavigate } from "react-router-dom";
import { handleInputChange } from "../../formUtils";
import '../Customer/LoginPage.css'

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const[Id ,setId]=useState([])
    const[user ,setUser]=useState([])
    
    const [loginFail, setLoginFail] = useState(false);
    const [state, setState]= useState({
      email: '',
      password:'',
    })

    const handleChange = handleInputChange(setState);
    const handleClick2=(e)=>{

        e.preventDefault()
        
        fetch("http://localhost:8080/api/employee/login",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify(state)
      
        }).then(res=>res.json())
        .then((result)=>{
            console.log(result)
            const token = result.token;
            if(result.status !== 500){
                localStorage.setItem("isAdmin", "true");
                localStorage.setItem("token", token);
                localStorage.setItem("adminId", result.employee_id);
                localStorage.setItem("adminName", result.emp_first_name + " " + result.emp_last_name);                
                navigate("/admin");
            }else{
                setLoginFail(true);
            }
        })
        
      } 

    const handleRegister =(e)=>{
        navigate("/Register")
    }
    return (
<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
  <div className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-4">
    <h2 className="text-2xl font-semibold mb-4">Admin Login</h2>
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
    <div className="text-center text-sm text-red-500 h-5">
      {loginFail ? "User not found" : "\u2800"}
    </div>
    <button
      className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
      onClick={handleClick2}
    >
      Log in
    </button>
  </div>
</div>
    )
};
 
export default AdminLoginPage;