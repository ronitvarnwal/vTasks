'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation';

export default function Signup() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);
  const router = useRouter();

  const handleSignup = async () => {
    if (!email || !password || !name) {
      alert('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email, 
        password,
        options: {
          data: {
            name: name,
          }
        }
      });
      
      if (error) {
        alert(error.message);
        return;
      }

      // Check if user needs email confirmation
      if (data.user && !data.user.email_confirmed_at) {
        setShowSuccessDialog(true);
        localStorage.setItem('name', name)
        return;
      }

      // If signup successful and user is confirmed, redirect to dashboard
      if (data.user) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('An error occurred during signup. Please try again.');
    } finally {
      setIsLoading(false);

      }
    }
  

  return (
    <>
      <div className="h-full mt-20 bg-zinc-50 py-10 px-10">
        <div className="bg-white rounded-xl shadow-xl shadow-zinc-200 p-5">
          <h1 className="text-zinc-700 text-2xl font-semibold">Create your account</h1>
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
            <div className="flex flex-col space-y-2">
              <label className="text-zinc-800/90 text-md font-medium">Name</label>
              <input 
                type="text" 
                className="transition-all duration-300 bg-white border border-gray-300 text-gray-900 text-sm rounded-md focus:outline-gray-900/70 block w-full p-2 h-10 dark:bg-zinc-950 dark:placeholder-zinc-500 dark:border-zinc-600" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              /> 
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
            <div className="">
              <button 
                type="button" 
                className="flex-1 transition-color duration-300 bg-gray-950 text-xl text-gray-50 font-semibold rounded-lg h-10 black-button dark:bg-zinc-50 dark:text-zinc-950 disabled:opacity-50 w-full" 
                onClick={handleSignup}
                disabled={isLoading}
              >
                {isLoading ? 'Signing up...' : 'Sign Up'}
              </button>
              {/* <button 
                type="button" 
                className="flex-1 transition-color duration-300 bg-blue-600 text-xl text-white font-semibold rounded-lg h-10 disabled:opacity-50" 
                onClick={handleSignin}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button> */}
            </div>
            <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Verify your email</AlertDialogTitle>
      <AlertDialogDescription>
        we have sent a verification link to your email address. Please check your email and click on the link to verify your account.
      </AlertDialogDescription>
    </AlertDialogHeader>
    
    <AlertDialogFooter>
      <AlertDialogAction onClick={() => { 
      setShowSuccessDialog(false)
      router.push('/login')
                                        }}>
        Continue
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
            <div className="">
            <p className="text-zinc-700 text-center">already have an account?<span className="text-zinc-900 font-medium underline" onClick={() => router.push("/login")}>Sign in</span></p>
            </div>
          </div>
          </div>
        </div>
    </>
  );
}