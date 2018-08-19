import fs from 'fs';

Accounts.onCreateUser((options, user) => {
    const { profile: { firstName, lastName } } = options;
    user.profile = {};
    user.profile.firstName = firstName;
    user.profile.lastName = lastName;
    user.profile.image = 'default-user-image.png';
    user.profile.settings = {};
    user.profile.settings.darkTheme = false;
    user.profile.settings.publicEmail = true;
    return user;
});