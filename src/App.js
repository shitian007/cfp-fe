import React from 'react';
import SearchAppBar from './components/searchAppBar';
import Person from './components/person'
import Conference from './components/conference'
import Organization from './components/organization'
import Home from './components/home'
import SearchPage from './components/searchPage'
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

class Base extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      person_id: 1,
      org_id: 1,
      conf_id: 1,
      display: <Home />
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
    fetch(fetch_url, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          display: <SearchPage
            searchResults={responseJson.results}
            selectPerson={this.selectPerson}
            selectOrganization={this.selectOrganization}
            selectConference={this.selectConference}
          />
        });
      })
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
      display: <Organization
        id={org_id}
        selectPerson={this.selectPerson}
      />
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