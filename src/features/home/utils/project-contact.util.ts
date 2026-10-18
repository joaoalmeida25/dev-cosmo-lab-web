export const buildWhatsAppUrl = (phone: string | undefined, message: string): string | null => {
  if (!phone || !/^[1-9]\d{7,14}$/.test(phone)) return null;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};
