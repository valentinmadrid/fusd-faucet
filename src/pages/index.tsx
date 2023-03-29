import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Keypair, PublicKey } from "@solana/web3.js";
import { SendTransactionRequest } from "components/SendTransactionRequest";
import { TransactionRequestQR } from "components/TransactionRequestQR";
import useTransactionListener from "hooks/useTransactionListener";
import type { NextPage } from "next";
import { useMemo, useState } from "react";

const Home: NextPage = () => {
  const reference = useMemo(() => Keypair.generate().publicKey, []);

  const [amount, setAmount] = useState<number>(100);

  const [faucets, setFaucets] = useState([
    {
      mint: new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"),
      qrCode: false,
      imageUri:
        "https://imgs.search.brave.com/JXssxjDhwkYT7rZdMJFrlPG5eQ83wuqwa3PZ5iyzr2o/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9jcnlw/dG9sb2dvcy5jYy9s/b2dvcy91c2QtY29p/bi11c2RjLWxvZ28u/cG5n",
      name: "$dev-USDC",
      maxWithdrawal: 10_000,
    },
  ]);

  // Listen for transactions with the reference
  useTransactionListener(reference);

  return (
    <div>
      <p className="text-black">
        Make sure to set your wallet network to Devnet. You are limited to one
        airdrop every minute.
      </p>
      <div className="bg-slate-300 rounded-lg shadow-xl p-4 mt-2">
        <div className="justify-items-start">
          <WalletMultiButton style={{ backgroundColor: "blue" }} />
          <p className="mt-1 text-black text-bold">Amount:</p>
          <input
            type="number"
            className="bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded mb-3 relative z-1 flow-root"
            value={amount}
            placeholder="Amount"
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          {faucets.map((faucet) => (
            <div
              className="bg-white rounded-lg shadow-lg p-4"
              key={faucet.mint.toBase58()}
            >
              <div className="flex flex-col items-center">
                <img
                  className="w-16 h-16 rounded-full mb-2"
                  src={faucet.imageUri}
                  alt={faucet.name}
                />
                <div className="text-center">
                  <h2 className="text-lg font-medium text-black">
                    {faucet.name}
                  </h2>
                  <p className="text-gray-600">
                    Max Amount: {faucet.maxWithdrawal}
                  </p>

                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-3"
                    onClick={() =>
                      setFaucets((faucets) =>
                        faucets.map((f) =>
                          f.mint.equals(faucet.mint)
                            ? { ...f, qrCode: !f.qrCode }
                            : f
                        )
                      )
                    }
                  >
                    {" "}
                    {faucet.qrCode ? "Use Wallet" : "Use a QR Code"}
                  </button>

                  {faucet.qrCode ? (
                    <TransactionRequestQR
                      reference={reference}
                      amount={amount}
                      mint={faucet.mint}
                    />
                  ) : (
                    <SendTransactionRequest
                      reference={reference}
                      amount={amount}
                      mint={faucet.mint}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
