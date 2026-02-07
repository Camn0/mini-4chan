'use client';

import { login, signup } from '@/app/actions';
import { useActionState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [loginState, loginAction, isLoginPending] = useActionState(login, { message: '' });
  const [signupState, signupAction, isSignupPending] = useActionState(signup, { message: '' });

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#f0e0d6] font-serif pt-10 pb-10 text-sm">
      
      {/* Header Title */}
      <h1 className="text-3xl font-bold text-[#af0a0f] mb-2 text-center tracking-tight">
        /exercise/ Auth
      </h1>
      <p className="text-center text-[#800000] mb-6 text-xs">
        Please Login or Register to participate.
      </p>

      <div className="w-full max-w-sm px-4">
        
        {/* --- LOGIN BOX --- */}
        <div className="border border-[#b7c5d9] bg-[#d6daf0] p-1 mb-6">
          <div className="bg-[#f0e0d6] px-2 py-1 text-[#0f0c5d] font-bold text-xs border-b border-[#b7c5d9] mb-2">
            Existing User Login
          </div>
          
          <form action={loginAction} className="px-3 pb-3">
            <div className="flex flex-col gap-2">
              <input 
                name="email" 
                type="email" 
                placeholder="Email" 
                required 
                className="border border-[#aaa] p-1 w-full text-sm font-sans" 
              />
              <input 
                name="password" 
                type="password" 
                placeholder="Password" 
                required 
                className="border border-[#aaa] p-1 w-full text-sm font-sans" 
              />
              
              <div className="flex items-center justify-between mt-1">
                <button 
                  type="submit" 
                  disabled={isLoginPending}
                  className="border border-[#888] bg-[#e0e0e0] hover:bg-[#d0d0d0] px-3 py-1 text-xs text-black font-sans active:bg-[#ccc]"
                >
                  {isLoginPending ? 'Loading...' : 'Login'}
                </button>
              </div>

              {/* Login Notice */}
              {loginState.message && (
                <div className="mt-2 text-red-600 font-bold text-xs border border-red-300 bg-red-50 p-1">
                  ! {loginState.message}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* --- REGISTER BOX --- */}
        <div className="border border-[#b7c5d9] bg-[#d6daf0] p-1">
          <div className="bg-[#f0e0d6] px-2 py-1 text-[#0f0c5d] font-bold text-xs border-b border-[#b7c5d9] mb-2">
            New User Registration
          </div>
          
          <form action={signupAction} className="px-3 pb-3">
            <div className="flex flex-col gap-2">
              <input 
                name="email" 
                type="email" 
                placeholder="New Email" 
                required 
                className="border border-[#aaa] p-1 w-full text-sm font-sans" 
              />
              <input 
                name="password" 
                type="password" 
                placeholder="New Password" 
                required 
                className="border border-[#aaa] p-1 w-full text-sm font-sans" 
              />
              
              <div className="mt-1">
                <button 
                  type="submit" 
                  disabled={isSignupPending}
                  className="border border-[#888] bg-[#e0e0e0] hover:bg-[#d0d0d0] px-3 py-1 text-xs text-black font-sans active:bg-[#ccc]"
                >
                  {isSignupPending ? 'Processing...' : 'Sign Up'}
                </button>
              </div>

              {/* Register Notice */}
              {signupState.message && (
                <div className={`mt-2 text-xs font-bold border p-1 ${
                  signupState.message.includes('Success') || signupState.message.includes('berhasil') 
                  ? 'text-green-700 border-green-400 bg-green-50' 
                  : 'text-red-600 border-red-300 bg-red-50'
                }`}>
                  {signupState.message.includes('Success') ? '✓ ' : '! '}
                  {signupState.message}
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="mt-8 text-center text-xs">
          <Link href="/" className="text-[#34345c] hover:text-[#d00] hover:underline">
            [ Return to Dashboard ]
          </Link>
        </div>

      </div>
    </div>
  );
}