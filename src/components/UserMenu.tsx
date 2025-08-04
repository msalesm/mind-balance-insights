
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, Settings, Heart } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { ThemeToggle } from "./ThemeToggle";

const UserMenu = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: 'Logout realizado',
        description: 'Você foi desconectado com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro no logout',
        description: 'Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      <ThemeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full hover-lift smooth-transition">
            <Avatar className="h-9 w-9 ring-2 ring-health-primary/20 transition-all hover:ring-health-primary/40">
              <AvatarImage src="/placeholder.svg" alt="Avatar" />
              <AvatarFallback className="bg-gradient-to-r from-health-primary to-health-accent text-white font-medium animate-fade-in">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 glass-card animate-slide-down" align="end" forceMount>
          <DropdownMenuLabel className="font-normal p-4">
            <div className="flex flex-col space-y-2">
              <p className="text-sm font-semibold leading-none font-heading">
                {user?.email?.split('@')[0] || 'Usuário'}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer hover:bg-muted/50 transition-colors p-3">
            <Settings className="mr-3 h-4 w-4 text-health-primary" />
            <span>Configurações</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer hover:bg-muted/50 transition-colors p-3">
            <Heart className="mr-3 h-4 w-4 text-health-secondary" />
            <span>Meu Perfil de Saúde</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleSignOut}
            className="cursor-pointer hover:bg-destructive/10 transition-colors p-3 text-destructive focus:text-destructive"
          >
            <LogOut className="mr-3 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;
