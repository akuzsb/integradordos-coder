import passport from "passport"
import {Strategy} from "passport-jwt"
import UsersDAO from "../daos/users.dao.js";

passport.use('jwt', new Strategy({
	jwtFromRequest: (req) => {
		let token = null;
		if (req && req.signedCookies) {
			token = req.signedCookies.jwt;
		}
		return token;
	},
	secretOrKey: process.env.SECRET_JWT
}, async (payload, done) => {
	let user = await UsersDAO.getUserByID(payload.id);
	if (user) {
		return done(null, user);
	} else {
		return done(null, false);
	}

}));

export default passport;