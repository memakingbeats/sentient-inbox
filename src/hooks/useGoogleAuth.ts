import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { GOOGLE_CONFIG, GOOGLE_URLS } from '@/lib/constants';

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  accessToken: string;
}

export const useGoogleAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const authenticate = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Construir URL de autenticação do Google
      const authUrl = new URL(GOOGLE_URLS.AUTH);
      authUrl.searchParams.set('client_id', GOOGLE_CONFIG.CLIENT_ID);
      authUrl.searchParams.set('redirect_uri', GOOGLE_CONFIG.REDIRECT_URI);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('scope', GOOGLE_CONFIG.SCOPES.join(' '));
      authUrl.searchParams.set('access_type', 'offline');
      authUrl.searchParams.set('prompt', 'consent');
      
      // Abrir popup para autenticação
      const popup = window.open(
        authUrl.toString(),
        'google-auth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        throw new Error('Popup bloqueado. Permita popups para este site.');
      }

      // Escutar mensagens do popup
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          const { user: userData, accessToken } = event.data;
          const googleUser: GoogleUser = {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            picture: userData.picture,
            accessToken
          };
          
          setUser(googleUser);
          setIsAuthenticated(true);
          localStorage.setItem('google_user', JSON.stringify(googleUser));
          toast.success('Conectado ao Gmail com sucesso!');
          popup.close();
          setIsLoading(false);
        } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
          toast.error('Erro ao conectar com Gmail: ' + event.data.error);
          popup.close();
          setIsLoading(false);
        }
      };

      window.addEventListener('message', handleMessage);
      
      // Verificar se popup foi fechado manualmente
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', handleMessage);
          setIsLoading(false);
        }
      }, 1000);

    } catch (error) {
      console.error('Erro na autenticação:', error);
      toast.error('Erro ao conectar com Gmail');
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('google_user');
    toast.success('Desconectado do Gmail');
  }, []);

  // Verificar se já existe usuário logado no localStorage
  const checkExistingAuth = useCallback(() => {
    const storedUser = localStorage.getItem('google_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('google_user');
      }
    }
  }, []);

  return {
    isAuthenticated,
    user,
    isLoading,
    authenticate,
    logout,
    checkExistingAuth
  };
};