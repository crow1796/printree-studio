export const VAT = .12

export const priceWithVatCeil = price => {
  const vat = price * VAT
  return Math.ceil(price + vat)
}

export const priceWithVat = price => {
  const vat = price * VAT
  return price + vat
}