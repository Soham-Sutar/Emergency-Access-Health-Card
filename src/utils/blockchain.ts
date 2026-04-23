import Web3 from 'web3';

// ✅ Paste your ABI array from Remix here ↓
export const HEALTH_CARD_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "_patientId", "type": "string" },
      { "internalType": "string", "name": "_ipfsCid", "type": "string" }
    ],
    "name": "addPatientRecord",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_patientId", "type": "string" },
      { "internalType": "string", "name": "_newIpfsCid", "type": "string" }
    ],
    "name": "updatePatientRecord",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_patientId", "type": "string" }
    ],
    "name": "getPatientRecord",
    "outputs": [
      { "internalType": "string", "name": "", "type": "string" },
      { "internalType": "uint256", "name": "", "type": "uint256" },
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// ✅ Use your actual deployed contract address here
export const CONTRACT_ADDRESS = "0xB319212163F5148B70985077cc05283b68f776a2";

export interface PatientRecord {
  ipfsCid: string;
  timestamp: number;
  doctorAddress: string;
}

// ✅ Add a new patient record
export const addPatientToBlockchain = async (
  web3: Web3,
  account: string,
  patientId: string,
  ipfsCid: string
): Promise<void> => {
  const contract = new web3.eth.Contract(HEALTH_CARD_ABI, CONTRACT_ADDRESS);
  await contract.methods.addPatientRecord(patientId, ipfsCid).send({
    from: account,
    gas: '300000',
  });
};

// ✅ Update existing patient record
export const updatePatientOnBlockchain = async (
  web3: Web3,
  account: string,
  patientId: string,
  newIpfsCid: string
): Promise<void> => {
  const contract = new web3.eth.Contract(HEALTH_CARD_ABI, CONTRACT_ADDRESS);
  await contract.methods.updatePatientRecord(patientId, newIpfsCid).send({
    from: account,
    gas: '300000',
  });
};

// ✅ Retrieve patient record
export const getPatientFromBlockchain = async (web3: any, patientId: string) => {
  try {
    if (!web3) throw new Error('Web3 not initialized');
    const contract = new web3.eth.Contract(HEALTH_CARD_ABI, CONTRACT_ADDRESS);
    const result = await contract.methods.getPatientRecord(patientId).call();

    console.log("🧩 Raw blockchain result:", result);

    let ipfsCid = "";
    let timestamp = 0;
    let doctorAddress = "";

    if (typeof result === "string") {
      ipfsCid = result;
    } else if (Array.isArray(result)) {
      ipfsCid = result[0];
      timestamp = Number(result[1]);
      doctorAddress = result[2];
    } else if (typeof result === "object" && result !== null) {
      ipfsCid = result.ipfsCid || result[0] || result.hash || "";
      timestamp = Number(result.timestamp || result[1] || 0);
      doctorAddress = result.doctorAddress || result[2] || "";
    }

    if (!ipfsCid || ipfsCid === "[object Object]") {
      throw new Error("Invalid CID from blockchain");
    }

    return { ipfsCid, timestamp, doctorAddress };
  } catch (error) {
    console.error("Error fetching patient record:", error);
    throw new Error("Failed to fetch patient record");
  }
};

// ✅ Generate a unique patient ID
export const generatePatientId = (name: string, age: number): string => {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 10000);
  return `PATIENT-${name.substring(0, 3).toUpperCase()}-${age}-${timestamp}-${randomNum}`;
};
