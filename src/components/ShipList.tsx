import { act, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { encode } from "bs58";
import { blake3 } from "hash-wasm";
import { program } from "../anchor/setup";
import { ProgramAccount } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { Buffer } from "buffer";
import { x25519 } from "@noble/curves/ed25519";
import { useNavigate } from "react-router-dom";
import "../styles/ShipList.css";

export default function ShipList() {
  const { connection } = useConnection();
  const { publicKey, signMessage } = useWallet();
  const navigate = useNavigate();
  //   const [shipAccounts, setShipAccounts] = useState<
  //     | ProgramAccount<{
  //         ship: PublicKey;
  //         shipManagement: PublicKey;
  //         dataAccounts: PublicKey[];
  //       }>[]
  //     | null
  //   >(null);

  // MOCK DATA
  const [shipAccounts, setShipAccounts] = useState([
    {
      publicKey: "mockPublicKey1",
      account: {
        ship: "mockShip1",
        shipManagement: "mockShipManagement1",
        dataAccounts: ["mockDataAccount1"],
      },
    },
    {
      publicKey: "mockPublicKey2",
      account: {
        ship: "mockShip2",
        shipManagement: "mockShipManagement2",
        dataAccounts: ["mockDataAccount1"],
      },
    },
  ]);
  const [hasAccess, setHasAccess] = useState([true, true]);
  const [unapprovedExternalObservers, setUnapprovedExternalObservers] =
    useState([false, false]);

  useEffect(() => {
    const fetchAllShipAccounts = async () => {
      try {
        if (!publicKey) {
          console.error("Wallet not connected");
          return;
        }

        // Fetch initial account data
        let shipAccounts = await program.account.shipAccount.all();
        console.log("Ship Accounts:", JSON.stringify(shipAccounts, null, 2));

        // TODO:
        shipAccounts = shipAccounts.filter(
          (shipAccount) =>
            shipAccount.account.dataAccounts.length > 0 &&
            shipAccount.account.shipManagement.equals(publicKey)
        );

        setShipAccounts(shipAccounts);

        await Promise.all(
          shipAccounts.map(async (shipAccount, shipIndex) => {
            await Promise.all(
              shipAccount.account.dataAccounts.map(async (dataAccount) => {
                const [externalObserversAccountAddr, _] =
                  PublicKey.findProgramAddressSync(
                    [
                      Buffer.from("external_observers_account"),
                      dataAccount.toBuffer(),
                    ],
                    program.programId
                  );

                const externalObserversAccountData =
                  await program.account.externalObserversAccount.fetch(
                    externalObserversAccountAddr
                  );

                console.log(
                  "External Observers Account Data:",
                  JSON.stringify(externalObserversAccountData, null, 2)
                );
              })
            );
          })
        );
      } catch (error) {
        console.error("Error fetching counter data:", error);
      }
    };

    //fetchAllShipAccounts();
  }, [program, connection, publicKey]);

  const handleViewObservers = async (
    dataAccountAddress: string,
    shipAccountAddress: string
  ) => {
    console.log(
      `View observers for ship account ${shipAccountAddress} and data account ${dataAccountAddress}`
    );

    navigate("/view-observers", {
      state: { dataAccountAddress, shipAccountAddress },
    });
  };

  const handleViewData = async (ship: string) => {
    console.log(`Viewing data for ship ${ship}`);
    navigate("/view-data", { state: { ship } });
  };

  // Render the value of the counter
  return (
    <div className="main-container">
      <div className="table-container">
        <h1 className="ship-accounts-title">Ship Accounts</h1>
        {shipAccounts && shipAccounts.length > 0 ? (
          <table className="styled-table">
            <tbody>
              {shipAccounts.map((account, index) => (
                <tr key={index}>
                  <td> {account.account.ship.toString()} </td>
                  <td className="button-container">
                    <button
                      onClick={() =>
                        handleViewData(account.account.ship.toString())
                      }
                    >
                      View data
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() =>
                        handleViewObservers(
                          account.account.dataAccounts.at(-1)!.toString(),
                          account.publicKey.toString()
                        )
                      }
                    >
                      View observers
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
