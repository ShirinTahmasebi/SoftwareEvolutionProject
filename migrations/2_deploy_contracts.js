var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var MemberManager = artifacts.require("./MemberManager.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(MemberManager);
};
