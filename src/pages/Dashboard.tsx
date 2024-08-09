import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Post {
    _id: string;
    companyName: string;
    keywords: string[];
    description: string;
    image: string;
    phoneCountry: string;
    postType: string; // Ensure the postType field exists in the Post interface
}

const Dashboard: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [countryFilter, setCountryFilter] = useState('');
    const [userType, setUserType] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user type and posts
        const fetchUserTypeAndPosts = async () => {
            try {
                const token = localStorage.getItem('token');

                // Fetch user type
                const userTypeResponse = await axios.get('https://nexus-back-end.onrender.com/api/posts/post-type', {
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                const fetchedUserType = userTypeResponse.data.postType;
                setUserType(fetchedUserType);

                // Determine the opposite post type
                const oppositePostType = fetchedUserType === 'devTeam' ? 'orderGiver' : 'devTeam';

                // Fetch posts based on user type
                const postsResponse = await axios.get('https://nexus-back-end.onrender.com/api/posts', {
                    params: {
                        page,
                        limit: 7,
                        keyword: searchTerm,
                        country: countryFilter,
                        postType: oppositePostType,
                    },
                    headers: {
                        Authorization: `${token}`,
                    },
                });

                setPosts(postsResponse.data.posts);
                setTotalPages(postsResponse.data.totalPages);

            } catch (error) {
                console.error('Failed to fetch user type or posts:', error);
            }
        };

        fetchUserTypeAndPosts();
    }, [page, searchTerm, countryFilter]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    const handleCountryChange = (value: string) => {
        setCountryFilter(value);
        setPage(1);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleCreatePost = () => {
        navigate('/sheet-in'); // Redirect to post creation page
    };

    const handleLogout = () => {
        // Clear tokens from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
        // Navigate to sign-in page
        navigate('/sign-in');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen my-20">
            {/* Header */}
            <div className="w-full max-w-4xl mb-8 text-center">
                {userType === 'devTeam' ? (
                    <>
                        <h1 className="text-3xl font-bold text-gray-800">Dev Team Dashboard</h1>
                        <p className="text-lg text-gray-600">Manage and view posts from order givers</p>
                    </>
                ) : (
                    <>
                        <h1 className="text-3xl font-bold text-gray-800">Order Giver Dashboard</h1>
                        <p className="text-lg text-gray-600">Manage and view posts from dev teams</p>
                    </>
                )}
            </div>

            <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md">
                <div className="flex justify-between mb-4">
                    <Button
                        onClick={handleLogout}
                        className="px-4 py-2 text-black border border-black rounded bg-white-200 hover:text-red-200"
                    >
                        Logout
                    </Button>
                    <Button
                        onClick={handleCreatePost}
                        className="px-4 py-2 text-black border border-black rounded bg-white-200 hover:text-green-200"
                    >
                        Create New Post
                    </Button>
                </div>
                <div className="flex justify-between mb-4">
                    <div className="flex flex-1">
                        <input
                            type="text"
                            placeholder="Search by keyword"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full p-2 mr-2 border border-gray-300 rounded"
                        />
                        <Select onValueChange={handleCountryChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Country" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Countries</SelectLabel>
                                    <SelectItem value="all">All Countries</SelectItem>
                                    <SelectItem value="MA">Morocco</SelectItem>
                                    <SelectItem value="FR">France</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-4">
                    {posts.map((post) => (
                        <div key={post._id} className="flex p-4 border border-gray-300 rounded-lg">
                            <img
                                src={post.image}
                                alt="Company Logo"
                                className="object-cover w-16 h-16 mr-4 rounded"
                            />
                            <div>
                                <h3 className="text-xl font-semibold">{post.companyName}</h3>
                                <p className="text-gray-600">{post.keywords.join(', ')}</p>
                                <p className="mt-2 text-gray-800">{post.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center mt-6">
                    <Button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="px-4 py-2 mr-2 text-black border border-black rounded bg-white-200 hover:text-red-200 disabled:opacity-50"
                    >
                        Previous
                    </Button>
                    <span className="px-4 py-2">{page} of {totalPages}</span>
                    <Button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                        className="px-4 py-2 ml-2 text-black border border-black rounded bg-white-200 hover:text-red-200 disabled:opacity-50"
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
