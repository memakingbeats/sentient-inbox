// Configurações do Google OAuth
export const GOOGLE_CONFIG = {
  CLIENT_ID: '349138754128-40n1hlg6rasd1hig7e89sg6saehfae47.apps.googleusercontent.com',
  SCOPES: [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ],
  REDIRECT_URI: `${window.location.origin}/auth/callback`
};

// URLs da API do Google
export const GOOGLE_URLS = {
  AUTH: 'https://accounts.google.com/o/oauth2/v2/auth',
  TOKEN: 'https://oauth2.googleapis.com/token',
  USERINFO: 'https://www.googleapis.com/oauth2/v2/userinfo',
  GMAIL_API: 'https://gmail.googleapis.com/gmail/v1'
};