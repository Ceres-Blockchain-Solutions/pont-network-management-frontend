import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ExternalObserversAccount, program } from "../anchor/setup";
import "../styles/ShipList.css";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { set } from "@coral-xyz/anchor/dist/cjs/utils/features";
import * as ecies25519 from "ecies-25519";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

interface Observer {
    publicKey: string;
    data: any;
}

export default function ViewObservers() {
    const location = useLocation();
    const { sendTransaction, publicKey } = useWallet();
    const { connection } = useConnection();
    const { dataAccountAddress, shipAccountAddress, shipAddr } = location.state as { dataAccountAddress: string, shipAccountAddress: string, shipAddr: string };
    const [unapprovedObservers, setUnapprovedObservers] = useState<PublicKey[]>([]);
    const [approvedObservers, setApprovedObservers] = useState<PublicKey[]>([]);
    const [externalObserversAccountInfo, setExternalObserversAccountInfo] = useState<ExternalObserversAccount>();
    const [externalObserversAccountAddress, setExternalObserversAccountAddress] = useState<PublicKey>();

    // MOCK 
    // const [unapprovedObservers, setUnapprovedObservers] = useState<PublicKey[]>([
    //     PublicKey.unique(),
    //     PublicKey.unique(),
    //     PublicKey.unique()
    // ]);
    // const [approvedObservers, setApprovedObservers] = useState<PublicKey[]>([
    //     PublicKey.unique(),
    //     PublicKey.unique()
    // ]);

    useEffect(() => {
        const fetchObservers = async () => {
            try {
                const [externalObserversAccountAddress] =
                    PublicKey.findProgramAddressSync(
                        [
                            Buffer.from("external_observers_account"),
                            new PublicKey(dataAccountAddress).toBuffer(),
                        ],
                        program.programId
                    );
                setExternalObserversAccountAddress(externalObserversAccountAddress);

                const externalObserversAccountInfo =
                    await program.account.externalObserversAccount.fetch(
                        externalObserversAccountAddress
                    );
                setExternalObserversAccountInfo(externalObserversAccountInfo);

                setUnapprovedObservers(
                    externalObserversAccountInfo.unapprovedExternalObservers
                );
                setApprovedObservers(externalObserversAccountInfo.externalObservers);

                console.log(
                    "Unapproved observers:",
                    externalObserversAccountInfo.unapprovedExternalObservers
                );
                console.log(
                    "Approved observers:",
                    externalObserversAccountInfo.externalObservers
                );
            } catch (error) {
                console.error("Error fetching observers data:", error);
            }
        };

        // MOCK
        fetchObservers();
    }, [dataAccountAddress]);

    async function addMasterkeyToDb(masterKey: Uint8Array, shipAddr: string) {
        // const masterKeyString = Buffer.from(masterKey).toString('base64');
        try {
            const response = await fetch('http://localhost:5001/api/add-masterkey', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    shipAddr,
                    masterKey: Array.from(masterKey),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error: ${errorData.error}`);
            }

            const data = await response.json();
            console.log('Success:', data);
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    const handleApprove = async (observer: PublicKey) => {
        try {
            // Add logic to approve the observer
            console.log(`Approving observer: ${observer.toString()}`);

            const masterKey = new Uint8Array(32);

            const index =
                externalObserversAccountInfo?.unapprovedExternalObservers.findIndex(
                    (unapprovedObserver) => unapprovedObserver.equals(observer)
                );
            const observerX25519Pk =
                externalObserversAccountInfo?.unapprovedExternalObserversX25519Pks[
                index!
                ];

            const encryptedMasterKey = await ecies25519.encrypt(
                masterKey,
                observerX25519Pk!.toBytes(),
            );

            // TODO: Generate random masterKey and save it in the database
            const tx = await program.methods
                .addExternalObserver(
                    new PublicKey(observer),
                    Array.from(encryptedMasterKey)
                )
                .accountsStrict({
                    dataAccount: dataAccountAddress,
                    externalObserversAccount: externalObserversAccountAddress!,
                    shipAccount: shipAccountAddress,
                    shipManagement: publicKey!,
                    systemProgram: SystemProgram.programId,
                })
                .transaction();

            try {
                // Perform the Solana transaction
                const txSignature = await sendTransaction(
                    tx,
                    connection,
                    {
                        skipPreflight: true
                    }
                );

                // If the transaction is successful, update the database
                await addMasterkeyToDb(masterKey, shipAddr);

                console.log('Transaction and database update successful');
                console.log('Transaction signature:', txSignature);

                // Update the state to rerender the page
                setUnapprovedObservers((prev) =>
                    prev.filter((unapprovedObserver) => !unapprovedObserver.equals(observer))
                );
                setApprovedObservers((prev) => [...prev, observer]);
                
            } catch (error) {
                console.error('Error during atomic operation:', error);

                throw error; // Re-throw the error after handling
            }
        } catch (error) {
            console.error("Error approving observer:", error);
        }
    };

    return (
        <div className="main-container">
            <div className="table-container">
                <h1 className="ship-accounts-title">Observers</h1>
                <h2 className="ship-accounts-subtitle">Unapproved Observers</h2>
                {unapprovedObservers.length > 0 ? (
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>Public Key</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {unapprovedObservers.map((observer, idx) => (
                                <tr key={idx}>
                                    <td>{observer.toString()}</td>
                                    <td>
                                        <button
                                            className="btn-secondary"
                                            onClick={() => handleApprove(observer)}
                                        >
                                            Approve
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No unapproved observers!</p>
                )}
                <br />
                <h2 className="ship-accounts-subtitle">Approved Observers</h2>
                {approvedObservers.length > 0 ? (
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>Public address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {approvedObservers.map((observer, idx) => (
                                <tr key={idx}>
                                    <td>{observer.toString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Loading approved observers...</p>
                )}
            </div>
        </div>
    );
}
