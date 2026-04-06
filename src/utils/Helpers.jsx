// src/utils/helpers.js
export const formatCurrency = (value) => `$${Number(value).toFixed(2)}`;

export const calculateDiscount = (total, discount) => Math.max(total - discount, 0);

export const findProductVariant = (product, variantId) => {
  return product.variants?.find((v) => v._id === variantId) || null;
};

export const applyCoupon = (total, coupon) => {
  if (!coupon) return total;
  if (coupon.discountType === "percentage") {
    return total - (total * coupon.discountValue) / 100;
  }
  return total - coupon.discountValue;
};