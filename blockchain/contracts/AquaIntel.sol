// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AquaIntel {
    struct WaterScan {
        uint256 id;
        string status;
        uint256 quality;
        string locationName;
        uint256 timestamp;
    }

    WaterScan[] public scans;
    address public owner;

    event ScanLogged(
        uint256 indexed id,
        string status,
        uint256 quality,
        string locationName,
        uint256 timestamp
    );

    constructor() {
        owner = msg.sender;
    }

    function logScan(
        string memory _status,
        uint256 _quality,
        string memory _locationName
    ) public returns (uint256) {
        uint256 scanId = scans.length;
        scans.push(WaterScan({
            id: scanId,
            status: _status,
            quality: _quality,
            locationName: _locationName,
            timestamp: block.timestamp
        }));
        emit ScanLogged(scanId, _status, _quality, _locationName, block.timestamp);
        return scanId;
    }

    function getScan(uint256 _id) public view returns (WaterScan memory) {
        return scans[_id];
    }

    function getTotalScans() public view returns (uint256) {
        return scans.length;
    }
}
