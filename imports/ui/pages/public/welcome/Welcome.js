import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, MobileStepper, Button, Icon, Typography } from '@material-ui/core';
import { withRouter } from 'react-router';
import SwipeableViews from 'react-swipeable-views';
import Color from 'color';
import Cookies from 'js-cookie';

const infoSteps = [
    {
        label: 'Discover and join parties with your friends!',
        icon: 'search',
        bgColor: '#2962ff'
    },
    {
        label: 'Suggest and vote only the songs you like!',
        icon: 'how_to_vote',
        bgColor: '#c62828'
    },
    {
        label: 'See info about the currently playing song!',
        icon: 'info',
        bgColor: '#512da8'
    },
];

const styles = theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
    },
    img: {
        height: 255,
        overflow: 'hidden',
        width: '100%',
    },
    mobileStepper: {
       position: 'absolute',
        backgroundColor: 'transparent',
    },
    swiper: {
        display: 'flex',
        flex: 1,
    },
    content: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        height: '100%',
        color: '#fff'
    },
    contentLabel: {
        color: '#fff',
        textAlign: 'center',
    },
    contentIcon: {
        fontSize: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '100%',
        height: 100,
        width: 100,
        marginBottom: 10,
        boxShadow: '0 0 10px rgba(255,255,255,.1) inset',
    },
    button: {
        color: 'white',
    }
});

class SwipeableTextMobileStepper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeStep: 0,
        };
        if(!Cookies.get('first-time')) {
            Cookies.set('first-time', 'some value');
        } else {
            props.history.replace('/login');
        }
    }


    handleNext = () => {
        if(this.state.activeStep === infoSteps.length - 1) {
            this.props.history.replace('/login');
        }
        this.setState(prevState => ({
            activeStep: prevState.activeStep + 1,
        }));
    };

    handleBack = () => {
        this.setState(prevState => ({
            activeStep: prevState.activeStep - 1,
        }));
    };

    handleStepChange = activeStep => {
        this.setState({ activeStep });
    };

    render() {
        const { classes, theme } = this.props;
        const { activeStep } = this.state;

        const maxSteps = infoSteps.length;

        return (
            <div className={classes.root}>
                <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={this.state.activeStep}
                    onChangeIndex={this.handleStepChange}
                    enableMouseEvents
                    className={classes.swiper}
                >
                    {infoSteps.map((step, i) => (
                        <div key={i} className={classes.content} style={{backgroundColor: step.bgColor}}>
                            <Icon className={classes.contentIcon} style={{backgroundColor: Color(step.bgColor).lighten(0.05)}}>{step.icon}</Icon>
                            <Typography variant="headline" className={classes.contentLabel} gutterBottom>
                                {step.label}
                            </Typography>
                        </div>
                        // <img key={step.label} className={classes.img} src={step.imgPath} alt={step.label} />
                    ))}
                </SwipeableViews>
                <MobileStepper
                    variant="text"
                    steps={maxSteps}
                    // position="static"
                    activeStep={activeStep}
                    className={classes.mobileStepper}
                    nextButton={
                        <Button className={classes.button} size="small" onClick={this.handleNext} disabled={activeStep === maxSteps}>
                            {activeStep === maxSteps - 1 ? 'Get started' : 'Next'}
                            {theme.direction === 'rtl' ? <Icon>keyboard_arrow_left</Icon> : <Icon>keyboard_arrow_right</Icon>}
                        </Button>
                    }
                    backButton={
                        <Button className={classes.button} size="small" onClick={this.handleBack} disabled={activeStep === 0}>
                            {theme.direction === 'rtl' ? <Icon>keyboard_arrow_right</Icon> : <Icon>keyboard_arrow_left</Icon>}
                            Back
                        </Button>
                    }
                />
            </div>
        );
    }
}

SwipeableTextMobileStepper.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles, { withTheme: true })(SwipeableTextMobileStepper));