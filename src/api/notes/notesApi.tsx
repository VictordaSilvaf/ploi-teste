import { AxiosResponse } from "axios";
import axios from "../../axios";

export interface Note {
  id: number;
  title: string;
  description: string;
  tag: Tag[];
  status: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  mark?: {
    id: number;
    name: string;
    email?: string;
  }[];
}

export interface Tag {
  content: string;
  color:
    | "gray"
    | "red"
    | "yellow"
    | "green"
    | "blue"
    | "indigo"
    | "purple"
    | "pink";
}

interface NotesResponse {
  notas: Note[];
}

export const getAllNotes = async (): Promise<NotesResponse> => {
  const response: AxiosResponse<NotesResponse> = await axios.get("/note");
  return response.data;
};

export const getNoteDetails = async (note_id: string): Promise<Note> => {
  const response: AxiosResponse<Note> = await axios.get(`/note/${note_id}`, {
    withCredentials: true,
  });
  return response.data;
};

export const deleteNote = async (note_id: number): Promise<Note> => {
  const response: AxiosResponse<Note> = await axios.delete(`/note/${note_id}`, {
    withCredentials: true,
  });
  return response.data;
};


interface StoreNoteResponse {
  id: number;
  title: string | null;
  description: string | null;
  tag: Tag[];
  status: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export const getNote = async (note_id: string): Promise<Note> => {
  const response: AxiosResponse<Note> = await axios.get(`/note/${note_id}`, {
    withCredentials: true,
  });
  return response.data;
};

export const storeNote = async (
  title: string,
  description: string,
  tag: string,
  mark: {
    id: number;
    name: string;
    email?: string;
  }[]
): Promise<StoreNoteResponse> => {
  const response: AxiosResponse<StoreNoteResponse> = await axios.post(
    "/note",
    {
      title: title,
      description: description,
      tag: tag,
      mark: mark,
    },
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const updateNote = async (
  title: string,
  description: string,
  tag: string,
  mark: {
    id: number;
    name: string;
    email?: string;
  }[],
  note_id: string
): Promise<{ message: string }> => {
  const response: AxiosResponse<{ message: string }> = await axios.post(
    `/note/${note_id}?_method=PUT`,
    {
      title: title,
      description: description,
      tag: tag,
      mark: mark,
    },
    {
      withCredentials: true,
    }
  );

  return response.data;
};
