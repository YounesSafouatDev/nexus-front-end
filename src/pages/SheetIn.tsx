import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const countryOptions = [
    { code: 'MA', name: '+212' },
    { code: 'FR', name: '+33' },
];

const SheetIn: React.FC = () => {
    const [formData, setFormData] = useState({
        companyName: '',
        email: '',
        phone: '',
        phoneCountry: 'MA',
        keywords: '',
        description: '',
        image: '',
        postType: ''
    });
    const { toast } = useToast();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch postType from API
        const fetchPostType = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/api/posts/post-type', {
                    headers: { Authorization: `${token}` }
                });
                setFormData(prevData => ({
                    ...prevData,
                    postType: response.data.postType
                }));
            } catch (error) {
                console.error('Failed to fetch post type:', error);
                showError('Failed to fetch post type.');
            }
        };

        fetchPostType();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target;

        if (target instanceof HTMLInputElement) {
            const { name, value, files } = target;

            if (name === 'image' && files) {
                const file = files[0];
                const reader = new FileReader();

                reader.onloadend = () => {
                    const base64String = reader.result as string;
                    setFormData({
                        ...formData,
                        image: base64String
                    });
                    setImagePreview(base64String);
                };

                reader.readAsDataURL(file);
            } else if (name !== 'image') {
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
        if (formData.phone.length < 9 || formData.phone.length > 15) {
            showError('Phone number must be between 9 and 15 digits long.');
            return;
        }

        // Validate the email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(formData.email)) {
            showError('Please enter a valid email address.');
            return;
        }

        // Validate the keywords (if required)
        const keywordsArray = formData.keywords.split(',').map(keyword => keyword.trim()).filter(keyword => keyword.length > 0);
        if (keywordsArray.length === 0) {
            showError('Please enter at least one keyword.');
            return;
        }

        // Format phone number with country code
        const formattedPhone = `${countryOptions.find(option => option.code === formData.phoneCountry)?.name || '+212'}${formData.phone}`;

        const dataToSubmit = {
            ...formData,
            phone: formattedPhone,
            keywords: keywordsArray, // Convert keywords to an array
        };

        try {
            const response = await axios.post('http://localhost:3000/api/posts/create', dataToSubmit, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`
                },
            });

            // Handle successful post creation
            toast({
                title: "Post Created",
                description: response.data.message,
            });

            // Redirect to a different page if needed
            navigate('/dashboard');

        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.error) {
                showError(error.response.data.error);
            } else {
                showError('An error occurred during post creation.');
            }

            console.error('Post creation error:', error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="flex p-8 bg-white rounded-lg shadow-lg">
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-8">
                        <label htmlFor="image" className="relative cursor-pointer">
                            <div className="flex items-center justify-center w-40 h-40 overflow-hidden border border-dashed rounded">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Image Preview" className="object-cover w-full h-full" />
                                ) : (
                                    <span className="text-gray-400">Upload Image</span>
                                )}
                            </div>
                            <input
                                type="file"
                                name="image"
                                id="image"
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
                                <Label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">Description</Label>
                                <Input
                                    type="text"
                                    name="description"
                                    id="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <Label htmlFor="keywords" className="block mb-2 text-sm font-medium text-gray-900">Keywords (comma-separated)</Label>
                                <Input
                                    type="text"
                                    name="keywords"
                                    id="keywords"
                                    value={formData.keywords}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
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
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex space-x-4">
                                <Button type="submit" className="text-white bg-blue-500">Submit</Button>
                                <Button type="button" className="text-white bg-gray-500" onClick={() => navigate('/posts')}>Cancel</Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SheetIn;
