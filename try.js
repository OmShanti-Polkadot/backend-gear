import React, { useState, useEffect } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';

function HealthInsurance() {
  const [api, setApi] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    async function connect() {
      const provider = new WsProvider('wss://your-node-url-here');
      const api = await ApiPromise.create({ provider });
      setApi(api);

      const contract = await api.query.healthInsuranceNFT.healthInsuranceNFT();
      setContract(contract);
    }

    connect();
  }, []);

  async function createPolicy(policy) {
    const tx = contract.createPolicy(policy);
    await tx.signAndSend(signer);
  }

  async function getPolicy(owner) {
    const policy = await contract.getPolicy(owner);
    // do something with the policy
  }

  async function revokePolicy(owner) {
    const tx = contract.revokePolicy(owner);
    await tx.signAndSend(signer);
  }

  return (
    <div>
      // your React UI goes here
    </div>
  );
}

export default HealthInsurance;
