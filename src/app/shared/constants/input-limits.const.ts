export const InputLimits = {
  name: {
    minLength: 2,
    maxLength: 50,
  },
  fullName: {
    minLength: 2,
    maxLength: 100,
  },
  email: {
    minLength: 3,
    maxLength: 254,
  },
  username: {
    minLength: 3,
    maxLength: 30,
  },
  password: {
    minLength: 8,
    maxLength: 128,
  },
  requestAccessComment: {
    maxLength: 250,
  },
  link: {
    maxLength: 200,
  },
  description: {
    maxLength: 250,
  },
  code: {
    maxLength: 6,
  },
};
