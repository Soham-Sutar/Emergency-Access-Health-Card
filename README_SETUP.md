# Emergency Access Health Card - Setup Guide

## 🚀 Quick Start

This blockchain-based health card system uses Ethereum, IPFS, and QR codes for secure patient record management.

## 📋 Prerequisites

1. **MetaMask Browser Extension**
   - Install from [metamask.io](https://metamask.io/)
   - Create an account and save your seed phrase securely

2. **Ganache (Local Blockchain)**
   - Download from [trufflesuite.com/ganache](https://trufflesuite.com/ganache)
   - Or install globally: `npm install -g ganache`

3. **Pinata Account (IPFS Storage)**
   - Sign up at [pinata.cloud](https://www.pinata.cloud/)
   - Get your API keys from the dashboard

## 🔧 Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Edit `.env` and add your Pinata credentials:
```
VITE_PINATA_API_KEY=your_actual_api_key
VITE_PINATA_SECRET_KEY=your_actual_secret_key
VITE_CONTRACT_ADDRESS=will_add_after_deployment
```

### 3. Start Local Blockchain
```bash
ganache
```

This will:
- Create a local Ethereum blockchain on `http://127.0.0.1:8545`
- Generate 10 test accounts with 100 ETH each
- Display private keys for testing

### 4. Deploy Smart Contract

**Using Remix IDE (Recommended for beginners)**
1. Go to [remix.ethereum.org](https://remix.ethereum.org/)
2. Create a new file `HealthCard.sol`
3. Copy the contract code from `contracts/HealthCard.sol`
4. Compile with Solidity 0.8.0+
5. Deploy:
   - Environment: "Injected Provider - MetaMask"
   - Connect MetaMask to Ganache (Network: localhost:8545)
   - Click "Deploy"
6. Copy the deployed contract address
7. Add it to your `.env` file

### 5. Configure MetaMask
1. Open MetaMask
2. Add network:
   - Network Name: Ganache Local
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 1337
   - Currency Symbol: ETH
3. Import an account from Ganache using a private key

### 6. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:8080`

## 🎯 Usage Flow

### For Doctors:

1. **Login**
   - Navigate to the login page
   - Connect MetaMask wallet
   - Enter credentials (demo: any username/password works)

2. **Add New Patient**
   - Click "Add New Patient" from dashboard
   - Fill in patient details:
     - Name, Age, Gender, Blood Group
     - Allergies, Medications, Medical History
     - Emergency Contact
   - Submit form
   - System will:
     - Encrypt data
     - Upload to IPFS
     - Store CID on blockchain
     - Generate QR code
   - Download the QR code for the patient

3. **Emergency Access via QR Scan**
   - Click "Scan QR Code" from dashboard
   - Use camera to scan patient's QR code
   - Or enter Patient ID manually
   - View complete medical record
   - Update record if needed (creates new blockchain version)

## 🔐 Security Features

- **AES Encryption**: All patient data encrypted before IPFS upload
- **Blockchain Immutability**: Records cannot be altered without trace
- **MetaMask Authentication**: Only authorized doctors with wallets can access
- **Decentralized Storage**: IPFS ensures data availability
- **Version Tracking**: Every update creates new blockchain entry

## 📊 System Architecture

```
┌─────────────┐
│   Doctor    │
│  (MetaMask) │
└──────┬──────┘
       │
       ├─── Login/Auth
       │
       ├─── Add Patient ────► Encrypt ────► IPFS (Pinata) ────► Get CID
       │                                                          │
       │                                                          ▼
       │                                          Blockchain (Ganache/Ethereum)
       │                                          Store: PatientID + CID + Timestamp
       │                                                          │
       │                                                          ▼
       │                                                    Generate QR Code
       │
       └─── Scan QR ────► Get PatientID ────► Blockchain ────► Fetch CID
                                                                  │
                                                                  ▼
                                                          IPFS ────► Decrypt ────► Display
```

