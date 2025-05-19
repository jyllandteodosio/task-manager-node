import passport from 'passport';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import User from '../models/userModel.js';

// Serialize user into the session
// Serialize the user's database ID (_id)
passport.serializeUser((user: any, done) => {
	done(null, user._id?.toString());
});

// Deserialize user from the session
// Find the user by ID and attach it to req.user
passport.deserializeUser(async (id: string, done) => {
	try {
		const user = await User.findById(id);
		done(null, user);
	} catch (err) {
		done(err, null);
	}
});

passport.use(
	new GoogleStrategy({
		clientID: process.env.GOOGLE_CLIENT_ID!,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		callbackURL: '/auth/google/callback',
		proxy: true,
	}, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
		try {
			let currentUser = await User.findOne({ googleId: profile.id });

			if (currentUser) {
				console.log('user is: ', currentUser.username || currentUser.email);
				const googleEmail = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
				// if (currentUser.username !== profile.displayName || currentUser.email !== googleEmail) {
				// 	currentUser.username = profile.displayName;
				// 	currentUser.email = googleEmail;
				// 	await currentUser.save();
				// 	console.log('Updated existing user: ', currentUser.username || currentUser.email);
				// }

				if (currentUser.googleId) {
					if (currentUser.username !== profile.displayName) {
						currentUser.username = profile.displayName;
					}
					if (currentUser.email !== googleEmail) {
						currentUser.email = googleEmail;
					}
					if (profile.name?.givenName && currentUser.firstName !== profile.name.givenName) {
						currentUser.firstName = profile.name.givenName;
					}
					if (profile.name?.familyName && currentUser.lastName !== profile.name.familyName) {
						currentUser.lastName = profile.name.familyName;
					}

					if (currentUser.isModified()) {
						await currentUser.save();
						console.log('Updated existing Google user data:', currentUser.username || currentUser.email);
					}
				}

				done(null, currentUser);
			} else {
				const googleEmail = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
				const newUser = new User({
					googleId: profile.id,
					username: profile.displayName,
					email: googleEmail,
					firstName: profile.name?.givenName,
					lastName: profile.name?.familyName,
				});
				await newUser.save();
				console.log('created new user: ', newUser.username || newUser.email);
				done(null, newUser);
			}
		} catch (err: any) {
			console.error('Error in Google OAuth callback:', err);
			done(err);
		}
	})
);
