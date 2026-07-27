const AFFILIATE_PHONE = "5571996150401";

const encodeText = (text: string) =>
  encodeURIComponent(text).replace(/%20/g, " ");

export const buildWhatsAppAffiliateLink = () => {
  const text =
    `Olá! Tenho interesse em ser afiliada/parceira LipoVitta.\n\n` +
    `Nome completo:\n` +
    `WhatsApp:\n` +
    `Email:\n` +
    `Quantidade de seguidores (se for creator):\n` +
    `Estado:\n` +
    `Já conhece o LipoVitta? (sim/não):`;
  return `https://wa.me/${AFFILIATE_PHONE}?text=${encodeText(text)}`;
};

export const buildWhatsAppAffiliateDataLink = (data: {
  fullName?: string;
  phone?: string;
  email?: string;
  followersRange?: string;
  state?: string;
  knowsProduct?: boolean | string;
  companyName?: string;
  cnpj?: string;
  businessType?: string;
  city?: string;
  volumeNotes?: string | null;
  type: "afiliada" | "parceiro";
}) => {
  const typeLabel = data.type === "afiliada" ? "Afiliada" : "Parceiro comercial";
  let text = `Novo cadastro de ${typeLabel} LipoVitta\n\n`;

  if (data.fullName) text += `Nome: ${data.fullName}\n`;
  if (data.companyName) text += `Empresa: ${data.companyName}\n`;
  if (data.cnpj) text += `CNPJ: ${data.cnpj}\n`;
  if (data.businessType) text += `Tipo: ${data.businessType}\n`;
  if (data.phone) text += `WhatsApp: ${data.phone}\n`;
  if (data.email) text += `Email: ${data.email}\n`;
  if (data.followersRange) text += `Seguidores: ${data.followersRange}\n`;
  if (data.city || data.state) text += `Local: ${data.city || ""}${data.city && data.state ? " - " : ""}${data.state || ""}\n`;
  if (data.knowsProduct !== undefined)
    text += `Já conhece: ${typeof data.knowsProduct === "boolean" ? (data.knowsProduct ? "Sim" : "Não") : data.knowsProduct}\n`;
  if (data.volumeNotes) text += `Observações: ${data.volumeNotes}\n`;

  text += `\nRecebido via site lipovitta.site`;
  return `https://wa.me/${AFFILIATE_PHONE}?text=${encodeText(text)}`;
};
