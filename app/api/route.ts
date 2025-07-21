import { NextResponse } from "next/server";
import { JSEncrypt } from "jsencrypt";

export async function POST(request: Request) {
  const { text, publicKey } = await request.json();
  const formattedPublicKey = `-----BEGIN PUBLIC KEY-----
${publicKey}
-----END PUBLIC KEY-----`;
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(formattedPublicKey);
  const encrypted = encrypt.encrypt(text);
  return NextResponse.json({ encrypted });
}
