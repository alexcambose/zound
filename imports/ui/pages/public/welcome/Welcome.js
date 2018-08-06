import React, { Component, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

class Welcome extends Component {
    render = () => {
        return (
            <Fragment>
                <Button variant="contained" size="large" color="primary" className="fullwidth" component={Link} to="/login">Login</Button>
                <Button variant="contained" size="large" color="primary" className="fullwidth" component={Link} to="/register">Register</Button>
            </Fragment>
        );
    }
}

export default Welcome;
