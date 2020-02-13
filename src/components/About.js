import React from 'react';
import { withRouter } from 'react-router-dom';
import { Grid } from '@material-ui/core';

class About extends React.Component {

    componentDidMount() {
        this.props.setLoadingState(false);
    }

    render() {
        return (
            <Grid container
                justify="center"
                style={{ marginTop: 20 }}>
                In Progress
            </Grid>
        )
    }
}

export default withRouter(About);