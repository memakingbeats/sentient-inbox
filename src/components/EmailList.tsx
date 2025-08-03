import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  MailOpen, 
  Star, 
  Paperclip, 
  Clock,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export interface Email {
  id: string;
  subject: string;
  sender: string;
  snippet: string;
  date: string;
  isRead: boolean;
  isImportant: boolean;
  hasAttachments: boolean;
  labels: string[];
}

interface EmailListProps {
  token: string;
}

// Mock data para demonstração
const mockEmails: Email[] = [
  {
    id: '1',
    subject: 'Relatório Mensal de Vendas',
    sender: 'joao@empresa.com',
    snippet: 'Segue em anexo o relatório mensal de vendas com os números atualizados...',
    date: '2025-01-15 10:30',
    isRead: false,
    isImportant: true,
    hasAttachments: true,
    labels: ['Trabalho', 'Relatórios']
  },
  {
    id: '2', 
    subject: 'Reunião de equipe - Amanhã às 14h',
    sender: 'maria@empresa.com',
    snippet: 'Lembrete da reunião de equipe marcada para amanhã às 14h na sala de conferências...',
    date: '2025-01-15 09:15',
    isRead: true,
    isImportant: false,
    hasAttachments: false,
    labels: ['Trabalho']
  },
  {
    id: '3',
    subject: 'Proposta de Parceria',
    sender: 'contato@parceiro.com',
    snippet: 'Gostaríamos de apresentar uma proposta de parceria estratégica...',
    date: '2025-01-14 16:45',
    isRead: false,
    isImportant: true,
    hasAttachments: true,
    labels: ['Negócios', 'Parceria']
  }
];

export const EmailList = ({ token }: EmailListProps) => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  useEffect(() => {
    loadEmails();
  }, [token]);

  const loadEmails = async () => {
    setLoading(true);
    try {
      // Simular carregamento de emails
      setTimeout(() => {
        setEmails(mockEmails);
        setLoading(false);
        toast.success(`${mockEmails.length} emails carregados`);
      }, 1000);
    } catch (error) {
      toast.error('Erro ao carregar emails');
      setLoading(false);
    }
  };

  const markAsRead = (emailId: string) => {
    setEmails(emails.map(email => 
      email.id === emailId ? { ...email, isRead: true } : email
    ));
  };

  const filteredEmails = emails.filter(email =>
    email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.snippet.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-full gap-4">
      {/* Lista de emails */}
      <div className="w-1/2 flex flex-col">
        <Card className="flex-1 bg-gradient-to-br from-card to-gmail-secondary border-gmail-primary/20">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gmail-primary to-red-400 bg-clip-text text-transparent">
                Caixa de Entrada
              </h2>
              <div className="flex gap-2">
                <Button 
                  onClick={loadEmails}
                  disabled={loading}
                  size="sm"
                  variant="outline"
                  className="border-gmail-primary/30 hover:border-gmail-primary"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
                <Button size="sm" variant="outline" className="border-gmail-primary/30 hover:border-gmail-primary">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gmail-secondary border-gmail-primary/30 focus:border-gmail-primary"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-[500px]">
              {filteredEmails.map((email, index) => (
                <div key={email.id}>
                  <div 
                    className={`p-4 hover:bg-gmail-secondary/50 cursor-pointer transition-colors ${
                      selectedEmail?.id === email.id ? 'bg-gmail-primary/10' : ''
                    }`}
                    onClick={() => {
                      setSelectedEmail(email);
                      if (!email.isRead) markAsRead(email.id);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {email.isRead ? (
                          <MailOpen className="w-4 h-4 text-gmail-read" />
                        ) : (
                          <Mail className="w-4 h-4 text-gmail-unread" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-medium truncate ${
                            email.isRead ? 'text-gmail-read' : 'text-foreground'
                          }`}>
                            {email.sender}
                          </span>
                          {email.isImportant && (
                            <Star className="w-3 h-3 text-gmail-important fill-current" />
                          )}
                          {email.hasAttachments && (
                            <Paperclip className="w-3 h-3 text-gmail-attachment" />
                          )}
                        </div>
                        <h3 className={`text-sm mb-1 truncate ${
                          email.isRead ? 'text-gmail-read' : 'text-foreground font-medium'
                        }`}>
                          {email.subject}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate mb-2">
                          {email.snippet}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1">
                            {email.labels.map(label => (
                              <Badge 
                                key={label} 
                                variant="secondary"
                                className="text-xs bg-gmail-primary/20 text-gmail-primary"
                              >
                                {label}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {email.date}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < filteredEmails.length - 1 && <Separator className="bg-border/30" />}
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Visualizador de email */}
      <div className="w-1/2">
        <Card className="h-full bg-gradient-to-br from-card to-gmail-secondary border-gmail-primary/20">
          {selectedEmail ? (
            <>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-2">{selectedEmail.subject}</h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>De: {selectedEmail.sender}</span>
                      <span>•</span>
                      <span>{selectedEmail.date}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {selectedEmail.isImportant && (
                      <Star className="w-4 h-4 text-gmail-important fill-current" />
                    )}
                    {selectedEmail.hasAttachments && (
                      <Paperclip className="w-4 h-4 text-gmail-attachment" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap">{selectedEmail.snippet}</p>
                    <br />
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
                    <br />
                    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                  </div>
                </ScrollArea>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Selecione um email para visualizar</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};