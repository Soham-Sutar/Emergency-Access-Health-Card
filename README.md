# 🏥 Emergency Access Health Card

A **blockchain-based emergency health card system** that allows authorized doctors to securely register, update, and retrieve patient medical records using **Ethereum smart contracts**, **IPFS decentralized storage**, and **QR codes** for instant emergency access.

---

## 📖 Overview

In emergency situations, fast access to a patient's medical history can save lives. This project provides a secure, tamper-proof, and decentralized way for doctors to:

- Store encrypted patient records on **IPFS**
- Anchor record references (CIDs) on the **Ethereum blockchain** for immutability
- Generate a **QR code** for each patient that retrieves the latest record instantly
- Update records over time while maintaining a verifiable on-chain history

---

## ✨ Features

- 🔐 **Doctor Authentication** via MetaMask wallet
- 📝 **Add Patient Records** with full medical details (allergies, medications, history, etc.)
- 🔒 **AES-256 Encryption** of patient data before IPFS upload
- 🌐 **IPFS Storage** via Pinata for decentralized, censorship-resistant data
- ⛓️ **Smart Contract** stores IPFS CIDs on the Ethereum blockchain
- 📱 **QR Code Generation** — downloadable QR for each patient
- 📷 **QR Code Scanner** — emergency access by scanning the patient's QR
- 🔄 **Update Records** — new versions are tracked on-chain
- 🎨 **Modern Responsive UI** with Tailwind CSS and shadcn/ui

---

## 🛠 Tech Stack

**Frontend**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- React Router

**Blockchain & Storage**
- Solidity (Smart Contract)
- Web3.js
- Ethereum (Ganache for local development)
- MetaMask (wallet & authentication)
- IPFS via Pinata

**Utilities**
- CryptoJS (AES encryption)
- qrcode.react (QR generation)
- html5-qrcode (QR scanning)

---

## 🏗 System Architecture

```
┌─────────────┐
│   Doctor    │
│ (MetaMask)  │
└──────┬──────┘
       │
       ├─── Login / Authenticate
       │
       ├─── Add Patient ──► Encrypt (AES) ──► Upload to IPFS ──► Get CID
       │                                                           │
       │                                                           ▼
       │                                       Store CID on Ethereum Blockchain
       │                                                           │
       │                                                           ▼
       │                                                   Generate QR Code
       │
       └─── Scan QR ──► Get Patient ID ──► Blockchain ──► Fetch CID
                                                              │
                                                              ▼
                                            IPFS ──► Decrypt ──► Display Record
```

---

## 📋 Prerequisites

Before you begin, make sure you have:

- **Node.js** (v18 or higher) and npm
- **MetaMask** browser extension — [metamask.io](https://metamask.io/)
- **Ganache** (local blockchain) — [trufflesuite.com/ganache](https://trufflesuite.com/ganache)
- **Pinata account** for IPFS storage — [pinata.cloud](https://www.pinata.cloud/)

---

## 🚀 Installation & Setup

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd emergency-health-card
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the project root (copy from `.env.example`):
```env
VITE_PINATA_API_KEY=your_pinata_api_key
VITE_PINATA_SECRET_KEY=your_pinata_secret_key
VITE_CONTRACT_ADDRESS=your_deployed_contract_address
```

### 4. Start a local blockchain
```bash
ganache
```
This runs a local Ethereum node at `http://127.0.0.1:8545`.

### 5. Deploy the smart contract

The Solidity contract is located at `contracts/HealthCard.sol`.

**Quick deploy with Remix IDE:**
1. Open [remix.ethereum.org](https://remix.ethereum.org/)
2. Create a new file and paste the contents of `contracts/HealthCard.sol`
3. Compile with Solidity `0.8.0+`
4. In **Deploy**, choose **Injected Provider - MetaMask**
5. Connect MetaMask to your Ganache network (Chain ID `1337`)
6. Click **Deploy** and copy the deployed contract address
7. Paste the address into your `.env` file as `VITE_CONTRACT_ADDRESS`

### 6. Configure MetaMask
Add Ganache as a custom network:
- **Network Name:** Ganache Local
- **RPC URL:** `http://127.0.0.1:8545`
- **Chain ID:** `1337`
- **Currency Symbol:** ETH

Import a Ganache test account using its private key.

### 7. Run the app
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

> 📚 For a more detailed setup walkthrough, see [`README_SETUP.md`](./README_SETUP.md).

---

## 🎯 Usage Flow

1. **Login** — Connect your MetaMask wallet and sign in.
2. **Add Patient** — Fill in patient details. The app encrypts the data, uploads it to IPFS, stores the CID on-chain, and generates a downloadable QR code.
3. **Emergency Access** — Scan a patient's QR code (or enter their Patient ID) to fetch and decrypt the latest record.
4. **Update Record** — Modify a patient's data; a new IPFS CID is stored on-chain, while the same QR code keeps working and always points to the latest version.

---

---

## 🔐 Security

- **AES-256 Encryption** — All patient records are encrypted before being uploaded to IPFS.
- **Blockchain Immutability** — Every record reference (CID) stored on-chain is tamper-proof and timestamped.
- **Wallet-Based Authentication** — Only doctors with an authorized MetaMask wallet can interact with the contract.
- **Decentralized Storage** — IPFS ensures data is not held by a single point of failure.
- **Version History** — Every record update is tracked as a new on-chain transaction.

> ⚠️ This project is intended for educational and demonstration purposes. For production use, implement strong key management, role-based access control, and ensure full compliance with HIPAA / GDPR / local healthcare regulations.

---

## 🧩 Smart Contract API

| Function | Description |
|---|---|
| `addPatientRecord(patientId, ipfsCid)` | Register a new patient record |
| `updatePatientRecord(patientId, newIpfsCid)` | Update an existing record |
| `getPatientRecord(patientId)` | Retrieve a patient's latest CID, timestamp, and doctor address |
| `patientExists(patientId)` | Check whether a patient is registered |
| `getTotalPatients()` | Get the total number of registered patients |

---

## 🛠 Troubleshooting

| Issue | Solution |
|---|---|
| MetaMask won't connect | Ensure Ganache is running and the network is added correctly |
| Transaction fails | Verify contract address in `.env` and that your account has ETH |
| IPFS upload fails | Check Pinata API keys and your internet connection |
| QR scanner not working | Grant camera permission, or use manual Patient ID entry |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to fork the repository and submit a pull request.

---

## 📄 License

This project is released under the **MIT License**. See the `LICENSE` file for details.

---

## 💡 Acknowledgments

- [Ethereum](https://ethereum.org/) — Smart contract platform
- [IPFS](https://ipfs.tech/) & [Pinata](https://www.pinata.cloud/) — Decentralized storage
- [MetaMask](https://metamask.io/) — Wallet & Web3 authentication
- [shadcn/ui](https://ui.shadcn.com/) — UI component library
