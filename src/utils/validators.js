export const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

export const isFieldEmpty = (field) => {
  return !field || field.trim().length === 0;
};
