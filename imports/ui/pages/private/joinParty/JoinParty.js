import React, { Component } from 'react';
import PropTypes from 'proptypes';
import { withTracker } from 'meteor/react-meteor-data';
import Parties from '../../../../db/parties/collection';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import { Icon, InputAdornment, TextField, Button, FormHelperText, Typography } from '@material-ui/core';

class JoinParty extends Component {
    state = {
        password: '',
    };
    static propTypes = {
        party: PropTypes.object.isRequired,
    };
    static defaultProps = {
        party: {},
    };
    handleChange = name => e => this.setState({ [name]: e.target.value });
    handleSubmit = e => {
        e.preventDefault();
        const partyId = this.props.party._id;
        Meteor.call('parties.toggleJoin', partyId , this.state.password, (err, res) => {
            if(err) this.setState({ error: err.reason});
            else this.props.history.push('/party/' + partyId);
        });
    };
    render = () => {
        const { party } = this.props;
        const { password, error } = this.state;
        if(Object.keys(party) === 0) return <Redirect to="/"/>;
        return (
            <form onSubmit={this.handleSubmit}>
                <Typography variant="display4">{party.title}</Typography>
                <TextField
                    id="password"
                    type="text"
                    fullWidth
                    label="Password"
                    value={password}
                    onChange={this.handleChange('password')}
                    margin="normal"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Icon>dialpad</Icon>
                            </InputAdornment>
                        ),
                    }}
                />
                <Button variant="raised" color="primary" type="primary" fullWidth>Join</Button>
                {error && <FormHelperText error>{error}</FormHelperText>}

            </form>
        );
    }
}

export default withTracker(props => {
    Meteor.subscribe('parties');

    return {
        party: Parties.findOne({_id: props.match.params.id}),
    };
})(withRouter(JoinParty));
