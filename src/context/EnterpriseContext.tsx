import React, { createContext, useState, useCallback, useContext, ReactNode, useEffect } from 'react';

// Definição da interface Enterprise
interface Enterprise {
    id: number;
    name: string;
    description: string
    user_id: number
    // Adicione outros campos conforme necessário
}

// Definição da interface para o contexto
interface EnterpriseContextProps {
    enterprise: Enterprise | null;
    handleEnterpriseChange: (enterprise: Enterprise) => void;
}

// Criação do contexto
const EnterpriseContext = createContext<EnterpriseContextProps | undefined>(undefined);

// Função para obter a empresa armazenada no localStorage
const getStoredEnterprise = (): Enterprise | null => {
    const storedEnterprise = localStorage.getItem('selectedEnterprise');
    return storedEnterprise ? JSON.parse(storedEnterprise) : null;
};

// Definição do provedor de contexto
export const EnterpriseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [enterprise, setEnterprise] = useState<Enterprise | null>(getStoredEnterprise);

    const handleEnterpriseChange = useCallback((enterprise: Enterprise) => {
        setEnterprise(enterprise);
        // Armazena a empresa no localStorage quando ela for alterada
        localStorage.setItem('selectedEnterprise', JSON.stringify(enterprise));
    }, []);

    useEffect(() => {
        // Recupera a empresa armazenada quando o componente monta
        const storedEnterprise = getStoredEnterprise();
        if (storedEnterprise) {
            setEnterprise(storedEnterprise);
        }
    }, []);

    return (
        <EnterpriseContext.Provider value={{ enterprise, handleEnterpriseChange }}>
            {children}
        </EnterpriseContext.Provider>
    );
};
// Hook para usar o contexto
// eslint-disable-next-line react-refresh/only-export-components
export const useEnterpriseContext = (): EnterpriseContextProps => {
    const context = useContext(EnterpriseContext);
    if (!context) {
        throw new Error("useEnterpriseContext must be used within an EnterpriseProvider");
    }
    return context;
};
