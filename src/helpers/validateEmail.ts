import { EMAIL_REGEX } from "../config/constants";

export const validateEmail = (value: string) => {
  if (typeof value === 'undefined' || value.length === 0) {
    return '';
  }

  if (!EMAIL_REGEX.test(value)) {
    return '';
  } else {
    return value;
  }
};