import { Button } from '@/components/ui/button';
import { Mail, LogOut } from 'lucide-react';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';

export const AuthButton = () => {
  const { isAuthenticated, user, isLoading, authenticate, logout } = useGoogleAuth();

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <img 
            src={user.picture} 
            alt={user.name}
            className="w-8 h-8 rounded-full"
          />
          <div className="hidden sm:block">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Button 
          onClick={logout}
          variant="outline"
          size="sm"
          className="bg-gmail-secondary border-gmail-primary text-foreground hover:bg-gmail-primary hover:text-primary-foreground"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </div>
    );
  }

  return (
    <Button 
      onClick={authenticate}
      disabled={isLoading}
      className="bg-gradient-to-r from-gmail-primary to-red-500 hover:from-gmail-primary hover:to-red-600 text-primary-foreground shadow-lg hover:shadow-glow transition-all duration-300"
    >
      <Mail className="w-4 h-4 mr-2" />
      {isLoading ? 'Conectando...' : 'Conectar ao Gmail'}
    </Button>
  );
};