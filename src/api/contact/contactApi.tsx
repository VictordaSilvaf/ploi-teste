import { AxiosResponse } from 'axios';
import axios from '../../axios';

interface PropsContactCreate {
    enterprise_id: number
    email: string
    owner: string
    phone_number: string
    name: string
    surname: string

}   


export const createContact = async (enterprise_id: number, email: string, owner: string, phone_number?: string, name?: string, surname?: string): Promise<PropsContactCreate> => {
    const response: AxiosResponse<PropsContactCreate> = await axios.post('/contact', {
        enterprise_id: enterprise_id,
        email: email,
        owner: owner,
        phone_number: phone_number,
        name: name,
        surname: surname
    });

    return response.data;
}

interface PropsGetContacts {
    enterprise_id: number,
    contacts: []
}

export const getContacts = async (enterprise_id: number): Promise<PropsGetContacts> => {
    const response: AxiosResponse<PropsGetContacts> = await axios.get(`/contacts/${enterprise_id}`, {
        withCredentials: true
    });

    return response.data;
}


interface PropsDeleteContact {
    id: string
}

export const deleteContact = async (id: string): Promise<PropsDeleteContact> => {
    const response: AxiosResponse<PropsDeleteContact> = await axios.delete(`/contact/${id}`);

    return response.data;
}

export const putContact = async (id: string, enterprise_id: number, email: string, owner: string, phone_number?: string, name?: string, surname?: string): Promise<PropsContactCreate> => {
    const response: AxiosResponse<PropsContactCreate> = await axios.put(`/contact/${id}`, {
        enterprise_id: enterprise_id,
        email: email,
        owner: owner,
        phone_number: phone_number,
        name: name,
        surname: surname
    });

    return response.data
}