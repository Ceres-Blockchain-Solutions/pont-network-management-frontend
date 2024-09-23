import { useEffect, useState } from "react";
import "../styles/ShipList.css";
import { useLocation } from "react-router-dom";
import crypt from "crypto-browserify";
import { Buffer } from "buffer";

interface SensorData {
  lat: number;
  long: number;
  mileage: number;
  engineLoad: number;
  fuelLevel: number;
  seaState: string;
  seaSurfaceTemperature: number;
  airTemp: number;
  humidity: number;
  barometricPressure: number;
  cargoStatus: string;
  time: number;
}

interface DataItem {
  event: string;
  ship: string;
  fingerprint: string;
  ciphertext: string;
  tag: string;
  iv: string;
  data_account: string;
  ciphertext_timestamp_unix: number;
  ciphertext_timestamp_date: {
    $date: string;
  };
}

// Decrypt data AES-256-GCM
export const decrypt = (
  ciphertext: string,
  tag: string,
  iv: string,
  key: crypt.CipherKey
) => {
  const decipher = crypt.createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(iv, "hex")
  );
  decipher.setAuthTag(Buffer.from(tag, "hex")); // Set the authentication tag
  let decrypted = decipher.update(ciphertext, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

export default function ViewData() {
  const location = useLocation();
  const [encryptedData, setEncryptedData] = useState<DataItem[]>([]);
  // const [decryptedData, setDecryptedData] = useState<SensorData[]>([]);
  const { ship, masterKeyDecrypted } = location.state as {
    ship: string;
    masterKeyDecrypted: Uint8Array;
  };

  // MOCK
  const [decryptedData, setDecryptedData] = useState<SensorData[]>([
    {
      lat: 37.7749,
      long: -122.4194,
      mileage: 1200,
      engineLoad: 75,
      fuelLevel: 50,
      seaState: "Calm",
      seaSurfaceTemperature: 15,
      airTemp: 20,
      humidity: 60,
      barometricPressure: 1013,
      cargoStatus: "Loaded",
      time: Date.now(),
    },
    {
      lat: 34.0522,
      long: -118.2437,
      mileage: 1500,
      engineLoad: 80,
      fuelLevel: 60,
      seaState: "Moderate",
      seaSurfaceTemperature: 18,
      airTemp: 22,
      humidity: 55,
      barometricPressure: 1015,
      cargoStatus: "Unloaded",
      time: Date.now(),
    },
    {
      lat: 40.7128,
      long: -74.006,
      mileage: 1800,
      engineLoad: 70,
      fuelLevel: 40,
      seaState: "Rough",
      seaSurfaceTemperature: 12,
      airTemp: 18,
      humidity: 65,
      barometricPressure: 1010,
      cargoStatus: "Loaded",
      time: Date.now(),
    },
  ]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:5000/api/data");
        const result = await response.json();
        // TODO: New Collection for each ship on backend to remove this filter
        const resultFiltered = result.filter(
          (item: DataItem) => item.ship === ship
        );
        setEncryptedData(result);

        // Decrypt data
        const _decryptedData: SensorData[] = resultFiltered.map(
          (item: DataItem) => {
            console.log(
              "Decrypting data: ",
              item.ciphertext,
              item.tag,
              item.iv,
              masterKeyDecrypted
            );
            const decrypted = decrypt(
              item.ciphertext,
              item.tag,
              item.iv,
              masterKeyDecrypted
            );
            return JSON.parse(decrypted);
          }
        );
        console.log("Decrypted data:", _decryptedData);
        setDecryptedData(_decryptedData);

        // Log decrypted data
        decryptedData.forEach((item, index) => {
          console.log(`Decrypted data for ship at index ${index}:`, item);
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    // MOCK
    // fetchData();
  }, []);

  const truncate = (str: string) => {
    if (str.length <= 8) return str;
    return `${str.slice(0, 4)}...${str.slice(-4)}`;
  };

  // return (
  //     <div className="table-container">
  //         <h2 className='ship-accounts-title'>Data View</h2>
  //         <table className="styled-table">
  //             <thead>
  //                 <tr>
  //                     <th>Ship</th>
  //                     <th>Fingerprint</th>
  //                     <th>Ciphertext</th>
  //                     <th>Tag</th>
  //                     <th>IV</th>
  //                     <th>Timestamp</th>
  //                 </tr>
  //             </thead>
  //             <tbody>
  //                 {encryptedData.map((item, index) => (
  //                     <tr key={index}>
  //                         <td>{item.ship}</td>
  //                         <td>{truncate(item.fingerprint)}</td>
  //                         <td>{truncate(item.ciphertext)}</td>
  //                         <td>{truncate(item.tag)}</td>
  //                         <td>{truncate(item.iv)}</td>
  //                         <td>{new Date(item.ciphertext_timestamp_unix).toLocaleString()}</td>
  //                     </tr>
  //                 ))}
  //             </tbody>
  //         </table>
  //     </div>
  // );
  return (
    <div className="main-container">
      <div className="table-container table-container-lg">
        {decryptedData.length > 0 && (
          <table className="styled-table">
            <thead>
              <tr>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Mileage</th>
                <th>Engine Load</th>
                <th>Fuel Level</th>
                <th>Sea State</th>
                <th>Sea Surface Temperature</th>
                <th>Air Temperature</th>
                <th>Humidity</th>
                <th>Barometric Pressure</th>
                <th>Cargo Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {decryptedData.map((data, index) => (
                <tr key={index}>
                  <td>{data.lat}</td>
                  <td>{data.long}</td>
                  <td>{data.mileage}</td>
                  <td>{data.engineLoad}</td>
                  <td>{data.fuelLevel}</td>
                  <td>{data.seaState}</td>
                  <td>{data.seaSurfaceTemperature}</td>
                  <td>{data.airTemp}</td>
                  <td>{data.humidity}</td>
                  <td>{data.barometricPressure}</td>
                  <td>{data.cargoStatus}</td>
                  <td>{new Date(data.time).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
