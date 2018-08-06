import React, { Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Drawer from '../../components/Drawer';

export default ({ children }) =>
<Fragment>
    <Drawer/>
    <Grid
        container
        alignItems='center'
    >
        <Grid item xs={3}/>
        <Grid item xs={6}>
            <Paper className='padding-10'><Grid container direction="column" justify="center">{children}</Grid></Paper>
        </Grid>
    </Grid>
</Fragment>;