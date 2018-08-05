import React, { Component, Fragment } from 'react';
import RegisterForm from './RegisterForm';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

class Register extends Component {
    render = () => {
        return (
            <Fragment>
                <Typography variant="display2" color="textPrimary" gutterBottom>
                    Register
                </Typography>
                <RegisterForm/>
                <Typography variant="caption" align="center">
                    <p>Already have an account? <Link to="/login">Login!</Link></p>
                </Typography>
            </Fragment>
        );
    }
}

export default Register;
