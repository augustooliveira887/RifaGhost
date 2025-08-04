import { PixResponse } from '../types';

export interface PixResponse {
  id: string;
  pixCode: string;
  pixQrCode: string;
}

const SECRET_KEY = '18e91c79-748a-4418-872a-0d64db8f7083';
const API_URL = "https://app.ghostspaysv1.com/api/v1/transaction.purchase";


export async function gerarPix(
  nome: string,
  email: string,
  cpf: string,
  telefone: string,
  valorCentavos: number,
  descricao: string,
  utmQuery: string
): Promise<PixResponse> {
 
 const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': SECRET_KEY,
        'Accept': 'application/json'
      },
    body: JSON.stringify({
      name: nome,
      email,
      cpf,
      phone: telefone,
      paymentMethod: "PIX",
      amount: valorCentavos,
      traceable: true,
      utmQuery,
      items: [
        {
          unitPrice: valorCentavos,
          title: descricao,
          quantity: 1,
          tangible: false
        }
      ]
    })
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Erro ao gerar cobrança:", data);
    throw new Error(data.message || "Erro ao gerar cobrança Pix");
  }

  return {
    id: data.id,
    pixCode: data.pixCode,
    pixQrCode: data.pixQrCode
  };
}

/**
 * Verifica o status de pagamento Pix
 */
const STATUS_URL = "https://app.ghostspaysv1.com/api/v1/transaction.getPayment";

export async function verificarStatusPagamento(id: string): Promise<"PENDING" | "APPROVED" | "FAILED" | "REJECTED"> {
  const response = await fetch(`${STATUS_URL}?id=${id}`, {
    method: "GET",
    headers: {
      "Authorization": SECRET_KEY
    }
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Erro ao verificar status:", data);
    throw new Error(data.message || "Erro ao verificar status do pagamento");
  }

  return data.status;
}

