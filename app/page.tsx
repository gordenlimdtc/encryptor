"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Lock, Copy, CheckCircle, AlertCircle } from "lucide-react";

const encryptFormSchema = z.object({
  publicKey: z.string().min(1, "Public key is required"),
  message: z.string().min(1, "Message is required"),
});

type EncryptFormData = z.infer<typeof encryptFormSchema>;

export default function Home() {
  const [encryptedResult, setEncryptedResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const form = useForm<EncryptFormData>({
    resolver: zodResolver(encryptFormSchema),
    defaultValues: {
      publicKey: "",
      message: "",
    },
  });

  const onSubmit = async (data: EncryptFormData) => {
    setIsLoading(true);
    setError("");
    setEncryptedResult("");

    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: data.message,
          publicKey: data.publicKey,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to encrypt message");
      }

      const result = await response.json();
      setEncryptedResult(result.encrypted);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (encryptedResult) {
      try {
        await navigator.clipboard.writeText(encryptedResult);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy to clipboard:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-indigo-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Message Encryptor</h1>
          </div>
          <p className="text-lg text-gray-600">
            Encrypt your messages using RSA public key encryption
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Encrypt Message</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="publicKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Public Key</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your RSA public key content (without BEGIN/END markers)"
                          className="min-h-[120px] font-mono text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Message to Encrypt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter the message you want to encrypt"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Encrypting...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Lock className="h-4 w-4 mr-2" />
                      Encrypt Message
                    </div>
                  )}
                </Button>
              </form>
            </Form>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-red-700">{error}</span>
                </div>
              </div>
            )}
          </div>

          {/* Result Display */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Encrypted Result</h2>
            
            {encryptedResult ? (
              <div className="space-y-4">
                <div className="relative">
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Encrypted Message
                  </Label>
                  <div className="relative">
                    <Textarea
                      value={encryptedResult}
                      readOnly
                      className="min-h-[200px] font-mono text-sm bg-gray-50"
                    />
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                    >
                      {copied ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-green-700 font-medium">
                      Message encrypted successfully!
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-gray-500">
                <div className="text-center">
                  <Lock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Encrypted result will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">How to Use</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-indigo-600 font-bold">1</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Enter Public Key</h4>
              <p className="text-sm text-gray-600">
                Paste your RSA public key content (the API will automatically add the PEM wrapper)
              </p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-indigo-600 font-bold">2</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Write Message</h4>
              <p className="text-sm text-gray-600">
                Enter the message you want to encrypt. This will be encrypted using the public key.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-indigo-600 font-bold">3</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Get Result</h4>
              <p className="text-sm text-gray-600">
                Click &quot;Encrypt Message&quot; to get your encrypted result. You can copy it to clipboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
