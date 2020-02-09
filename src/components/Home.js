import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
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
          });
          this.props.setLoadingState(false);
        }
      });
  }

  render() {
    return (
      <div style={{ margin: 50 }}>
        <Grid container spacing={3}>
          <Grid item md>
            <Grid container spacing={2}>
              <Typography variant="h5" color="textPrimary">Top Conferences</Typography>
            </Grid>
            <Grid style={{ margin: 20, paddingRight: 40 }} container justify="space-between">
              <Table size='small'>
                <TableHead>
                  <TableRow style={{ background: 'lightgrey' }}>
                    <TableCell align="left">Conference Name</TableCell>
                    <TableCell align="left">Year</TableCell>
                    <TableCell align="left">Score</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.confs.map(conf => (
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

          <Grid item sm>
            <Grid container spacing={1}>
              <Typography variant="h5" color="textPrimary">Most Impactful People</Typography>
            </Grid>
            <Grid style={{ margin: 20, paddingRight: 40 }} container justify="space-between">
              <Table size='small'>
                <TableHead>
                  <TableRow style={{ background: 'lightgrey' }}>
                    <TableCell align="left">Name</TableCell>
                    <TableCell align="left">Score</TableCell>
                    <TableCell align="left">Organization</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.persons.map(person => (
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

          <Grid item sm>
            <Grid container spacing={1}>
              <Typography variant="h5" color="textPrimary">Most Impactful Organizations</Typography>
            </Grid>
            <Grid style={{ margin: 20, paddingRight: 40 }} container justify="space-between">
              <Table size='small'>
                <TableHead>
                  <TableRow style={{ background: 'lightgrey' }}>
                    <TableCell align="left">Name</TableCell>
                    <TableCell align="left">Score</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.orgs.map(org => (
                    <TableRow key={org.id} align="left">
                      <TableCell> <Link to={'/org/' + org.id}> {org.text} </Link> </TableCell>
                      <TableCell> {org.score} </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>
          </Grid>

        </Grid>
      </div>
    )
  }
}

export default withRouter(Home);