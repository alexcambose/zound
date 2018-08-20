import Welcome from '../pages/public/welcome/Welcome';
import Login from '../pages/public/login/Login';
import Register from '../pages/public/register/Register';

export default [
    {
        path: '/',
        component: Welcome,
        exact: true,
        noPadding: true,
    },
    {
        path: '/login',
        component: Login,
        noTopPadding: true,
    },
    {
        path: '/register',
        component: Register,
        noTopPadding: true,
    },
];