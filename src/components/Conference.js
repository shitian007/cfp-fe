import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Grid, Typography } from '@material-ui/core';
import { Link, withRouter } from 'react-router-dom';
import { backendIP } from './constants'
import _ from 'lodash';

class Conference extends React.Component {
  constructor(props) {
    super(props);
    this.mounted = false;
    this.state = {
      id: this.props.id,
      title: '',
      pages: [],
      persons: [],
      score: ''
    }
    this.getConferenceInfo();
  }

  componentDidMount() {
    this.mounted = true;
    this.unlisten = this.props.history.listen((location, action) => {
      this.getConferenceInfo();
    });
  }

  componentWillUnmount() {
    this.mounted = false;
    this.unlisten();
  }

  getConferenceInfo = () => {
    let fetch_url = backendIP + 'conf?id=' + this.props.match.params.id;
    fetch(fetch_url, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (this.mounted) {
          this.setState({
            title: responseJson.title,
            topics: responseJson.topics,
            pages: responseJson.pages,
            persons: responseJson.persons,
            score: responseJson.score
          });
        }
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
              <Typography variant="h5" color="textPrimary"> {this.state.title} </Typography>
            </Grid>
            <Grid style={{marginTop: 10}}>
              <Typography variant="h4" color="textSecondary"> Score: {this.state.score} </Typography>
            </Grid>
            <Grid style={{ margin: 20, padding: 20 }} container justify="space-between">
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
    let persons = _.sortBy(this.props.persons, p => p.score).reverse();

    return (
      <TableContainer style={{ marginRight: 50 }} component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow style={{ background: 'lightgrey' }}>
              <TableCell align="right">Person&nbsp;[Score]</TableCell>
              <TableCell align="right">Organization&nbsp;[Score]</TableCell>
              <TableCell align="right">Role&nbsp;</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {persons.map(person => (
              <TableRow key={person.role + person.id}>
                <TableCell align="right">
                  <Link to={'/person/' + person.id}>
                    {person.name}
                  </Link>
                  &nbsp;[{person.score}]
                </TableCell>
                <TableCell align="right">
                  <Link to={'/org/' + person.org_id}>
                    {person.org}
                  </Link>
                  &nbsp;[{person.org_score}]
                </TableCell>
                <TableCell align="right">{person.role}</TableCell>
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
                <a target="_blank" rel="noopener noreferrer" href={row[0]}>
                  {row[0]}
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }
}
export default withRouter(Conference);