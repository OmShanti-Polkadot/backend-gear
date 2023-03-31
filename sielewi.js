import React, { useState } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';

function App() {
  const [policy, setPolicy] = useState(null);
  const [policyNumber, setPolicyNumber] = useState('');

  const wsProvider = new WsProvider('ws://localhost:9944');
  const contractAddress = '0x1234567890123456789012345678901234567890';
  const contractAbi = [{"type":"event","name":"Transfer","inputs":[{"type":"address","name":"from","indexed":true},{"type":"address","name":"to","indexed":true},{"type":"uint256","name":"tokenId","indexed":true}],"anonymous":false},{"type":"function","name":"create_policy","inputs":[{"type":"tuple","name":"policy","components":[{"type":"string","name":"policy_holder_name"},{"type":"string","name":"policy_number"},{"type":"string","name":"coverage_details"},{"type":"u64","name":"expiration_date"}]}],"outputs":[{"type":"bool","name":""}]},{"type":"function","name":"get_policy","inputs":[{"type":"address","name":"owner"}],"outputs":[{"type":"tuple","name":"","components":[{"type":"string","name":"policy_holder_name"},{"type":"string","name":"policy_number"},{"type":"string","name":"coverage_details"},{"type":"u64","name":"expiration_date"}]}]}];

  async function createPolicy() {
    const api = await ApiPromise.create({ provider: wsProvider });
    const contractInstance = await api.contract.at(contractAddress, contractAbi);

    const policyHolderName = 'Alice';
    const coverageDetails = 'Health insurance coverage';
    const expirationDate = 1735689600; // June 1, 2025

    const policy = {
      policy_holder_name: policyHolderName,
      policy_number: policyNumber,
      coverage_details: coverageDetails,
      expiration_date: expirationDate,
    };

    const tx = contractInstance.tx.create_policy(policy);
    const txHash = await tx.signAndSend('Alice');

    console.log(`Transaction hash: ${txHash}`);
  }

  async function getPolicy() {
    const api = await ApiPromise.create({ provider: wsProvider });
    const contractInstance = await api.contract.at(contractAddress, contractAbi);

    const policy = await contractInstance.query.get_policy('Alice');

    setPolicy(policy);
  }

  return (
    <div>
      <h1>Create Policy</h1>
      <label htmlFor="policy-number">Policy Number:</label>
      <input
        type="text"
        id="policy-number"
        value={policyNumber}
        onChange={(event) => setPolicyNumber(event.target.value)}
      />
      <button onClick={createPolicy}>Create Policy</button>

      <h1>Get Policy</h1>
      <button onClick={getPolicy}>Get Policy</button>
      {policy && (
        <div>
          <p>Policy Holder Name: {policy[0]}</p>
          <p>Policy Number: {policy[1]}</p>
          <p>Coverage Details: {policy[2]}</p>
          <p>Expiration Date: {policy[3]}</p>
        </div>
      )}
    </div>
  );
}

export default App;
