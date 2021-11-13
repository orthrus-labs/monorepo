// SPDX-Licence-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "base64-sol/base64.sol";

contract SVGNFT is ERC721URIStorage {
    uint256 tokenCounter;

    constructor() ERC721("SVG NFT", "svgNFT") {
        tokenCounter = 0;
    }

    event CreatedSVGNFT(uint256 indexed tokenId, string tokenUri);

    function create(string memory _svg) public {
        _safeMint(msg.sender, tokenCounter);
        string memory imageURI = svgToImageURI(_svg);
        string memory tokenURI = formatTokenURI(imageURI);
        _setTokenURI(tokenCounter, tokenURI);
        emit CreatedSVGNFT(tokenCounter, tokenURI);
        tokenCounter = tokenCounter + 1;
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
}
