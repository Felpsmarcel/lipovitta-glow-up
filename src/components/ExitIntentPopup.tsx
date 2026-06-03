import { useState, useEffect } from "react";
import { X } from "lucide-react";

const ExitIntentPopup = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 768) return;
    if (localStorage.getItem("exitPopupShown")) return;

    const handler = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setShow(true);
        localStorage.setItem("exitPopupShown", "1");
        document.documentElement.removeEventListener("mouseleave", handler);
      }
    };

    document.documentElement.addEventListener("mouseleave", handler);
    return () => document.documentElement.removeEventListener("mouseleave", handler);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ backgroundColor: "rgba(70, 103, 180, 0.8)" }}>
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative shadow-2xl animate-scale-in">
        <button
          onClick={() => setShow(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Fechar"
        >
          <X size={24} />
        </button>

        <h3 className="text-xl md:text-2xl font-bold mb-2" style={{ color: "#4667B4", fontFamily: "'Playfair Display', serif" }}>
          Antes de sair, leve um guia gratuito 🎁
        </h3>
        <p className="text-sm mb-6" style={{ color: "#555" }}>
          Baixe grátis o Guia: <strong>5 Hábitos para Aliviar o Lipedema</strong>
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setShow(false);
          }}
          className="flex flex-col gap-3"
        >
          <input
            type="email"
            required
            placeholder="Seu melhor e-mail"
            className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2"
            style={{ borderColor: "#E8ECF1", outlineColor: "#4667B4" }}
          />
          <button
            type="submit"
            className="w-full py-3 rounded-xl text-white font-bold transition-colors hover:opacity-90"
            style={{ backgroundColor: "#9BAE52" }}
          >
            BAIXAR O GUIA
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExitIntentPopup;
