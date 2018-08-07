import Home from '../pages/private/home/Home';
import JoinParty from '../pages/private/joinParty/JoinParty';
import CreateParty from '../pages/private/createParty/CreateParty';

export default [
    {
        path: '/',
        component: Home,
        exact: true,
    },
    {
        path: '/create-party',
        component: CreateParty,
        exact: true,
        inContainer: true,
    },
    {
        path: '/join-party/:id',
        component: JoinParty,
        exact: true,
    }
];