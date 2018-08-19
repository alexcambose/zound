import React, { Component, Fragment } from 'react';
import PropTypes from 'proptypes';
import DeletePartyDialog from '../../../components/DeletePartyDialog';
import EditPartyDialog from '../../../components/EditPartyDialog';
import LeavePartyButton from '../../../components/LeavePartyButton';
import { Icon, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, ListSubheader, Switch } from '@material-ui/core';

class Settings extends Component {
    state = {
        deletePartyDialog: false,
        editPartyDialog: false,
    };
    static propTypes = {
        party: PropTypes.object.isRequired,
    };
    render = () => {
        const { party } = this.props;
        const { deletePartyDialog, editPartyDialog } = this.state;

        if(Meteor.userId() !== party.user_id)
            return (
                <Fragment>
                    <LeavePartyButton party={party}/>
                </Fragment>
            );
        return (
            <div>
                <DeletePartyDialog party={party} open={deletePartyDialog} onClose={() => this.setState({ deletePartyDialog: false })}/>
                <EditPartyDialog party={party} open={editPartyDialog} onClose={() => this.setState({ editPartyDialog: false })}/>
                <Fragment>
                    <List>
                        <ListItem
                            button
                            onClick={() => this.setState({ editPartyDialog: true })}
                        >
                            <ListItemIcon>
                                <Icon>edit</Icon>
                            </ListItemIcon>
                            <ListItemText primary="Edit party"/>
                        </ListItem>
                        <ListItem
                            button
                            onClick={() => this.setState({ deletePartyDialog: true })}
                        >
                            <ListItemIcon>
                                <Icon>delete_forever</Icon>
                            </ListItemIcon>
                            <ListItemText primary="Delete party"/>
                        </ListItem>
                    </List>
                </Fragment>
            </div>
        );
    }
}

export default Settings;
