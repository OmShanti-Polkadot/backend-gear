use frame_support::{decl_event, decl_module, decl_storage, dispatch::DispatchResult};
use sp_std::vec::Vec;
use sp_runtime::{traits::{CheckedAdd, CheckedSub}, DispatchError, Percent, RuntimeDebug};

#[derive(Clone, Eq, PartialEq, RuntimeDebug)]
pub struct HealthInsurancePolicy {
    pub policy_holder_name: Vec<u8>,
    pub policy_number: u64,
    pub coverage_details: Vec<u8>,
    pub expiration_date: u64,
}

#[derive(Encode, Decode, Clone, Eq, PartialEq, RuntimeDebug)]
pub struct PolicyMetadata {
    pub policy_holder: Vec<u8>,
    pub policy_number: u64,
    pub coverage_details: Vec<u8>,
    pub expiration_date: u64,
    pub owner: T::AccountId,
}

pub trait Trait: frame_system::Trait {}

decl_storage! {
    trait Store for Module<T: Trait> as HealthInsurance {
        Policies: map hasher(blake2_128_concat) T::Hash => PolicyMetadata;
    }
}

decl_event!(
    pub enum Event<T> where
        <T as frame_system::Trait>::AccountId,
        <T as frame_system::Trait>::Hash,
        u64,
    {
        PolicyCreated(AccountId, Hash, u64),
        PolicyTransferred(Hash, AccountId),
        PolicyRevoked(Hash, AccountId),
    }
);

decl_module! {
    pub struct Module<T: Trait> for enum Call where origin: T::Origin {
        #[weight = 10_000]
        fn create_policy(origin, policy: HealthInsurancePolicy) -> DispatchResult {
            let sender = ensure_signed(origin)?;
            let metadata = PolicyMetadata {
                policy_holder: policy.policy_holder_name.clone(),
                policy_number: policy.policy_number,
                coverage_details: policy.coverage_details.clone(),
                expiration_date: policy.expiration_date,
                owner: sender.clone(),
            };
            let hash = T::Hashing::hash_of(&metadata);
            Policies::<T>::insert(&hash, &metadata);
            Self::deposit_event(RawEvent::PolicyCreated(sender, hash, policy.policy_number));
            Ok(())
        }

        #[weight = 10_000]
        fn transfer_policy(origin, policy_hash: T::Hash, new_owner: T::AccountId) -> DispatchResult {
            let sender = ensure_signed(origin)?;
            let metadata = Policies::<T>::get(&policy_hash).ok_or(Error::<T>::PolicyNotFound)?;
            ensure!(metadata.owner == sender, Error::<T>::Unauthorized);
            Policies::<T>::mutate(&policy_hash, |metadata| {
                metadata.owner = new_owner.clone();
            });
            Self::deposit_event(RawEvent::PolicyTransferred(policy_hash, new_owner));
            Ok(())
        }

        #[weight = 10_000]
        fn revoke_policy(origin, policy_hash: T::Hash) -> DispatchResult {
            let sender = ensure_signed(origin)?;
            let metadata = Policies::<T>::get(&policy_hash).ok_or(Error::<T>::PolicyNotFound)?;
            ensure!(metadata.owner == sender, Error::<T>::Unauthorized);
            Policies::<T>::remove(&policy_hash);
            Self::deposit_event(RawEvent::PolicyRevoked(policy_hash, sender));
            Ok(())
        }
    }
}

decl_error! {
    pub enum Error for Module<T: Trait> {
        PolicyNotFound,
        Unauthorized,
    }
}
