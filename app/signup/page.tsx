'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Signup() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        if (password != confirmPassword) {
            setErrorMsg("Password does not match");
            setLoading(false);
        } else {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                setErrorMsg(error.message);
                setLoading(false);
                router.push('/signup');
            } else {
                setSuccessMsg('Signup successful!');
                setEmail('');
                setPassword('');
                setTimeout(() => {
                    router.push('/login');
                }, 4000);
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-semibold text-center mb-6 text-black">Sign Up</h2>
                <form onSubmit={handleSignup}>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-2 text-black">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-3 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />

                    <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-3 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />

                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-black mb-2">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full p-3 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 focus:outline-none"
                    >
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>
                </form>

                {successMsg && <p className="mt-4 text-green-500 text-center">{successMsg}</p>}
                {errorMsg && <p className="mt-4 text-red-500 text-center">{errorMsg}</p>}

                <p className="mt-4 text-center text-sm text-gray-600">
                    Sudah punya akun?{' '}
                    <Link href="/login" className="text-blue-500 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}