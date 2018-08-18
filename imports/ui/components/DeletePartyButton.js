import React, { Component, Fragment } from 'react';
import PropTypes from 'proptypes';
import { Button, Icon, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, Slide } from '@material-ui/core';

class DeletePartyButton extends Component {
    state = {
        open: true,
    };
    static propTypes = {
        party: PropTypes.object.isRequired,
    };
    handleDeleteParty = () => {
        Meteor.call('parties.remove', this.props.party._id, (err, res) => {
            if(err) alert(err);
            else {
                this.handleDialog(false);
            }
        });
    };
    handleDialog = open => () => this.setState({ open });
    render = () => {
        const { party } = this.props;
        if(!party) return null;
        return (
            <Fragment>
                <Button size="small" onClick={this.handleDialog(true)} variant='raised' color="secondary" fullWidth><Icon>delete</Icon> Delete party</Button>
                <Dialog
                    open={this.state.open}
                    TransitionComponent={props => <Slide direction="up" {...props} />}
                    keepMounted
                    onClose={this.handleDialog(false)}
                >
                    <DialogTitle id="alert-dialog-slide-title">
                        Warning
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            Are you sure you want to delete <strong>{party.title}</strong> ?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleDialog(false)} color="primary">
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

export default DeletePartyButton;
