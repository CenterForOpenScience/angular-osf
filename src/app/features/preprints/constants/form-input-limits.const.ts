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
  withdrawalJustification: {
    minLength: 25,
  },
  decisionComment: {
    maxLength: 100,
  },
  requestDecisionJustification: {
    minLength: 20,
  },
};
