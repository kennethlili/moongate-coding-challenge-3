import { Button } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { SiweMessage } from "siwe";
import ConnectWalletButton from "../components/ConnectWalletButton";

export default function Home() {
  const [wallet, setWallet] = useState("");
  const [loading, setLoading] = useState(false);

  const onClick = useCallback(() => {
    setLoading(true);
  }, []);

  const verifySignature = async ({
    message,
    signature,
  }: {
    message: SiweMessage;
    signature: string;
  }) => {
    const response = await fetch("/api/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, signature }),
    });
    const responseBody = await response.json();

    if (!responseBody.success) {
      console.error("Failed to verify signature", responseBody.message);
      onError();
    } else if (responseBody.success) {
      return true;
    }
  };

  const onSuccess = useCallback(
    async (message: SiweMessage, signature: string) => {
      setLoading(false);
      const verified = await verifySignature({ message, signature });
      if (verified) {
        setWallet(message.address);
      }
    },
    []
  );

  const onError = useCallback(() => {
    setLoading(false);
    setWallet("");
  }, []);

  return (
    <div className="container m-auto p-8 flex flex-col gap-8">
      <h1>Wallet: {wallet || "Not Connected"}</h1>

      <div className="flex flex-col gap-4  items-start">
        <ConnectWalletButton
          onClick={onClick}
          onSuccess={onSuccess}
          onError={onError}
        >
          <WalletButtonContent wallet={wallet} />
        </ConnectWalletButton>
      </div>
    </div>
  );
}

interface WalletButtonContentProps {
  wallet: string;
}

function WalletButtonContent({ wallet }: WalletButtonContentProps) {
  if (!wallet) {
    return (
      <Button className="flex w-fit bg-blue-500 p-4" as="div">
        Connect Wallet
      </Button>
    );
  }

  return (
    <Button className="flex w-fit bg-blue-500 p-4" as="div">
      Congratulations! You have connected to {wallet}
    </Button>
  );
}
