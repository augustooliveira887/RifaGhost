import { PixResponse } from '../types';

export interface PixResponse {
  id: string;
  pixCode: string;
  pixQrCode: string;
}

const SECRET_KEY = import.meta.env.VITE_GHOSTSPAY_SECRET_KEY;
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
  // Validar CPF antes de enviar
  const cpfLimpo = cpf.replace(/\D/g, '');
  if (cpfLimpo.length !== 11) {
    throw new Error('CPF deve ter 11 dígitos');
  }

  // Validar telefone
  const telefoneLimpo = telefone.replace(/\D/g, '');
  if (telefoneLimpo.length < 10) {
    throw new Error('Telefone deve ter pelo menos 10 dígitos');
  }

  try {
  const response = await fetch(API_URL, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SECRET_KEY}`,
      'Accept': 'application/json',
      'Origin': window.location.origin
    },
    body: JSON.stringify({
      name: nome,
      email,
      cpf: cpfLimpo,
      phone: telefoneLimpo,
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

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Erro na resposta da API:", {
      status: response.status,
      statusText: response.statusText,
      body: errorText
    });
    
    try {
      const errorData = JSON.parse(errorText);
      throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`);
    } catch {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }
  }

  const data = await response.json();

  return {
    id: data.id,
    pixCode: data.pixCode,
    pixQrCode: data.pixQrCode
  };
  
  } catch (error) {
    console.error("Erro ao gerar PIX:", error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Erro inesperado ao gerar cobrança PIX');
  }
}

/**
 * Verifica o status de pagamento Pix
 */
const STATUS_URL = "https://app.ghostspaysv1.com/api/v1/transaction.getPaymentDetails";

export async function verificarStatusPagamento(id: string): Promise<"PENDING" | "APPROVED" | "FAILED" | "REJECTED"> {
  try {
  const response = await fetch(`${STATUS_URL}?id=${id}`, {
    method: "GET",
    mode: 'cors',
    headers: {
      "Authorization": `Bearer ${SECRET_KEY}`,
      "Accept": "application/json",
      "Origin": window.location.origin
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Erro ao verificar status:", {
      status: response.status,
      statusText: response.statusText,
      body: errorText
    });
    throw new Error(`Erro ${response.status}: Não foi possível verificar o status do pagamento`);
  }

  const data = await response.json();
  return data.status;
  
  } catch (error) {
    console.error("Erro ao verificar status do pagamento:", error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Erro de conexão ao verificar status. Tente novamente.');
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Erro inesperado ao verificar status do pagamento');
  }
}