import React, { Component } from 'react';
import PropTypes from 'proptypes';
import { Meteor } from 'meteor/meteor';

class Logout extends Component {
    handleClick = () => {
        Meteor.logout();
    };
    render = () => {
        return (
            <div onClick={this.handleClick}>
                {this.props.children}
            </div>
        );
    }
}

export default Logout;
