import gscholar_icon from './assets/gscholar_icon.png';
import orcid_icon from './assets/orcid_icon.png';
import dblp_icon from './assets/dblp_icon.png';
import aminer_icon from './assets/aminer_icon.png';
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { Typography, Box } from '@material-ui/core';
import { Link, withRouter } from 'react-router-dom';
import { backendIP, personIssueURL, googleScholarBaseURL, aminerBaseURL, orcidBaseURL } from './constants'
import '../../node_modules/react-vis/dist/style.css';
import { XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, LineSeries } from 'react-vis';
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
            id: responseJson.id,
            score: responseJson.score,
            name: responseJson.name,
            org_id: responseJson.org.id,
            org: responseJson.org.text,
            external_ids: responseJson.external_ids,
            confs: responseJson.conferences
          });
          this.props.setLoadingState(false);
        }
      });
  }

  render() {

    let confs = _.sortBy(this.state.confs, c => c.score).reverse();
    let gscholar_link = '-';
    let orcid_link = '-';
    let dblp_link = '-';
    let aminer_link = '-';
    if (this.state.external_ids) {
      if (this.state.external_ids.gscholar_id) {
        gscholar_link = <a target="_blank" rel="noopener noreferrer" href={googleScholarBaseURL + this.state.external_ids.gscholar_id}>link</a>
      }
      if (this.state.external_ids.orcid) {
        orcid_link = <a target="_blank" rel="noopener noreferrer" href={orcidBaseURL + this.state.external_ids.orcid}>link</a>
      }
      if (this.state.external_ids.dblp_id) {
        dblp_link = <a target="_blank" rel="noopener noreferrer" href={this.state.external_ids.dblp_id}>link</a>
      }
      if (this.state.external_ids.aminer_id) {
        aminer_link = <a target="_blank" rel="noopener noreferrer" href={aminerBaseURL + this.state.external_ids.aminer_id}>link</a>
      }
    }

    return (
      <div style={{ marginTop: 30, display: 'flex', justifyContent: 'center' }}>
        <div>
          <Typography variant="h5" color="textPrimary">
            {this.state.name} <span style={{ fontSize: 12 }}>ID: {this.state.id}</span>
          </Typography>
          <Typography variant="h5" color="textSecondary"> Score: {this.state.score} </Typography>
          <Link to={'/org/' + this.state.org_id}>
            {this.state.org}
          </Link>
          <div style={{ margin: 30, alignContent: 'left', fontSize: 12 }}>
            <Box style={{ margin: 10 }}>
              <img style={{ height: 20 }} src={gscholar_icon} alt="google scholar" />
              &nbsp;Google Scholar:&nbsp;
              {gscholar_link}
            </Box>
            <Box style={{ margin: 10 }}>
              <img style={{ height: 20 }} src={orcid_icon} alt="orcid" />
              &nbsp;orcID:&nbsp;
              {orcid_link}
            </Box>
            <Box style={{ margin: 10 }}>
              <img style={{ height: 20 }} src={dblp_icon} alt="dblp" />
              &nbsp;dblp:&nbsp;
              {dblp_link}
            </Box>
            <Box style={{ margin: 10 }}>
              <img style={{ height: 20 }} src={aminer_icon} alt="aminer" />
              &nbsp;Aminer:&nbsp;
              {aminer_link}
            </Box>
            <div style={{ margin: 60, fontSize: 12 }}>
              *To report discrepancies and updates to researcher information, please submit an issue&nbsp;
              <a target="_blank" rel="noopener noreferrer" href={personIssueURL}>here</a>
            </div>
            <div>
              <Visualizer conferences={confs}></Visualizer>
            </div>
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

class Visualizer extends React.Component {
  render() {
    let confDict = {}
    this.props.conferences.forEach((conf) => {
      if (confDict[conf.year] == undefined) {
        confDict[conf.year] = 1;
      } else {
        confDict[conf.year] = confDict[conf.year] + 1;
      }
    });
    let dataArr = []
    for (let [key, value] of Object.entries(confDict)) {
      dataArr.push({ x: key, y: value });
    }
    console.log([...new Set(this.props.conferences.map(item => item.title))]);

    return (
      <XYPlot
        xType="ordinal"
        width={600}
        height={300}>
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis title="Year" />
        <YAxis title="Service" />
        <LineSeries
          data={dataArr}
          style={{ stroke: 'blue', strokeWidth: 3 }} />
      </XYPlot>
    )
  }
}

export default withRouter(Person);