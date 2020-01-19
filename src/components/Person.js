import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Link, Typography } from '@material-ui/core';
import { IP } from './constants'

class Organization extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      name: '',
      org: '',
      confs: []
    }
    this.getPersonInfo();
  }

  getPersonInfo = () => {
    let fetch_url = IP + 'person?id=' + this.state.id;
    fetch(fetch_url, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          name: responseJson.name,
          org_id: responseJson.org.id,
          org: responseJson.org.text,
          confs: responseJson.conferences
        });
      });
  }
  render() {
    return (
      <div style={{ marginTop: 30, display: 'flex', justifyContent: 'center' }}>
        <div>
          <Typography variant="h5" color="textPrimary">{this.state.name}</Typography>
          <Link onClick={() => this.props.selectOrganization(this.state.org_id)}>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.confs.map((conf, index) => (
              <TableRow key={conf.id}>
                <TableCell>
                  <Link onClick={() => this.props.selectConference(conf.id)}>
                    {conf.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <Typography>{conf.role}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default Organization;