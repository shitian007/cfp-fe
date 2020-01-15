import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

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
      searchResults: []
    };
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.grow}>
        <div className={classes.title}>
          Conference Information Search
        </div>
        <Autocomplete
          disableClearable
          options={[].map(option => option.title)}
          renderInput={params => (
            <TextField
              onChange={this.updateResults}
              className={classes.search}
              {...params}
              variant="outlined"
              InputProps={{ ...params.InputProps, type: 'search' }}
            />
          )}
        />
      </div>
    );
  }
}

export default withStyles(styles)(SearchAppBar);