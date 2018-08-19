import React, { Component } from 'react';
import PropTypes from 'proptypes';
import { Avatar, withStyles, Typography } from '@material-ui/core';
import { version } from '/package.json';

const styles = {
    container: {
        marginTop: 30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    logo: {
        height: 160,
    },
    info: {
        fontWeight: 300,
        marginTop: 10,
    },
    infoBottom: {
        marginTop: 30,
        fontWeight: 300,
    }
};

class About extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
    };
    render = () => {
        const { classes } = this.props;
        return (
            <div className={classes.container}>
                <img
                    alt="Zound logo"
                    src="/logo.png"
                    className={classes.logo}
                />
                <Typography variant="title" gutterBottom className={classes.info} align='center'>
                    Developer: <a href="https://github.com/alexcambose">Alexandru Cambose</a>
                </Typography>
                <Typography variant="title" gutterBottom className={classes.info} align='center'>
                    Version: {version}
                </Typography>

                <Typography variant="title" gutterBottom className={classes.infoBottom} align='center'>
                    Want to contribute? See <a href="https://github.com/alexcambose/zound">Github repository</a>.
                </Typography>
            </div>
        );
    }
}

export default withStyles(styles)(About);
