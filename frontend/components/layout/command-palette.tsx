'use client';

import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from '@/components/ui/command';
import {
  LayoutDashboard,
  Bot,
  Activity,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Lock,
  ScrollText,
  Swords,
  Network,
  Swords as SwordIcon,
} from 'lucide-react';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();

  const navigate = (href: string) => {
    router.push(href);
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search AgentGuard..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => navigate('/')}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Overview
            <CommandShortcut>G O</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => navigate('/agents')}>
            <Bot className="mr-2 h-4 w-4" />
            Agents
            <CommandShortcut>G A</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => navigate('/activity')}>
            <Activity className="mr-2 h-4 w-4" />
            Activity
            <CommandShortcut>G E</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => navigate('/approvals')}>
            <ShieldCheck className="mr-2 h-4 w-4" />
            Approvals
            <CommandShortcut>G U</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => navigate('/threats')}>
            <AlertTriangle className="mr-2 h-4 w-4" />
            Threats
            <CommandShortcut>G T</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => navigate('/policies')}>
            <FileText className="mr-2 h-4 w-4" />
            Policies
            <CommandShortcut>G P</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => navigate('/permissions')}>
            <Lock className="mr-2 h-4 w-4" />
            Permissions
          </CommandItem>
          <CommandItem onSelect={() => navigate('/audit')}>
            <ScrollText className="mr-2 h-4 w-4" />
            Audit
            <CommandShortcut>G D</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => navigate('/simulator')}>
            <SwordIcon className="mr-2 h-4 w-4" />
            Run attack simulation
            <CommandShortcut>G S</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => navigate('/audit')}>
            <ScrollText className="mr-2 h-4 w-4" />
            Verify audit chain
          </CommandItem>
          <CommandItem onSelect={() => navigate('/mcp')}>
            <Network className="mr-2 h-4 w-4" />
            View MCP gateway
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
