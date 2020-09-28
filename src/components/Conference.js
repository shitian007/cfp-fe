import React from 'react';
import { Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import MUIDataTable from "mui-datatables";
import { Grid, Typography, Chip } from '@material-ui/core';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withRouter } from 'react-router-dom';
import { backendIP, updateConferenceIssueURL } from './constants';
import SeriesPopover from './SeriesPopover';
import { urlInfo } from './utils';

class Conference extends React.Component {
  constructor(props) {
    super(props);
    this.mounted = false;
    this.state = {
      id: this.props.id,
      title: '',
      topics: [],
      pages: [],
      persons: [],
      score: '',
      series: '',
      sister_confs: []
    }
    this.getConferenceInfo();
  }

  componentDidMount() {
    this.mounted = true;
    this.unlisten = this.props.history.listen((location, action) => {
      this.getConferenceInfo();
    });
    this.props.setLoadingState(true);
  }

  componentWillUnmount() {
    this.mounted = false;
    this.unlisten();
  }

  getConferenceInfo = () => {
    let [fetch_type, fetch_id] = urlInfo(window.location.href);
    let fetch_url = backendIP + 'conf?id=' + fetch_id;
    if (fetch_type === "conf") {
      fetch(fetch_url, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((responseJson) => {
          if (this.mounted) {
            this.setState({
              id: responseJson.id,
              title: responseJson.title,
              topics: responseJson.topics,
              pages: responseJson.pages,
              persons: responseJson.persons,
              score: responseJson.score,
              series: responseJson.series,
              sister_confs: responseJson.sister_confs
            });
            this.props.setLoadingState(false);
          }
        });
    }
  }

  render() {
    let topics = []
    if (this.state.topics.length !== 0) {
      this.state.topics.forEach((row, index) => {
        topics.push(
          <Chip style={{ marginRight: 20 }} key={row} label={row}></Chip>
        )
      })
    } else {
      topics.push(<Typography color="textSecondary" key='no-topic'>No labelled topics</Typography>)
    }
    return (
      <div style={{ margin: 50 }}>
        <Grid container spacing={3}>
          <Grid item xs>
            <Grid container justify="center" style={{ marginBottom: 10 }}>
              <SeriesPopover seriesTitle={this.state.series} conferences={this.state.sister_confs} />
            </Grid>
            <Grid container spacing={1} justify="center">
              <Typography variant="h5" color="textPrimary">
                {this.state.title} <span style={{ fontSize: 12 }}>ID: {this.state.id}</span>
              </Typography>
            </Grid>
            <Grid style={{ marginTop: 10 }}>
              <Typography variant="h5" color="textSecondary"> Score: {this.state.score} </Typography>
            </Grid>
            <Grid style={{ margin: 10 }} container justify="center">
              {topics}
            </Grid>
            <div style={{ margin: 60, fontSize: 12 }}>
              *To report discrepancies and updates to conference information, please submit an issue&nbsp;
              <a target="_blank" rel="noopener noreferrer" href={updateConferenceIssueURL}>here</a>
            </div>
            <Grid container spacing={1}>
              <ConferenceInfo pages={this.state.pages} />
            </Grid>
          </Grid>
          <Grid item sm>
            <ConferencePersons
              persons={this.state.persons}
              selectPerson={this.props.selectPerson}
              selectOrganization={this.props.selectOrganization}
            />
          </Grid>
        </Grid>
      </div>
    )
  }
}

class ConferenceInfo extends React.Component {
  render() {
    return (
      <ExpansionPanel style={{ width: "100%" }}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Relevant URLs</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Table size="small">
            <TableBody>
              {this.props.pages.map(row => (
                <TableRow key={row[0]}>
                  <TableCell>
                    <a target="_blank" rel="noopener noreferrer" href={row[0]}>
                      {row[0]}
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    )
  }
}
export default withRouter(Conference);

class ConferencePersons extends React.Component {
  // Customize filter options
  // Allow sorting by score
  constructor(props) {
    super(props);
    this.state = {
      title: "Service Members",
      columns: ["Name", "Organization", "Role"],
      options: {
        onCellClick: (colData) => {
          console.log(colData);
        },
        filter: false,
        filterType: 'checkbox',
      }
    }
  }

  UNSAFE_componentWillReceiveProps() {
    let personData = this.props.persons.map((p) => {
      let modifiedPerson = p;
      modifiedPerson.Name = p.name;
      modifiedPerson.Organization = p.org;
      modifiedPerson.Role = p.role;
      return modifiedPerson
    });
    this.setState({
      data: personData
    });
  }

  render() {
    console.log(this.state.data);
    return (
      <MUIDataTable
        title={this.state.title}
        data={this.state.data}
        columns={this.state.columns}
        options={this.state.options}
      />
    );
  }
}

// class ConferencePersons extends React.Component {

//   constructor(props) {
//     super(props);
//     this.state = {
//       data: []
//     }
//   }

//   UNSAFE_componentWillReceiveProps() {
//     this.groupBy("Person");
//   }

//   groupBy = (type) => {
//     let sortedData = []
//     if (type === "Person") {
//       sortedData = _.sortBy(this.props.persons, p => p.score).reverse()
//     } else if (type === "Person-Alphabetical") {
//       sortedData = _.sortBy(this.props.persons, p => p.score).reverse()
//     } else if (type === "Organization-Score") {
//       sortedData = _.sortBy(this.props.persons, p => p.score).reverse()
//     } else if (type === "Organization-Alphabetical") {
//       sortedData = _.sortBy(this.props.persons, p => p.score).reverse()
//     } else if (type === "Role") {
//       sortedData = _.sortBy(this.props.persons, p => p.score).reverse()
//     }
//     this.setState({
//       data: sortedData
//     });
//   }

//   render() {
//     return (
//       <TableContainer style={{ marginRight: 50 }} component={Paper}>
//         <Table size="small">
//           <TableHead>
//             <TableRow style={{ background: 'lightgrey' }}>
//               <TableCell align="right">Person&nbsp;[Score]</TableCell>
//               <TableCell align="right">Organization&nbsp;[Score]</TableCell>
//               <TableCell align="right">Role&nbsp;</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {this.state.data.map(person => (
//               <TableRow key={person.role + person.id}>
//                 <TableCell align="right">
//                   <Link to={'/person/' + person.id}>
//                     {person.name}
//                   </Link>
//                   &nbsp;[{person.score}]
//                 </TableCell>
//                 <TableCell align="right">
//                   <Link to={'/org/' + person.org_id}>
//                     {person.org}
//                   </Link>
//                   &nbsp;[{person.org_score}]
//                 </TableCell>
//                 <TableCell align="right">{person.role}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     )
//   }
// }
