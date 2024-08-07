import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/components/ui/use-toast";
import axios from 'axios';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const countryOptions = [
    { code: 'MA', name: '+212' },
    { code: 'FR', name: '+33' },
];

const SignUp: React.FC = () => {
    const [formData, setFormData] = useState({
        companyName: '',
        email: '',
        phone: '',
        phoneCountry: 'MA',
        password: '',
        logo: '',
        userType: ''
    });

    const [passwordVisible, setPasswordVisible] = useState(false);
    const { toast } = useToast();
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const role = params.get('role');
        if (role) {
            setFormData((prevData) => ({
                ...prevData,
                userType: role
            }));
        } else {
            navigate("/acceuil")
        }
    }, [location.search]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target;

        if (target instanceof HTMLInputElement) {
            const { name, value, files } = target;

            if (name === 'logo' && files) {
                const file = files[0];
                const reader = new FileReader();

                reader.onloadend = () => {
                    const base64String = reader.result as string;
                    setFormData({
                        ...formData,
                        logo: base64String
                    });
                    setLogoPreview(base64String);
                };

                reader.readAsDataURL(file);
            } else if (name !== 'logo') {
                setFormData({
                    ...formData,
                    [name]: value
                });
            }
        } else if (target instanceof HTMLSelectElement) {
            const { name, value } = target;
            if (name === 'phoneCountry') {
                setFormData({
                    ...formData,
                    phoneCountry: value
                });
            }
        }
    };

    function showError(error: string) {
        toast({
            title: "Problem",
            description: error,
        });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Ensure the phone number is valid
        if (formData.phone.length !== 9) {
            showError('Phone number must be exactly 9 digits long.');
            return;
        }

        // Validate the email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(formData.email)) {
            showError('Please enter a valid email address.');
            return;
        }

        // Ensure the password is not empty
        if (formData.password.length === 0) {
            showError('Password cannot be empty.');
            return;
        }

        // Format phone number with country code
        const formattedphone = `${countryOptions.find(option => option.code === formData.phoneCountry)?.name || '+212'}${formData.phone}`;

        const dataToSubmit = {
            ...formData,
            phone: formattedphone, // Adjusted field name to match backend
        };

        try {
            const response = await axios.post('http://localhost:3000/auth/register', dataToSubmit, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Handle successful registration
            toast({
                title: "Account created",
                description: response.data.message,
            });

            // Store the token and refresh in local storage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('refresh', response.data.refresh);

            // Redirect to the dashboard
            navigate('/dashboard');

            console.log('Registration successful:', response.data);
        } catch (error: any) {
            // Check if the error response contains a message
            if (error.response && error.response.data && error.response.data.error) {
                showError(error.response.data.error);
            } else {
                showError('An error occurred during registration.');
            }

            console.error('Registration error:', error);
        }
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="flex p-8 bg-white rounded-lg shadow-lg">
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-8">
                        <label htmlFor="logo" className="relative cursor-pointer">
                            <div className="flex items-center justify-center w-40 h-40 overflow-hidden border border-dashed rounded">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Logo Preview" className="object-cover w-full h-full" />
                                ) : (
                                    <span className="text-gray-400">Upload Logo</span>
                                )}
                            </div>
                            <input
                                type="file"
                                name="logo"
                                id="logo"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleChange}
                            />
                        </label>
                        <div className="flex flex-col space-y-4">
                            <div>
                                <Label htmlFor="companyName" className="block mb-2 text-sm font-medium text-gray-900">Company Name</Label>
                                <Input
                                    type="text"
                                    name="companyName"
                                    id="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
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
                                        className="w-full p-2 pr-10 border rounded" // Added padding to the right to make space for the icon
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
                            <div className="flex space-x-4">
                                <div className="w-1/3">
                                    <Label htmlFor="phoneCountry" className="block mb-2 text-sm font-medium text-gray-900">Country</Label>
                                    <Select
                                        name="phoneCountry"
                                        value={formData.phoneCountry}
                                        onValueChange={(value) => setFormData({ ...formData, phoneCountry: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue>{countryOptions.find(option => option.code === formData.phoneCountry)?.name || '+212'}</SelectValue>
                                        </SelectTrigger>
                                        <SelectContent id="phoneCountry">
                                            <SelectGroup>
                                                <SelectLabel>Country Codes</SelectLabel>
                                                {countryOptions.map((option) => (
                                                    <SelectItem key={option.code} value={option.code}>
                                                        {option.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="w-3/4">
                                    <Label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900">Phone Number</Label>
                                    <Input
                                        type="tel"
                                        name="phone"
                                        id="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        maxLength={9}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded">Sign Up</Button>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
