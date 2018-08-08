import Home from '../pages/private/home/Home';
import JoinParty from '../pages/private/joinParty/JoinParty';
import CreateParty from '../pages/private/createParty/CreateParty';
import Party from '../pages/private/party/Party';

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
        // inContainer: true,
    },
    {
        path: '/party/:id/:page?',
        component: Party,
        // inContainer: true,
    },

];