import React from 'react';
import './App.css';
import SearchAppBar from './components/SearchAppBar';
import Person from './components/Person'
import Conference from './components/Conference'
import Organization from './components/Organization'

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
      display: ''
    }
  }

  displayInfo = () => {
    if (this.state.display == 'Person') {
      return <Person />
    } else if (this.state.display == 'Organization') {
      return <Organization />
    } else if (this.state.display == 'Conference') {
      return <Conference />
    } else {
      return <Home />
    }
  };


  render() {
    return (
      <div>
        <SearchAppBar />
        {this.displayInfo()}
      </div>
    )
  }
}