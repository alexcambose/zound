import React, { Component, Fragment } from 'react';
import PropTypes from 'proptypes';
import DeletePartyButton from '../../../components/DeletePartyButton';
import LeavePartyButton from '../../../components/LeavePartyButton';

class Settings extends Component {
    static propTypes = {
        party: PropTypes.object.isRequired,
    };
    render = () => {
        const { party } = this.props;
        if(Meteor.userId() !== party.user_id)
            return (
                <Fragment>
                    <LeavePartyButton party={party}/>
                </Fragment>
            );
        return (
            <div>
                <DeletePartyButton party={party}/>
            </div>
        );
    }
}

export default Settings;
