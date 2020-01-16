import React from 'react';
import debounce from 'lodash.debounce';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { IP } from './constants'
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  title: {
    fontSize: 30,
  },
  grow: {
    backgroundColor: 'lightblue',
  },
  search: {
    width: 500,
    margin: 10,
  }
});

class SearchAppBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchResults: [],
    };
    this.getSearchResults = debounce(this.getSearchResults, 300)
  }

  updateResults = (e) => {
    e.preventDefault();
    let searchVal = e.target.value;
    this.getSearchResults(searchVal);
  }

  getSearchResults = (searchVal) => {
    let fetch_url = IP + 'search?search_val=' + searchVal;
    fetch(fetch_url, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          searchResults: responseJson['results']
        });
      });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.grow}>
        <div className={classes.title}>
          Conference Information Search
        </div>
        <Autocomplete
          getOptionLabel={option => {
            return option[1];
          }}
          filterOptions={x => x}
          options={this.state.searchResults}
          autoComplete
          includeInputInList
          freeSolo
          disableOpenOnFocus
          renderInput={params => (
            <TextField
              className={classes.search}
              {...params}
              label="Search"
              variant="outlined"
              onChange={this.updateResults}
            />
          )}
          renderOption={option => {
            return (
              <Typography variant="body2" color="textSecondary">
                {option[1]}
              </Typography>
            );
          }}
        />
      </div>
    );
  }
}

export default withStyles(styles)(SearchAppBar);