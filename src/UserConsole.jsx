import React, {Component} from 'react';
import ipfs from './ipfs';

import './UserConsole.css';
import ApplicationList from "./ApplicationList";

class UserConsole extends Component {

  constructor(props) {
    super(props);

    this.state = {
      whichItemShouldDisplay: 'listOfApplicationsPage',
      buffer: null,
      ipfsHash: '',
      name: null,
      description: null,
      applications: [],
      developers: [],
      render: false,
    };

    this.getApplications();
  }

  render() {
    let content = null;
    content = this.getListOfApplicationsPage();
    return content;
  }

  onUploadApplicationSubmit = (event) => {
    event.preventDefault();

    // Check whether all fields have been filled or not.
    if (!this.state.name || !this.state.description) {
      alert('Fill all of the fields and try again!');
      return;
    }

    ipfs.files.add(this.state.buffer, (error, result) => {
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
          {from: this.props.accounts[0]},
        ).then(() => {
          return this.props.applicationManagerContract.getApplicationsCount();
        }).then((applicatoinCount) => {
          return this.props.applicationManagerContract.applications(applicatoinCount);
        }).then(() => {
          this.setState({whichItemShouldDisplay: 'listOfApplicationsPage'});
        });
      }
    });
  };

  onSelectedFileChanged = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    const that = this;
    reader.onload = function () {
      // The file's text will be printed here
      that.setState({buffer: Buffer(reader.result)});
      console.log(that.state.buffer);
    };
  };

  handleInputChanged = (event) => {
    this.setState({
      [event.target.id]: event.target.value,
    });
  };

  getApplications = () => {
    this.setState({applications: [], developers: []});
    this.props.applicationManagerContract.applicationIdsByDeveloperId(parseInt(this.props.memberId, 10))
      .then((applicationIdsString) => {
        const applicationIds = applicationIdsString.split(":");

        const addApplicationToStateListMethod = (application, developer) => {
          this.state.applications.push(application);
          this.state.developers.push(developer);
          this.setState({render: true});
        };

        for (let i = 1; i <= applicationIds.length; i++) {
          let application;
          this.props.applicationManagerContract.applications(applicationIds[i])
            .then((_application) => {
              application = _application;
              return _application;
            }).then((_application) => {
            return this.props.memberManagerContract.developers(_application[4]);
          }).then((developer) => {
            addApplicationToStateListMethod(application, developer);
          });
        }
      });
  };

  getListOfApplicationsPage = () => {
    return <ApplicationList applications={this.state.applications} developers={this.state.developers}/>;
  };
}

export default UserConsole;