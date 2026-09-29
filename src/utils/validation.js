export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone) {
  return /^[0-9+\-\s]{10,15}$/.test(phone);
}

export function isProhibitedAnimalText(text = "") {
  return /\b(lion|tiger|leopard|cheetah|elephant|bear|rhino|rhinoceros|crocodile|alligator)\b/i.test(text);
}
