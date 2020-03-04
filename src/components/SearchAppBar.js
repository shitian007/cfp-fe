import React from 'react';
import debounce from 'lodash.debounce';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Typography from '@material-ui/core/Typography';
import { Button, Grid, Box } from '@material-ui/core';
import { Link, withRouter } from 'react-router-dom';
import { backendIP } from './constants'

const styles = theme => ({
  mainGrid: {
    background: 'linear-gradient(to right bottom, white, lightblue)',
    padding: 10
  },
  search: {
    minWidth: 800,
  },
  optionType: {
    float: 'right'
  }
});

class SearchAppBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchResults: [],
    };
    this.getSearchResults = debounce(this.getSearchResults, 300)
    this.onTextChange = this.onTextChange.bind(this);
  }

  // Debounced search results retrieval
  getSearchResults = (searchVal) => {
    let fetch_url = backendIP + 'autocomplete_search?search_val=' + searchVal;
    fetch(fetch_url, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          searchResults: responseJson['results']
        });
      });
  }

  onTextChange = (event, value) => {
    this.setState({
      searchVal: value
    });
    this.getSearchResults(value)
  }

  render() {
    const { classes } = this.props;
    return (
      <Grid container className={classes.mainGrid}>
        <Grid item sm style={{ maxWidth: 400 }}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <Link to={'/home'}> <Button style={{ maxWidth: 150 }}> CFP-Mining Home </Button> </Link>
            <Link to={'/about'}> <Button> About </Button> </Link>
            <Link to={'/about'}> <Button> FAQ </Button> </Link>
          </Box>
        </Grid>
        <Grid item sm>
          <Grid container>
            <Autocomplete
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  this.props.search(this.state.searchVal);
                }
              }
              }
              getOptionLabel={
                (option) => {
                  return (typeof option === "string") ? option : option.text;
                }
              }
              onInputChange={this.onTextChange}
              options={this.state.searchResults}
              autoComplete
              freeSolo
              renderInput={params => (
                <TextField
                  className={classes.search}
                  {...params}
                  label="Search Conferences / Researchers / Organizations"
                  variant="outlined"
                />
              )}
              renderOption={option => {
                return (
                  <Grid container justify="space-between">
                    <Typography variant="body2" align="left">{option.text}</Typography>
                    <Typography variant="body2" color="textSecondary" align="right">{option.type}</Typography>
                  </Grid>
                );
              }}
            />

          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(withStyles(styles)(SearchAppBar));