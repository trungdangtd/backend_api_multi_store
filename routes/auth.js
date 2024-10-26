const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const authRouter = express.Router();
const jwt = require('jsonwebtoken');

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

//signin API endpoint

authRouter.post('/api/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const findUser = await User.findOne({ email });
        if (!findUser) {
            res.status(400).json({ msg: "Email không tồn tại" })
        } else {
            //kiểm tra xem mật khẩu nhập vào có đúng vs mật khẩu đã mã hoá trong db không
            const isMatch = await bcrypt.compare(password, findUser.password);
            if (!isMatch) {
                res.status(400).json({ msg: "Mật khẩu không đúng" })
            } else {
                const token = jwt.sign({ id: findUser._id }, "passwordKey");

                //xoá thông tin nhạy cảm(mật khẩu)
                const { password, ...userWithoutPassword } = findUser._doc;

                //send the response

                res.json({ token, ...userWithoutPassword });
            };
        };
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

module.exports = authRouter;