import { Link } from "react-router-dom";

export const STATES = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];
export const NOTIFY_EMAIL = "lipovitta@clarinhacbr.com.br";

export const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className="block text-xs uppercase tracking-[1.5px] font-semibold text-[#4667B4] mb-2">
      {label}
    </label>
    {children}
    {error && <p className="text-xs text-red-600 mt-1.5">{error}</p>}
  </div>
);

export const inputCls = (err?: string) =>
  `w-full rounded-lg border px-4 py-3 text-sm bg-white outline-none transition-colors ${
    err
      ? "border-red-400 focus:border-red-500"
      : "border-border focus:border-[#4667B4]"
  }`;

export const SuccessCard = ({
  title,
  message,
  whatsappHref,
  whatsappLabel,
}: {
  title: string;
  message: string;
  whatsappHref?: string;
  whatsappLabel?: string;
}) => (
  <div className="bg-white border border-[#9BAE52]/40 rounded-2xl p-8 md:p-10 text-center shadow-sm">
    <div className="w-14 h-14 rounded-full bg-[#9BAE52]/15 flex items-center justify-center mx-auto mb-4">
      <svg className="w-7 h-7 text-[#9BAE52]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <h2 className="font-serif text-2xl text-[#4667B4] mb-2">{title}</h2>
    <p className="text-muted-foreground text-sm mb-6">{message}</p>
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
      {whatsappHref && (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-full text-white transition-colors"
          style={{ backgroundColor: "#25D366" }}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.521.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.521.074-.797.372-.275.299-1.051 1.026-1.051 2.504 0 1.478 1.077 2.904 1.227 3.105.149.198 2.12 3.235 5.138 4.535.719.31 1.28.496 1.718.634.722.229 1.379.197 1.898.126.58-.084 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.052 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          {whatsappLabel || "Enviar dados pelo WhatsApp"}
        </a>
      )}
      <Link
        to="/"
        className="inline-flex font-semibold text-sm px-5 py-2.5 rounded-full text-white transition-colors"
        style={{ backgroundColor: "#4667B4" }}
      >
        Voltar ao site
      </Link>
    </div>
  </div>
);
