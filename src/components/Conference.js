import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import { Divider, Grid, Link, Typography } from '@material-ui/core';
import { IP } from './constants'

const styles = theme => ({
  container: {
    margin: 50
  },

  personTable: {
    marginRight: 50
  },

  personTableHeader: {
    background: 'lightgrey'
  }
});

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
          pages: responseJson.pages,
          persons: responseJson.persons
        });
      });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs>
            <Grid container spacing={1}>
              <Typography variant="h5" color="textPrimary">{this.state.title}</Typography>
            </Grid>
            <Grid container spacing={1}>
              <Table size="small">
                <TableHead>
                  <TableRow align="left">
                    <Typography>
                    Relevant URLs&nbsp;
                    </Typography>
                    </TableRow>
                </TableHead>
                <Divider variant="left" />
                <TableBody>
                  {this.state.pages.map(row => (
                    <TableRow align='left'>
                      <Link target="_blank" href={row[0]}>
                        {row[0]}
                      </Link>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>
          </Grid>
          <Grid item sm>
            <TableContainer className={classes.personTable} component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow className={classes.personTableHeader}>
                    <TableCell align="right">Person&nbsp;</TableCell>
                    <TableCell align="right">Organization&nbsp;</TableCell>
                    <TableCell align="right">Role&nbsp;</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.persons.map(row => (
                    <TableRow key={row.person_id}>
                      <TableCell align="right">{row.name}</TableCell>
                      <TableCell align="right">{row.org}</TableCell>
                      <TableCell align="right">{row.role}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles)(Conference);