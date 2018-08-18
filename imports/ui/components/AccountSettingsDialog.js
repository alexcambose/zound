import React, { Component } from 'react';
import PropTypes from 'proptypes';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@material-ui/core';

class AccountSettingsDialog extends Component {
    state = {
        open: true,
        firstName: Meteor.user().profile.firstName,
        lastName: Meteor.user().profile.lastName,
        email: Meteor.user().emails[0].address,
        currentPassword: '',
        newPassword: '',
    };
    static propTypes = {
        onClose: PropTypes.func.isRequired
    };
    handleClose = () => {
        this.setState({ open: false });
        setTimeout(() => {this.props.onClose();}, 100);
    };
    handleChange = name => ({ target }) => this.setState({[name]: target.value});
    render = () => {
        const { firstName, lastName, email, currentPassword, newPassword, } = this.state;
        return (
            <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Account settings</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="First Name"
                        type="text"
                        value={firstName}
                        onChange={this.handleChange('firstName')}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Last Name"
                        type="text"
                        value={lastName}
                        onChange={this.handleChange('lastName')}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={this.handleChange('email')}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Current password"
                        type="password"
                        value={email}
                        onChange={this.handleChange('email')}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.handleClose} color="primary">
                        Subscribe
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default AccountSettingsDialog;
