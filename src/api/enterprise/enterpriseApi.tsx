import { AxiosResponse } from "axios"
import axios from '../../axios'
/* eslint-disable @typescript-eslint/no-explicit-any */

axios.defaults.withCredentials = true;

interface Enterprise {
    enterprise(enterprise: any): string;
    
    id: string
    name: string
    user_id: number
    description: string
    photo: string
    links: string
}

interface PropsGetEnterprises {
    id: number,
    enterprises: []
}

export const createEnterprise = async (name: string, user_id: number, description: string, photo: string, links: string): Promise<Enterprise> => {


    const response: AxiosResponse<Enterprise> = await axios.post('/enterprise', {
        name: name,
        user_id: user_id,
        description: description,
        photo: photo,
        links: links
    }, {
        withCredentials: true
    })


    return response.data;

}

export const getEnterprises = async (id: number): Promise<PropsGetEnterprises> => {
    const response: AxiosResponse<PropsGetEnterprises> = await axios.get(`/enterprise/user`, {
        params: {
            user_id: id
        },
        withCredentials: true,
    });

    return response.data;

}

export const updateEnterprise = async (enterprise_id: string, name: string, description: string, links: string, user_id: number): Promise<Enterprise> => {
    const response: AxiosResponse<Enterprise> = await axios.put(`/enterprise/${enterprise_id}`, {
        name,
        description,
        links,
        user_id,
        enterprise_id
    });

    return response.data;
}


interface inviteEnterpriseProps {
    email: string
    enterprise_id: string
}


export const inviteEnterpriseUser = async (email: string, enterprise_id: string): Promise<inviteEnterpriseProps> => {
    const response: AxiosResponse<inviteEnterpriseProps> = await axios.post(`/enterprise/invite-user`, {
        email, 
        enterprise_id
    });

return response.data
}

interface getInvitesUserProps {
    user_id: string
    invites: []
}

export const getInvites = async (user_id: string): Promise<getInvitesUserProps> => {
    const response: AxiosResponse<getInvitesUserProps> = await axios.get(`/enterprise/invite-notification`, {
        params:{
            user_id
        }
    });

    return response.data;
}

interface acceptInviteProps {
    enterprise_id: string
    user_id: string
}

export const acceptInvite  = async (enterprise_id: string, user_id: string): Promise<acceptInviteProps> => {
    const response: AxiosResponse<acceptInviteProps> = await axios.post('/enterprise/accept-invite', {
        enterprise_id,
        user_id
    });

    return response.data
}


interface enterprisePivotUser {
    user_id: string;
    enterprise_pivot: []
}
export const enterprisePivotUser = async (user_id: string): Promise<enterprisePivotUser> => {
    const response: AxiosResponse<enterprisePivotUser> = await axios.get(`/user/access/enterprise/${user_id}`);

    return response.data;
}


interface userInEnterprise {
    enterprise_id: string
    users: []
}

export const userInEnterprise = async (enterprise_id: string): Promise<userInEnterprise> => {
    const response: AxiosResponse<userInEnterprise> = await axios.get('/enterprise/all-users', {
        params: {
            enterprise_id
        }
    })

    return response.data;
}