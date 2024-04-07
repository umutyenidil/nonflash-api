import jwtUtil from "../utils/jwt.util.js";

export default (req, res, next) => {
    try {
        const authorizationHeader = req.headers.Authorization || req.headers.authorization;

        if (!(authorizationHeader && authorizationHeader.startsWith('Bearer') && authorizationHeader.split(" ").length === 2)) {
            return res.status(401).json({
                message: 'need Authorization header',
                errors: {
                    auth: 'unauthorized access',
                },
            });
        }

        const accessToken = authorizationHeader.split(" ")[1];

        const decodedAccessToken = jwtUtil.verifyAccessToken(accessToken);

        if (!decodedAccessToken) {
            return res.status(401).json({
                errors: {
                    default: "unauthorized",
                },
            });
        }

        req.user = decodedAccessToken.user;

        next();
    } catch (err) {
        return res.status(401).json({
            errors: {
                auth: 'unauthorized access',
            },
        });
    }
};