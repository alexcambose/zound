import React, { Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

export default ({ children, noTopPadding, scroll }) =>
<div style={{padding: (noTopPadding ? '0 10px 10px' : '74px 10px 10px'), overflow: (scroll ? 'scroll' : 'auto')}}>
    {children}
</div>;