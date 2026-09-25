'use client';

import React, { useState } from 'react';
import { useWorkspace } from '@/context/workspace-context';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { Dropdown } from '@/components/ui/Dropdown';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function WorkspaceSelector() {
  const { currentWorkspace, workspaces, switchWorkspace, createWorkspace } = useWorkspace();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNameChange = (val: string) => {
    setNewName(val);
    setNewSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setIsSubmitting(true);
    try {
      await createWorkspace({
        name: newName.trim(),
        slug: newSlug.trim() || newName.trim().toLowerCase(),
      });
      setIsModalOpen(false);
      setNewName('');
      setNewSlug('');
    } catch {
      // toast shown in context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <Dropdown
        trigger={
          <button className="w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 transition-all text-left group cursor-pointer">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                {currentWorkspace.logo}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate leading-none">
                  {currentWorkspace.name}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-none font-medium">
                  {currentWorkspace.plan}
                </p>
              </div>
            </div>
            <ChevronsUpDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 shrink-0" />
          </button>
        }
        align="left"
        className="w-full"
        items={[
          ...workspaces.map((ws) => ({
            id: ws.id,
            label: ws.name,
            icon: (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-bold flex items-center justify-center">
                    {ws.logo}
                  </span>
                  <span className="text-xs font-medium">{ws.name}</span>
                </div>
                {ws.id === currentWorkspace.id && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
              </div>
            ),
            onClick: () => switchWorkspace(ws.id),
          })),
          'separator',
          {
            id: 'new-ws',
            label: 'Create Workspace...',
            icon: <Plus className="w-4 h-4 text-slate-500" />,
            onClick: () => setIsModalOpen(true),
          },
        ]}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Workspace"
        description="Organize distinct marketing brands, teams, or client portfolios."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Workspace Name"
            placeholder="e.g. Acme Studio"
            value={newName}
            onChange={(e) => handleNameChange(e.target.value)}
            required
            autoFocus
          />
          <Input
            label="Workspace Slug"
            placeholder="acme-studio"
            value={newSlug}
            onChange={(e) => setNewSlug(e.target.value)}
            helperText="Identifier for the workspace"
          />
          <div className="flex items-center justify-end gap-2.5 pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              disabled={!newName.trim()}
            >
              Create Workspace
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
