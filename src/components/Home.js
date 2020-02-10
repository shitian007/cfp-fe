import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { Paper, Tabs, Tab } from '@material-ui/core';
import { Grid, Box } from '@material-ui/core';
import { Link, withRouter } from 'react-router-dom';
import { backendIP, personIssueURL } from './constants'

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
            tabDisplay: <TopConferences confs={responseJson.confs} />
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
        tabDisplay: <TopConferences confs={this.state.confs} />
      });
    } else if (value === 1) {
      this.setState({
        tabDisplay: <TopPersons persons={this.state.persons} />
      });
    } else {
      this.setState({
        tabDisplay: <TopOrganizations orgs={this.state.orgs} />
      });
    }
  }

  render() {
    return (
      <div style={{ margin: 100, marginTop: 20 }}>
        <Grid container>
          <Grid item style={{ width: 900 }}>
            <Paper square style={{ width: 480 }}>
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
          <Grid item style={{ margin: 50 }}>
            <Box display="block" style={{ width: 500, fontSize: 14 }}>
              <p><b>NOTE</b></p>
              All <i>Conference</i>, <i>Person</i>, <i>Organization</i> data on CFP-Mining is mined from individual Conference call-for-papers
              and the verity of the information hence cannot be guaranteed. For lapses or inaccuracy of any data, please request for corresponding updates as follows:
              <p>
                <b>For updating of Person information: </b> please submit a new issue&nbsp;
                <a target="_blank" href={personIssueURL}>here</a>
              </p>
            </Box>
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