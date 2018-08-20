import React, { Component, Fragment } from 'react';
import PropTypes from 'proptypes';
import { Button, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText } from '@material-ui/core';

class LeavePartyDialog extends Component {
    static propTypes = {
        party: PropTypes.object.isRequired,
        onClose: PropTypes.func.isRequired,
        open: PropTypes.bool.isRequired,
    };
    handleLeaveParty = () => {
        Meteor.call('parties.toggleJoin', this.props.party._id, (err, res) => {
            if(err) alert(err);
            else {
                this.handleCloseDialog();
            }
        });
    };
    handleCloseDialog = () => this.props.onClose();
    render = () => {
        const { party, open } = this.props;
        if(!party) return null;
        return (
            <Fragment>
                <Dialog
                    open={open}
                    keepMounted
                    onClose={this.handleCloseDialog}
                >
                    <DialogTitle id="alert-dialog-slide-title">
                        Warning
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            Are you sure you want to leave <strong>{party.title}</strong> ?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseDialog} color="primary">
                            No
                        </Button>
                        <Button onClick={this.handleLeaveParty} color="secondary">
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        );
    }
}

export default LeavePartyDialog;
