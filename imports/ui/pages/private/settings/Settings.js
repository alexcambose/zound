import React, { Component, Fragment } from 'react';
import { Icon, List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, Switch, ListSubheader } from '@material-ui/core';
import AccountSettingsDialog from '../../../components/AccountSettingsDialog';

class Settings extends Component {
    state = {
        darkTheme: false,
        accountDialog: false,
        publicEmail: Meteor.user().profile.publicEmail,
    };
    handleToggle = value => () => this.setState({[value]: !this.state[value]});
    handleDeleteAccount = () => {

    };
    render = () => {
        const { darkTheme, accountDialog, publicEmail } = this.state;
        return (
            <Fragment>
                {accountDialog && <AccountSettingsDialog onClose={this.handleToggle('accountDialog')}/>}
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
                        onClick={this.handleDeleteAccount}
                    >
                        <ListItemIcon>
                            <Icon>delete_forever</Icon>
                        </ListItemIcon>
                        <ListItemText primary="Delete account" secondary={"Delete your account forever"}/>
                    </ListItem>
                </List>
            </Fragment>
        );
    }
}

export default Settings;
