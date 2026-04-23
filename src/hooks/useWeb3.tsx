import React, { createContext, useContext, useEffect, useState } from "react";
import Web3 from "web3";
import { toast } from "@/hooks/use-toast";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface Web3State {
  web3: Web3 | null;
  account: string | null;
  connected: boolean;
  chainId: number | null;
}

type Web3ContextValue = Web3State & {
  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => void;
};

const Web3Context = createContext<Web3ContextValue | null>(null);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<Web3State>({
    web3: null,
    account: null,
    connected: false,
    chainId: null,
  });

  const connectWallet = async (): Promise<boolean> => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask to use this application.",
        variant: "destructive",
      });
      return false;
    }

    try {
      const web3Instance = new Web3(window.ethereum);
      const accounts: string[] = await window.ethereum.request({ method: "eth_requestAccounts" });
      const chainId = await web3Instance.eth.getChainId();

      setState({
        web3: web3Instance,
        account: accounts[0] || null,
        connected: Boolean(accounts && accounts.length > 0),
        chainId: Number(chainId),
      });

      toast({
        title: "Wallet Connected",
        description: accounts[0] ? `${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}` : "Connected",
      });

      return true;
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to MetaMask. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const disconnectWallet = () => {
    setState({
      web3: null,
      account: null,
      connected: false,
      chainId: null,
    });
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (!accounts || accounts.length === 0) {
        disconnectWallet();
      } else {
        setState((prev) => ({ ...prev, account: accounts[0], connected: true }));
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    (async () => {
      try {
        const web3Instance = new Web3(window.ethereum);
        const accounts: string[] = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts && accounts.length > 0) {
          const chainId = await web3Instance.eth.getChainId();
          setState({
            web3: web3Instance,
            account: accounts[0],
            connected: true,
            chainId: Number(chainId),
          });
        }
      } catch {
        // ignore
      }
    })();

    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  return (
    <Web3Context.Provider value={{ ...state, connectWallet, disconnectWallet }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = (): Web3ContextValue => {
  const ctx = useContext(Web3Context);
  if (!ctx) {
    throw new Error("useWeb3 must be used within a Web3Provider. Wrap your app with <Web3Provider />");
  }
  return ctx;
};