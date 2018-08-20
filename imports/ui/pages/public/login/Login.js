import React, { Component } from 'react';
import PropTypes from 'proptypes';
import LoginFrom from '../../../forms/LoginFrom';
import { Typography, withStyles } from '@material-ui/core/';
import { Link } from 'react-router-dom';
import styles from '../styles';

class Login extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
    };
    componentDidMount = () => {
        document.body.classList.add(this.props.classes.bgColor);
    };
    componentWillUnmount = () => {
        document.body.classList.remove(this.props.classes.bgColor);
    };
    render = () => {
        const { classes } = this.props;
        return (
            <div className={classes.container}>
                <img
                    src="/logo.png"
                    alt="Zound logo"
                    className={classes.logo}
                />
                <LoginFrom/>
                <Typography variant="caption" align="center">
                    <p>Don't have an account? <Link to="/register" className={classes.link}>Register!</Link></p>
                </Typography>
            </div>
        );
    }
}

export default withStyles(styles)(Login);
