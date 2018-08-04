import Welcome from '../pages/welcome/welcome';
import Login from '../pages/login/Login';
import Register from '../pages/register/Register';

export default [
    {
        path: '/',
        component: Welcome,
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