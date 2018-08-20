import React, { Component } from 'react';
import PropTypes from 'proptypes';
import RegisterForm from '../../../forms/RegisterForm';
import { Link } from 'react-router-dom';
import { withStyles, Typography } from '@material-ui/core';
import styles from '../styles';

class Register extends Component {
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
                <RegisterForm/>
                <Typography variant="caption" align="center">
                    <p>Already have an account? <Link to="/login" className={classes.link}>Login!</Link></p>
                </Typography>
            </div>
        );
    }
}

export default withStyles(styles)(Register);
