import Welcome from '../pages/public/welcome/Welcome';
import Login from '../pages/public/login/Login';
import Register from '../pages/public/register/Register';

export default [
    {
        path: '/',
        component: Welcome,
        exact: true,
        inContainer: true,
    },
    {
        path: '/login',
        component: Login,
        inContainer: true,
    },
    {
        path: '/register',
        component: Register,
        inContainer: true,
    },
];