import { AxiosResponse } from "axios";
import axios from "../../axios";

export interface Environment {
  id: number;
  name: string;
  user_id: number;
  enterprise_id: number;
}

interface PropsGetEnvironment {
  user_id: number;
  enterprise_id: number;
  environments: Environment[];
}

export const getAllEnvironment = async (
  user_id: number,
  enterprise_id: number
): Promise<PropsGetEnvironment> => {
  const response: AxiosResponse<PropsGetEnvironment> = await axios.get(
    "/environment/user",
    {
      params: {
        user_id: user_id,
        enterprise_id: enterprise_id,
      },
      withCredentials: true,
    }
  );

  return response.data;
};

export const getAllEnvironmentTrashed = async (
  user_id: number,
  enterprise_id: number
): Promise<PropsGetEnvironment> => {
  const response: AxiosResponse<PropsGetEnvironment> = await axios.get(
    "/environment/trashed",
    {
      params: {
        user_id: user_id,
        enterprise_id: enterprise_id,
      },
      withCredentials: true,
    }
  );

  return response.data;
};

interface EnvironmentCreate {
  name: string;
  user_id: number;
  enterprise_id: number;
  environment: {
    id: number;
  };
}

export const createEnvironment = async (
  name: string,
  user_id: number,
  enterprise_id: number
): Promise<EnvironmentCreate> => {
  const response: AxiosResponse<EnvironmentCreate> = await axios.post(
    "/environment",
    {
      name: name,
      user_id: user_id,
      enterprise_id: enterprise_id,
    },
    {
      withCredentials: true,
    }
  );

  return response.data;
};

interface deleteEnvironmentsProps {
  id: string;
}

export const deleteEnvironment = async (
  id: string
): Promise<deleteEnvironmentsProps> => {
  const response: AxiosResponse<deleteEnvironmentsProps> = await axios.delete(
    `/environment/${id}`
  );

  return response.data;
};

export const forceDeleteEnvironment = async (
  id: string
): Promise<deleteEnvironmentsProps> => {
  const response: AxiosResponse<deleteEnvironmentsProps> = await axios.delete(
    `/environment/${id}/forceDelete`
  );

  return response.data;
};

interface updateEnvironmentProps {
  id: string;
  enterprise_id: string;
  name: string;
}

export const updateEnvironment = async (
  id: string,
  enterprise_id: number,
  name: string
): Promise<updateEnvironmentProps> => {
  const response: AxiosResponse<updateEnvironmentProps> = await axios.put(
    `/environment/${id}`,
    {
      enterprise_id,
      name,
    }
  );

  return response.data;
};

interface restoreEnvironmentProps {
  id: string;
}

export const restoreEnvironment = async (
  id: string
): Promise<restoreEnvironmentProps> => {
  const response: AxiosResponse<restoreEnvironmentProps> = await axios.put(
    `/environment/${id}/restore`
  );

  return response.data;
};
