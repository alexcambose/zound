import React, { Component } from 'react';
import PropTypes from 'proptypes';
import JoinedUser from '../../../components/JoinedUser';

class People extends Component {
    state = {};
    static propTypes = {
        party: PropTypes.object.isRequired,
    };
    static defaultProps = {};
    render = () => {
        const { party } = this.props;

        return party.joined_users.map(({ user_id, date}) => <JoinedUser key={user_id} user_id={user_id} date={date} partyHost={user_id === party.user_id}/>);
    }
}

export default People;
