// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  Transaction,
} from '@solana/web3.js';
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
} from '@solana/spl-token';
import * as anchor from '@project-serum/anchor';
import { Program, Idl, BN } from '@project-serum/anchor';
import idl from '../../idl/idl.json';

type POST = {
  transaction: string;
  message: string;
};

type GET = {
  label: string;
  icon: string;
};

function getFromPayload(
  req: NextApiRequest,
  payload: string,
  field: string
): string {
  function parseError() {
    throw new Error(`${payload} parse error: missing ${field}`);
  }
  let value;
  if (payload === 'Query') {
    if (!(field in req.query)) parseError();
    value = req.query[field];
  }
  if (payload === 'Body') {
    if (!req.body || !(field in req.body)) parseError();
    value = req.body[field];
  }
  if (value === undefined || value.length === 0) parseError();
  return typeof value === 'string' ? value : value[0];
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return get(req, res);
  }

  if (req.method === 'POST') {
    return post(req, res);
  }
}

const get = async (req: NextApiRequest, res: NextApiResponse<GET>) => {
  const label = 'Solana SPL Faucet';
  const icon =
    'https://media.discordapp.net/attachments/964525722301501477/978683590743302184/sol-logo1.png';

  res.status(200).json({
    label,
    icon,
  });
};

const post = async (req: NextApiRequest, res: NextApiResponse<POST>) => {
  const BOMK_MINT_ADDRESS = new PublicKey(
    '3CHKioaZLccwKUyBjDz4w8HaTHettizV3Cjb6qg2a8R4'
  );

  const accountField = getFromPayload(req, 'Body', 'account');
  const referenceField = getFromPayload(req, 'Query', 'reference');
  const amountField = getFromPayload(req, 'Query', 'amount');
  const amount = new BN(amountField);
  const mint = getFromPayload(req, 'Query', 'mint');
  const FUSD_MINT_ADDRESS = new PublicKey(mint);

  const sender = new PublicKey(accountField);
  const reference = new PublicKey(referenceField);
  const rpcUrl = process.env.RPC_ENDPOINT;
  const connection = new Connection(rpcUrl, 'confirmed');
  console.log('connection', connection);
  const mockWallet = {
    signTransaction: () => Promise.reject(),
    signAllTransactions: () => Promise.reject(),
    publicKey: Keypair.generate().publicKey,
  };
  const provider = new anchor.AnchorProvider(connection, mockWallet, {});

  const programId = new PublicKey(
    'GCGsUSYteThHoeZeT78AXHjLKmwVCVsP8WqT3GhSMLua'
  );
  const program = new anchor.Program(idl as Idl, programId, provider);

  const transaction = new Transaction();
  const latestBlockhash = await connection.getLatestBlockhash();
  transaction.feePayer = sender;
  transaction.recentBlockhash = latestBlockhash.blockhash;

  const fusdSenderATA = await getAssociatedTokenAddress(
    FUSD_MINT_ADDRESS,
    sender
  );
  const senderFusdTokenAccount = await connection.getAccountInfo(fusdSenderATA);

  if (!senderFusdTokenAccount) {
    const createFusdSenderATA = await createAssociatedTokenAccountInstruction(
      sender,
      fusdSenderATA,
      sender,
      FUSD_MINT_ADDRESS,
      new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
    );
    transaction.add(createFusdSenderATA);
  }
  const [fusdFaucetTokenAccountPk] =
    await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from('token-seed'), FUSD_MINT_ADDRESS.toBuffer()],
      programId
    );
  const [fusdFaucetPk] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from('mint'), FUSD_MINT_ADDRESS.toBuffer()],
    programId
  );

  const [withdrawPk] = await PublicKey.findProgramAddress(
    [Buffer.from('withdrawer'), sender.toBuffer()],
    programId
  );

  const clock = new anchor.web3.PublicKey(
    'SysvarC1ock11111111111111111111111111111111'
  );
  const withdrawAccount = await connection.getAccountInfo(withdrawPk);
  if (!withdrawAccount) {
    const createWithdrawAccount = await program.methods
      .initializeWithdrawer()
      .accounts({
        signer: sender,
        withdrawer: withdrawPk,
      })
      .instruction();
    transaction.add(createWithdrawAccount);
  }

  const txHash2 = await program.methods
    .withdraw(amount)
    .accounts({
      signer: sender,
      mint: FUSD_MINT_ADDRESS,
      withdrawerAccount: fusdSenderATA,
      faucetAccount: fusdFaucetTokenAccountPk,
      faucet: fusdFaucetPk,
      withdrawer: withdrawPk,
      clock: clock,
    })
    .instruction();

  txHash2.keys.push({
    pubkey: reference,
    isSigner: false,
    isWritable: false,
  });
  transaction.add(txHash2);

  // Serialize and return the unsigned transaction.
  const serializedTransaction = transaction.serialize({
    verifySignatures: false,
    requireAllSignatures: false,
  });

  const base64Transaction = serializedTransaction.toString('base64');
  const message = 'Thanks for using our faucet!';

  res.status(200).send({ transaction: base64Transaction, message });
};
