import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { Button, Paper, Tabs, Tab } from '@material-ui/core';
import { Grid, Box } from '@material-ui/core';
import { Link, withRouter } from 'react-router-dom';
import { backendIP, personIssueURL, newConferenceIssueURL, updateConferenceIssueURL } from './constants';

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.mounted = false;
    this.state = {
      series: [],
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
            series: responseJson.series,
            confs: responseJson.confs,
            persons: responseJson.persons,
            orgs: responseJson.orgs,
            tabDisplay: <TopConferences confs={responseJson.confs} series={responseJson.series} />
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
        tabDisplay: <TopConferences confs={this.state.confs} series={this.state.series} />
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
            <Paper square style={{ width: 490 }}>
              <Tabs
                value={this.state.tabDisplayIndex}
                indicatorColor="primary"
                textColor="primary"
                onChange={this.handleChange}
              >
                <Tab label="Top Conferences" />
                <Tab label="Top Contributors" />
                <Tab label="Top Organizations" />
              </Tabs>
            </Paper>
          </Grid>
          <Grid item style={{ width: 1000 }}>
            {this.state.tabDisplay}
          </Grid>
        </Grid>
        <Grid container justify="center">
          <Box align="left" style={{ margin: 20, width: 800, fontSize: 14 }}>
            <div> <b>NOTE</b> </div>
            Most data on CFP-Mining is mined from individual conference call-for-papers and the accuracy and completeness of the
            information hence cannot be guaranteed.
            The code for data mining from conferences can be found at&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/shitian007/cfp-mining">cfp-mining</a>&nbsp;
            and the code for website at&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/shitian007/cfp-fe">cfp-fe</a>.
            PRs, comments and suggestions are highly welcome.<br/>
            <Grid style={{marginTop: 10}} container>
              <u>For lapses or inaccuracy of any data, please request for corresponding updates as follows:</u>
              <div>
                <b>To ADD or UPDATE Person information: </b> please submit a new issue&nbsp;
                <a target="_blank" rel="noopener noreferrer" href={personIssueURL}>here</a>
              </div>
              <div>
                <b>To ADD a new Conference: </b> please submit a new issue&nbsp;
                <a target="_blank" rel="noopener noreferrer" href={newConferenceIssueURL}>here</a><br />
              </div>
              <div>
                <b>To UPDATE Conference information: </b> please submit a new issue&nbsp;
                <a target="_blank" rel="noopener noreferrer" href={updateConferenceIssueURL}>here</a><br />
              </div>
            </Grid>
          </Box>
        </Grid>
      </div>
    )
  }
}

class TopConferences extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      displayBySeries: false,
      displayByIteration: true
    }
  }

  setDisplayBy = (displayByType) => {
    this.setState({
      displayBySeries: displayByType === 'series',
      displayByIteration: displayByType === 'iteration',
    });
  }

  render() {
    let headers = []
    let tableContent = []
    if (this.state.displayByIteration) {
      headers.push(['Conference Iteration', 'Year', 'Score'].map(headerName => {
        return <TableCell key={headerName} align="left">{headerName}</TableCell>
      }));
      tableContent = this.props.confs.map(conf => (
        <TableRow key={conf.id} align="left">
          <TableCell> <Link to={'/conf/' + conf.id}> {conf.title} </Link> </TableCell>
          <TableCell> {conf.year} </TableCell>
          <TableCell> {conf.score} </TableCell>
        </TableRow>
      ))
    } else {
      headers.push(['Conference Series', 'Score'].map(headerName => {
        return <TableCell key={headerName} align="left">{headerName}</TableCell>
      }));
      tableContent = this.props.series.map(series => (
        <TableRow key={series.id} align="left">
          <TableCell> {series.text} </TableCell>
          <TableCell> {series.score} </TableCell>
        </TableRow>
      ));
    }

    return (
      <Grid item>
        <Button
          onClick={() => this.setDisplayBy('iteration')}
          size="small" variant="outlined" color="primary"
          disabled={this.state.displayByIteration}
          style={{margin: 10}} >
          By Iteration
        </Button>
        <Button
          onClick={() => this.setDisplayBy('series')}
          size="small" variant="outlined" color="primary"
          disabled={this.state.displayBySeries}
          style={{margin: 10}} >
          By Series
        </Button>
        <Grid container justify="space-between">
          <Table size='small'>
            <TableHead>
              <TableRow style={{ background: 'lightgrey' }}>
                {headers}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableContent}
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