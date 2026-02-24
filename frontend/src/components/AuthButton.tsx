import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, Loader2 } from 'lucide-react';

export default function AuthButton() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();

  const isLoggingIn = loginStatus === 'logging-in';
  const isAuthenticated = identity && !identity.getPrincipal().isAnonymous();

  if (isAuthenticated) {
    const principal = identity.getPrincipal().toString();
    const shortPrincipal = `${principal.slice(0, 8)}...${principal.slice(-6)}`;

    return (
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-xs text-muted-foreground">Logged in as</span>
          <span className="text-sm font-mono text-neon-blue">{shortPrincipal}</span>
        </div>
        <Button
          onClick={clear}
          variant="outline"
          size="sm"
          className="border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10 hover:text-neon-blue"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={login}
      disabled={isLoggingIn}
      className="bg-neon-blue text-background hover:bg-neon-blue-bright hover:shadow-neon"
    >
      {isLoggingIn ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <LogIn className="mr-2 h-4 w-4" />
          Login
        </>
      )}
    </Button>
  );
}
