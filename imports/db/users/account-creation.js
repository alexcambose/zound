import fs from 'fs';


Accounts.onCreateUser((options, user) => {
    const { profile: { firstName, lastName } } = options;
    user.profile = {};
    user.profile.firstName = firstName;
    user.profile.lastName = lastName;
    user.profile.image = 'default-user-image.png';
    user.asd = 'asd'; // very important asd, kidding
    return user;
});