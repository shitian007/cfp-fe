import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Grid, Link, Typography } from '@material-ui/core';
import { IP } from './constants'

class Conference extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      title: '',
      pages: [],
      persons: []
    }
    this.getConferenceInfo();
  }

  getConferenceInfo = () => {
    let fetch_url = IP + 'conf?id=' + this.state.id;
    fetch(fetch_url, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          title: responseJson.title,
          topics: responseJson.topics,
          pages: responseJson.pages,
          persons: responseJson.persons
        });
      });
  }

  render() {
    let topics = []
    if (this.state.topics) {
      this.state.topics.forEach((row, index) => {
        topics.push(
              <Typography key={row} variant="body2" color="textSecondary" align="right">{row}</Typography>
        )
      })
    }
    return (
      <div style={{ margin: 50 }}>
        <Grid container spacing={3}>
          <Grid item xs>
            <Grid container spacing={1}>
              <Typography variant="h5" color="textPrimary">{this.state.title}</Typography>
            </Grid>
            <Grid style={{margin: 20, padding: 20}} container justify="space-between">
              {topics}
            </Grid>
            <Grid container spacing={1}>
              <ConferenceInfo pages={this.state.pages} />
            </Grid>
          </Grid>
          <Grid item sm>
            <ConferencePersons
              persons={this.state.persons}
              selectPerson={this.props.selectPerson}
              selectOrganization={this.props.selectOrganization}
            />
          </Grid>
        </Grid>
      </div>
    )
  }
}

class ConferencePersons extends React.Component {
  render() {
    return (
      <TableContainer style={{ marginRight: 50 }} component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow style={{ background: 'lightgrey' }}>
              <TableCell align="right">Person&nbsp;</TableCell>
              <TableCell align="right">Organization&nbsp;</TableCell>
              <TableCell align="right">Role&nbsp;</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.persons.map(row => (
              <TableRow key={row.role + row.id}>
                <TableCell align="right">
                  <Link onClick={() => this.props.selectPerson(row.id)}>
                    {row.name}
                  </Link>
                </TableCell>
                <TableCell align="right">
                  <Link onClick={() => this.props.selectOrganization(row.org_id)}>
                    {row.org}
                  </Link>
                </TableCell>
                <TableCell align="right">{row.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }
}

class ConferenceInfo extends React.Component {
  render() {
    return (
      <Table size="small">
        <TableHead>
          <TableRow align="left">
            <TableCell>
              <Typography>
                Relevant URLs
                    </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.props.pages.map(row => (
            <TableRow key={row[0]}>
              <TableCell>
                <Link target="_blank" href={row[0]}>
                  {row[0]}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }
}
export default Conference;