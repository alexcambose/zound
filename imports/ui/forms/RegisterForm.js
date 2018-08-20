import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText/';

class RegisterForm extends Component {
    state = {
        firstName: 'Alex',
        lastName: 'Cambose',
        email: 'alexcambose@yahoo.com',
        password: '1234',
        cpassword: '1234',
        showPassword: false,
        showCPassword: false,
        error: '',
    };

    handleChange = name => ({ target }) => this.setState({[name]: target.value});
    handleClickShowPassword = () => this.setState({ showPassword: !this.state.showPassword });
    handleClickShowCPassword = () => this.setState({ showCPassword: !this.state.showCPassword });
    handleSubmit = e => {
        e.preventDefault();
        const { firstName, lastName, email, password, cpassword } = this.state;
        if(password !== cpassword) { this.setState({ error: 'Passwords do not match!' }); return; }
        Accounts.createUser({
            email,
            password,
            profile: { firstName, lastName }
        }, (err, res) => {
            if(err) this.setState({ error: err.reason });
            // will redirect
        });
    };
    render = () => {
        const { firstName, lastName, email, password, cpassword, showPassword, showCPassword, error } = this.state;
        return (
            <form onSubmit={this.handleSubmit}>
                <TextField
                    id="firstName"
                    fullWidth={true}
                    label="First name"
                    value={firstName}
                    onChange={this.handleChange('firstName')}
                    margin="normal"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Icon>face</Icon>
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    id="lastName"
                    fullWidth={true}
                    label="Last name"
                    value={lastName}
                    onChange={this.handleChange('lastName')}
                    margin="normal"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Icon>face</Icon>
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    id="email"
                    fullWidth={true}
                    type="email"
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
                <TextField
                    id="cpassword"
                    fullWidth={true}
                    type={showCPassword ? 'text' : 'password'}
                    label="Confirm password"
                    value={cpassword}
                    onChange={this.handleChange('cpassword')}
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
                                    onClick={this.handleClickShowCPassword}
                                >
                                    {showCPassword ? <Icon>visibility_off</Icon> : <Icon>visibility</Icon>}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
                <Button fullWidth type="submit">Register</Button>
                {error && <FormHelperText error>{error}</FormHelperText>}
            </form>
        );
    }
}

export default RegisterForm;
