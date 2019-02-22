import { Strategy, StrategyOptions, ExtractJwt } from 'passport-jwt';
import { secretOrKey } from './config';
import { UserService } from '../services/UserService';

const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secretOrKey
};

export const auth: Function = (passport) => {
    const service: UserService = new UserService();

    passport.use(
        new Strategy(opts, (payload, done) => {
            const user = service.findById(payload.id)
            if (user.id) {
                return done(null, user);
            }
            return done(null, false);
        })
    )
};
