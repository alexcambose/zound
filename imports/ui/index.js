import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import App from './App';

const theme = createMuiTheme({});


Meteor.startup(() => {
    ReactDOM.render(
        <MuiThemeProvider theme={theme}>
            <App />
        </MuiThemeProvider>, document.querySelector('#app'));
});
