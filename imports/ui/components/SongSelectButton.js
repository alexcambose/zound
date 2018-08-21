import React, { Component, Fragment } from 'react';
import PropTypes from 'proptypes';
import { Button, Dialog, AppBar, ExpansionPanelActions, Typography, CircularProgress, Avatar, IconButton, TextField, Icon, Chip, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Toolbar, withStyles } from '@material-ui/core';
import { Track } from '../utils';
import _ from 'lodash';
import renderHTML from 'react-render-html';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import Container from '../pages/Container';

momentDurationFormatSetup(moment);

const styles = theme => ({
    appBar: {
        position: 'relative',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    searchInput: {
        display: 'block'
    },
    trackMoreInfo: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    chip: {
        margin: theme.spacing.unit,
        marginLeft: 0,
    },
    panelSummary: {
        // borderBottom: '1px solid gray',
    },
    image: {
        borderRadius: 4,
        width: 200,
        height: 200,
        marginBottom: 6,
    },
    info: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: 10,
    },
    albumImage: {
        width: 24,
        height: 24,
        margin: 4,
    },
    imagesContainer: {},
    albumName: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 4px',
        fontWeight: 'bold',
    },
    artistName: {
        margin: '0 4px',
        fontWeight: 'bold',
    },
    albumInfo: {
        display: 'flex',
        alignItems: 'center',
    },
    trackInfo: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        flexDirection: 'column'
    },
    textCenter: {
        textAlign: 'center',
    }
});

class SongSelectButton extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        selectButtonLabel: PropTypes.string,
        onSelected: PropTypes.func,
        title: PropTypes.string,
        dialogTitle: PropTypes.string,
        color: PropTypes.string,
    };
    static defaultProps = {
        selectButtonLabel: 'Select',
        title: 'Select a song',
        dialogTitle: 'Search a track',
    };
    state = {
        open: false,
        search: '',
        expanded: -1,
        tracksFound: [],
        hasError: false,
    };
    handleDialog = open => () => this.setState({ open });
    handleSearchChange = ({ target }) => {
        this.setState({ search: target.value });
        this.handleSearch();
    };
    handleSearch = _.debounce(async e => {
        const tracksFound = await Track.search(this.state.search);
        this.setState({ tracksFound });
    }, 300);
    handlePanelChange = panel => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false,
        });
        this.setInfo(panel);
    };
    setInfo = async index => {
        const info = await Track.getTrackInfo(this.state.tracksFound[index].name, this.state.tracksFound[index].artist);
        const newTracks = [...this.state.tracksFound];
        newTracks[index].info = info;
        this.setState({ tracksFound: newTracks });
    };
    handleSongSelect = song => {
        const { onSelected } = this.props;
        if(onSelected)
            onSelected(song);
        this.handleDialog(false)();
    };
    render = () => {
        const { open, search, expanded, tracksFound, hasError } = this.state;
        const { classes, selectButtonLabel, title, dialogTitle, color } = this.props;

        if (hasError) return <div>Error!</div>;
        const trackPanels = tracksFound.map((e, i) => (
            <ExpansionPanel key={i} expanded={expanded === i} onChange={this.handlePanelChange(i)}>
                <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>} className={classes.panelSummary}>
                    <Typography className={classes.heading}>{e.name}</Typography>
                    <Typography className={classes.secondaryHeading}>{e.artist}</Typography>
                </ExpansionPanelSummary>
                {e.info &&
                <ExpansionPanelDetails className={classes.trackMoreInfo}>
                    <div className={classes.trackInfo}>
                        <div className={classes.imagesContainer}>
                            <Avatar alt={e.name} src={e.image[2]['#text']} className={classes.image}/>
                        </div>
                        <div className={classes.info}>
                            <Typography gutterBottom variant="headline">
                                {e.name}
                            </Typography>
                            <Typography gutterBottom variant="subheading" className={classes.albumInfo}>
                                <small>by</small>
                                <span className={classes.artistName}>{e.artist}</span>
                            </Typography>
                            {e.info.album &&
                            <Typography gutterBottom variant="subheading" className={classes.albumInfo}>
                                <small>album</small>
                                <div className={classes.albumName}>
                                    <Avatar alt={e.name} src={e.info.album.image[0]['#text']}
                                            className={classes.albumImage}/>
                                    <span>{e.info.album.title}</span>
                                </div>
                            </Typography>
                            }
                            {parseInt(e.info.duration) !== 0 &&
                            <Typography gutterBottom>
                                Duration: <strong>{moment.duration(parseInt(e.info.duration), 'milliseconds').format()}</strong>
                            </Typography>
                            }
                            <div>
                                {e.info.toptags.tag.map((e, i) => <Chip key={i} label={e.name}
                                                                        className={classes.chip}/>)}
                            </div>
                        </div>
                    </div>

                    {e.info.wiki && <Typography variant='caption'>{renderHTML(e.info.wiki.summary)}</Typography>}
                </ExpansionPanelDetails>
                }
                {e.info && <ExpansionPanelActions><Button size="small" variant='outlined' fullWidth onClick={() => this.handleSongSelect(e)}>{selectButtonLabel}</Button></ExpansionPanelActions>}
                {!e.info && <div className={classes.textCenter}><CircularProgress className={classes.progress}/></div>}
            </ExpansionPanel>
        ));
        return (
            <Fragment>
                <Button onClick={this.handleDialog(true)} variant="raised" color="primary" fullWidth style={{backgroundColor: color}}>{title}</Button>
                <Dialog
                    fullScreen
                    open={open}
                    onClose={this.handleDialog(false)}
                >
                    <AppBar className={classes.appBar} style={{backgroundColor: color}}>
                        <Toolbar>
                            <IconButton color="inherit" onClick={this.handleDialog(false)} aria-label="Close">
                                <Icon>close</Icon>
                            </IconButton>
                            <Typography variant="title" color="inherit">
                                {dialogTitle}
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Container noTopPadding scroll>
                        <TextField
                            id="search"
                            label="Type track name..."
                            type="search"
                            fullWidth
                            margin="normal"
                            value={search}
                            onChange={this.handleSearchChange}
                            className={classes.searchInput}
                        />
                        <div>
                            {trackPanels}
                        </div>
                    </Container>

                </Dialog>
            </Fragment>
        );
    };
    componentDidCatch(error, info) {
        this.setState({ hasError: true });
    }
}

export default withStyles(styles)(SongSelectButton);
