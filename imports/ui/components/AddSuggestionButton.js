import React, { Component, Fragment } from 'react';
import PropTypes from 'proptypes';
import { Button, Dialog, AppBar, Typography, Divider, IconButton, List, ListItem,TextField, ListItemText, Icon, Slide, Toolbar, withStyles } from '../../../node_modules/@material-ui/core/';
import { Track } from '../utils';

const styles = theme => ({
    appBar: {
        position: 'relative',
    },

});

class AddSuggestionButton extends Component {
    state = {
        open: false,
        search: '',
    };
    static propTypes = {
        classes: PropTypes.object.isRequired,
    };
    handleDialog = open => () => this.setState({ open });
    handleSearchChange = async e => {
        const { value } = e.target;
        this.setState({search: value});
        console.log(await Track.search(value));
    };
    render = () => {
        const { open, search } = this.state;
        const { classes } = this.props;
        return (
            <Fragment>
                <Button onClick={this.handleDialog(true)} variant="raised" color="primary" fullWidth>Add suggestion</Button>
                <Dialog
                    fullScreen
                    open={open}
                    onClose={this.handleDialog(false)}
                >
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton color="inherit" onClick={this.handleDialog(false)} aria-label="Close">
                                <Icon>close</Icon>
                            </IconButton>
                            <Typography variant="title" color="inherit" >
                                Search a track
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <TextField
                        id="search"
                        label="Type track name..."
                        type="search"
                        fullWidth
                        margin="normal"
                        value={search}
                        onChange={this.handleSearchChange}
                    />
                    <List>
                        <ListItem button>
                            <ListItemText primary="Phone ringtone" secondary="Titania" />
                        </ListItem>
                        <Divider />
                        <ListItem button>
                            <ListItemText primary="Default notification ringtone" secondary="Tethys" />
                        </ListItem>
                    </List>
                </Dialog>
            </Fragment>
        );
    }
}

export default withStyles(styles)(AddSuggestionButton);
