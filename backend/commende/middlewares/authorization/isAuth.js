const passport = require("passport");
require('dotenv').config();
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../../model/userModel");

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.jwtCode || 'mysecretword',
  issuer: process.env.JWT_ISSUER,
  audience: process.env.JWT_AUDIENCE
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await User.findById(payload.userId).select("-password");
      
      if (!user || user.tokenVersion !== payload.tokenVersion) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

const authenticateJWT = () => (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        success: false,
        message: "Authentification requise"
      });
    }
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = { authenticateJWT };