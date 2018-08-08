import React, { Component } from 'react';
import PropTypes from 'proptypes';
import { withTracker } from 'meteor/react-meteor-data';
import Parties from '../../../../db/parties/collection';
import PartyCard from '../../../components/PartyCard';

class Home extends Component {
    state = {};
    static propTypes = {
        parties: PropTypes.array.isRequired,
    };
    render = () => {
        const { parties } = this.props;
        const partiesCards = parties.map(e =>
            <PartyCard key={e._id} party={e}/>
        );
        return (
            <div>
                {partiesCards}
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('parties');
    return {
        parties: Parties.find({}).fetch(),
    }
})(Home);
