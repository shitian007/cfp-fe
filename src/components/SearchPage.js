import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Grid, Typography } from '@material-ui/core';
import { backendIP } from './constants';
import { Link, withRouter } from 'react-router-dom';

class SearchPage extends React.Component {

  constructor(props) {
    super(props);
    this.mounted = false;
    this.state = {
      searchResults: []
    }
    this.getResults();
  }

  componentDidMount() {
    this.mounted = true;
    this.unlisten = this.props.history.listen((location, action) => {
      this.getResults();
    });
    this.props.setLoadingState(true);
  }

  componentWillUnmount() {
    this.mounted = false;
    this.unlisten();
  }

  getResults = () => {
    let fetch_url = backendIP + 'search?search_val=' + this.props.match.params.searchVal;
    fetch(fetch_url, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (this.mounted) {
          this.setState({
            searchResults: responseJson.results
          });
          this.props.setLoadingState(false);
        }
      })
  }

  render() {
    let searchRows = [];
    this.state.searchResults.forEach((row, index) => {
      let rowContent = <div>Unknown</div>;
      if (row.type === "person") {
        rowContent =
          <div>
            <Link to={`/person/` + row.id}>
              {row.name}
            </Link>
            <Typography variant="body2">{row.org}</Typography>
          </div>
      } else if (row.type === "org") {
        rowContent =
          <Link to={`/org/` + row.id}> {row.text} </Link>
      } else if (row.type === "conf") {
        rowContent =
          <Link to={`/conf/` + row.id}> {row.text} </Link>
      } else {
        rowContent = <div>Unknown Results</div>
      }
      searchRows.push(
        <TableRow key={row.type + row.id}>
          <TableCell>
            <Grid container justify="space-between">
              {rowContent}
              <Typography variant="body2" color="textSecondary" align="right">{row.type}</Typography>
            </Grid>
          </TableCell>
        </TableRow>
      )
    });

    return (
      <div style={{ marginTop: 30, display: 'flex', justifyContent: 'center' }}>
        <Table style={{ width: 800 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h6" color="textSecondary" align="left">Search Results</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {searchRows}
          </TableBody>
        </Table>
      </div>
    )
  }
}

export default withRouter(SearchPage);