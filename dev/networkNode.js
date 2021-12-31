const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const Blockchain = require('./blockchain');
const rp = require('request-promise');

const app = express();
const port = process.argv[2];

const nodeAddress = uuidv4().split('-').join('');

const bitcoin = new Blockchain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/blockchain', function (req, res) {
  res.send(bitcoin);
});

app.post('/transaction', function (req, res) {
  const newTransaction = req.body;

  const blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction);

  res.json({ note: `Transaction will be added in block ${blockIndex}` });
});

app.post('/transaction/broadcast', function (req, res) {
  const requestPromises = [];
  const { amount, sender, recipient } = req.body;
  const newTransaction = bitcoin.createNewTransaction(amount, sender, recipient);

  bitcoin.addTransactionToPendingTransactions(newTransaction);

  bitcoin.networkNodes.forEach((networkNodeUrl) => {
    const requestOptions = {
      uri: `${networkNodeUrl}/transaction`,
      method: 'POST',
      body: newTransaction,
      json: true
    };

    requestPromises.push(rp(requestOptions));
  });

  Promise.all(requestPromises).then((data) => {
    res.json({ note: 'Transaction created and broadcast successfully.' });
  });
});

app.get('/mine', function (req, res) {
  const requestPromises = [];
  const lastBlock = bitcoin.getLastBlock();
  const prevBlockHash = lastBlock['hash'];
  const currentBlockData = {
    index: lastBlock['index'] + 1,
    transactions: bitcoin.pendingTransactions
  };

  const nonce = bitcoin.proofOfWork(prevBlockHash, currentBlockData);
  const blockHash = bitcoin.hashBlock(prevBlockHash, currentBlockData, nonce);
  const newBlock = bitcoin.createNewBlock(nonce, prevBlockHash, blockHash);

  bitcoin.networkNodes.forEach((networkNodeUrl) => {
    const requestOptions = {
      uri: `${networkNodeUrl}/receive-new-block`,
      method: 'POST',
      body: { newBlock },
      json: true
    };

    requestPromises.push(rp(requestOptions));
  });

  Promise.all(requestPromises)
    .then((data) => {
      const requestOptions = {
        uri: `${bitcoin.currentNodeUrl}/transaction/broadcast`,
        method: 'POST',
        body: {
          amount: 12.5,
          sender: '00',
          recipient: nodeAddress
        },
        json: true
      };

      return rp(requestOptions);
    })
    .then((data) => {
      res.json({ note: 'New block mined & broadcast successfully', block: newBlock });
    });
});

app.post('/receive-new-block', function (req, res) {
  const { newBlock } = req.body;
  const lastBlock = bitcoin.getLastBlock();
  const correctHash = lastBlock.hash === newBlock.previousBlockHash;
  const correctIndex = lastBlock['index'] + 1 === newBlock['index'];

  if (correctHash && correctIndex) {
    bitcoin.chain.push(newBlock);
    bitcoin.pendingTransactions = [];
    res.json({ note: 'New block received and accepted.', newBlock });
  } else {
    res.json({ note: 'New block rejected', newBlock });
  }
});

// register a node and broadcast it the network
app.post('/register-and-broadcast-node', function (req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  const regNodesPromises = [];

  if (bitcoin.networkNodes.indexOf(newNodeUrl) === -1) bitcoin.networkNodes.push(newNodeUrl);

  bitcoin.networkNodes.forEach((networkNodeUrl) => {
    // [/register-node]
    const requestOptions = {
      uri: `${networkNodeUrl}/register-node`,
      method: 'POST',
      body: { newNodeUrl },
      json: true
    };

    regNodesPromises.push(rp(requestOptions));
  });

  Promise.all(regNodesPromises)
    .then((data) => {
      const bulkRegisterOptions = {
        uri: `${newNodeUrl}/register-nodes-bulk`,
        method: 'POST',
        body: { allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl] },
        json: true
      };

      return rp(bulkRegisterOptions);
    })
    .then((data) => {
      res.json({ note: 'New node registered with network successfully.' });
    });
});

// register a node with the network
app.post('/register-node', function (req, res) {
  const { newNodeUrl } = req.body;
  const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) === -1;
  const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;

  if (nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(newNodeUrl);

  res.json({ note: 'New node registered successfully.' });
});

// register multiple nodes at once
app.post('/register-nodes-bulk', function (req, res) {
  const { allNetworkNodes } = req.body;

  allNetworkNodes.forEach((networkNodeUrl) => {
    const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) === -1;
    const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
    if (nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(networkNodeUrl);
  });

  res.json({ note: 'Bulk registration successful.' });
});

// CONSENSUS
app.get('/consensus', function (req, res) {
  const requestPromises = [];

  bitcoin.networkNodes.forEach((networkNodeUrl) => {
    const requestOptions = {
      uri: `${networkNodeUrl}/blockchain`,
      method: 'GET',
      json: true
    };

    requestPromises.push(rp(requestOptions));
  });

  Promise.all(requestPromises).then((blockchains) => {
    const currentChainLength = bitcoin.chain.length;
    let maxChainLength = currentChainLength;
    let newLongestChain = null;
    let newPendingTransactions = null;

    blockchains.forEach((blockchain) => {
      if (blockchain.chain.length > maxChainLength) {
        maxChainLength = blockchain.chain.length;
        newLongestChain = blockchain.chain;
        newPendingTransactions = blockchain.pendingTransactions;
      }
    });

    if (!newLongestChain || (newLongestChain && !bitcoin.chainIsValid(newLongestChain))) {
      res.json({ note: 'Current chain has not been replaced', chain: bitcoin.chain });
    } else {
      bitcoin.chain = newLongestChain;
      bitcoin.pendingTransactions = newPendingTransactions;

      res.json({
        note: 'This chain has been replaced.',
        chain: bitcoin.chain
      });
    }
  });
});

app.get('/block/:blockHash', function (req, res) {
  const { blockHash } = req.params;
  const correctBlock = bitcoin.getBlock(blockHash);

  res.json({
    block: correctBlock
  });
});

app.get('/transaction/:transactionId', function (req, res) {
  const { transactionId } = req.params;
  const { transaction, block } = bitcoin.getTransaction(transactionId);
  res.json({
    transaction,
    block
  });
});

app.get('/address/:address', function (req, res) {
  const { address } = req.params;
  const addressData = bitcoin.getAddressData(address);

  res.json({
    ...addressData
  });
});

app.get('/block-explorer', function (req, res) {
  res.sendFile('./block-explore/index.html', { root: __dirname });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}...`);
});
