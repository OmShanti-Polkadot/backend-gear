import { ApiPromise, WsProvider } from '@polkadot/api';

const POLKADOT_WS_URL = 'wss://rpc.polkadot.io';

async function createPolicy() {
  const wsProvider = new WsProvider(POLKADOT_WS_URL);
  const api = await ApiPromise.create({ provider: wsProvider });

  // Set up the contract instance
  const contractAddress = '0x1234567890123456789012345678901234567890';
  const contractAbi = [{"type":"event","name":"Transfer","inputs":[{"type":"address","name":"from","indexed":true},{"type":"address","name":"to","indexed":true},{"type":"uint256","name":"tokenId","indexed":true}],"anonymous":false},{"type":"function","name":"create_policy","inputs":[{"type":"tuple","name":"policy","components":[{"type":"string","name":"policy_holder_name"},{"type":"string","name":"policy_number"},{"type":"string","name":"coverage_details"},{"type":"u64","name":"expiration_date"}]}],"outputs":[{"type":"bool","name":""}]},{"type":"function","name":"get_policy","inputs":[{"type":"address","name":"owner"}],"outputs":[{"type":"tuple","name":"","components":[{"type":"string","name":"policy_holder_name"},{"type":"string","name":"policy_number"},{"type":"string","name":"coverage_details"},{"type":"u64","name":"expiration_date"}]}]}];

  const contractInstance = await api.contract.at(contractAddress, contractAbi);

  // Set up the policy object
  const policy = {
    policy_holder_name: 'Alice',
    policy_number: '12345',
    coverage_details: 'Health insurance coverage',
    expiration_date: 1735689600, // June 1, 2025
  };

  // Send the create_policy transaction
  const tx = contractInstance.tx.create_policy(policy);
  const txHash = await tx.signAndSend('Alice');

  console.log(`Transaction hash: ${txHash}`);
}

async function getPolicy() {
  const wsProvider = new WsProvider(POLKADOT_WS_URL);
  const api = await ApiPromise.create({ provider: wsProvider });

  // Set up the contract instance
  const contractAddress = '0x1234567890123456789012345678901234567890';
  const contractAbi = [{"type":"event","name":"Transfer","inputs":[{"type":"address","name":"from","indexed":true},{"type":"address","name":"to","indexed":true},{"type":"uint256","name":"tokenId","indexed":true}],"anonymous":false},{"type":"function","name":"create_policy","inputs":[{"type":"tuple","name":"policy","components":[{"type":"string","name":"policy_holder_name"},{"type":"string","name":"policy_number"},{"type":"string","name":"coverage_details"},{"type":"u64","name":"expiration_date"}]}],"outputs":[{"type":"bool","name":""}]},{"type":"function","name":"get_policy","inputs":[{"type":"address","name":"owner"}],"outputs":[{"type":"tuple","name":"","components":[{"type":"string","name":"policy_holder_name"},{"type":"string","name":"policy_number"},{"type":"string",";
}

