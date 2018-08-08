import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import App from './App';

const theme = createMuiTheme({
    overrides: {
        // Name of the component ⚛️ / style sheet
        MuiButton: {
            // Name of the rule
            raisedSecondary: {
                // Some CSS
                background: 'linear-gradient(45deg, #357a38 30%, #00a152 90%)',
                borderRadius: 3,
                border: 0,
                color: 'white',
                height: 48,
                padding: '0 30px',
                boxShadow: '0 3px 5px 2px rgba(53, 122, 56, .3)',
            },
        },
    },
});


Meteor.startup(() => {
    ReactDOM.render(
        <MuiThemeProvider theme={theme}>
            <CssBaseline/>
            <App />
        </MuiThemeProvider>, document.querySelector('#app'));
});
