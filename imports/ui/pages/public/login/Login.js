import React, { Component, Fragment } from 'react';
import LoginFrom from './LoginFrom';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

class Login extends Component {
    render = () => {
        return (
            <Fragment>
                <Typography variant="display2" color="textPrimary" gutterBottom>
                    Login
                </Typography>
                <LoginFrom/>
                <Typography variant="caption" align="center">
                    <p>Don't have an account? <Link to="/register">Register!</Link></p>
                </Typography>
            </Fragment>
        );
    }
}

export default Login;
