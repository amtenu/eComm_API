export const createUserValidationSchema = {
  name: {
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
      errorMessage: "username must be between 2 and 32",
    },
    notEmpty: {
      errorMessage: "Not be empty",
    },
    isString: {
      errorMessage: "Only Strings",
    },
  },
  age: {
    isLength: {
      options: {
        min: 1,
        max: 3,
      },
      errorMessage: "Age must be between 1 and 100",
    },
    notEmpty: {
      errorMessage: "Not be empty",
    },
    isNumeric: {
      errorMessage: "Only Numbers",
    },
  },
};
