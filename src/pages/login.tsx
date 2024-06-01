import React, { useEffect, useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
type LoginProps = {}
const Login:React.FC<LoginProps>=()=>{
    const [showPassword, setShowPassword] = useState(false);
  
    const router = useRouter()
	
const  [inputs,setInputs] = useState({email:'',password:''})
const [signInWithEmailAndPassword,user,loading, error,] = useSignInWithEmailAndPassword(auth);
const handleLogin=async(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    if(!inputs.email||!inputs.password) return toast.error("Please fill all")
    try{
const user = await signInWithEmailAndPassword(inputs.email, inputs.password)
if(!user) return;
toast.success("Login Successful!",{ position: "top-center" })
router.push('/home')
}catch(err:any){
   toast.error(err.message,{position:"top-center",theme:"dark"})
}
}

const handleChangeInput = (e:any) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
};
const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
};
useEffect(() => {
    if(error) alert(error.message)
  }, [error])
return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800">
    <form 
      className="space-y-6 px-6 pb-4 bg-gray-900 rounded-lg shadow-lg w-full max-w-md"
      onSubmit={handleLogin} 
      autoComplete="on" 
      style={{ background: 'linear-gradient(90deg, rgba(18,18,23,1) 6%, rgba(14,14,23,1) 35%, rgba(26,32,33,1) 100%)' }}
    >
      <h3 className='text-xl font-medium text-white text-center p-2'>Login to MovieMaze!</h3>
      <div>
        <label htmlFor='email' className='text-sm font-medium block mb-2 text-gray-300'>
          Email
        </label>
        <input
          onChange={handleChangeInput}
          type='email'
          name='email'
          id='email'
          className='input py-2 px-3 w-full rounded-lg bg-gray-800 text-white'
          placeholder='name@company.com'
          autoComplete='email'
        />
      </div>
      
      <div className='relative'>
        <label htmlFor='password' className='text-sm font-medium block mb-2 text-gray-300'>
          Password
        </label>
        <input
          onChange={handleChangeInput}
          type={showPassword ? 'text' : 'password'}
          name='password'
          id='password'
          className='input py-2 px-3 w-full rounded-lg bg-gray-800 text-white'
          placeholder='*******'
          autoComplete='new-password'
        />
        <button
          type='button'
          onClick={togglePasswordVisibility}
          className='absolute inset-y-0 right-0 pt-5 pr-3 flex items-center text-gray-400 hover:text-gray-500'
        >
          {showPassword ? <FaEyeSlash fontSize={'25'} /> : <FaEye fontSize={'25'} />}
        </button>
      </div>
      
      
      <button type='submit' className='btn w-full bg-blue-600 text-white py-2 rounded-lg'>
        {loading ? "Please wait..." : "Login"}
      </button>
      <div className='text-sm font-medium text-gray-300'>
        New User?{" "}
        <Link href='/' className='text-blue-700 hover:underline'>
          Sign up
        </Link>
      </div>
    </form>
  </div>

);
}
export default Login

