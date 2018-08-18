import React, { Component, Fragment } from 'react';
import PropTypes from 'proptypes';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from "meteor/meteor";
import Parties from '../../../../db/parties/collection';
import PartyCard from '../../../components/PartyCard';

class JoinedParties extends Component {
    state = {};
    static propTypes = {
        parties: PropTypes.array
    };
    static defaultProps = {
        parties: [],
    };
    render = () => {
        const { parties } = this.props;
        console.log(parties);
        return (
            <Fragment>
                {parties.map(e => <PartyCard key={e._id} party={e} noVote/>)}
            </Fragment>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('parties');
    return {
        parties: Parties.find({}).fetch().filter(e => {
            for(let joinedUser of e.joined_users)
                if(joinedUser.user_id === Meteor.userId()) return true;
            return false;
        }),
    }
})(JoinedParties);
