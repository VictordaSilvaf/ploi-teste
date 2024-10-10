import { AxiosResponse } from "axios"
import axios from '../../axios';
interface PropsPipeline {
    enterprise_id: string | undefined | number
    pipelines: []
}


export const getPipelineEnterprise = async (enterprise_id: string | undefined | number): Promise<PropsPipeline> => {

    const response: AxiosResponse<PropsPipeline> = await axios.get(`/pipeline/${enterprise_id}`, {
        withCredentials: true
    });

    return response.data;
}

export const getPipelinesTrashed = async (enterprise_id: string | undefined | number): Promise<PropsPipeline> => {
    const response: AxiosResponse<PropsPipeline> = await axios.get(`/pipeline/${enterprise_id}/trashed`);
    return response.data;

}


interface PropsPipelineUpdate {
    id: string | number
    name: string
    sort: number
    enterprise_id: number
    environment_id: number
    color?: string
}

export const updatedPipeline = async (id: string | number, name: string, sort: number, enterprise_id: number, environment_id: number, color?: string): Promise<PropsPipelineUpdate> => {

    const response: AxiosResponse<PropsPipelineUpdate> = await axios.put(`/pipeline/${id}`, {
        name: name,
        sort: sort,
        enterprise_id: enterprise_id,
        environment_id: environment_id,
        color: color
        
    });

    return response.data;

}



interface PropsPipelinePost {
    name: string
    enterprise_id: string | undefined | number
    environment_id: number
    color: string
    permission: string

}

export const createPipelineEnterprise = async (name: string, enterprise_id: string | undefined | number, environment_id: number, color: string, permission: string): Promise<PropsPipelinePost> => {
    const response: AxiosResponse<PropsPipelinePost> = await axios.post('/pipeline', {
        name: name,
        enterprise_id: enterprise_id,
        environment_id: environment_id,
        color: color,
        permission: permission

    });

    return response.data;
}


interface PropsDeletePipeline {
    id: string
}

export const deletePipeline = async (id: string): Promise<PropsDeletePipeline> => {
    const response: AxiosResponse<PropsDeletePipeline> = await axios.delete(`/pipeline/${id}`);

    return response.data;
}


interface restorePipelineProps {
    id: string
}

export const restorePipeline = async (id: string): Promise<restorePipelineProps> => {
    const response: AxiosResponse<restorePipelineProps> = await axios.put(`/pipeline/${id}/restore`);

    return response.data;
}