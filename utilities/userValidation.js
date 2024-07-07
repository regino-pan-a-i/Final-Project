const {body, validationResult} = require('express-validator');
validate = {}
validate.userRules = () => {
    return [
        body('name')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('Please provide a valid first name.')
            .isLength({ min: 1 })
            .withMessage('First name must be at least 1 character long.')
            .isString(),

        body('email')
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .withMessage('A valid email is required.')
            .normalizeEmail(),

        body('password')
            .trim()
            .isStrongPassword({
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1
            })
            .withMessage('Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol.')
            .notEmpty()
            .isString()
    ];
};


validate.validate = (req, res, next) => {

    console.log('Validating user data');
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        console.log('No validation errors found');
        return next();
    }
    const extractedErrors = errors.array().map(err => ({
        [err.path]: err.msg
    }));
    console.log(errors)
    // return
    return res.status(400).json({
        errors: extractedErrors
    })
}

module.exports = validate;