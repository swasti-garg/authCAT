const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { GOOGLE } = require("./env");
const userRepository = require("../repositories/userRepository");
passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE.CLIENT_ID,
            clientSecret: GOOGLE.CLIENT_SECRET,
            callbackURL: GOOGLE.CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            const email = profile.emails[0].value;
            const googleId = profile.id;
            const avatar = profile.photos[0].value;

            let user = await userRepository.findByGoogleId(googleId);

            if (!user) {
                user = await userRepository.findByEmail(email);

                if (user) {
                    user = await userRepository.linkGoogleAccount(
                        email,
                        googleId,
                        avatar
                    );
            } else {
                    user = await userRepository.createGoogleUser({
                    email,
                    googleId,
                avatar,
                });
             }
            }

        return done(null, user);

        }
    )
);


module.exports = passport;