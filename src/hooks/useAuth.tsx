
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const useAuth = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/sign-in');
                return;
            }

            try {
                const response = await axios.post('/validate-token', { token });
                if (!response.data.isValid) {
                    navigate('/sign-in');
                }
            } catch (error) {
                console.error('Token validation error:', error);
                navigate('/sign-in');
            }
        };

        checkAuth();
    }, [navigate]);
};

export default useAuth;
