export const createUserValidationSchema={
    name:{
        isLength:{
            options:{
                min:5,
                max:32
            },
            errorMessage:"username must be between 2 and 32"
        },
        notEmpty:{
            errorMessage:"Not be empty"
        },
        isString:{
            errorMessage:"Only Strings"
        }
    }
}