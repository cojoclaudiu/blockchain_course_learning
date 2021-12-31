const Blockchain = require('./blockchain');
const bitcoin = new Blockchain();

const bc1 = {
  chain: [
    {
      index: 1,
      timestamp: 1640905177637,
      transactions: [],
      nonce: 100,
      hash: '0',
      previousBlockHash: '0'
    },
    {
      index: 2,
      timestamp: 1640905225347,
      transactions: [],
      nonce: 5672,
      hash: '00002b62f1205be4a02b5f13b07344e7dbbe80088ec44327c34971412405da12',
      previousBlockHash: '0'
    },
    {
      index: 3,
      timestamp: 1640905284079,
      transactions: [
        {
          transactionId: '0fcb0d1048554837be9fbe324b87e551',
          amount: 12.5,
          sender: '00',
          recipient: '5caacf7a4baf41d0be5ee212569f5d66'
        },
        {
          transactionId: '0fcb0d1048554837be9fbe324b87e551',
          amount: 10,
          sender: 'saasfaf214qwf',
          recipient: 'fkbkajcaxca'
        },
        {
          transactionId: '0fcb0d1048554837be9fbe324b87e551',
          amount: 20,
          sender: 'saasfaf214qwf',
          recipient: 'fkbkajcaxca'
        },
        {
          transactionId: '0fcb0d1048554837be9fbe324b87e551',
          amount: 30,
          sender: 'saasfaf214qwf',
          recipient: 'fkbkajcaxca'
        }
      ],
      nonce: 133287,
      hash: '000034a1e81768b574c68d12347773e0154d683fd73ee64f18f0364bdd474448',
      previousBlockHash: '00002b62f1205be4a02b5f13b07344e7dbbe80088ec44327c34971412405da12'
    },
    {
      index: 4,
      timestamp: 1640905326211,
      transactions: [
        {
          transactionId: '0fcb0d1048554837be9fbe324b87e551',
          amount: 12.5,
          sender: '00',
          recipient: '5caacf7a4baf41d0be5ee212569f5d66'
        },
        {
          transactionId: '0fcb0d1048554837be9fbe324b87e551',
          amount: 40,
          sender: 'saasfaf214qwf',
          recipient: 'fkbkajcaxca'
        },
        {
          transactionId: '0fcb0d1048554837be9fbe324b87e551',
          amount: 50,
          sender: 'saasfaf214qwf',
          recipient: 'fkbkajcaxca'
        },
        {
          transactionId: '0fcb0d1048554837be9fbe324b87e551',
          amount: 60,
          sender: 'saasfaf214qwf',
          recipient: 'fkbkajcaxca'
        },
        {
          transactionId: '0fcb0d1048554837be9fbe324b87e551',
          amount: 70,
          sender: 'saasfaf214qwf',
          recipient: 'fkbkajcaxca'
        }
      ],
      nonce: 9898,
      hash: '000037feeb346a5294e960846e754d20b801f28e838f9800427a52bfe0f435aa',
      previousBlockHash: '000034a1e81768b574c68d12347773e0154d683fd73ee64f18f0364bdd474448'
    },
    {
      index: 5,
      timestamp: 1640905344374,
      transactions: [
        {
          transactionId: '0fcb0d1048554837be9fbe324b87e551',
          amount: 12.5,
          sender: '00',
          recipient: '5caacf7a4baf41d0be5ee212569f5d66'
        }
      ],
      nonce: 14539,
      hash: '00004f0dbdbbbde3c5af1304105ab454c6f5a085363337f9f21d7ee2591cf280',
      previousBlockHash: '000037feeb346a5294e960846e754d20b801f28e838f9800427a52bfe0f435aa'
    },
    {
      index: 6,
      timestamp: 1640905345305,
      transactions: [
        {
          transactionId: '0fcb0d1048554837be9fbe324b87e551',
          amount: 12.5,
          sender: '00',
          recipient: '5caacf7a4baf41d0be5ee212569f5d66'
        }
      ],
      nonce: 69991,
      hash: '0000fd110425df5de73f98fb12adc5ec7eded24b631e3e558c4acca760cd637b',
      previousBlockHash: '00004f0dbdbbbde3c5af1304105ab454c6f5a085363337f9f21d7ee2591cf280'
    }
  ],
  pendingTransactions: [
    {
      transactionId: '0fcb0d1048554837be9fbe324b87e551',
      amount: 12.5,
      sender: '00',
      recipient: '5caacf7a4baf41d0be5ee212569f5d66'
    }
  ],
  currentNodeUrl: 'http://localhost:3001',
  networkNodes: []
};

console.log('VALID: ', bitcoin.chainIsValid(bc1.chain));
