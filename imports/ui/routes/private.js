import Home from '../pages/private/home/Home';
import JoinParty from '../pages/private/joinParty/JoinParty';
import CreateParty from '../pages/private/createParty/CreateParty';
import Party from '../pages/private/party/Party';
import Profile from '../pages/private/profile/Profile';
import About from '../pages/private/about/About';
import Settings from '../pages/private/settings/Settings';
import JoinedParties from '../pages/private/joinedParties/JoinedParties';

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
    },
    {
        path: '/join-party/:id',
        component: JoinParty,
        exact: true,
    },
    {
        path: '/party/:id/:page?',
        component: Party,
    },
    {
        path: '/profile/:user_id',
        component: Profile,
    },
    {
        path: '/joined-parties',
        component: JoinedParties,
    },
    {
        path: '/settings',
        component: Settings,
    },
    {
        path: '/about',
        component: About,
    },
];