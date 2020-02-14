import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { Link, withRouter } from 'react-router-dom';
import { backendIP } from './constants'
import _ from 'lodash';

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
    this.props.setLoadingState(true);
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
            id: responseJson.id,
            name: responseJson.name,
            score: responseJson.score,
            persons: responseJson.persons
          });
          this.props.setLoadingState(false);
        }
      });
  }
  render() {
    let persons = _.sortBy(this.state.persons, p => p.score).reverse();
    return (
      <div style={{ margin: 30, display: 'flex', justifyContent: 'center' }}>
        <div>
          <Typography variant="h5" color="textPrimary">
            {this.state.name} <span style={{fontSize: 12}}>ID: {this.state.id}</span>
          </Typography>
          <Typography variant="h5" color="textSecondary">Score: {this.state.score}</Typography>
        </div>
        <Table style={{ width: 500 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="body1" color="textSecondary">Person</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" color="textSecondary">Score</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {persons.map(person => (
              <TableRow key={person.id}>
                <TableCell>
                  <Link to={'/person/' + person.id}> {person.text} </Link>
                </TableCell>
                <TableCell>
                  {person.score}
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