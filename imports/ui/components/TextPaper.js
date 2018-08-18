import React, { Component } from 'react';
import PropTypes from 'proptypes';
import { Paper, Typography, withStyles } from '@material-ui/core';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';

const styles = theme => ({
    paper: {
        padding: 30,
        marginBottom: 5,
        marginTop: 5,
        [theme.breakpoints.down('md')]: {
            padding: 10,
        },
    }
});

class TextPaper extends Component {
    state = {};
    static propTypes = {
        classes: PropTypes.object.isRequired,
        width: PropTypes.string.isRequired,
    };
    static defaultProps = {};
    render = () => {
        const { width, children, classes } = this.props;
        return (
            <Paper className={classes.paper}>
                <Typography variant={isWidthDown('sm', width) ? 'title' : 'display1'} align='center'>
                    {children}
                </Typography>
            </Paper>
        );
    }
}

export default withStyles(styles)(withWidth()(TextPaper));
