/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import login from "../assets/signup.avif";
import { Auth } from "../Contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";


const Login = () => {
  const [userName,setUserName] = useState("");
  const [password,setPassword] = useState("");
const [role,setRole] = useState({
  isAdmin:false,
  isPatient:false,
  isDoctor:false
})
const {dispatch} = useContext(Auth);
const nav = useNavigate();
const {user} = useContext(Auth)

useEffect(()=>{
  if(user !== null){
    nav("/dashboard")
  }
})

const handleSubmit = async (e) => {
  e.preventDefault()
  // console.log(userName+" "+password+ " "+role.isAdmin+" "+role.isDoctor+" "+role.isPatient)
  try {
    const user = await fetch(`http://localhost:3000/login`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({userName,password,roles:role})
    })

    const data = await user.json();
    if(user.ok){
      console.log('Login Succesfull',data);
      localStorage.setItem("token",data.token);
      localStorage.setItem("role",data.r)
      dispatch({type:'LOGIN',payload:{token:data.token,role:data.r}})
      nav("/dashboard")
    } else {
      console.log(data.message);
    }
    setUserName("");
    setPassword("");

  } catch (error) {
    console.log(error);
  }
}

const handleChange = (e) => {
  const selectedRole = e.target.value
  setRole({
    isAdmin: selectedRole === "admin",
    isPatient: selectedRole === "patient",
    isDoctor: selectedRole === 'doctor'
  })
}

  return (
    <div className="flex justify-center items-center gap-10 mt-7">
      <img className="w-1/3 h-auto" src={login} />
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-2xl font-semibold text-slate-700">Login to Account</h1>
        <form className="shadow-2xl flex flex-col justify-center mt-4 items-center border-2 rounded-lg w-96 gap-6 py-7">
          <div className="flex flex-col justify-start items-center gap-4">
            <p className='mr-[185px]'>Enter username</p>
            <input className='p-2 outline-none border-2 rounded-lg w-full' type="text" placeholder="username" value={userName} onChange={(e)=>setUserName(e.target.value)}/>
          </div>
          <div className="flex flex-col justify-center items-center gap-2">
            <p className="mr-[185px]">Enter password</p>
            <input className='p-2 outline-none border-2 rounded-lg w-full' type="password" placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
          </div>
          <select name="role" className="p-2 rounded-lg" onChange={handleChange} >
            <option value="">Select role</option>
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
            <option value="admin">Admin</option>
          </select>
          <button className='shadow-lg hover:bg-blue-800 w-[315px] h-9 bg-blue-500 rounded-full text-white' onClick={handleSubmit}>Submit</button>
          <div className="">
              <Link to='/signup' className="text-pink-600 font-semibold ">Not Registered yet ? </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
