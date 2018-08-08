import React, { Component, Fragment } from 'react';
import PropTypes from 'proptypes';
import AddSuggestionButton from '../../../components/AddSuggestionButton';

class Music extends Component {
    state = {};
    static propTypes = {
        party: PropTypes.object.isRequired,
    };
    static defaultProps = {};
    render = () => {
        return (
            <Fragment>
                <AddSuggestionButton/>
            </Fragment>
        );
    }
}

export default Music;
