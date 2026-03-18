let jwt = require('jsonwebtoken');
let fs = require('fs');

const publicKey = fs.readFileSync("public.pem");

module.exports = {
    CheckLogin: function (req, res, next) {
        try {
            let authHeader = req.headers.authorization;

            console.log("HEADER:", authHeader); // 👈 debug

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({
                    message: "Bạn chưa đăng nhập"
                });
            }

            let token = authHeader.split(" ")[1];

            console.log("TOKEN:", token); // 👈 debug

            let result = jwt.verify(token, publicKey, {
                algorithms: ["RS256"]
            });

            console.log("DECODE:", result); // 👈 debug

            req.user = result;

            next();

        } catch (error) {
            console.log("ERROR:", error.message); // 👈 debug

            return res.status(401).json({
                message: "Token không hợp lệ"
            });
        }
    }
};