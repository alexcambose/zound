import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';

class LoginFrom extends Component {
    state = {
        email: 'alexcambose@yahoo.com',
        password: '12345',
        showPassword: false,
        error: '',
    };
    handleChange = name => ({ target }) => this.setState({[name]: target.value});
    handleClickShowPassword = () => this.setState({ showPassword: !this.state.showPassword });
    handleSubmit = e => {
        e.preventDefault();
        const { email, password } = this.state;

        Meteor.loginWithPassword(email, password, err => {
            if(err) this.setState({ error: err.reason });
            // will redirect
        })
    };
    render = () => {
        const { email, password, showPassword, error } = this.state;
        return (
            <form onSubmit={this.handleSubmit}>
                <TextField
                    id="email"
                    type="email"
                    fullWidth
                    label="Email"
                    value={email}
                    onChange={this.handleChange('email')}
                    margin="normal"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Icon>email</Icon>
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    id="password"
                    fullWidth={true}
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    value={password}
                    onChange={this.handleChange('password')}
                    margin="normal"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Icon>dialpad</Icon>
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="Toggle password visibility"
                                    onClick={this.handleClickShowPassword}
                                >
                                {showPassword ? <Icon>visibility_off</Icon> : <Icon>visibility</Icon>}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
                <Button fullWidth type="submit">Login</Button>
                {error && <FormHelperText error>{error}</FormHelperText>}

            </form>
        );
    }
}

export default LoginFrom;
