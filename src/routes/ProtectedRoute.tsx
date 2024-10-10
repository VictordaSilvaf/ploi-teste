import React from 'react';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return window.location.href = '/login' // Redireciona para a página de login se o usuário não estiver autenticado
    }

    return children; // Retorna o componente filho se o usuário estiver autenticado
};

export default ProtectedRoute;