import React, { Component, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

class Welcome extends Component {
    render = () => {
        return (
            <Fragment>
                <Link to="/login"><Button variant="contained" size="large" color="primary" className="fullwidth">Login</Button></Link>
                <Link to="/regster"><Button variant="contained" size="large" color="primary" className="fullwidth">Register</Button></Link>
            </Fragment>
        );
    }
}

export default Welcome;
