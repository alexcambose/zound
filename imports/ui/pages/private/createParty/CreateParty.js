import React, { Component } from 'react';
import CreatePartyForm from '../../../forms/CreateOrEditPartyForm';

class createParty extends Component {
    state = {};
    render = () => {
        return (
            <div>
                <CreatePartyForm/>
            </div>
        );
    }
}

export default createParty;
