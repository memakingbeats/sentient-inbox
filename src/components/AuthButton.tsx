import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, LogOut } from 'lucide-react';
import { toast } from 'sonner';

interface AuthButtonProps {
  isAuthenticated: boolean;
  onAuthSuccess: (token: string) => void;
  onLogout: () => void;
}

export const AuthButton = ({ isAuthenticated, onAuthSuccess, onLogout }: AuthButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      // Simular autenticação por agora - você precisará implementar Google OAuth
      setTimeout(() => {
        onAuthSuccess('mock-token');
        toast.success('Conectado ao Gmail com sucesso!');
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      toast.error('Erro ao conectar com Gmail');
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    onLogout();
    toast.success('Desconectado do Gmail');
  };

  if (isAuthenticated) {
    return (
      <Button 
        onClick={handleLogout}
        variant="outline"
        className="bg-gmail-secondary border-gmail-primary text-foreground hover:bg-gmail-primary hover:text-primary-foreground"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Desconectar
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleGoogleAuth}
      disabled={isLoading}
      className="bg-gradient-to-r from-gmail-primary to-red-500 hover:from-gmail-primary hover:to-red-600 text-primary-foreground shadow-lg hover:shadow-glow transition-all duration-300"
    >
      <Mail className="w-4 h-4 mr-2" />
      {isLoading ? 'Conectando...' : 'Conectar ao Gmail'}
    </Button>
  );
};