import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an Authprovider');
    }
    return context;
};

export const Authprovider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        const storedRole = localStorage.getItem('role');

        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
            setRole(storedRole);
            setIsAuthenticated(true);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post('https://zesty-ktrace.up.railway.app/api/auth/login', { email, password });

            if (response.data.success) {
                const { token, user, role } = response.data.data;

                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('role', role);

                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                setUser(user);
                setRole(role);
                setIsAuthenticated(true);

                return { success: true, role };
            }
            return { success: false, error: response.data.error };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Login failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        setRole(null);
        setIsAuthenticated(false);
    };

    const value = {
        user,
        role,
        loading,
        isAuthenticated,
        login,
        logout,
        isAdmin: role === 'admin',
        isOperator: ['drymill', 'wetmill', 'finance'].includes(role),
        isDrymill: role === 'drymill',
        isWetmill: role === 'wetmill',
        isFinance: role === 'finance',
        isFarmer: role === 'farmer',
        isBuyer: role === 'buyer',
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}