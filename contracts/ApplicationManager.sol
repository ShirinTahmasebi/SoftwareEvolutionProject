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

	// Get all applicatoins which belong to a specific developerId
	mapping (uint => string) public applicationIdsByDeveloperId; 

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
		applicationIdsByDeveloperId[_developerId] = strConcat(applicationIdsByDeveloperId[_developerId], ":", uint2str(applicationsCount));
	}

	function strConcat(string _a, string _b, string _c, string _d, string _e) internal returns (string){
	    bytes memory _ba = bytes(_a);
	    bytes memory _bb = bytes(_b);
	    bytes memory _bc = bytes(_c);
	    bytes memory _bd = bytes(_d);
	    bytes memory _be = bytes(_e);
	    string memory abcde = new string(_ba.length + _bb.length + _bc.length + _bd.length + _be.length);
	    bytes memory babcde = bytes(abcde);
	    uint k = 0;
	    for (uint i = 0; i < _ba.length; i++) babcde[k++] = _ba[i];
	    for (i = 0; i < _bb.length; i++) babcde[k++] = _bb[i];
	    for (i = 0; i < _bc.length; i++) babcde[k++] = _bc[i];
	    for (i = 0; i < _bd.length; i++) babcde[k++] = _bd[i];
	    for (i = 0; i < _be.length; i++) babcde[k++] = _be[i];
	    return string(babcde);
	}

	function strConcat(string _a, string _b, string _c, string _d) internal returns (string) {
	    return strConcat(_a, _b, _c, _d, "");
	}

	function strConcat(string _a, string _b, string _c) internal returns (string) {
	    return strConcat(_a, _b, _c, "", "");
	}

	function strConcat(string _a, string _b) internal returns (string) {
	    return strConcat(_a, _b, "", "", "");
	}

	function uint2str(uint i) internal pure returns (string){
	    if (i == 0) return "0";
	    uint j = i;
	    uint length;
	    while (j != 0){
	        length++;
	        j /= 10;
	    }
	    bytes memory bstr = new bytes(length);
	    uint k = length - 1;
	    while (i != 0){
	        bstr[k--] = byte(48 + i % 10);
	        i /= 10;
	    }
	    return string(bstr);
	}
}