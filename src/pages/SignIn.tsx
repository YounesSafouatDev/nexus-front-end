import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/components/ui/use-toast";
import axios from 'axios';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const SignIn: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [passwordVisible, setPasswordVisible] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://nexus-back-end.onrender.com//auth/login', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Handle successful login
            toast({
                title: "Sign In Successful",
                description: "Welcome back!",
            });

            // Store the tokens in local storage
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('refresh', response.data.refreshToken);

            // Redirect to the dashboard
            navigate('/dashboard');

        } catch (error: any) {
            if (error.response && error.response.status === 429) {
                console.log(error.response.data);

                const retryAfterMs = error.response.data.retryAfter;
                let retryAfter;

                // Ensure retryAfterMs is not negative and is a realistic value
                if (retryAfterMs < 0 || retryAfterMs > 31536000000) { // 1 year in milliseconds
                    retryAfter = "a very long time"; // Fallback in case of invalid retryAfterMs
                } else {
                    const seconds = Math.floor((retryAfterMs / 1000) % 60);
                    const minutes = Math.floor((retryAfterMs / (1000 * 60)) % 60);
                    const hours = Math.floor((retryAfterMs / (1000 * 60 * 60)) % 24);
                    const days = Math.floor(retryAfterMs / (1000 * 60 * 60 * 24));

                    // Build the retryAfter string in a readable format
                    const parts = [];
                    if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
                    if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
                    if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
                    if (seconds > 0 || parts.length === 0) parts.push(`${seconds} second${seconds > 1 ? 's' : ''}`);

                    retryAfter = parts.join(', ').replace(/, ([^,]*)$/, ' and $1');
                }

                showError(`Too many login attempts. Please try again after ${retryAfter}.`);
            } else if (error.response && error.response.status === 404) {
                showError('User does not exist. Redirecting to Sign Up...');
                setTimeout(() => navigate('/sign-up'), 2000);
            } else {
                showError('An error occurred during sign-in.');
            }

        }
    };

    function showError(error: string) {
        toast({
            title: "Problem",
            description: error,

        });
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="flex p-8 bg-white rounded-lg shadow-lg">
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <div>
                        <Label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</Label>
                        <Input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="relative">
                        <Label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</Label>
                        <div className="relative">
                            <Input
                                type={passwordVisible ? "text" : "password"}
                                name="password"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full p-2 pr-10 border rounded"
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                                onClick={() => setPasswordVisible(!passwordVisible)}
                            >
                                {passwordVisible ? (
                                    <FaRegEye />
                                ) : (
                                    <FaRegEyeSlash />
                                )}
                            </button>
                        </div>
                    </div>
                    <Button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded">Sign In</Button>
                </form>
            </div>
        </div>
    );
};

export default SignIn;
