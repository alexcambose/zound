import React, { Component } from 'react';
import PropTypes from 'proptypes';
import { withTracker } from 'meteor/react-meteor-data';
import Parties from '../../../../db/parties/collection';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import { Icon, InputAdornment, TextField, Button } from '@material-ui/core';

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
        Meteor.call('parties.toggleJoin', this.state.password, this.props.party._id, (err, res) => {
            if(err) this.setState({ error: err.reason});
            else this.props.history.push('/');
        });
    };
    render = () => {
        const { party } = this.props;
        const { password } = this.state;
        if(Object.keys(party) === 0) return <Redirect to="/"/>;
        return (
            <form onSubmit={this.handleSubmit}>
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
                <Button variant="raised" color="primary" type="primary">Join</Button>
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
