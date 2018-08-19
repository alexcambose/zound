import React, { Component, Fragment } from 'react';
import PropTypes from 'proptypes';
import { Button, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText } from '@material-ui/core';
import { withRouter } from 'react-router';

class DeletePartyDialog extends Component {
    static propTypes = {
        party: PropTypes.object.isRequired,
        onClose: PropTypes.func.isRequired,
        open: PropTypes.bool.isRequired,
    };
    handleDeleteParty = () => {
        Meteor.call('parties.remove', this.props.party._id, (err, res) => {
            if(err) alert(err);
            else {
                this.props.history.replace('/');
            }
        });
    };
    closeDialog = () => {
        this.props.onClose();
    };
    render = () => {
        const { party, open } = this.props;
        if(!party) return null;
        return (
            <Fragment>
                <Dialog
                    open={open}
                    keepMounted
                    onClose={this.closeDialog}
                >
                    <DialogTitle >
                        Warning
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText >
                            Are you sure you want to delete <strong>{party.title}</strong> ?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeDialog} color="primary">
                            No
                        </Button>
                        <Button onClick={this.handleDeleteParty} color="secondary">
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        );
    }
}

export default withRouter(DeletePartyDialog);
