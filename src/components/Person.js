import gscholar_icon from './assets/gscholar_icon.png';
import orcid_icon from './assets/orcid_icon.png';
import aminer_icon from './assets/aminer_icon.png';
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { Typography, Box } from '@material-ui/core';
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
          <div style={{ margin: 50, alignContent: 'left', fontSize: 12 }}>
            <Box style={{ margin: 10 }}>
              <img style={{ height: 20 }} src={gscholar_icon} alt="google scholar" />
              Google Scholar:&nbsp;
              <a target="_black" rel="noopener noreferrer" href={"https://www.google.com"}>
                {"Placeholder"}
              </a>
            </Box>
            <Box style={{ margin: 10 }}>
              <img style={{ height: 20 }} src={orcid_icon} alt="orcid" />
              orcID:&nbsp;
              <a target="_black" rel="noopener noreferrer" href={"https://www.orcid.org"}>
                {"Placeholder"}
              </a>
            </Box>
            <Box style={{ margin: 10 }}>
              <img style={{ height: 20 }} src={aminer_icon} alt="aminer" />
              Aminer:&nbsp;
              <a target="_black" rel="noopener noreferrer" href={"https://www.aminer.cn"}>
                {"Placeholder"}
              </a>
            </Box>
          </div>
        </div>
        <Table style={{ width: 800 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="body1" color="textSecondary">Conference</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" color="textSecondary">Role</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" color="textSecondary">Score</Typography>
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
                  <Typography variant="body2">{conf.role}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{conf.score}</Typography>
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