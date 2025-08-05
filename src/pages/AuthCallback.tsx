import { useEffect } from 'react';
import { GOOGLE_CONFIG, GOOGLE_URLS } from '@/lib/constants';

const AuthCallback = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      // Enviar erro para a janela pai
      window.opener?.postMessage({
        type: 'GOOGLE_AUTH_ERROR',
        error: error
      }, window.location.origin);
      return;
    }

    if (code) {
      // Trocar código por token de acesso
      exchangeCodeForToken(code);
    }
  }, []);

  const exchangeCodeForToken = async (code: string) => {
    try {
      const response = await fetch(GOOGLE_URLS.TOKEN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: GOOGLE_CONFIG.CLIENT_ID,
          client_secret: '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', // Em produção, usar Supabase Edge Function
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: GOOGLE_CONFIG.REDIRECT_URI
        })
      });

      const tokenData = await response.json();

      if (tokenData.error) {
        throw new Error(tokenData.error_description || tokenData.error);
      }

      // Buscar informações do usuário
      const userResponse = await fetch(GOOGLE_URLS.USERINFO, {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      });

      const userData = await userResponse.json();

      // Enviar dados para a janela pai
      window.opener?.postMessage({
        type: 'GOOGLE_AUTH_SUCCESS',
        user: userData,
        accessToken: tokenData.access_token
      }, window.location.origin);

    } catch (error) {
      console.error('Erro ao trocar código por token:', error);
      window.opener?.postMessage({
        type: 'GOOGLE_AUTH_ERROR',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }, window.location.origin);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Processando autenticação...</h2>
        <p className="text-muted-foreground">Aguarde enquanto finalizamos o login.</p>
      </div>
    </div>
  );
};

export default AuthCallback;