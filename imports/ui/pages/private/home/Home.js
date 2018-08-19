import React, { Component } from 'react';
import PropTypes from 'proptypes';
import { withTracker } from 'meteor/react-meteor-data';
import Parties from '../../../../db/parties/collection';
import PartyCard from '../../../components/PartyCard';
import TextPaper from '../../../components/TextPaper';

class Home extends Component {
    state = {};
    static propTypes = {
        parties: PropTypes.array.isRequired,
    };
    render = () => {
        const { parties } = this.props;
        if(parties.length === 0) {
            return <TextPaper>No parties</TextPaper>
        }
        return parties.map(e =>
            <PartyCard key={e._id} party={e}/>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('parties');
    return {
        parties: Parties.find({}).fetch(),
    }
})(Home);
