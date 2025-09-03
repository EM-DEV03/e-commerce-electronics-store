export interface PayUConfig {
  apiKey: string
  merchantId: string
  accountId: string
  testMode: boolean
}

export interface PaymentRequest {
  orderId: string
  amount: number
  currency: string
  description: string
  buyerEmail: string
  buyerFullName: string
  paymentMethod: "CREDIT_CARD" | "PSE" | "CASH" | "NEQUI"
  creditCardData?: {
    number: string
    expirationDate: string
    securityCode: string
    name: string
  }
  pseData?: {
    bankCode: string
    userType: "N" | "J"
    documentType: "CC" | "CE" | "NIT"
    documentNumber: string
  }
}

export interface PaymentResponse {
  success: boolean
  transactionId?: string
  orderId: string
  state: "APPROVED" | "DECLINED" | "PENDING" | "ERROR"
  responseMessage: string
  paymentNetworkResponseCode?: string
  paymentNetworkResponseErrorMessage?: string
}

const PAYU_CONFIG: PayUConfig = {
  apiKey: process.env.PAYU_API_KEY || "",
  merchantId: process.env.PAYU_MERCHANT_ID || "",
  accountId: process.env.PAYU_ACCOUNT_ID || "",
  testMode: process.env.NODE_ENV !== "production",
}

const PAYU_BASE_URL = PAYU_CONFIG.testMode
  ? "https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi"
  : "https://api.payulatam.com/payments-api/4.0/service.cgi"

export async function processPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
  try {
    const signature = generateSignature(
      PAYU_CONFIG.apiKey,
      PAYU_CONFIG.merchantId,
      paymentRequest.orderId,
      paymentRequest.amount,
      paymentRequest.currency,
    )

    const payuRequest = {
      language: "es",
      command: "SUBMIT_TRANSACTION",
      merchant: {
        apiKey: PAYU_CONFIG.apiKey,
        apiLogin: PAYU_CONFIG.merchantId,
      },
      transaction: {
        order: {
          accountId: PAYU_CONFIG.accountId,
          referenceCode: paymentRequest.orderId,
          description: paymentRequest.description,
          language: "es",
          signature: signature,
          additionalValues: {
            TX_VALUE: {
              value: paymentRequest.amount,
              currency: paymentRequest.currency,
            },
          },
          buyer: {
            merchantBuyerId: "1",
            fullName: paymentRequest.buyerFullName,
            emailAddress: paymentRequest.buyerEmail,
            contactPhone: "3001234567",
            dniNumber: "12345678",
            shippingAddress: {
              street1: "Calle 123 #45-67",
              street2: "",
              city: "Sincelejo",
              state: "Sucre",
              country: "CO",
              postalCode: "700001",
              phone: "3001234567",
            },
          },
        },
        paymentMethod: paymentRequest.paymentMethod,
        paymentCountry: "CO",
        deviceSessionId: generateDeviceSessionId(),
        ipAddress: "127.0.0.1",
        cookie: "pt1t38347bs6jc9ruv2ecpv7o2",
        userAgent: "Mozilla/5.0",
      },
    }

    if (paymentRequest.paymentMethod === "CREDIT_CARD" && paymentRequest.creditCardData) {
      payuRequest.transaction = {
        ...payuRequest.transaction,
        creditCard: {
          number: paymentRequest.creditCardData.number,
          securityCode: paymentRequest.creditCardData.securityCode,
          expirationDate: paymentRequest.creditCardData.expirationDate,
          name: paymentRequest.creditCardData.name,
        },
      }
    }

    if (paymentRequest.paymentMethod === "PSE" && paymentRequest.pseData) {
      payuRequest.transaction = {
        ...payuRequest.transaction,
        bankCode: paymentRequest.pseData.bankCode,
        userType: paymentRequest.pseData.userType,
        documentType: paymentRequest.pseData.documentType,
        documentNumber: paymentRequest.pseData.documentNumber,
      }
    }

    const response = await fetch(PAYU_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payuRequest),
    })

    const result = await response.json()

    return {
      success: result.code === "SUCCESS",
      transactionId: result.transactionResponse?.transactionId,
      orderId: paymentRequest.orderId,
      state: result.transactionResponse?.state || "ERROR",
      responseMessage: result.transactionResponse?.responseMessage || result.error || "Error desconocido",
      paymentNetworkResponseCode: result.transactionResponse?.paymentNetworkResponseCode,
      paymentNetworkResponseErrorMessage: result.transactionResponse?.paymentNetworkResponseErrorMessage,
    }
  } catch (error) {
    console.error("PayU payment error:", error)
    return {
      success: false,
      orderId: paymentRequest.orderId,
      state: "ERROR",
      responseMessage: "Error de conexión con el procesador de pagos",
    }
  }
}

function generateSignature(
  apiKey: string,
  merchantId: string,
  referenceCode: string,
  amount: number,
  currency: string,
): string {
  const crypto = require("crypto")
  const signatureString = `${apiKey}~${merchantId}~${referenceCode}~${amount}~${currency}`
  return crypto.createHash("md5").update(signatureString).digest("hex")
}

function generateDeviceSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export async function getPaymentMethods(): Promise<any[]> {
  return [
    { code: "CREDIT_CARD", name: "Tarjeta de Crédito", type: "CREDIT_CARD" },
    { code: "PSE", name: "PSE - Pagos Seguros en Línea", type: "BANK_TRANSFER" },
    { code: "CASH", name: "Efectivo (Baloto, Efecty)", type: "CASH" },
    { code: "NEQUI", name: "Nequi", type: "DIGITAL_WALLET" },
  ]
}
