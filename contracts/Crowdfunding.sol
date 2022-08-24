//SPDX-License-Identifier: GPL-3.0

//Contributors
//Manager
//minContribution
//deadline
//targetAmount
//raisedAmount
//noOfContributions

pragma solidity ^0.8.0;

contract CrowdFunding {
    mapping(address => uint256) public Contributors; //Links address of contributors to the donated amount and gives it to address public manager
    address public Manager;
    uint256 public minContribution;
    uint256 public deadline;
    uint256 public targetAmount;
    uint256 public raisedAmount;
    uint256 public noOfContributors;

    struct Request {
        string description;                             //Manager must tell the purpose before transferring funds
        address payable recipient;                      //It will tell who will be receiving their contributions
        uint256 value;                                  //money involved in transferring request
        bool isCompleted;                               //status of the request completed or not
        uint256 noOfVoters;                             //Total no of voters who approved
        mapping(address => bool) voters;
    }

    mapping(uint256 => Request) public requests;
    uint256 public num_of_request;                      //each request is mapped to unique number for identification

       
    constructor(uint256 _targetAmount, uint256 _deadline) {
        targetAmount = _targetAmount;
        deadline = block.timestamp + _deadline;        //block timestamp gives time in sec
        minContribution = 100 wei;
        Manager = msg.sender;                          //Deployer of this smart contract is default manager
    }
    
    //Function which handles when a contributer can send Eth and the transaction is processed only when the "require" conditions are fulfilled
    
    function sendEth() public payable {
        require(block.timestamp < deadline, "Deadline has been passed");
        require(msg.value >= 100 wei, "Minimum Contribution not met ");

        if (Contributors[msg.sender] == 0) {
    
            noOfContributors++;                         //Incrementing to increase the no of contributors after successful eth transfers
        }

        Contributors[msg.sender] += msg.value;          //Increases the amount sent by the user
        raisedAmount += msg.value;                      //Increases the overall amount
    }
    
    //Function to fetch current contract balance. It's (view only)
    
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function Refund() public {
        require(block.timestamp > deadline && raisedAmount < targetAmount);
        require(Contributors[msg.sender] > 0);         //if the refund initiator is a contributor
        address payable user = payable(msg.sender);
        user.transfer(Contributors[msg.sender]);
        // solhint-disable-next-line
        Contributors[msg.sender] = 0;
    }

    // Function to request contributions from contributors for a particular purpose
    function MakeRequest(
        string memory _description,
        address payable _recipient,
        uint256 _value
    ) public {
        require(msg.sender == Manager, "Only Manager can make a request");
        Request storage new_Request = requests[num_of_request];
        num_of_request++;
        new_Request.description = _description;
        new_Request.recipient = _recipient;
        new_Request.value = _value;
        new_Request.isCompleted = false;
        new_Request.noOfVoters = 0;
    }
    
    //function to seek approval from contributors
    
    function Voting(uint256 _num_of_request) public {
        require(Contributors[msg.sender] > 0, "You are not a contributor");
        Request storage this_Request = requests[_num_of_request];
        require(
            this_Request.voters[msg.sender] == false,
            "You have already voted"
        );
        this_Request.voters[msg.sender] = true;
        this_Request.noOfVoters++;
    }

    //Initialized only by the manager
    function MakePayment(uint256 _num_of_request) public {
        require(raisedAmount >= targetAmount);
        require(msg.sender == Manager);
        Request storage this_Request = requests[_num_of_request];
        require(
            this_Request.isCompleted == false,
            "The Payment is already done"
        );
        require(
            this_Request.noOfVoters > noOfContributors / 2,
            "Majority does not support"
        );
        this_Request.recipient.transfer(this_Request.value);
        this_Request.isCompleted = true; //transfers value to the recipient and completes the request so it cannot be initialized again
    }
}
