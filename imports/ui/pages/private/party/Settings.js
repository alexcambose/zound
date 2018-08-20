import React, { Component, Fragment } from 'react';
import PropTypes from 'proptypes';
import DeletePartyDialog from '../../../components/DeletePartyDialog';
import EditPartyDialog from '../../../components/EditPartyDialog';
import LeavePartyDialog from '../../../components/LeavePartyDialog';
import { Icon, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, ListSubheader, Switch } from '@material-ui/core';

class Settings extends Component {
    state = {
        deletePartyDialog: false,
        editPartyDialog: false,
        leavePartyDialog: false,
    };
    static propTypes = {
        party: PropTypes.object.isRequired,
    };
    render = () => {
        const { party } = this.props;
        const { deletePartyDialog, editPartyDialog, leavePartyDialog } = this.state;

        return (
            <Fragment>
                <LeavePartyDialog party={party} open={leavePartyDialog} onClose={() => this.setState({ leavePartyDialog: false })}/>
                <DeletePartyDialog party={party} open={deletePartyDialog} onClose={() => this.setState({ deletePartyDialog: false })}/>
                <EditPartyDialog party={party} open={editPartyDialog} onClose={() => this.setState({ editPartyDialog: false })}/>
                {Meteor.userId() !== party.user_id ?
                    <List>
                        <ListItem
                            button
                            onClick={() => this.setState({ leavePartyDialog: true })}
                        >
                            <ListItemIcon>
                                <Icon>undo</Icon>
                            </ListItemIcon>
                            <ListItemText primary="Leave party"/>
                        </ListItem>
                    </List>
                    :
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
                }
            </Fragment>
        );
    }
}

export default Settings;
