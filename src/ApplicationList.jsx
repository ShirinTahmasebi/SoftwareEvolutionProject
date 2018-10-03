import React, {Component} from 'react';
import './ApplicationList.css';


class ApplicationList extends Component {
  render() {
    let application1 = null;
    let application2 = null;
    const applicationListCards = this.props.applications.map(
      (application, index) => {
        if (index % 2 === 0) {
          application1 = application;
          if ((this.props.applications.length - 1) === index) {
            return this.drawRowOfApplications(application1, null, index, -1);
          } else {
            return null;
          }
        } else {
          application2 = application;
          return this.drawRowOfApplications(application1, application2, index - 1, index);
        }
      },
    );
    return (
      <div>
        <div style={{height: '30px'}}/>
        <div className="table-container">
          <div className="table-header">
            <div className="col-xs-4 table-header-sections"/>
            <div className="col-xs-4 table-header-sections table-header-title">Applications List</div>
            <div className="col-xs-4 table-header-sections header-login">
              {(this.props.onBackButtonClicked) ?
                <input type="button" className="login-button btn btn-default btn-lg" value="Back"
                       onClick={this.props.onBackButtonClicked}/> : ''}
            </div>
          </div>
          <div className="table-body">
            {applicationListCards}
          </div>
        </div>
      </div>
    );
  }

  drawRowOfApplications = (application1, application2, index1, index2) => {
    return (
      <div className="application-cards-row-container">
        <div className="application-card">
          {this.applicationCard(application1, index1)}
        </div>
        {
          (application2) ?
            <div className="application-card">
              {this.applicationCard(application2, index2)}
            </div> : ''
        }
      </div>
    );
  };

  applicationCard = (application, index) => {
    return (
      <div key={application[0]}>
        <div className="application-image-container">
          <img src={`https://ipfs.io/ipfs/${application[3]}`} alt=""/>
        </div>
        <div className="application-title-container">
          <span className="title-style">Name:</span>
          <span className="value-style">{application[1]}</span>
        </div>
        <div className="application-title-container">
          <span className="title-style">Description:</span>
          <span className="value-style">{this.truncate.apply(application[2], [20, true])}</span>
        </div>
        {(this.props.developers) ?
          (
            <div className="application-title-container">
              <span className="title-style">Developer Name:</span>
              <span className="value-style">{this.props.developers[index][1]}</span>
            </div>
          ) : ''}
        <div className="application-download-button-container">
          <a
            className="download-button btn btn-success btn-lg"
            href={`https://ipfs.io/ipfs/${application[3]}`}
          >
            Download
          </a>
        </div>
      </div>
    );

  };

  truncate(n, useWordBoundary) {
    if (this.length <= n) {
      return this;
    }
    let subString = this.substr(0, n - 1);
    return (useWordBoundary
      ? subString.substr(0, subString.lastIndexOf(' '))
      : subString) + "...";
  };
}

export default ApplicationList;