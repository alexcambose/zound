import React, { Component } from 'react';
import PropTypes from 'proptypes';
import { TextField, Button, FormHelperText,  InputAdornment, Icon, FormControl,MenuItem, Chip, Input, InputLabel, Select } from '@material-ui/core';
import { genres } from '../config';
import { withRouter } from 'react-router';
import moment from 'moment';

class CreateOrEditPartyForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            description: '',
            genre: [],
            startDate: new Date,
            endDate: new Date,
            password: '',
            color: '#000000',
            error: '',
            loading: false,
        };
        if(props.party) {
            this.state = {...this.state, ...props.party};
        }
        console.log(props.party)
    }
    static propTypes = {
        party: PropTypes.object,
    };
    handleChange = name => ({ target }) => this.setState({[name]: target.value});
    handleSubmit = e => {
        e.preventDefault();
        this.setState({loading: true});
        if(this.props.party) {
            Meteor.call('parties.update', this.props.party._id, this.state, (err, res) => {
                this.setState({loading: false});
                if(err) {
                    this.setState({ error: err.reason });
                } else {
                    this.props.history.push('/');
                }
            });
        } else {
            Meteor.call('parties.insert', this.state, (err, res) => {
                this.setState({loading: false});
                if(err) {
                    this.setState({ error: err.reason });
                } else {
                    this.props.history.push('/');
                }
            })
        }
    };
    render = () => {
        const { party } = this.props;
        const { title, description, genre, startDate, endDate, error, color, password, loading } = this.state;
        console.log(startDate.toString(), startDate.toISOString());
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
                                    <Chip key={value} label={genres[value]} style={{marginRight: 4}}/>
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
                <TextField
                    id="datetime-local"
                    label="Start date"
                    type="datetime-local"
                    value={moment(startDate).format('YYYY-MM-DDTHH:mm')}
                    onChange={this.handleChange('startDate')}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    fullWidth
                    margin='normal'
                />
                <TextField
                    id="datetime-local"
                    label="End date"
                    type="datetime-local"
                    value={moment(endDate).format('YYYY-MM-DDTHH:mm')}
                    onChange={this.handleChange('endDate')}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    fullWidth
                    margin='normal'
                />
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
                <TextField
                    id="datetime-local"
                    label="Color (optional)"
                    type="color"
                    onChange={this.handleChange('color')}
                    value={color}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    fullWidth
                    margin='normal'
                />
                <Button disabled={loading} variant="contained" fullWidth type="submit">{party ? 'Save' : 'Create'} party</Button>
                {error && <FormHelperText error>{error}</FormHelperText>}
            </form>
        );
    }
}

export default withRouter(CreateOrEditPartyForm);
