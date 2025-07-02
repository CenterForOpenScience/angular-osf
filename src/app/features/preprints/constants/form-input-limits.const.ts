export const formInputLimits = {
  abstract: {
    minLength: 20,
    maxLength: 3000,
  },
  title: {
    maxLength: 100,
  },
  doi: {
    pattern: /^10\.\d{4}\/[\s\S]{2,500}$/,
  },
  citation: {
    maxLength: 500,
  },
};
