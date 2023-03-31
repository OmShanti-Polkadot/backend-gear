import { ApiPromise, WsProvider } from '@polkadot/api';

const provider = new WsProvider('ws://localhost:9944');
const api = await ApiPromise.create({ provider });


async function getPolicies() {
    const policies = await api.query.insuranceModule.policies.entries();
  
    return policies.map(([key, policy]) => {
      return {
        id: key.args[0].toNumber(),
        holder_name: policy.holder_name.toString(),
        policy_type: policy.policy_type.toString(),
        start_date: policy.start_date.toString(),
        end_date: policy.end_date.toString(),
      };
    });
  }
  


import React, { useState, useEffect } from 'react';

function PolicyTable() {
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    getPolicies().then(data => setPolicies(data));
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Holder Name</th>
          <th>Policy Type</th>
          <th>Start Date</th>
          <th>End Date</th>
        </tr>
      </thead>
      <tbody>
        {policies.map(policy => (
          <tr key={policy.id}>
            <td>{policy.id}</td>
            <td>{policy.holder_name}</td>
            <td>{policy.policy_type}</td>
            <td>{policy.start_date}</td>
            <td>{policy.end_date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
