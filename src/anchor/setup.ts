import { IdlAccounts, Program } from "@coral-xyz/anchor";
import { PontNetwork } from "./pont_network";
import IDL from "./idl.json";
import { Connection } from "@solana/web3.js";
 
const connection = new Connection("http://127.0.0.1:8899", "confirmed");
 
// Initialize the program interface with the IDL, program ID, and connection.
// This setup allows us to interact with the on-chain program using the defined interface.
export const program = new Program<PontNetwork>(IDL as PontNetwork, {
  connection,
});
 
 
// This is just a TypeScript type for the account data structures based on the IDL
// We need this so TypeScript doesn't yell at us
export type DataAccount = IdlAccounts<PontNetwork>["dataAccount"];
export type ExternalObserversAccount = IdlAccounts<PontNetwork>["externalObserversAccount"];
export type ShipAccount = IdlAccounts<PontNetwork>["shipAccount"];