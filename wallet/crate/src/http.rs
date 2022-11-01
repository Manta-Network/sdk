//! Signer HTTP Client Implementation

use manta_pay::{
  config::{Config, ReceivingKey},
  signer::{
    client::network::{Network,Message},
    Checkpoint, ReceivingKeyRequest, SignError, SignRequest, SignResponse, SyncError,
    SyncRequest, SyncResponse,
},
};
use alloc::{boxed::Box, vec::Vec};
use manta_accounting::wallet::{self, signer};
use manta_util::{
    future::LocalBoxFutureResult,
    http::reqwest::{self, IntoUrl, KnownUrlClient},
};

#[doc(inline)]
pub use reqwest::Error;

/// Wallet Associated to [`Client`]
pub type Wallet<L> = wallet::Wallet<Config, L, Client>;

/// HTTP Signer Client
pub struct Client {
    /// Base Client
    base: KnownUrlClient,

    /// Network Selector
    network: Option<Network>,
}

impl Client {
    /// Builds a new HTTP [`Client`] that connects to `server_url`.
    #[inline]
    pub fn new<U>(server_url: U) -> Result<Self, Error>
    where
        U: IntoUrl,
    {
        Ok(Self {
            base: KnownUrlClient::new(server_url)?,
            network: None,
        })
    }

    /// Sets the network that will be used to wrap HTTP requests.
    #[inline]
    pub fn set_network(&mut self, network: Option<Network>) {
        self.network = network
    }

    /// Wraps the current outgoing `request` with a `network` if it is not `None`.
    #[inline]
    pub fn wrap_request<T>(&self, request: T) -> Message<T> {
        Message {
            network: self
                .network
                .expect("Unable to wrap request, missing network."),
            message: request,
        }
    }
}

impl signer::Connection<Config> for Client {
    type Checkpoint = Checkpoint;
    type Error = Error;

    #[inline]
    fn sync(
        &mut self,
        request: SyncRequest,
    ) -> LocalBoxFutureResult<Result<SyncResponse, SyncError>, Self::Error> {
        Box::pin(async move { self.base.post("sync", &self.wrap_request(request)).await })
    }

    #[inline]
    fn sign(
        &mut self,
        request: SignRequest,
    ) -> LocalBoxFutureResult<Result<SignResponse, SignError>, Self::Error> {
        Box::pin(async move { self.base.post("sign", &self.wrap_request(request)).await })
    }

    #[inline]
    fn receiving_keys(
        &mut self,
        request: ReceivingKeyRequest,
    ) -> LocalBoxFutureResult<Vec<ReceivingKey>, Self::Error> {
        Box::pin(async move {
            self.base
                .post("receivingKeys", &self.wrap_request(request))
                .await
        })
    }
}
