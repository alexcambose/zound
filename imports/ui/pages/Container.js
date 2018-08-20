import React, { Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

export default ({ children, noTopPadding, noPadding, scroll }) =>
<div style={{padding: (noTopPadding ? '0 10px 10px' : (noPadding ? 0 : '66px 10px 10px')), overflow: (scroll ? 'scroll' : 'auto')}}>
    {children}
</div>;