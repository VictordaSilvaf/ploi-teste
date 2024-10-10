import { AxiosResponse } from "axios";
import axios from "../../axios";

interface PropsCardOrder {
  pipeline_id: string;
  to_position: number | undefined;
  card_id: string;
}

export const updateCardOrder = async (
  pipeline_id: string,
  to_position: number | undefined,
  card_id: string
): Promise<PropsCardOrder> => {
  const response: AxiosResponse<PropsCardOrder> = await axios.put(
    `/card/order/${card_id}`,
    {
      pipeline_id: pipeline_id,
      to_position: to_position,
    }
  );

  return response.data;
};

interface PropsCreateCards {
  title: string;
  description: string;
  user_id: number;
  pipeline_id: number;
}

export const createCards = async (
  title: string,
  description: string,
  user_id: number,
  pipeline_id: number
): Promise<PropsCreateCards> => {
  const response: AxiosResponse<PropsCreateCards> = await axios.post("/card", {
    title: title,
    description: description,
    user_id: user_id,
    pipeline_id: pipeline_id,
  });

  return response.data;
};

interface PropsUpdateCardData {
  id: string | number;
  title: string;
  email: string;
  phone: string;
  description: string;
  user_id: number;
  pipeline_id: number | string | undefined;
  date_conclusion: string
  priority: string
}

export const updatedCardData = async (
  id: string | number,
  title: string,
  email: string,
  phone: string,
  description: string,
  user_id: number,
  pipeline_id: string | number | undefined,
  date_conclusion: string,
  priority: string
): Promise<PropsUpdateCardData> => {
  const response: AxiosResponse<PropsUpdateCardData> = await axios.put(
    `/card/${id}`,
    {
      title: title,
      email: email,
      phone: phone,
      description: description,
      user_id: user_id,
      pipeline_id: pipeline_id,
      date_conclusion: date_conclusion,
      priority: priority
    }
  );

  return response.data;
};

interface annotationCardsProps {
  card_id: string;
  title: string;
  annotation: string;
  user_id: number;
  pipeline_id: number;
}

export const updatedAnnotationCards = async (
  card_id: string,
  title: string,
  annotation: string,
  user_id: number,
  pipeline_id: number
): Promise<annotationCardsProps> => {
  const response: AxiosResponse<annotationCardsProps> = await axios.put(
    `/card/${card_id}`,
    {
      title,
      annotation,
      user_id,
      pipeline_id,
    }
  );

  return response.data;
};

interface deleteCardProps {
  card_id: string;
}

export const deleteCard = async (card_id: string): Promise<deleteCardProps> => {
  const response: AxiosResponse<deleteCardProps> = await axios.delete(
    `/card/${card_id}`
  );

  return response.data;
};

interface cardTrashedProps {
  user_id: string
  cards: []
}
export const cardTrasheds = async (user_id: string): Promise<cardTrashedProps> => {
  const response: AxiosResponse<cardTrashedProps> = await axios.get(`/card/trashed/${user_id}`);

  return response.data
}
