import { createContext, ReactNode, useContext, useEffect, useState } from "react"


interface User {
    id: number
    name: string
    email: string
    picture: string
    first_name: string
    last_name: string
    about: string
    url: string
    company: string
}

interface AuthContextType {
    user: User | null
    token: string | null;
    loginContext: (userData: {user: User; token: string}) => void;
    logoutContext: () => void;
    getUserContext: () => User | null
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider = (props: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
    
    
    
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if(storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
            setIsAuthenticated(true);
            
        } else {
            setIsAuthenticated(false);
        }
    }, [])

    const loginContext = (userData: {user: User; token: string}) => {
        setUser(userData.user);
        setToken(userData.token);

        // Armazenar os dados de autenticação no localStorage
        localStorage.setItem('user', JSON.stringify(userData.user));
        localStorage.setItem('token', userData.token);

        setIsAuthenticated(true);

        window.location.href = '/';
        
    }

    const logoutContext = () => {
        setUser(null);
        setToken(null);

        // Remover os dados de autenticação do localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('selectedEnvironment');
        localStorage.removeItem('selectedEnterprise');

        window.location.href = '/login';
    };

    const getUserContext = () => {
        return user;
    }

    // adicionar aqui outras funçãos de login 

    return (
        <AuthContext.Provider value={{ user, token, loginContext, logoutContext, getUserContext, isAuthenticated }}>
            {props.children}
        </AuthContext.Provider>
    );

}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};





