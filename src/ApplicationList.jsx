import React, {Component} from 'react';

class ApplicationList extends Component {
  render() {
    const applicationListCards = this.props.applications.map(
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
              {(this.props.developers) ?
                (<div className="body-sections row">
                  <div className="col-xs-5 console-title-container">
                    Developer Name:
                  </div>
                  <div className="col-xs-7 console-content-container">
                    {this.props.developers[index][1]}
                  </div>
                </div>) : ''}
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
  }
}

export default ApplicationList;