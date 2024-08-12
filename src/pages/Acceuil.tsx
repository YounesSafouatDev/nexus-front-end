import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";

const Acceuil: React.FC = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const validateToken = async (token: string) => {
        try {
            const response = await axios.post('https://nexus-back-end.onrender.com/auth/validate-token', { token });
            return response.data.isValid;
        } catch (error) {
            console.error('Token validation error:', error);
            return false;
        }
    };

    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                const isValid = await validateToken(token);
                if (isValid) {
                    navigate('/dashboard');
                }
            }
        };

        checkAuthStatus();
    }, [navigate, toast]);

    const handleButtonClick = (role: string) => {
        navigate(`/sign-up?role=${role}`);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="mb-8 text-4xl font-bold">Vous êtes</h1>
            <div className="flex space-x-4">
                <Button
                    className="w-40 h-12 px-4 py-2 text-black border border-black rounded bg-white-200 hover:text-red-200"
                    onClick={() => handleButtonClick('orderGiver')}
                >
                    Order Giver
                </Button>
                <Button
                    className="w-40 h-12 px-4 py-2 text-black border border-black rounded bg-white-200 hover:text-red-200"
                    onClick={() => handleButtonClick('devTeam')}
                >
                    Dev Team
                </Button>
            </div>
        </div>
    );
};

export default Acceuil;
