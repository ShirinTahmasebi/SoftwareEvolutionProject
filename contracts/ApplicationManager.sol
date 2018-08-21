pragma solidity 0.4.24;

contract ApplicationManager {

	// Model applicatoins
	struct Application {
		uint id;
		string name;
		string description;
		string ipfsHash;
		uint developerId;
		uint likeCounts;
	}

	// Store & fetch applicatoins
	mapping (uint => Application) public applications;

	// Get developer id of each applicatoin by application id
	mapping (uint => uint) public developerIdByApplicationId; 

	// Get IPFS hash of each application by application id
	mapping (uint => string) public IPFSHashByApplicationId; 

	// Store applications count
	uint public applicationsCount;
	 
	function getApplicationsCount() public view returns (uint) {
    	return applicationsCount;
  	}

	// Constructor
	function ApplicationManager() public {
	}

	// Add application
	function addApplication(string _name, string _description, string _ipfsHash, uint _developerId) public {
		applicationsCount ++;
		applications[applicationsCount] = Application(applicationsCount, _name, _description, _ipfsHash, _developerId, 0);
		developerIdByApplicationId[applicationsCount] = _developerId;
		IPFSHashByApplicationId[applicationsCount] = _ipfsHash;
	}
}