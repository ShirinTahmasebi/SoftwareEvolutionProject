import React, { Component } from 'react'
import ipfs from './ipfs'

import './DeveloperConsole.css'


const ITEM_0 = "consoleButtonsPage";
const BUTTON_FOR_ITEM_1 = "newApplicationButton";
const ITEM_1 = "createApplicationPage";
const BUTTON_FOR_ITEM_2 = "listOfApplicationsButton";
const ITEM_2 = "listOfApplicationsPage";

class DeveloperConsole extends Component {

  constructor(props) {
    super(props);

    this.state = {
      whichItemShouldDisplay: ITEM_0,
      buffer: null,
      ipfsHash: '',
      name: null,
      description: null,
      applications: [],
      developers: null,
      render: false,
    };
  }

  inputClicked = (event) => {
    if (event.target.id === BUTTON_FOR_ITEM_1) {
      console.log(BUTTON_FOR_ITEM_1);
      this.setState({whichItemShouldDisplay: ITEM_1});
    } else if (event.target.id === BUTTON_FOR_ITEM_2) {
      console.log(BUTTON_FOR_ITEM_2);
      this.setState({whichItemShouldDisplay: ITEM_2});
      this.getApplications(event);
    }
  }


  render() {
    let content = null;
    if (this.state.whichItemShouldDisplay === ITEM_0) {
      content = this.getConsoleButtonsPage();
    } else if (this.state.whichItemShouldDisplay === ITEM_1) {
      content = this.getCreateApplicationPage();
    } else if (this.state.whichItemShouldDisplay === ITEM_2) {
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
            this.setState({whichItemShouldDisplay: ITEM_2});
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

  getApplications = (event) => {
    this.setState({applications: [], developers: []});
    this.props.applicationManagerContract.applicationIdsByDeveloperId(parseInt(this.props.memberId, 10))
    .then( (applicationIdsString) => {
      const applicationIds = applicationIdsString.split(":");

      const addApplicationToStateListMethod = (application, developer) => {
        this.state.applications.push(application);
        this.state.developers.push(developer);
        this.setState({render: true});
      }
      
      for (let i = 1; i <= applicationIds.length; i++) {
        let application;
        this.props.applicationManagerContract.applications(applicationIds[i])
        .then( (_application) => {
          application = _application;
          return _application;
        }). then((_application) => {
          return this.props.memberManagerContract.developers(_application[4]);
        }).then((developer) => {
          addApplicationToStateListMethod(application, developer);
        });
      }
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
        <div className="col-xs-2"/>
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
        <div className="col-xs-2"/>
      </div>
    );
  }

  getListOfApplicationsPage = () => {
    const applicationListCards = this.state.applications.map(
      (application, index) => 
      <div>
        <div key={application[0]} className="row">
            <div className="col-xs-2"/>
            <div className="col-xs-8 body-sections">
              <div className="body-sections row">
                <div className="col-xs-5 console-title-container">
                  Name:
                </div>
                <div className="col-xs-7 console-content-container">
                  <h1>{application[1]}</h1>
                </div>
              </div>
              <div className="body-sections row">
                <div className="col-xs-5 console-title-container">
                  Description:
                </div>
                <div className="col-xs-7 console-content-container">
                  {application[2]}
                </div>
              </div>
              <div className="body-sections row">
                <div className="col-xs-5 console-title-container">
                  Developer Name:
                </div>
                <div className="col-xs-7 console-content-container">
                  {this.state.developers[index][1]}
                </div>
              </div>
              <br/>
              <div className="body-sections row">
                <div className="col-xs-5 console-title-container">
                  Application Preview:
                </div>
                <div className="col-xs-7 console-content-container">
                  <img src={`https://ipfs.io/ipfs/${application[3]}`} alt=""/>
                </div>
              </div>
            </div>
            <div className="col-xs-2"/>
          </div>
          <hr style={{margin: "40px"}}/>
        </div>
    );
    return (
      <div>
        {applicationListCards}
      </div>
    );
  }
}

export default DeveloperConsole;