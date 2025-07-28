import { NextResponse } from "next/server";
import jsrsasign from "jsrsasign";

export async function POST(request: Request) {
  const { text, publicKey } = await request.json();
  
  try {
    // Handle both full PEM format and key content only
    const pemKey = publicKey.includes('-----BEGIN PUBLIC KEY-----') 
      ? publicKey 
      : `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`;
    
    const pubKeyObj = jsrsasign.KEYUTIL.getKey(pemKey) as jsrsasign.RSAKey;
    const encryptedHex = jsrsasign.KJUR.crypto.Cipher.encrypt(text, pubKeyObj, "RSA");
    
    // Convert hex to base64 to match JSEncrypt output format
    const encryptedBase64 = jsrsasign.hextob64(encryptedHex);
    
    return NextResponse.json({ encrypted: encryptedBase64 });
  } catch (error) {
    console.error('Encryption error:', error);
    return NextResponse.json(
      { error: 'Failed to encrypt message. Please check your public key.' },
      { status: 400 }
    );
  }
}
