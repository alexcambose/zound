import React, { Component, Fragment } from 'react';
import PropTypes from 'proptypes';
import { Button, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText } from '@material-ui/core';
import CreateOrEditPartyForm from '../forms/CreateOrEditPartyForm';

class EditPartyDialog extends Component {
    static propTypes = {
        party: PropTypes.object.isRequired,
        onClose: PropTypes.func.isRequired,
        open: PropTypes.bool.isRequired,
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
                        Edit party
                    </DialogTitle>
                    <DialogContent>
                        <CreateOrEditPartyForm party={party}/>
                    </DialogContent>
                </Dialog>
            </Fragment>
        );
    }
}

export default EditPartyDialog;
