import React, { Component, Fragment } from 'react';
import PropTypes from 'proptypes';
import { Typography } from '@material-ui/core';
import moment from 'moment';

class Info extends Component {
    state = {};
    static propTypes = {
        party: PropTypes.object.isRequired,
    };
    static defaultProps = {};
    render = () => {
        const { title, description, startDate, endDate } = this.props.party;
        return (
            <Fragment>
                <Typography variant="headline">{title}</Typography>
                <Typography variant="subheading" color="textSecondary">{description}</Typography>
                <Typography variant="body1">
                    <strong>From:</strong> {moment(startDate).format('MMMM Do YYYY, h:mm a')} <strong>to</strong> {moment(endDate).format('MMMM Do YYYY, h:mm a')}
                </Typography>
            </Fragment>
        );
    }
}

export default Info;
