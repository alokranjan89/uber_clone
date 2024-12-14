const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');

module.exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    const { fullname, email, password } = req.body;

    try {
        // Use the correct static method `hashPassword`
        const hashedPassword = await userModel.hashPassword(password);

        // Ensure `fullname` is an object with `firstname` and `lastname` properties
        const user = await userService.createUser({
            firstname: fullname.firstname,
            lastname: fullname.lastname, // Fixed the typo here
            email,
            password: hashedPassword,
        });

        // Generate authentication token
        const token = user.generateAuthToken();

        // Send the response
        res.status(201).json({ token, user });
    } catch (err) {
        next(err);
    }
};
