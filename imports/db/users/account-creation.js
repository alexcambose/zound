Accounts.onCreateUser((options, user) => {
    const { firstName, lastName } = options;
    user.profile = {};
    user.firstName = firstName;
    user.lastName = lastName;
    return user;
});