// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";
import "@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";

contract CrossChainTokenMover is AxelarExecutable {
    IAxelarGateway immutable gateway;
    IAxelarGasService immutable gasService;
    
    constructor(address _gateway, address _gasReceiver)
        AxelarExecutable(_gateway)
    {
        gateway = IAxelarGateway(_gateway);
        gasService = IAxelarGasService(_gasReceiver);
    }

    function sendToken(
        string calldata destinationChain,
        string calldata destinationAddress,
        string calldata symbol,
        uint256 amount
    ) external payable {
        address tokenAddress = gateway.tokenAddresses(symbol);
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);
        IERC20(tokenAddress).approve(address(gateway), amount);

        bytes memory payload = abi.encode(destinationAddress);
        if (msg.value > 0) {
            gasService.payNativeGasForContractCallWithToken{value: msg.value}(
                address(this),
                destinationChain,
                destinationAddress,
                payload,
                symbol,
                amount,
                msg.sender
            );
        }
        gateway.callContractWithToken(
            destinationChain,
            destinationAddress,
            payload,
            symbol,
            amount
        );
    }

    event Executed(address indexed _from, string _value);
    
    function _execute(
        string calldata sourceChain_,
        string calldata,
        bytes calldata payload
    ) internal override {
        address recipient = abi.decode(payload, (address));
        string memory message = "Token received!";
        bytes memory messagePayload = abi.encode(message);

        // Send the message back to the sender chain
        if (msg.value > 0) {
            gasService.payNativeGasForContractCall{value: msg.value}(
                address(this),
                sourceChain_,
                recipient,
                messagePayload,
                msg.sender
            );
        }
        gateway.callContract(sourceChain_, recipient, messagePayload);

        emit Executed(msg.sender, message);
    }
}
