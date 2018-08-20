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
import Settings from './Settings';

const styles = () => ({
    container: {
        marginTop: 6,
        marginBottom: 57,
    }
});

class Party extends Component {
    constructor(props) {
        super(props);
        if(!this.props.match.params.page) props.history.replace('/party/'+props.match.params.id+'/music');
    }

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
            return <People party={party}/>;
        } else if(page === 'info') {
            return <Info party={party}/>;
        } else if(page === 'settings') {
            return <Settings party={party}/>;
        }
    };

    render = () => {
        const { party, classes } = this.props;
        if(party === null) return null;
        if(!party.joined_users.find(e => e.user_id === Meteor.userId())) return <Redirect to="/"/>;
        return (
            <div className={classes.container}>
                {this.renderPage()}
                <PartyBottomNavigation party={party}/>
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
