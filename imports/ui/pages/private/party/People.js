import React, { Component } from 'react';
import PropTypes from 'proptypes';
import JoinedUser from '../../../components/JoinedUser';

class People extends Component {
    state = {};
    static propTypes = {
        joined_users: PropTypes.array.isRequired,
    };
    static defaultProps = {};
    render = () => {
        return this.props.joined_users.map(({ user_id, date}) => <JoinedUser key={user_id} user_id={user_id} date={date}/>);
    }
}

export default People;
