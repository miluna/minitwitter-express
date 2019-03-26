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
            service.findById(payload.id)
            .then(user => {
                if (user.id) {
                    return done(null, user);
                }
                return done(null, false);
            })
            .catch(err => {
                return done(null, false);
            })
        })
    )
};
