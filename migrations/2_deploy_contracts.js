var MemberManager = artifacts.require("./MemberManager.sol");
var ApplicationManager = artifacts.require("./ApplicationManager.sol");

module.exports = function(deployer) {
  deployer.deploy(MemberManager);
  deployer.deploy(ApplicationManager);
};
