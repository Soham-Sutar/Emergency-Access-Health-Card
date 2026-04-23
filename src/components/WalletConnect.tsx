import { Wallet, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWeb3 } from '@/hooks/useWeb3';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const WalletConnect = () => {
  const { account, connected, connectWallet, disconnectWallet } = useWeb3();

  if (!connected) {
    return (
      <Button variant="medical" onClick={connectWallet}>
        <Wallet className="mr-2 h-4 w-4" />
        Connect MetaMask
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Wallet className="mr-2 h-4 w-4" />
          {account?.substring(0, 6)}...{account?.substring(38)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Wallet Connected</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-xs font-mono">{account}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={disconnectWallet} className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
