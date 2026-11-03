// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title CharityLedger
 * @dev Lưu trữ cam kết (commitment) mã hóa của hồ sơ từ thiện on-chain để đối soát minh bạch.
 */
contract CharityLedger {
    struct CampaignRecord {
        bytes32 commitment;
        uint256 timestamp;
        address recordedBy;
    }

    // Mapping: mã hồ sơ (campaignId) => CampaignRecord
    mapping(string => CampaignRecord) public records;

    event CommitmentRecorded(
        string indexed campaignId,
        bytes32 commitment,
        uint256 timestamp,
        address indexed recordedBy
    );

    error RecordAlreadyExists(string campaignId);
    error InvalidCommitment();

    /**
     * @dev Ghi commitment của hồ sơ lên on-chain khi chuyển sang trạng thái RECEIVING
     * @param campaignId Mã định danh hồ sơ
     * @param commitment Mã băm hash(L1 + L2 + salt)
     */
    function recordCommitment(string calldata campaignId, bytes32 commitment) external {
        if (commitment == bytes32(0)) revert InvalidCommitment();
        if (records[campaignId].timestamp != 0) revert RecordAlreadyExists(campaignId);

        records[campaignId] = CampaignRecord({
            commitment: commitment,
            timestamp: block.timestamp,
            recordedBy: msg.sender
        });

        emit CommitmentRecorded(campaignId, commitment, block.timestamp, msg.sender);
    }

    /**
     * @dev Lấy thông tin record đã lưu theo campaignId
     */
    function getRecord(string calldata campaignId) external view returns (bytes32 commitment, uint256 timestamp, address recordedBy) {
        CampaignRecord memory record = records[campaignId];
        return (record.commitment, record.timestamp, record.recordedBy);
    }
}

