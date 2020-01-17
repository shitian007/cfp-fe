import React from 'react';
import SearchAppBar from './components/SearchAppBar';
import Person from './components/Person'
import Conference from './components/Conference'
import Organization from './components/Organization'
import { IP } from './components/constants'
import './App.css';

export default App;

function App() {
  return (
    <div className="App">
      <Base />
    </div>
  );
}

class Home extends React.Component {
  render() {
    return (
      <div>HOME</div>
    )
  }
}

class Base extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      person_id: 1,
      org_id: 1,
      conf_id: 1,
      display: <Conference
        id={1}
        selectPerson={this.selectPerson}
        selectOrganization={this.selectOrganization}
      />
    }
    this.search = this.search.bind(this);
    this.selectPerson = this.selectPerson.bind(this);
    this.selectOrganization = this.selectOrganization.bind(this);
    this.selectConference = this.selectConference.bind(this);
  }

  search = (searchVal) => {
    this.getResults(searchVal)
  }

  getResults = (searchVal) => {
    let fetch_url = IP + 'search?search_val=' + searchVal;
    this.setState({
      display: <Home />
    });
  }

  selectPerson = (person_id) => {
    this.setState({
      person_id: person_id,
      display: <Person id={person_id} />
    });
  }
  selectOrganization = (org_id) => {
    this.setState({
      org_id: org_id,
      display: <Organization id={org_id} />
    });
  }
  selectConference = (conf_id) => {
    this.setState({
      conf_id: conf_id,
      display: <Conference
        id={conf_id}
        selectPerson={this.selectPerson}
        selectOrganization={this.selectOrganization}
      />
    });
  }

  changeDisplayType = (displayType) => {
    this.setState({
      display: displayType
    });
  }

  render() {
    return (
      <div style={{ margin: 10 }}>
        <SearchAppBar
          search={this.search}
         />
        {this.state.display}
      </div>
    )
  }
}