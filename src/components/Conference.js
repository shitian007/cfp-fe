import React from 'react';
import { TableContainer, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { Grid, Typography, Chip } from '@material-ui/core';
import { Link, withRouter } from 'react-router-dom';
import { backendIP, updateConferenceIssueURL } from './constants'
import _ from 'lodash';

class Conference extends React.Component {
  constructor(props) {
    super(props);
    this.mounted = false;
    this.state = {
      id: this.props.id,
      title: '',
      topics: [],
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
    this.props.setLoadingState(true);
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
            id: responseJson.id,
            title: responseJson.title,
            topics: responseJson.topics,
            pages: responseJson.pages,
            persons: responseJson.persons,
            score: responseJson.score
          });
          this.props.setLoadingState(false);
        }
      });
  }

  render() {
    let topics = []
    if (this.state.topics.length !== 0) {
      this.state.topics.forEach((row, index) => {
        topics.push(
          <Chip style={{marginRight: 20}} key={row} label={row}></Chip>
        )
      })
    } else {
      topics.push(<Typography color="textSecondary" key='no-topic'>No labelled topics</Typography>)
    }
    return (
      <div style={{ margin: 50 }}>
        <Grid container spacing={3}>
          <Grid item xs>
            <Grid container spacing={1}>
            <Typography variant="h5" color="textPrimary">
              {this.state.title} <span style={{fontSize: 12}}>ID: {this.state.id}</span>
            </Typography>
            </Grid>
            <Grid style={{marginTop: 10}}>
              <Typography variant="h5" color="textSecondary"> Score: {this.state.score} </Typography>
            </Grid>
            <Grid style={{margin: 10}} container justify="center">
              {topics}
            </Grid>
            <div style={{ margin: 60, fontSize: 12 }}>
              *To report discrepancies and updates to conference information, please submit an issue&nbsp;
              <a target="_blank" rel="noopener noreferrer" href={updateConferenceIssueURL}>here</a>
            </div>
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