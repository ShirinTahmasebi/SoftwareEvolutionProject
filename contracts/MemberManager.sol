pragma solidity 0.4.24;

contract MemberManager {
	// Model developers
	struct Developer {
		uint id;
		string username;
		string password;
	}

	// Model users
	struct User {
		uint id;
		string username;
		string password;
	}

	// Model admin
	struct Admin {
		uint id;
		string username;
		string password;
	}

	// Store & fetch developers
	mapping (uint => Developer) public developers; 

	// Store & fetch users
	mapping (uint => User) public users; 

	// Store developers count
	uint public developersCount;

	// Store users count
	uint public usersCount;
	 
	function getUsersCount() public view returns (uint) {
    	return usersCount;
  	}

  	function getDevelopersCount() public view returns (uint) {
    	return developersCount;
  	}

	// Constructor
	function MemberManager() public {
		addUser('user1', '123');
		addUser('user2', '123');
		addDeveloper('developer1', '123');
		addDeveloper('developer2', '123');
	}

	// Add user
	function addUser(string _username, string _password) private {
		usersCount ++;
		users[usersCount] = User(usersCount, _username, _password);
	}

	// Add developer
	function addDeveloper(string _username, string _password) public {
		developersCount ++;
		developers[developersCount] = Developer(developersCount, _username, _password);
	}

	// Sign up developers
	function signUp(string _username, string _password, bool isDeveloper) public {
		if (isDeveloper) {
			addDeveloper(_username, _password);
		} else {
			addUser(_username, _password);
		}
	}
}