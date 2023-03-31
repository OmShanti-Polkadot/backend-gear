use ink_lang::contract;

#[contract]
mod health_insurance_nft {
    use super::*;

    #[ink(storage)]
    pub struct HealthInsuranceNFT {
        policies: ink_storage::collections::HashMap<AccountId, HealthInsurancePolicy>,
    }

    impl HealthInsuranceNFT {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                policies: ink_storage::collections::HashMap::new(),
            }
        }

        #[ink(message)]
        pub fn create_policy(&mut self, policy: HealthInsurancePolicy) -> bool {
            let caller = self.env().caller();
            self.policies.insert(caller, policy);
            true
        }

        #[ink(message)]
        pub fn get_policy(&self, owner: AccountId) -> Option<HealthInsurancePolicy> {
            self.policies.get(&owner).cloned()
        }

        #[ink(message)]
        pub fn revoke_policy(&mut self, owner: AccountId) -> bool {
            self.policies.take(&owner).is_some()
        }
    }
}
