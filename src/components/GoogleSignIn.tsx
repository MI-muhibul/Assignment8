"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/AppProviders";
import { apiRequest, type User } from "@/lib/api";

type GoogleCredentialResponse = { credential?: string };

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
          }) => void;
          renderButton: (element: HTMLElement, options: {
            theme: "outline";
            size: "large";
            shape: "rectangular";
            text: "continue_with";
            width: number;
          }) => void;
        };
      };
    };
  }
}

export function GoogleSignIn({ redirectTo = "/events" }: { redirectTo?: string }) {
  const { signIn, notify } = useApp();
  const router = useRouter();
  const buttonContainer = useRef<HTMLDivElement>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const handleCredential = useCallback(async (response: GoogleCredentialResponse) => {
    if (!response.credential) {
      setError("Google did not return a sign-in credential. Please try again.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const result = await apiRequest<{ token: string; user: User }>("/api/auth/google", {
        method: "POST",
        body: JSON.stringify({ credential: response.credential }),
      });
      signIn(result.token, result.user);
      notify(`Welcome, ${result.user.name.split(" ")[0]}.`);
      router.push(redirectTo);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not sign you in with Google.");
    } finally {
      setBusy(false);
    }
  }, [notify, redirectTo, router, signIn]);

  useEffect(() => {
    if (!scriptReady || !clientId || !buttonContainer.current || !window.google) return;
    buttonContainer.current.replaceChildren();
    window.google.accounts.id.initialize({ client_id: clientId, callback: handleCredential });
    window.google.accounts.id.renderButton(buttonContainer.current, {
      theme: "outline",
      size: "large",
      shape: "rectangular",
      text: "continue_with",
      width: Math.min(buttonContainer.current.clientWidth, 360),
    });
  }, [clientId, handleCredential, scriptReady]);

  return (
    <div className="google-auth">
      {clientId && (
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
          onReady={() => setScriptReady(true)}
          onError={() => setError("Google sign-in could not load. Check your connection and try again.")}
        />
      )}
      <div className="auth-divider"><span>or continue with</span></div>
      {clientId
        ? <div className={busy ? "google-button google-button-busy" : "google-button"} ref={buttonContainer} />
        : <p className="google-auth-config">Google sign-in is not configured for this deployment yet.</p>}
      {error && <div className="form-error" role="alert">{error}</div>}
      {busy && <span className="google-auth-status" role="status">Signing you in…</span>}
    </div>
  );
}
