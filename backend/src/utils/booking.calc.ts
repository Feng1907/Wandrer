// Pure functions — không phụ thuộc DB/Prisma, dễ unit test

export interface PricingInput {
  adults: number;
  children: number;
  infants: number;
  adultPrice: number;
  childPrice: number;
  infantPrice: number;
  singleSupplement: boolean;
  singleSupplementPrice: number;
}

export interface DiscountInput {
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  minOrderValue: number;
  usageLimit: number | null;
  usedCount: number;
  expiresAt: Date | null;
}

export interface PricingResult {
  subtotal: number;
  discountAmount: number;
  totalPrice: number;
}

export interface RefundResult {
  refundPercent: number;
  refundAmount: number;
  daysUntilDeparture: number;
}

// ── Tính subtotal theo từng loại hành khách ───────────────────────────────────
export const calcSubtotal = (input: PricingInput): number => {
  const { adults, children, infants, adultPrice, childPrice, infantPrice, singleSupplement, singleSupplementPrice } = input;
  return (
    adults * adultPrice +
    children * childPrice +
    infants * infantPrice +
    (singleSupplement ? singleSupplementPrice : 0)
  );
};

// ── Validate và tính discount amount ─────────────────────────────────────────
export type DiscountError =
  | 'EXPIRED'
  | 'USAGE_LIMIT_REACHED'
  | 'MIN_ORDER_NOT_MET';

export const calcDiscount = (
  subtotal: number,
  discount: DiscountInput,
  now: Date = new Date(),
): { discountAmount: number; error?: DiscountError } => {
  if (discount.expiresAt && discount.expiresAt < now) return { discountAmount: 0, error: 'EXPIRED' };
  if (discount.usageLimit !== null && discount.usedCount >= discount.usageLimit) {
    return { discountAmount: 0, error: 'USAGE_LIMIT_REACHED' };
  }
  if (subtotal < discount.minOrderValue) return { discountAmount: 0, error: 'MIN_ORDER_NOT_MET' };

  const raw =
    discount.type === 'PERCENTAGE'
      ? (subtotal * discount.value) / 100
      : discount.value;

  return { discountAmount: Math.min(raw, subtotal) };
};

// ── Tính tổng cuối cùng ───────────────────────────────────────────────────────
export const calcTotalPrice = (subtotal: number, discountAmount: number): number =>
  subtotal - discountAmount;

// ── Cancellation Engine: % hoàn tiền theo ngày trước khởi hành ───────────────
export const calcRefund = (departureDate: Date, totalPrice: number, now: Date = new Date()): RefundResult => {
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysUntilDeparture = Math.ceil((departureDate.getTime() - now.getTime()) / msPerDay);

  let refundPercent = 0;
  if (daysUntilDeparture >= 15) refundPercent = 100;
  else if (daysUntilDeparture >= 7) refundPercent = 50;
  // < 7 ngày: 0%

  const refundAmount = Math.round((totalPrice * refundPercent) / 100);
  return { refundPercent, refundAmount, daysUntilDeparture };
};

// ── Kiểm tra booking có hết hạn chưa ─────────────────────────────────────────
export const isBookingExpired = (expiredAt: Date | null, now: Date = new Date()): boolean => {
  if (!expiredAt) return false;
  return expiredAt < now;
};
