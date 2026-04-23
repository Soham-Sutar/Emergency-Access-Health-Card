import axios from "axios";
import CryptoJS from "crypto-js";

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY || "your-pinata-api-key";
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY || "your-pinata-secret-key";
const ENCRYPTION_KEY = "emergency-health-card-secret-key-2024"; // In production, store in .env

export interface PatientData {
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  allergies: string;
  medications: string;
  medicalHistory: string;
  emergencyContact: string;
  timestamp: number;
  doctorAddress: string;
}

// 🔒 Encrypt patient data before uploading
export const encryptData = (data: PatientData): string => {
  const jsonString = JSON.stringify(data);
  return CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString();
};

// 🔓 Decrypt retrieved IPFS data
export const decryptData = (encryptedData: string): PatientData => {
  const decrypted = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
  const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
  return JSON.parse(jsonString);
};

// 🚀 Upload to IPFS using Pinata
export const uploadToIPFS = async (data: PatientData): Promise<string> => {
  try {
    const encryptedData = encryptData(data);

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        pinataContent: { encryptedData },
        pinataMetadata: {
          name: `patient-record-${Date.now()}`,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_KEY,
        },
        timeout: 15000,
      }
    );

    return response.data.IpfsHash;
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw new Error("Failed to upload data to IPFS");
  }
};

// 🌐 Gateways to try for retrieval
const IPFS_GATEWAYS = [
  "https://cloudflare-ipfs.com/ipfs/",
  "https://ipfs.io/ipfs/",
  "https://gateway.pinata.cloud/ipfs/",
];

// 🔍 Extract CID from any format (object, ipfs://, etc.)
function extractCid(input: any): string | null {
  if (!input) return null;

  if (typeof input === "string") {
    // Direct CID or ipfs://CID
    const match = input.match(/(Qm[1-9A-HJ-NP-Za-km-z]{44}|bafy[0-9a-z]{10,})/i);
    return match ? match[0] : null;
  }

  if (typeof input === "object") {
    const keys = ["IpfsHash", "ipfshash", "cid", "hash", "path", "uri", "url"];
    for (const key of keys) {
      if (key in input) return extractCid((input as any)[key]);
    }

    // try inside nested structure
    for (const val of Object.values(input)) {
      const cid = extractCid(val);
      if (cid) return cid;
    }
  }

  return null;
}

// 🌍 Try fetching from gateways
async function tryFetchUrl(url: string, timeout = 10000) {
  return axios.get(url, { timeout });
}

// 🧠 Main retrieve function
export async function retrieveFromIPFS(input: any): Promise<PatientData> {
  try {
    console.log("🧾 retrieveFromIPFS called with:", input);

    let cid: string | null = null;

    // 🧠 Case 1: Direct string CID
    if (typeof input === 'string' && input.startsWith('Qm')) {
      cid = input;
    }

    // 🧠 Case 2: IPFS gateway link
    else if (typeof input === 'string' && input.includes('/ipfs/')) {
      const match = input.match(/\/ipfs\/([^/?]+)/);
      cid = match ? match[1] : null;
    }

    // 🧠 Case 3: Object from blockchain (like { ipfsCid: '...' })
    else if (typeof input === 'object' && input !== null) {
      cid = input.ipfsCid || input.cid || input.IpfsHash || null;
    }

    if (!cid) {
      console.error('❌ Failed to extract valid CID from input:', input);
      throw new Error('Invalid IPFS input: CID not found.');
    }

    const gatewayURL = `https://gateway.pinata.cloud/ipfs/${cid}`;

    const response = await fetch(gatewayURL);
    if (!response.ok) {
      throw new Error(`Failed to fetch IPFS data. Status: ${response.status}`);
    }

    const json = await response.json();

    // 🧠 Decrypt if encryptedData exists
    if (json.encryptedData) {
      return decryptData(json.encryptedData);
    }

    return json;
  } catch (err: any) {
    console.error('Error retrieving from IPFS:', err);
    throw new Error(err.message || 'Failed to retrieve data from IPFS');
  }
}
