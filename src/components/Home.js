import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { Paper, Tabs, Tab } from '@material-ui/core';
import { Grid, Box } from '@material-ui/core';
import { Link, withRouter } from 'react-router-dom';
import { backendIP, personIssueURL, newConferenceIssueURL, updateConferenceIssueURL } from './constants';

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
        <Grid container justify="center">
          <Grid container justify="center">
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
          </Grid>
          <Grid item style={{ width: 1000 }}>
            {this.state.tabDisplay}
          </Grid>
        </Grid>
        <Grid container justify="center">
          <Box style={{ margin: 20, width: 800, fontSize: 14 }}>
            <div> <b>NOTE</b> </div>
            Most data on CFP-Mining is mined from individual conference call-for-papers and the verity of the information hence cannot be guaranteed.
            The code for data mining from conferences can be found at&nbsp;
            <a target="_blank" href="https://github.com/shitian007/cfp-mining">cfp-mining</a>&nbsp;
            and the code for website at&nbsp;
            <a target="_blank" href="https://github.com/shitian007/cfp-fe">cfp-fe</a>.<br/>
            <Grid container>
              <br/>For lapses or inaccuracy of any data, please request for corresponding updates as follows:
              <div>
                <b>To ADD or UPDATE Person information: </b> please submit a new issue&nbsp;
                <a target="_blank" href={personIssueURL}>here</a>
              </div>
              <div>
                <b>To ADD a new Conference: </b> please submit a new issue&nbsp;
                <a target="_blank" href={newConferenceIssueURL}>here</a><br />
              </div>
              <div>
                <b>To UPDATE Conference information: </b> please submit a new issue&nbsp;
                <a target="_blank" href={updateConferenceIssueURL}>here</a><br />
              </div>
            </Grid>
          </Box>
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