import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Grid, Link, Typography } from '@material-ui/core';

class SearchPage extends React.Component {

  render() {
    let searchRows = [];
    this.props.searchResults.forEach((row, index) => {
      let rowContent = <div>Unknown</div>;
      if (row.type === "person") {
        rowContent =
          <div>
            <Link onClick={() => this.props.selectPerson(row.id)}>
              {row.name}
            </Link>
            <Typography variant="body2">{row.org}</Typography>
          </div>
      } else if (row.type === "org") {
        rowContent =
          <Link onClick={() => this.props.selectOrganization(row.id)}>
            {row.text}
          </Link>
      } else if (row.type === "conf") {
        rowContent =
          <Link onClick={() => this.props.selectConference(row.id)}>
            {row.text}
          </Link>
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

export default SearchPage;