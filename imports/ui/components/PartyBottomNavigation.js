import React, { Component } from 'react';
import { BottomNavigation, BottomNavigationAction, Icon, withStyles } from '@material-ui/core';
import { withRouter } from 'react-router';
const styles = theme => ({
    bottomNavigation: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        boxShadow: '0px 0px 34px -12px black',
    }
});
class PartyBottomNavigation extends Component {
    state = {
        value: this.props.match.params.page,
    };
    static propTypes = {};
    static defaultProps = {};
    handleChange = (event, value) => {
        this.setState({ value });
        console.log(this.props);
        let url = this.props.match.url.split('/');
        url = url.slice(0, url.length - 1);
        this.props.history.push(url.join('/') + '/' + value);
    };
    render = () => {
        const { value } = this.state;
        const { classes } = this.props;
        return (
            <BottomNavigation value={value} onChange={this.handleChange} className={classes.bottomNavigation}>
                <BottomNavigationAction label="Music" value="music" icon={<Icon>library_music</Icon>} />
                <BottomNavigationAction label="People" value="people" icon={<Icon>person</Icon>} />
                <BottomNavigationAction label="Info" value="info" icon={<Icon>info</Icon>} />
            </BottomNavigation>
        );
    }
}

export default withStyles(styles)(withRouter(PartyBottomNavigation));
