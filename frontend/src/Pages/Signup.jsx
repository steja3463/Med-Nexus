// import React from 'react'

import { useContext, useEffect, useState } from "react";
import login from "../assets/login.avif";
import { Link, useNavigate } from "react-router-dom";
import { Auth } from "../Contexts/AuthContext";
// import { Auth } from "../Contexts/AuthContext";

const Signup = () => {
  const [userName,setUserName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const nav = useNavigate();

  const {user} = useContext(Auth);

  useEffect(()=>{
    if(user){
      nav("/dashboard");
    }
  },[])

  const handleSubmit = async (e) => {
    e.preventDefault()
    // console.log(userName+" "+password+ " "+role.isAdmin+" "+role.isDoctor+" "+role.isPatient)
    try {
      const user = await fetch(`http://localhost:3000/register`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({userName,email,password})
      })
  
      const data = await user.json();
      if(user.ok){
        nav("/login")
      } else {
        console.log(data.message);
      }
      setUserName("");
      setEmail(""); 
      setPassword("");
  
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex justify-center items-center gap-10 mt-7">
      <img className="w-1/3 h-auto" src={login} />
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-2xl font-semibold text-slate-700">Create an Account</h1>
        <form className="shadow-2xl flex flex-col justify-center mt-4 items-center border-2 rounded-lg w-96 gap-6 py-7">
          <div className="flex flex-col justify-start items-start gap-4 w-[300px]">
            <p className=''>Enter username</p>
            <input className='p-2 outline-none border-2 rounded-lg w-full' type="text" placeholder="username" value={userName} onChange={(e)=>setUserName(e.target.value)}/>
          </div>
          <div className="flex flex-col justify-center items-start gap-4 w-[300px]">
            <p className="">Enter Email:</p>
            <input className='p-2 outline-none border-2 rounded-lg w-full' type="email" placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
          </div>
          <div className="flex flex-col justify-center items-start gap-4 w-[300px]">
            <p className="">Enter password</p>
            <input className='p-2 outline-none border-2 rounded-lg w-full' type="password" placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
          </div>
          
          <button className='shadow-lg hover:bg-blue-800 w-[315px] h-9 bg-blue-500 rounded-full text-white' onClick={handleSubmit}>Register</button>
          <div className="">
              <Link to='/login' className="text-pink-600 font-semibold ">Already Have an Account ? </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup
