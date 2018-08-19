import React, { Component, Fragment } from 'react';
import PropTypes from 'proptypes';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from "meteor/meteor";
import Parties from '../../../../db/parties/collection';
import PartyCard from '../../../components/PartyCard';
import TextPaper from '../../../components/TextPaper';

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
        if(parties.length === 0)
            return <TextPaper>No joined parties</TextPaper>;
        return parties.map(e => <PartyCard key={e._id} party={e} noVote/>);
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
