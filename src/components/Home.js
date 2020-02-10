import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Paper, Tabs, Tab } from '@material-ui/core';
import { Grid, Typography } from '@material-ui/core';
import { Link, withRouter } from 'react-router-dom';
import { backendIP } from './constants'

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.mounted = false;
    this.state = {
      confs: [],
      persons: [],
      orgs: [],
      tabDisplayIndex: 0,
    }
    this.getHomeInfo();
  }

  componentDidMount() {
    this.mounted = true;
    this.unlisten = this.props.history.listen((location, action) => {
      this.getHomeInfo();
    });
    this.props.setLoadingState(true);
  }

  componentWillUnmount() {
    this.mounted = false;
    this.unlisten();
  }

  getHomeInfo = () => {
    let fetch_url = backendIP + 'home';
    fetch(fetch_url, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (this.mounted) {
          this.setState({
            confs: responseJson.confs,
            persons: responseJson.persons,
            orgs: responseJson.orgs,
            tabDisplay: <TopConferences confs={responseJson.confs}/>
          });
          this.props.setLoadingState(false);
        }
      });
  }

  handleChange = (event, value) => {
    this.setState({
      tabDisplayIndex: value
    });
    if (value === 0) {
      this.setState({
        tabDisplay: <TopConferences confs={this.state.confs}/>
      });
    } else if (value === 1) {
      this.setState({
        tabDisplay: <TopPersons persons={this.state.persons}/>
      });
    } else {
      this.setState({
        tabDisplay: <TopOrganizations orgs={this.state.orgs}/>
      });
    }
  }

  render() {
    return (
      <div style={{ margin: 100, marginTop: 20 }}>
        <Grid container>
          <Grid item>
            <Paper square style={{width: 480}}>
              <Tabs
                value={this.state.tabDisplayIndex}
                indicatorColor="primary"
                textColor="primary"
                onChange={this.handleChange}
              >
                <Tab label="Conferences" />
                <Tab label="Persons" />
                <Tab label="Organizations" />
              </Tabs>
            </Paper>
            <Grid container>
              {this.state.tabDisplay}
            </Grid>
          </Grid>
        </Grid>
      </div>
    )
  }
}

class TopConferences extends React.Component {
  render() {
    let confs = this.props.confs;
    return (
      <Grid item>
        <Grid style={{ marginTop: 20 }} container justify="space-between">
          <Table size='small'>
            <TableHead>
              <TableRow style={{ background: 'lightgrey' }}>
                <TableCell align="left">Conference Name</TableCell>
                <TableCell align="left">Year</TableCell>
                <TableCell align="left">Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {confs.map(conf => (
                <TableRow key={conf.id} align="left">
                  <TableCell> <Link to={'/conf/' + conf.id}> {conf.title} </Link> </TableCell>
                  <TableCell> {conf.year} </TableCell>
                  <TableCell> {conf.score} </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    )
  }
}

class TopPersons extends React.Component {
  render() {
    let persons = this.props.persons;
    return (
      <Grid item>
        <Grid style={{ marginTop: 20 }} container justify="space-between">
          <Table size='small'>
            <TableHead>
              <TableRow style={{ background: 'lightgrey' }}>
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Score</TableCell>
                <TableCell align="left">Organization</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {persons.map(person => (
                <TableRow key={person.id} align="left">
                  <TableCell> <Link to={'/person/' + person.id}> {person.name} </Link> </TableCell>
                  <TableCell> {person.score} </TableCell>
                  <TableCell> <Link to={'/org/' + person.org_id}> {person.org} </Link> </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    )
  }
}

class TopOrganizations extends React.Component {
  render() {
    let organizations = this.props.orgs;
    return (
      <Grid item>
        <Grid style={{ marginTop: 20 }} container justify="space-between">
          <Table size='small'>
            <TableHead>
              <TableRow style={{ background: 'lightgrey' }}>
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {organizations.map(org => (
                <TableRow key={org.id} align="left">
                  <TableCell> <Link to={'/org/' + org.id}> {org.text} </Link> </TableCell>
                  <TableCell> {org.score} </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    )
  }
}

export default withRouter(Home);