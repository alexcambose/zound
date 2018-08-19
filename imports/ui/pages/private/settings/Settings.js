import React, { Component, Fragment } from 'react';
import { Icon, List, ListItem, ListItemIcon, Dialog, DialogContent, DialogTitle, DialogContentText, DialogActions, ListItemText, ListItemSecondaryAction, Switch, ListSubheader, Slide, Button } from '@material-ui/core';
import AccountSettingsDialog from '../../../components/AccountSettingsDialog';

class Settings extends Component {
    state = {
        darkTheme: !!Meteor.user().profile.settings.darkTheme,
        accountDialog: false,
        publicEmail: !!Meteor.user().profile.settings.publicEmail,
        deleteAccountDialog: false,
    };
    handleDialog = deleteAccountDialog => () => this.setState({ deleteAccountDialog });
    handleToggle = value => () => this.setState({[value]: !this.state[value]}, () => {
        Meteor.call('user.updateSettings', this.state, (err, res) => {
            if(err) alert('error');

        });
    });

    handleDeleteAccount = () => {
        Meteor.call('user.removeAccount', (err, res) => {
            if(err) alert('error');

        });
    };
    render = () => {
        const { darkTheme, accountDialog, publicEmail, deleteAccountDialog } = this.state;
        return (
            <Fragment>
                <List subheader={<ListSubheader>Appearance</ListSubheader>}>
                    <ListItem
                        button
                        onClick={this.handleToggle('darkTheme')}
                    >
                        <ListItemIcon>
                            <Icon>invert_colors</Icon>
                        </ListItemIcon>
                        <ListItemText primary="Dark Theme" secondary={"Reduces eye strain in dark places"}/>
                        <ListItemSecondaryAction>
                            <Switch
                                onChange={this.handleToggle('darkTheme')}
                                checked={darkTheme}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                </List>
                <List subheader={<ListSubheader>Account</ListSubheader>}>
                    <ListItem
                        button
                        onClick={this.handleToggle('publicEmail')}
                    >
                        <ListItemIcon>
                            <Icon>email</Icon>
                        </ListItemIcon>
                        <ListItemText primary="Public email" secondary={"Displays your email in profile"}/>
                        <ListItemSecondaryAction>
                            <Switch
                                onChange={this.handleToggle('publicEmail')}
                                checked={publicEmail}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem
                        button
                        onClick={this.handleToggle('accountDialog')}
                    >
                        <ListItemIcon>
                            <Icon>account_circle</Icon>
                        </ListItemIcon>
                        <ListItemText primary="Account settings" secondary={"Change your name, email or password"}/>
                    </ListItem>
                    <ListItem
                        button
                        onClick={this.handleDialog(true)}
                    >
                        <ListItemIcon>
                            <Icon>delete_forever</Icon>
                        </ListItemIcon>
                        <ListItemText primary="Delete account" secondary={"Delete your account forever"}/>
                    </ListItem>
                </List>
                {accountDialog && <AccountSettingsDialog onClose={this.handleToggle('accountDialog')}/>}
                <Dialog
                    open={deleteAccountDialog}
                    keepMounted
                    onClose={this.handleDialog(false)}
                >
                    <DialogTitle >
                        Warning
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText >
                            Are you sure you want to delete your account ?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleDialog(false)} color="primary">
                            No
                        </Button>
                        <Button onClick={this.handleDeleteAccount} color="secondary">
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        );
    }
}

export default Settings;
