import React, {Component} from 'react';
import ipfs from './ipfs';

import './UserConsole.css';

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
    this.setState({applications: []});
    this.props.applicationManagerContract.getApplicationsCount()
      .then((applicatoinCount) => {
        const addApplicationToStateListMethod = (application) => {
          this.state.applications.push(application);
          this.setState({render: true});
        };

        for (let i = 1; i <= applicatoinCount; i++) {
          this.props.applicationManagerContract.applications(i)
            .then((application) => {
              addApplicationToStateListMethod(application);
            });
        }
      });
  };

  getListOfApplicationsPage = () => {
    const applicationListCards = this.state.applications.map(
      (application) =>
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
        </div>,
    );
    return (
      <div>
        {applicationListCards}
      </div>
    );
  };
}

export default UserConsole;