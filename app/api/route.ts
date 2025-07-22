import { NextResponse } from "next/server";
import { JSEncrypt } from "jsencrypt";

export async function POST(request: Request) {
  const { text, publicKey } = await request.json();
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);
  const encrypted = encrypt.encrypt(text);
  return NextResponse.json({ encrypted });
}
