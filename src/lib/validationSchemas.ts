export const validateName = (name: string) =>
  name.trim() ? "" : "This field is required";

export const validateEmail = (email: string) => {
  if (!email.trim()) return "Email is required";
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
    ? ""
    : "Invalid email address";
};

export const validatePhone = (phone: string) => {
  if (!phone.trim()) return "Phone number is required";
  return /^\d{10,}$/.test(phone)
    ? ""
    : "Invalid phone number. It should contain at least 10 digits, no spaces or dashes.";
};
