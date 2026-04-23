// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title HealthCard
 * @dev Smart contract for managing emergency access health card records
 * Stores patient records with IPFS CID references on the Ethereum blockchain
 */
contract HealthCard {
    struct PatientRecord {
        string ipfsCid;           // IPFS hash of encrypted patient data
        uint256 timestamp;        // When the record was created/updated
        address doctorAddress;    // Ethereum address of the doctor who created/updated
        bool exists;              // Check if record exists
    }

    // Mapping from patient ID to their record
    mapping(string => PatientRecord) private patientRecords;
    
    // Array to keep track of all patient IDs
    string[] private patientIds;

    // Events
    event PatientRecordAdded(string indexed patientId, string ipfsCid, address indexed doctorAddress, uint256 timestamp);
    event PatientRecordUpdated(string indexed patientId, string newIpfsCid, address indexed doctorAddress, uint256 timestamp);

    /**
     * @dev Add a new patient record
     * @param _patientId Unique identifier for the patient
     * @param _ipfsCid IPFS CID where encrypted patient data is stored
     */
    function addPatientRecord(string memory _patientId, string memory _ipfsCid) public {
        require(!patientRecords[_patientId].exists, "Patient record already exists");
        require(bytes(_patientId).length > 0, "Patient ID cannot be empty");
        require(bytes(_ipfsCid).length > 0, "IPFS CID cannot be empty");

        patientRecords[_patientId] = PatientRecord({
            ipfsCid: _ipfsCid,
            timestamp: block.timestamp,
            doctorAddress: msg.sender,
            exists: true
        });

        patientIds.push(_patientId);

        emit PatientRecordAdded(_patientId, _ipfsCid, msg.sender, block.timestamp);
    }

    /**
     * @dev Update an existing patient record with new IPFS CID
     * @param _patientId Unique identifier for the patient
     * @param _newIpfsCid New IPFS CID with updated patient data
     */
    function updatePatientRecord(string memory _patientId, string memory _newIpfsCid) public {
        require(patientRecords[_patientId].exists, "Patient record does not exist");
        require(bytes(_newIpfsCid).length > 0, "IPFS CID cannot be empty");

        patientRecords[_patientId].ipfsCid = _newIpfsCid;
        patientRecords[_patientId].timestamp = block.timestamp;
        patientRecords[_patientId].doctorAddress = msg.sender;

        emit PatientRecordUpdated(_patientId, _newIpfsCid, msg.sender, block.timestamp);
    }

    /**
     * @dev Retrieve a patient record
     * @param _patientId Unique identifier for the patient
     * @return ipfsCid IPFS CID of the patient data
     * @return timestamp When the record was last updated
     * @return doctorAddress Address of the doctor who last updated the record
     */
    function getPatientRecord(string memory _patientId) public view returns (
        string memory ipfsCid,
        uint256 timestamp,
        address doctorAddress
    ) {
        require(patientRecords[_patientId].exists, "Patient record does not exist");

        PatientRecord memory record = patientRecords[_patientId];
        return (record.ipfsCid, record.timestamp, record.doctorAddress);
    }

    /**
     * @dev Check if a patient record exists
     * @param _patientId Unique identifier for the patient
     * @return exists Boolean indicating if record exists
     */
    function patientExists(string memory _patientId) public view returns (bool) {
        return patientRecords[_patientId].exists;
    }

    /**
     * @dev Get total number of patient records
     * @return count Total number of patient records
     */
    function getTotalPatients() public view returns (uint256) {
        return patientIds.length;
    }

    /**
     * @dev Get patient ID by index
     * @param _index Index in the patientIds array
     * @return patientId Patient ID at the given index
     */
    function getPatientIdByIndex(uint256 _index) public view returns (string memory) {
        require(_index < patientIds.length, "Index out of bounds");
        return patientIds[_index];
    }
}
