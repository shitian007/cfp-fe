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
      persons: []
    }
    this.getOrganizationInfo();
  }

  getOrganizationInfo = () => {
    let fetch_url = IP + 'org?id=' + this.state.id;
    fetch(fetch_url, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          name: responseJson.name,
          persons: responseJson.persons
        });
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
                  <Link onClick={() => this.props.selectPerson(person.id)}>
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

export default Organization;