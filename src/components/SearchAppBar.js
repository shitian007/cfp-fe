import React from 'react';
import debounce from 'lodash.debounce';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';
import { Link, withRouter } from 'react-router-dom';
import { backendIP } from './constants'

const styles = theme => ({
  title: {
    fontSize: 30,
  },
  grow: {
    backgroundColor: 'lightblue',
    borderRadius: 10
  },
  search: {
    width: 800,
    margin: 10,
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
      <div className={classes.grow}>
        <Typography variant="h3">Mining Call for Papers</Typography>
        <Grid container justify="center">
          <Link to={'/home'} style={{margin: 5}}> Home </Link>
          <Link to={'/about'} style={{margin: 5}}> About </Link>
        </Grid>
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
              label="Search"
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
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(SearchAppBar));