import crypto from "crypto";

const MERCHANT_ID = process.env.PAYTR_MERCHANT_ID || "TEST_MERCHANT_ID";
const MERCHANT_KEY = process.env.PAYTR_MERCHANT_KEY || "TEST_MERCHANT_KEY";
const MERCHANT_SALT = process.env.PAYTR_MERCHANT_SALT || "TEST_MERCHANT_SALT";

interface PaytrTokenParams {
  userIp: string;
  merchantOid: string;
  email: string;
  paymentAmount: number; // in kuruş or normal? PayTR expects float amount multiplied by 100 or as string with 2 decimals? PayTR expects amount multiplied by 100 (e.g. 100 TL -> 10000 or 99.90 TL -> 9990) as string, or formatted float. Actually PayTR expects the exact payment amount as float, e.g. "99.90" but converted/formatted. Let's send the string with two decimals, or round it, but the signature must match. PayTR payment_amount is the amount of payment. E.g. "99.90" or "100". Let's use Math.round(amount * 100) / 100 as string.
  userBasket: string; // JSON base64 string
  userName: string;
  userAddress: string;
  userPhone: string;
  okUrl: string;
  failUrl: string;
  testMode?: "0" | "1";
}

export function generatePaytrToken(params: PaytrTokenParams) {
  const testMode = params.testMode || "1"; // Default to test mode
  const noInstall = "0"; // 0: allow installments, 1: block installments
  const maxInstall = "0"; // 0: no limit
  const currency = "TL";
  
  // Format payment amount (e.g. 99.9 -> 99.90)
  // PayTR expects float * 100 or formatted decimal. Standard is Math.round(paymentAmount * 100) as integer/string (e.g., 9990 kuruş) in some versions, or float formatted.
  // Actually, PayTR API expects kuruş (amount * 100) or decimal depending on the version. Let's use Math.round(params.paymentAmount * 100). E.g., 100.50 TL -> 10050.
  const amountStr = Math.round(params.paymentAmount * 100).toString();

  // Create concat string for signature hash
  // merchant_id + user_ip + merchant_oid + email + payment_amount + user_basket + no_install + max_install + currency + test_mode + merchant_salt
  const concatStr = 
    MERCHANT_ID + 
    params.userIp + 
    params.merchantOid + 
    params.email + 
    amountStr + 
    params.userBasket + 
    noInstall + 
    maxInstall + 
    currency + 
    testMode + 
    MERCHANT_SALT;

  const token = crypto
    .createHmac("sha256", MERCHANT_KEY)
    .update(concatStr)
    .digest("base64");

  return {
    token,
    merchantId: MERCHANT_ID,
    amountStr,
    currency,
    noInstall,
    maxInstall,
    testMode
  };
}

export function verifyPaytrCallback(
  merchantOid: string,
  status: string,
  totalAmount: string,
  hash: string
): boolean {
  // Concat string for verification: merchant_oid + merchant_salt + status + total_amount
  const concatStr = merchantOid + MERCHANT_SALT + status + totalAmount;
  
  const calculatedHash = crypto
    .createHmac("sha256", MERCHANT_KEY)
    .update(concatStr)
    .digest("base64");

  return calculatedHash === hash;
}
