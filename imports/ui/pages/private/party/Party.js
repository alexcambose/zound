import React, { Component } from 'react';
import PropTypes from 'proptypes';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import { withTracker } from 'meteor/react-meteor-data';
import Parties from '../../../../db/parties/collection';
import PartyBottomNavigation from '../../../components/PartyBottomNavigation';
import Music from './Music';
import People from './People';
import Info from './Info';
import AddSuggestionButton from '../../../components/AddSuggestionButton';
const styles = theme => ({
    container: {
        marginBottom: 57,
    }
});
class Party extends Component {
    state = {};
    static propTypes = {
        party: PropTypes.object,
    };
    static defaultProps = {
        party: null,
    };
    renderPage = () => {
        const page = this.props.match.params.page;
        const { party } = this.props;
        if(page === 'music') {
            return <Music party={party}/>;
        } else if(page === 'people') {
            return <People joined_users={party.joined_users}/>;
        } else if(page === 'info') {
            return <Info party={party}/>;
        }
    };
    render = () => {
        const { party, classes } = this.props;
        // if(party === null) return <Redirect to="/"/>;
        return (
            <div className={classes.container}>
                {this.renderPage()}
                <PartyBottomNavigation/>
            </div>
        );
    }
}

export default withTracker(props => {
    Meteor.subscribe('parties');
    return {
        party: Parties.findOne({_id: props.match.params.id}),
    };
})(withRouter(withStyles(styles)(Party)));
