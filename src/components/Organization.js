import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Typography } from '@material-ui/core';
import { Link, withRouter } from 'react-router-dom';
import { backendIP } from './constants'

class Organization extends React.Component {
  constructor(props) {
    super(props);
    this.mounted = false;
    this.state = {
      name: '',
      persons: []
    }
    this.getOrganizationInfo();
  }

  componentDidMount() {
    this.mounted = true;
    this.unlisten = this.props.history.listen((location, action) => {
      this.getOrganizationInfo();
    });
  }

  componentWillUnmount() {
    this.mounted = false;
    this.unlisten();
  }

  getOrganizationInfo = () => {
    let fetch_url = backendIP + 'org?id=' + this.props.match.params.id;
    fetch(fetch_url, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (this.mounted) {
          this.setState({
            name: responseJson.name,
            persons: responseJson.persons
          });
        }
      });
  }
  render() {
    return (
      <div style={{ margin: 30, display: 'flex', justifyContent: 'center' }}>
        <div>
          <Typography variant="h5" color="textPrimary">{this.state.name}</Typography>
        </div>
        <Table style={{ width: 500 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="body1" color="textSecondary">Persons</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.persons.map(person => (
              <TableRow key={person.id}>
                <TableCell>
                  <Link to={'/person/' + person.id}>
                    {person.text}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default withRouter(Organization);