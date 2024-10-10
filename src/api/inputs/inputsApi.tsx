import { AxiosResponse } from "axios";
import axios from '../../axios'

interface PropsInputs {
    name: string
    type: string
    enterprise_id: number
    options: string
}


export const createInputs = async (name: string, type: string, enterprise_id: number, options: string): Promise<PropsInputs> => {
    const response: AxiosResponse<PropsInputs> = await axios.post('/environment/input', {
        name: name,
        type: type,
        enterprise_id: enterprise_id,
        options: options
    });


    return response.data;

}

interface PropsValuesInputs {
    content: string
    name_input: string
    input_card_id: string
    card_id: string

}

export const updatedValuesInputs = async (content: string, name_input: string, input_card_id: string, card_id: string): Promise<PropsValuesInputs> => {
    const response: AxiosResponse<PropsValuesInputs> = await axios.put(`inputs/add-content`, {
        content,
        name_input,
        input_card_id,
        card_id
    });

    return response.data
}

interface PropsGetInputs {
    enterprise_id: string | number 
    inputs: []
}


export const getAllInputs = async (enterprise_id: string | number): Promise<PropsGetInputs> => {
    const response: AxiosResponse<PropsGetInputs> = await axios.get(`/inputs/${enterprise_id}`, {
        withCredentials: true
    });

    return response.data;
}


interface PropsDeleteInputs {
    id: string
}

export const deleteInputsEnvironment = async (id: string): Promise<PropsDeleteInputs> => {

    const response: AxiosResponse<PropsDeleteInputs> = await axios.delete(`/environment/input/${id}`);

    return response.data;

}

interface allInputsByCardProps {
    card_id: string
    content: []
}

export const allInputsByCard = async (card_id: string): Promise<allInputsByCardProps> => {
    const response: AxiosResponse<allInputsByCardProps> = await axios.get(`/inputs/all-inputs-by-card-id`, {
        params: {
            card_id
        }
    });

    return response.data;
} 


interface hideInputsProps {
    card_id: string
    input_card_id: string
}

export const hiddenInputsCard = async (card_id: string, input_card_id: string): Promise<hideInputsProps> => {
    const response: AxiosResponse<hideInputsProps> = await axios.post('/inputs/hidden-input', {
        card_id,
        input_card_id,
      
    });

    return response.data
}