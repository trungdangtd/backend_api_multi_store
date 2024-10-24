const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const authRouter = express.Router();

authRouter.post('/api/signup', async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            res.status(400).json({ msg: "Email đã tồn tại" });
        } else {
            //mã hoá mật khẩu
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            var user = new User({ fullname, email, password: hashedPassword });
            user = await user.save();
            res.json({ user });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = authRouter;