/* eslint-disable @typescript-eslint/no-explicit-any */

import { AxiosResponse } from "axios";
import axios from "../../axios";

export const getAllUsers = async (): Promise<any> => {
  const response: AxiosResponse<any> = await axios.get("/users");
  return response.data;
};

interface getUserProps {
  id: string;
  user: []
}

export const getUser = async (id: string): Promise<getUserProps> => {
  const response: AxiosResponse<getUserProps> = await axios.get(`/user/${id}`);

  return response.data;
};

interface userUpdateProps {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  about: string;
  url: string;
  company: string;
  profile_photo_path: string;
}

export const updateUser = async (
  id: string,
  name: string,
  first_name: string,
  last_name: string,
  about: string,
  url: string,
  company: string,
  profile_photo_path: string
): Promise<userUpdateProps> => {
  const response: AxiosResponse<userUpdateProps> = await axios.put(
    `/user/${id}`,
    {
      name,
      first_name,
      last_name,
      about,
      url,
      company,
      profile_photo_path,
    },
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return response.data;
};


interface changePasswordProps {
  id: string
  passwordCurrent: string
  passwordNew: string
}


export const changePasswordUser = async (id: string, passwordCurrent: string, passwordNew: string): Promise<changePasswordProps> => {
  const response: AxiosResponse<changePasswordProps> = await axios.put(`/user/change-password/${id}`, {
    passwordCurrent,
    passwordNew
  });

  return response.data;
}
