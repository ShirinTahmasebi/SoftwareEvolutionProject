import React, { Component } from 'react'
import ipfs from './ipfs'

import './DeveloperConsole.css'

class DeveloperConsole extends Component {

  constructor(props) {
    super(props);

    this.state = {
      whichItemShouldDisplay: 'consoleButtonsPage',
      buffer: null,
      ipfsHash: '',
      name: null,
      description: null,
    };
  }

  inputClicked = (event) => {
    if (event.target.id === "newApplicationButton") {
      console.log('newApplicationButton');
      this.setState({whichItemShouldDisplay: 'createApplicationPage'});
    } else if (event.target.id === "listOfApplicationsButton") {
      console.log('listOfApplicationsButton');
      this.setState({whichItemShouldDisplay: 'listOfApplicationsPage'});
    }
  }


  render() {
    let content = null;
    if (this.state.whichItemShouldDisplay === 'consoleButtonsPage') {
      content = this.getConsoleButtonsPage();
    } else if (this.state.whichItemShouldDisplay === 'createApplicationPage') {
      content = this.getCreateApplicationPage();
    } else if (this.state.whichItemShouldDisplay === 'listOfApplicationsPage') {
      content = this.getListOfApplicationsPage();
    }

    return content;
  }

  onUploadApplicationSubmit = (event) => {
    event.preventDefault();
    
    // Check whether all fields have been filled or not.
    if (!this.state.name || !this.state.description){
      alert('Fill all of the fields and try again!');
      return;
    }

    ipfs.files.add(this.state.buffer,  (error, result) => {
      if (error) {
        console.error(`onSubmit ipfs.add error is ${error}`);
        return;
      }
      this.setState({ipfsHash: result[0].hash});

      if (this.props.memberManagerContract && this.props.applicationManagerContract && this.props.accounts) {
        this.props.applicationManagerContract.addApplication(
          this.state.name, 
          this.state.description, 
          this.state.ipfsHash, 
          parseInt(this.props.memberId, 10), 
          {from: this.props.accounts[0]}
        ).then(() => {
          return this.props.applicationManagerContract.getApplicationsCount();
        }).then((applicatoinCount) => {
          return this.props.applicationManagerContract.applications(applicatoinCount);
        }).then ((application) => {
            console.log(`id => ${application[0]}`);
            console.log(`name => ${application[1]}`);
            console.log(`description => ${application[2]}`);
            console.log(`ipfsHash => ${application[3]}`);
            console.log(`memberId => ${application[4]}`);
            console.log(`likes count => ${application[5]}`);
            this.setState({whichItemShouldDisplay: 'listOfApplicationsPage'});
        });
        ; 
      }
    });
  }

  onSelectedFileChanged = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    const that = this;
    reader.onload = function(event) {
      // The file's text will be printed here
      that.setState({buffer: Buffer(reader.result)});
      console.log(that.state.buffer);
    };
  }

  handleInputChanged = (event) => {
    this.setState({
          [event.target.id]: event.target.value
      });
  }


  getConsoleButtonsPage = () => {
    return (
      <div>
        <div className="row">
          <div className="col-xs-4"></div>
          <div className="col-xs-4 body-sections row">
            <div className="col-xs-6 console-buttons-container">
              <input 
                type="button" 
                id="newApplicationButton"
                className="console-button btn btn-primary btn-lg" 
                value="Add New Application" 
                onClick={this.inputClicked}
              />
            </div>
            <div className="col-xs-6 console-buttons-container">
              <input 
                type="button" 
                id="listOfApplicationsButton"
                className="console-button btn btn-success btn-lg" 
                value="List of Applications" 
                onClick={this.inputClicked}
              />
            </div>
          </div>
          <div className="col-xs-4"></div>
        </div>
        
      </div>
      );
  }

  getCreateApplicationPage = () => {
    return (
      <div className="row">
        <div className="col-xs-2"></div>
        <div className="col-xs-8 body-sections-small-rtl-text">
          <h1>Fill the form and enter your application information:</h1>
          <form onSubmit={this.onUploadApplicationSubmit} className="form-container">
            <div className="input-field"> 
              <div className="form-group">
                <label htmlFor="name">Application Name:</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="name" 
                  onChange={this.handleInputChanged}
                />
              </div>
            </div>
            <div className="input-field"> 
              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="description" 
                  onChange={this.handleInputChanged}
                />
              </div>
            </div>
            <div className="input-field">
              <input type='file' onChange={this.onSelectedFileChanged}/>
              <br/>
              <br/>
              <br/>
              <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt=""/>
            </div>
            <br/>
            <br/>
            <br/>
            <input type="submit" className="btn btn-success btn-lg input-field"/>
          </form>
        </div>
        <div className="col-xs-2"></div>
      </div>
    );
  }

  getListOfApplicationsPage = () => {
    return (<div>List Of Applications</div>);
  }
}

export default DeveloperConsole;