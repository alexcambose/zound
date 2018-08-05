import Welcome from '../pages/public/welcome/Welcome';
import Login from '../pages/public/login/Login';
import Register from '../pages/public/register/Register';

export default [
    {
        path: '/',
        component: Welcome,
        exact: true,
    },
    {
        path: '/login',
        component: Login,
    },
    {
        path: '/register',
        component: Register,
    },
];