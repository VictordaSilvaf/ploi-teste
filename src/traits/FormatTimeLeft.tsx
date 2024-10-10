import { formatDistanceToNow, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

// Função para formatar a diferença de tempo
const formatTimeLeft = (createdAt: string) => {
  // Substitui o espaço por 'T' para o formato ISO
  const formattedDate = createdAt.replace(" ", "T");
  const createdDate = parseISO(formattedDate); // Usa parseISO para converter a string em Date

  // Calcula a distância entre a data criada e agora
  const distance = formatDistanceToNow(createdDate, {
    addSuffix: true, // Adiciona "ago" ou "in" conforme a diferença
    locale: ptBR, // Usa o locale em português do Brasil
  });

  // Adiciona "ago" em vez de "há" ou "em" se necessário
  return distance.replace("cerca de", "");
};

export default formatTimeLeft;