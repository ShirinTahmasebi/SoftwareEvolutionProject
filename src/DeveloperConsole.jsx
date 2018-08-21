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
    ipfs.files.add(this.state.buffer,  (error, result) => {
      if (error) {
        console.error(`onSubmit ipfs.add error is ${error}`);
        return;
      }
      this.setState({ipfsHash: result[0].hash});

      if (this.props.memberManagerContract && this.props.applicationManagerContract && this.props.accounts) {
        this.props.applicationManagerContract.addApplication(
          'name', 
          'description', 
          this.state.ipfsHash, 
          parseInt(this.props.memberId, 10), 
          {from: this.props.accounts[0]}
        ).then(() => {
          return this.props.applicationManagerContract.applications(1);
        }).then ((application) => {
            console.log(`id => ${application[0]}`);
            console.log(`name => ${application[1]}`);
            console.log(`description => ${application[2]}`);
            console.log(`ipfsHash => ${application[3]}`);
            console.log(`memberId => ${application[4]}`);
            console.log(`likes count => ${application[5]}`);
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
      <div>
        <div>
            <div>
              <h1>Your Application: </h1>
              <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt=""/>
              <h1>Upload Your Application:</h1>
              <form onSubmit={this.onUploadApplicationSubmit}>
                <input type='file' onChange={this.onSelectedFileChanged}/>
                <input type='submit'/>
              </form>
            </div>
          </div>
      </div>
    );
  }

  getListOfApplicationsPage = () => {
    return (<div>List Of Applications</div>);
  }
}

export default DeveloperConsole;