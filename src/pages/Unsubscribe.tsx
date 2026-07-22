import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import logoImg from "@/assets/logo-lipovitta.png";

type State = "loading" | "ready" | "already" | "invalid" | "success" | "error";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<State>("loading");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!token) {
      setState("invalid");
      return;
    }
    (async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: SUPABASE_ANON } }
        );
        const body = await res.json().catch(() => ({}));
        if (!res.ok) {
          setState("invalid");
          return;
        }
        if (body.valid === false && body.reason === "already_unsubscribed") {
          setState("already");
          return;
        }
        setState("ready");
      } catch {
        setState("invalid");
      }
    })();
  }, [token]);

  const confirm = async () => {
    if (!token || busy) return;
    setBusy(true);
    const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", {
      body: { token },
    });
    setBusy(false);
    if (error) {
      setState("error");
      return;
    }
    if ((data as any)?.success) setState("success");
    else if ((data as any)?.reason === "already_unsubscribed") setState("already");
    else setState("error");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-14">
      <img src={logoImg} alt="LipoVitta" className="h-10 mb-8" />
      <div className="bg-white border border-border rounded-2xl p-8 md:p-10 max-w-md w-full text-center shadow-sm">
        {state === "loading" && <p className="text-sm text-muted-foreground">Validando…</p>}

        {state === "invalid" && (
          <>
            <h1 className="font-serif text-2xl text-[#4667B4] mb-2">Link inválido</h1>
            <p className="text-sm text-muted-foreground">Este link de cancelamento não é válido ou expirou.</p>
          </>
        )}

        {state === "already" && (
          <>
            <h1 className="font-serif text-2xl text-[#4667B4] mb-2">Já cancelado</h1>
            <p className="text-sm text-muted-foreground">Você já foi removida da nossa lista.</p>
          </>
        )}

        {state === "ready" && (
          <>
            <h1 className="font-serif text-2xl text-[#4667B4] mb-3">Confirmar cancelamento</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Confirme abaixo para não receber mais nossos emails.
            </p>
            <button
              onClick={confirm}
              disabled={busy}
              className="font-semibold text-white text-sm px-6 py-3 rounded-full transition-colors disabled:opacity-60"
              style={{ backgroundColor: "#4667B4" }}
            >
              {busy ? "Processando…" : "Confirmar cancelamento"}
            </button>
          </>
        )}

        {state === "success" && (
          <>
            <h1 className="font-serif text-2xl text-[#4667B4] mb-2">Pronto</h1>
            <p className="text-sm text-muted-foreground">
              Você não receberá mais nossos emails.
            </p>
          </>
        )}

        {state === "error" && (
          <>
            <h1 className="font-serif text-2xl text-[#4667B4] mb-2">Algo deu errado</h1>
            <p className="text-sm text-muted-foreground">Tente novamente em instantes.</p>
          </>
        )}

        <div className="mt-8">
          <Link to="/" className="text-xs text-[#4667B4] hover:underline">Voltar ao site</Link>
        </div>
      </div>
    </div>
  );
};

export default Unsubscribe;
