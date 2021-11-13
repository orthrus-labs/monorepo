// SPDX-Licence-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "base64-sol/base64.sol";

contract RandomSVG is ERC721URIStorage, VRFConsumerBase {
    bytes32 internal keyHash;
    uint256 internal fee;
    uint256 tokenCounter;
    uint256 public price;
    address payable public owner;

    // SVG Params
    uint256 public maxNumberOfPaths;
    uint256 public maxNumberOfPathCommands;
    uint256 public size;
    string[] public pathCommands;
    string[] public colors;

    mapping(bytes32 => address) public requestIdToSender;
    mapping(bytes32 => uint256) public requestIdToTokenId;
    mapping(uint256 => uint256) public tokenIdToRandomNumber;

    event RequestedRandomSVG(
        bytes32 indexed requestId,
        uint256 indexed tokenId
    );
    event CreatedUnfinishedRandomSVG(
        uint256 indexed tokenId,
        uint256 randomNumber
    );
    event CreatedRandomSVG(uint256 indexed tokenId, string svg);

    constructor(
        address _VRFCoordinator,
        address _linkToken,
        bytes32 _keyHash,
        uint256 _fee
    )
        VRFConsumerBase(
            _VRFCoordinator, // VRF Coordinator
            _linkToken // LINK Token
        )
        ERC721("Random SVG", "rsNFT")
    {
        keyHash = _keyHash;
        fee = _fee;
        tokenCounter = 0;
        maxNumberOfPaths = 10;
        maxNumberOfPathCommands = 5;
        size = 500;
        pathCommands = ["M", "L"];
        colors = ["Red", "Blue", "Yellow", "Black"];
        price = 100000000000000000; // 0.1ETH / MATIC / AVAX
        owner = payable(msg.sender);
    }

    modifier onlyOwner () {
        require(msg.sender == owner, "not owner");
        _;
    }

    function withdraw() public payable onlyOwner() {
        owner.transfer(address(this).balance);
    }

    function create() public payable returns (bytes32 requestId) {
        require(msg.value >= price, "need to send more eth");
        requestId = requestRandomness(keyHash, fee);
        requestIdToSender[requestId] = msg.sender;
        uint256 tokenId = tokenCounter;
        requestIdToTokenId[requestId] = tokenId;
        tokenCounter = tokenCounter + 1;
        emit RequestedRandomSVG(requestId, tokenId);
        // use chainlink for randomness
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomNumber)
        internal
        override
    {
        // Chainlink only 200,000 gas per request max
        // need a workaroound for everything above the above gas limit.
        address nftOwner = requestIdToSender[requestId];
        uint256 tokenId = requestIdToTokenId[requestId];
        _safeMint(nftOwner, tokenId);
        tokenIdToRandomNumber[tokenId] = randomNumber;
        emit CreatedUnfinishedRandomSVG(tokenId, randomNumber);
    }

    function finishMint(uint256 _tokenId) public {
        require(bytes(tokenURI(_tokenId)).length <= 0, "token uri already set");
        require(tokenCounter > _tokenId, "TokenDI has not been minted yet");
        require(
            tokenIdToRandomNumber[_tokenId] > 0,
            "Need to wait for Chainlink VRF"
        );
        uint256 randomNumber = tokenIdToRandomNumber[_tokenId];
        string memory svg = generateSVG(randomNumber);
        string memory imageURI = svgToImageURI(svg);
        string memory tokenURI = formatTokenURI(imageURI);
        _setTokenURI(_tokenId, tokenURI);
        emit CreatedRandomSVG(_tokenId, svg);
    }

    function svgToImageURI(string memory _svg)
        public
        pure
        returns (string memory)
    {
        //turn svg code in images into data:image/svg+xml;base64,<base-64-encoded-svg-text>
        string memory baseUrl = "data:image/svg+xml;base64,";
        string memory svgBase64Encoded = Base64.encode(
            bytes(string(abi.encodePacked(_svg)))
        );
        string memory imageURI = string(
            abi.encodePacked(baseUrl, svgBase64Encoded)
        );
        return imageURI;
    }

    function formatTokenURI(string memory _imageUri)
        public
        pure
        returns (string memory)
    {
        string memory baseUrl = "data:application/json;base64,";
        return
            string(
                abi.encodePacked(
                    baseUrl,
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name": "SVG NFT", ',
                                '"description": "An NFT based on SVG!", ',
                                '"attributes": "", ',
                                '"image": "',
                                _imageUri,
                                '"}'
                            )
                        )
                    )
                )
            );
    }

    function generateSVG(uint256 _randomNumber)
        public
        view
        returns (string memory finalSvg)
    {
        uint256 numberOfPaths = (_randomNumber % maxNumberOfPaths) + 1;
        finalSvg = string(
            abi.encodePacked(
                "<svg xmlns='http://www.w3.org/2000/svg' height='",
                uint2str(size),
                "' width='",
                uint2str(size),
                "'>'"
            )
        );
        for (uint256 i = 0; i < numberOfPaths; i++) {
            uint256 newRNG = uint256(keccak256(abi.encode(_randomNumber, i)));
            string memory pathSvg = generatePath(newRNG);
            finalSvg = string(abi.encodePacked(finalSvg, pathSvg));
        }
        finalSvg = string(string(abi.encodePacked(finalSvg, "</svg>")));
    }

    function generatePath(uint256 _randomNumber)
        public
        view
        returns (string memory pathSvg)
    {
        uint256 numberOfPathCommands = (_randomNumber %
            maxNumberOfPathCommands) + 1;
        pathSvg = "<path d='";
        for (uint256 i = 0; i < numberOfPathCommands; i++) {
            uint256 newRng = uint256(
                keccak256(abi.encode(_randomNumber, size + 1))
            );
            string memory pathCommand = generatePathCommand(_randomNumber);
        }
        string memory color = colors[_randomNumber % colors.length];
        pathSvg = string(
            abi.encodePacked(
                pathSvg,
                "' fill='transparent' stroke='",
                color,
                "'>"
            )
        );
    }

    function generatePathCommand(uint256 _randomNumber)
        public
        view
        returns (string memory pathCommand)
    {
        pathCommand = pathCommands[_randomNumber % pathCommands.length];
        uint256 parameterOne = uint256(
            keccak256(abi.encode(_randomNumber, size * 2))
        ) % size;
        uint256 parameterTwo = uint256(
            keccak256(abi.encode(_randomNumber, size * 3))
        ) % size;
        pathCommand = string(
            abi.encodePacked(
                pathCommand,
                " ",
                uint2str(parameterOne),
                " ",
                uint2str(parameterTwo)
            )
        );
    }

    function uint2str(uint256 _i)
        internal
        pure
        returns (string memory _uintAsString)
    {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - (_i / 10) * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
}
