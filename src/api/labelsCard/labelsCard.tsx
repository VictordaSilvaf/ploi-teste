import { AxiosResponse } from "axios"
import axios from '../../axios';


interface labelsCardProps {
    name: string
    color: string
    environment_id: string
}


export const labelsCardCreate = async (name: string, color: string, environment_id: string): Promise<labelsCardProps> => {
    const response: AxiosResponse = await axios.post('/label-card', {
        name,
        color,
        environment_id
    });

    return response.data;
}

interface labelsCardActiveProps {
    label_card_id: string
    card_id: string
    active: number
}

export const labelCardActive = async (label_card_id: string, card_id: string, active: boolean): Promise<labelsCardActiveProps> => {
    const response: AxiosResponse = await axios.post('/label-card-active', {
        label_card_id,
        card_id,
        active
    });

    return response.data;
}


interface labelsCardGetProps {
    environment_id: string
}



export const getLabelsCard = async (environment_id: string): Promise<labelsCardGetProps> => {
    const response: AxiosResponse = await axios.get(`/labels-card/${environment_id}`);

    return response.data
}

interface deleteLabelsProps {
    id: string
}

export const deleteLabelsCard = async (id: string): Promise<deleteLabelsProps> => {
    const response: AxiosResponse = await axios.delete(`/label-card/${id}`);

    return response.data;
}


interface getLabelsCardAtiveProps {
    card_id: string
}


export const getLabelsAtive = async (card_id: string): Promise<getLabelsCardAtiveProps> => {

    const response: AxiosResponse = await axios.get(`/labels-card-active/${card_id}`);

    return response.data;


}

interface deleteLabelActiveProps {
    id: string
}

export const deleteLabelActive = async (id: string):Promise<deleteLabelActiveProps> => {
    const response: AxiosResponse = await axios.delete(`/label-card-active/${id}`);

    return response.data;
}