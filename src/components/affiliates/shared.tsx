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

export const SuccessCard = ({ title, message }: { title: string; message: string }) => (
  <div className="bg-white border border-[#9BAE52]/40 rounded-2xl p-8 md:p-10 text-center shadow-sm">
    <div className="w-14 h-14 rounded-full bg-[#9BAE52]/15 flex items-center justify-center mx-auto mb-4">
      <svg className="w-7 h-7 text-[#9BAE52]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <h2 className="font-serif text-2xl text-[#4667B4] mb-2">{title}</h2>
    <p className="text-muted-foreground text-sm mb-6">{message}</p>
    <Link
      to="/"
      className="inline-flex font-semibold text-sm px-5 py-2.5 rounded-full text-white transition-colors"
      style={{ backgroundColor: "#4667B4" }}
    >
      Voltar ao site
    </Link>
  </div>
);
