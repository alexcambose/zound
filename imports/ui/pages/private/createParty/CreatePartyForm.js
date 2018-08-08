import React, { Component } from 'react';
import { TextField, Button, FormHelperText,  InputAdornment, Icon, FormControl,MenuItem, Chip, Input, InputLabel, Select } from '@material-ui/core';
import { genres } from '../../../config';
import { withRouter } from 'react-router';

class CreatePartyForm extends Component {
    state = {
        title: 'Jumuleala',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent elementum id mi eget dictum. Proin ut ligula fermentum, mattis justo et, tempor ex. Fusce id erat quis tortor sodales sodales. Nullam quis augue non ante maximus egestas. Ut placerat tellus quis sapien porta lacinia. Nunc efficitur a risus ac rutrum. Quisque fringilla eget justo et efficitur. Quisque nec felis vitae leo tempus suscipit. Nulla facilisis commodo quam sed posuere. Aliquam malesuada fermentum luctus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aenean sodales urna vitae convallis vestibulum. Vestibulum quis cursus est. Vivamus vitae cursus quam, vel interdum turpis. Fusce tempus fermentum vestibulum. Aliquam molestie auctor purus, et molestie sapien mollis eu.',
        genre: [],
        startDate: new Date,
        endDate: new Date,
        password: '',
        error: '',
    };
    handleChange = name => ({ target }) => this.setState({[name]: target.value});
    handleSubmit = e => {
        e.preventDefault();
        Meteor.call('parties.insert', this.state, (err, res) => {
            if(err) {
                this.setState({ error: err.reason });
            } else {
                this.props.history.push('/');
            }
        })
    };
    render = () => {
        const { title, description, genre, startDate, endDate, error, password } = this.state;
        return (
            <form onSubmit={this.handleSubmit}>

                <TextField
                    id="title"
                    type="text"
                    fullWidth
                    label="Title"
                    value={title}
                    onChange={this.handleChange('title')}
                    margin="normal"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Icon>title</Icon>
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    id="description"
                    type="text"
                    multiline
                    rows={3}
                    fullWidth
                    label="Description"
                    value={description}
                    onChange={this.handleChange('description')}
                    margin="normal"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Icon>subject</Icon>
                            </InputAdornment>
                        ),
                    }}
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel htmlFor="select-multiple-chip">Genres</InputLabel>
                    <Select
                        multiple
                        value={genre}
                        onChange={this.handleChange('genre')}
                        input={<Input id="select-multiple-chip" />}
                        renderValue={selected => (
                            <div>
                                {selected.map(value => (
                                    <Chip key={value} label={genres[value]} />
                                ))}
                            </div>
                        )}
                    >
                        {genres.map((name, i)=> (
                            <MenuItem
                                key={name}
                                value={i}
                            >
                                {name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <InputLabel htmlFor="start-date">Start Date</InputLabel>

                <FormControl fullWidth>
                    <Input
                        id="start-date"
                        type="datetime-local"
                        onChange={this.handleChange('startDate')}
                    />
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel htmlFor="end-date">End Date</InputLabel>
                    <Input
                        id="end-date"
                        type="datetime-local"
                        onChange={this.handleChange('endDate')}
                    />
                </FormControl>
                <TextField
                    id="password"
                    type="text"
                    fullWidth
                    label="Join password"
                    value={password}
                    onChange={this.handleChange('password')}
                    margin="normal"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Icon>dialpad</Icon>
                            </InputAdornment>
                        ),
                    }}
                />
                <Button variant="contained" fullWidth type="submit">Register</Button>
                {error && <FormHelperText error>{error}</FormHelperText>}
            </form>
        );
    }
}

export default withRouter(CreatePartyForm);
