import { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import "./App.css";
import ShipList from "./components/ShipList";
import ViewData from "./components/ViewData";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ViewObservers from "./components/ViewObservers";
// import crypt from 'crypto'
// import { Buffer } from 'buffer/' // <-- no typo here ("/")

// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";

function App() {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;
  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => "http://127.0.0.1:8899", []);

  const wallets = useMemo(
    () => [
      // if desired, manually define specific/custom wallets here (normally not required)
      // otherwise, the wallet-adapter will auto detect the wallets a user's browser has available
    ],
    [network],
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Router>
            <div className="wallet-button-container">
              <WalletMultiButton />
            </div>
            <Routes>
              <Route path="/" element={<ShipList />} />
              <Route path="/view-data" element={<ViewData />} />
              <Route path="/view-observers" element={<ViewObservers />} />
            </Routes>
          </Router>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;