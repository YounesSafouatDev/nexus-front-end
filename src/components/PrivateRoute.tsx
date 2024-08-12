import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setIsAuthenticated(false);
                return;
            }

            try {
                const response = await axios.post('https://nexus-back-end.onrender.com/auth/validate-token', {
                    token,
                });

                if (response.data.isValid) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                setIsAuthenticated(false);
            }
        };

        validateToken();
    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>; // Optional: Add a loading spinner or message while checking authentication
    }

    return isAuthenticated ? <>{children}</> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;
