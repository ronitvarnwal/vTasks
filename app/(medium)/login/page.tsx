'use client';
import { Button } from "@/components/ui/button"
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password ,
      });
      if (error) {
        alert(error.message);
        return;
      }
      if (data.user) {
        localStorage.setItem('name', data.user.email?.split('@')[0] || 'user');
        router.push('/dashboard');
      }
    }
    catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
    
  }
  return (
    <div className="h-full bg-zinc-50 mt-20 p-10">
      <div className="bg-white shadow-xl shado-zinc-200 rounded-lg p-5">
        <h1 className="text-zinc-700 text-2xl font-semibold">Login Page</h1>
        <div className="flex flex-col space-y-7 py-5">
            <div className="flex flex-col space-y-2">
              <label className="text-zinc-800/90 text-md font-medium">Email</label>
              <input 
                type="email" 
                className="transition-all duration-300 bg-white border border-gray-300 text-gray-900 text-sm rounded-md focus:outline-gray-900/70 block w-full p-2 h-10 dark:bg-zinc-950 dark:placeholder-zinc-500 dark:border-zinc-600" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              /> 
              
            </div>
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-zinc-800/90 text-md font-medium">Password</label>
              <input 
                type="password" 
                className="transition-all duration-300 bg-white border border-gray-300 text-gray-900 text-sm rounded-md focus:outline-gray-900/70 block w-full p-2 h-10 dark:bg-zinc-950 dark:placeholder-zinc-500 dark:border-zinc-600" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              /> 
            </div>
            <div className="flex space-x-4 py-7">

              <Button 
                type="button" 
                className="flex-1 transition-color duration-300 bg-gray-950 text-xl text-gray-50 font-semibold rounded-lg h-10 black-button dark:bg-zinc-50 dark:text-zinc-950 disabled:opacity-50" 
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? 'Loging...' : 'Login'}
              </Button>
          </div>
        <div className="">
            <p className="text-zinc-700 text-center">don't have an account?<span className="text-zinc-900 font-medium underline" onClick={() => router.push("/signup")}>SignUp</span></p>
        </div>
        </div>
    </div>
  );
}