import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

interface Environment {
    id: number
    name: string
    user_id: number
    enterprise_id: number
}


interface EnvironmentContextProps {
    environment: Environment | null
    handleEnvironmentChange: (environment: Environment) => void;
}

const EnvironmentContext = createContext<EnvironmentContextProps | undefined>(undefined);

// Função para obter o ambiente  armazenado no localStorage
const getStoredEnvironment = (): Environment | null => {
    const storedEnvironment = localStorage.getItem('selectedEnvironment');
    return storedEnvironment ? JSON.parse(storedEnvironment) : null;
};

// Definição do provedor de contexto
export const EnvironmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [environment, setEnvironment] = useState<Environment | null>(getStoredEnvironment);

    const handleEnvironmentChange = useCallback((environment: Environment) => {
        setEnvironment(environment);
        // Armazena a empresa no localStorage quando ela for alterada
        localStorage.setItem('selectedEnvironment', JSON.stringify(environment));
    }, []);

    useEffect(() => {
        // Recupera a empresa armazenada quando o componente monta
        const storedEnvironment = getStoredEnvironment();
        if (storedEnvironment) {
            setEnvironment(storedEnvironment);
        }
    }, []);

    return (
        <EnvironmentContext.Provider value={{ environment, handleEnvironmentChange }}>
            {children}
        </EnvironmentContext.Provider>
    );
};
// Hook para usar o contexto
// eslint-disable-next-line react-refresh/only-export-components
export const useEnvironmentContext = (): EnvironmentContextProps => {
    const context = useContext(EnvironmentContext);
    if (!context) {
        throw new Error("useEnterpriseContext must be used within an EnterpriseProvider");
    }
    return context;
};