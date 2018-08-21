var MemberManager = artifacts.require("./MemberManager.sol");

module.exports = function(deployer) {
  deployer.deploy(MemberManager);
};
