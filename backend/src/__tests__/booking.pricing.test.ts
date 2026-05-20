import { calcSubtotal, calcDiscount, calcTotalPrice } from '../utils/booking.calc';

describe('calcSubtotal — tính giá theo loại hành khách', () => {
  const base = {
    adultPrice: 5_000_000,
    childPrice: 3_750_000,   // 75% adultPrice
    infantPrice: 0,
    singleSupplementPrice: 1_500_000,
  };

  test('chỉ người lớn', () => {
    const result = calcSubtotal({ ...base, adults: 2, children: 0, infants: 0, singleSupplement: false });
    expect(result).toBe(10_000_000);
  });

  test('người lớn + trẻ em', () => {
    const result = calcSubtotal({ ...base, adults: 2, children: 1, infants: 0, singleSupplement: false });
    expect(result).toBe(13_750_000);
  });

  test('người lớn + trẻ em + em bé (em bé miễn phí)', () => {
    const result = calcSubtotal({ ...base, adults: 2, children: 1, infants: 1, singleSupplement: false });
    expect(result).toBe(13_750_000); // infantPrice = 0
  });

  test('em bé có phụ thu dịch vụ', () => {
    const result = calcSubtotal({ ...base, infantPrice: 500_000, adults: 1, children: 0, infants: 2, singleSupplement: false });
    expect(result).toBe(6_000_000); // 5M + 2×500K
  });

  test('phụ thu phòng đơn được cộng thêm', () => {
    const result = calcSubtotal({ ...base, adults: 1, children: 0, infants: 0, singleSupplement: true });
    expect(result).toBe(6_500_000); // 5M + 1.5M supplement
  });

  test('không phụ thu phòng đơn khi singleSupplement = false', () => {
    const result = calcSubtotal({ ...base, adults: 1, children: 0, infants: 0, singleSupplement: false });
    expect(result).toBe(5_000_000);
  });

  test('đoàn lớn: 4 người lớn + 2 trẻ em + 1 em bé + phụ thu phòng đơn', () => {
    const result = calcSubtotal({ ...base, adults: 4, children: 2, infants: 1, singleSupplement: true });
    // 4×5M + 2×3.75M + 1×0 + 1.5M = 20M + 7.5M + 1.5M = 29M
    expect(result).toBe(29_000_000);
  });
});

describe('calcDiscount — kiểm tra mã giảm giá', () => {
  const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const pastDate = new Date(Date.now() - 1);

  const baseDiscount = {
    minOrderValue: 0,
    usageLimit: null,
    usedCount: 0,
    expiresAt: futureDate,
  };

  test('giảm theo %: 10% của 10 triệu = 1 triệu', () => {
    const { discountAmount } = calcDiscount(10_000_000, {
      ...baseDiscount, type: 'PERCENTAGE', value: 10,
    });
    expect(discountAmount).toBe(1_000_000);
  });

  test('giảm cố định: 500K', () => {
    const { discountAmount } = calcDiscount(10_000_000, {
      ...baseDiscount, type: 'FIXED', value: 500_000,
    });
    expect(discountAmount).toBe(500_000);
  });

  test('giảm không vượt quá subtotal', () => {
    const { discountAmount } = calcDiscount(1_000_000, {
      ...baseDiscount, type: 'FIXED', value: 5_000_000,
    });
    expect(discountAmount).toBe(1_000_000);
  });

  test('lỗi EXPIRED khi mã đã hết hạn', () => {
    const { discountAmount, error } = calcDiscount(5_000_000, {
      ...baseDiscount, type: 'FIXED', value: 100_000, expiresAt: pastDate,
    });
    expect(error).toBe('EXPIRED');
    expect(discountAmount).toBe(0);
  });

  test('lỗi USAGE_LIMIT_REACHED khi đã hết lượt', () => {
    const { discountAmount, error } = calcDiscount(5_000_000, {
      ...baseDiscount, type: 'PERCENTAGE', value: 10, usageLimit: 5, usedCount: 5,
    });
    expect(error).toBe('USAGE_LIMIT_REACHED');
    expect(discountAmount).toBe(0);
  });

  test('lỗi MIN_ORDER_NOT_MET khi đơn hàng chưa đủ tối thiểu', () => {
    const { discountAmount, error } = calcDiscount(2_000_000, {
      ...baseDiscount, type: 'PERCENTAGE', value: 10, minOrderValue: 5_000_000,
    });
    expect(error).toBe('MIN_ORDER_NOT_MET');
    expect(discountAmount).toBe(0);
  });

  test('không lỗi khi mã không có hạn (expiresAt = null)', () => {
    const { discountAmount, error } = calcDiscount(5_000_000, {
      ...baseDiscount, type: 'FIXED', value: 200_000, expiresAt: null,
    });
    expect(error).toBeUndefined();
    expect(discountAmount).toBe(200_000);
  });

  test('không lỗi khi mã không giới hạn số lần (usageLimit = null)', () => {
    const { discountAmount, error } = calcDiscount(5_000_000, {
      ...baseDiscount, type: 'PERCENTAGE', value: 20, usageLimit: null, usedCount: 9999,
    });
    expect(error).toBeUndefined();
    expect(discountAmount).toBe(1_000_000);
  });
});

describe('calcTotalPrice — tính tổng cuối', () => {
  test('không có giảm giá', () => {
    expect(calcTotalPrice(10_000_000, 0)).toBe(10_000_000);
  });

  test('có giảm giá', () => {
    expect(calcTotalPrice(10_000_000, 1_000_000)).toBe(9_000_000);
  });

  test('kịch bản đầy đủ: 2 người lớn + 1 trẻ em + giảm 10%', () => {
    const subtotal = calcSubtotal({
      adults: 2, children: 1, infants: 0,
      adultPrice: 5_000_000, childPrice: 3_750_000, infantPrice: 0,
      singleSupplement: false, singleSupplementPrice: 0,
    });
    const { discountAmount } = calcDiscount(subtotal, {
      type: 'PERCENTAGE', value: 10,
      minOrderValue: 0, usageLimit: null, usedCount: 0,
      expiresAt: new Date(Date.now() + 86_400_000),
    });
    const total = calcTotalPrice(subtotal, discountAmount);
    // subtotal = 13.75M, discount = 1.375M, total = 12.375M
    expect(subtotal).toBe(13_750_000);
    expect(discountAmount).toBe(1_375_000);
    expect(total).toBe(12_375_000);
  });
});
