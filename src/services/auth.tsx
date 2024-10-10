import { AxiosResponse } from 'axios';
import axios from '../axios';

interface User {
    id: number;
    name: string;
    first_name: string
    last_name: string
    about: string
    url: string
    company: string
    email: string;
    picture: string
}

interface AuthResponse {
    token: string;
    user: User;
    email: string,
    passoword: string
}

axios.defaults.withCredentials = true;

export const login = async (email: string, password: string): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await axios.post('/auth', {
        email,
        password,
       
    },
        {
            withCredentials: true
        }
    );

    

    return response.data;
}


interface AuthRegistration {
    name: string
    email: string
    password: string
}

export const registration = async (name: string, email: string, password: string): Promise<AuthRegistration> => {

    const response: AxiosResponse<AuthRegistration> = await axios.post('/user', {
        name,
        email,
        password
    });

    return response.data

}

interface PropsResetPassword {
    email: string
}

export const resetPassword = async(email: string): Promise<PropsResetPassword> => {
    
    const response: AxiosResponse<PropsResetPassword> = await axios.post('/auth/reset-password', {
        email
    });

    return response.data;
}