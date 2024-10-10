import { AxiosResponse } from "axios"
import axios from '../../axios'


interface userResposableCardProps {
    user_id: string
}


export const getCardsResponsableUser = async (user_id: string): Promise<userResposableCardProps> => {
    const response: AxiosResponse = await axios.get(`/responsablecard/all-responsable/${user_id}`);

    return response.data;
}

interface responsableCardPeopleProps {
    user_id: string
    card_id: string
}

export const responsableCardPeople = async (user_id: string, card_id: string): Promise<responsableCardPeopleProps> => {
    const response: AxiosResponse = await axios.post('/responsablecard', {
        user_id,
        card_id
    });

    return response.data;
}

interface deleteResponsableProps {
    id: string
}

export const deleteResponsable = async (id: string): Promise<deleteResponsableProps> => {
    const response: AxiosResponse<deleteResponsableProps> = await axios.delete(`/responsablecard/${id}`);
    return response.data;
}

