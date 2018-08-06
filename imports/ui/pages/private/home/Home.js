import React, { Component } from 'react';
import Logout from '../../../components/Logout';

class Home extends Component {
    state = {};
    render = () => {
        return (
            <div>Saluuuut, {Meteor.user().profile.firstName} | <Logout>Logout</Logout></div>
        );
    }
}

export default Home;
