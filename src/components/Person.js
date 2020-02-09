import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Typography } from '@material-ui/core';
import { Link, withRouter } from 'react-router-dom';
import { backendIP } from './constants'
import _ from 'lodash';

class Person extends React.Component {
  constructor(props) {
    super(props);
    this.mounted = false;
    this.state = {
      name: '',
      org: '',
      confs: []
    }
    this.getPersonInfo();
  }

  componentDidMount() {
    this.mounted = true;
    this.unlisten = this.props.history.listen((location, action) => {
      this.getPersonInfo();
    });
    this.props.setLoadingState(true);
  }

  componentWillUnmount() {
    this.mounted = false;
    this.unlisten();
  }

  getPersonInfo = () => {
    let fetch_url = backendIP + 'person?id=' + this.props.match.params.id;
    fetch(fetch_url, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (this.mounted) {
          this.setState({
            score: responseJson.score,
            name: responseJson.name,
            org_id: responseJson.org.id,
            org: responseJson.org.text,
            confs: responseJson.conferences
          });
          this.props.setLoadingState(false);
        }
      });
  }

  render() {

    let confs = _.sortBy(this.state.confs, c => c.score).reverse();

    return (
      <div style={{ marginTop: 30, display: 'flex', justifyContent: 'center' }}>
        <div>
          <Typography variant="h5" color="textPrimary">{this.state.name}</Typography>
          <Typography variant="h5" color="textSecondary"> Score: {this.state.score} </Typography>
          <Link to={'/org/' + this.state.org_id}>
            {this.state.org}
          </Link>
        </div>
        <Table style={{ width: 800 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="body2" color="textSecondary">Conference</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="textSecondary">Role</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="textSecondary">Score</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {confs.map((conf, index) => (
              <TableRow key={conf.id + conf.role}>
                <TableCell>
                  <Link to={'/conf/' + conf.id}>
                    {conf.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <Typography>{conf.role}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{conf.score}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default withRouter(Person);