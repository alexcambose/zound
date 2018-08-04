import React, {Component} from 'react';
import Proptypes from 'proptypes';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

class Welcome extends Component {
    render = () => {
        return (
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
            >
                <Button variant="contained" size="large" color="primary" className="fullwidth">Login</Button>
                <Button variant="contained" size="large" color="primary" className="fullwidth">Register</Button>
            </Grid>
        );
    }
}

export default Welcome;
