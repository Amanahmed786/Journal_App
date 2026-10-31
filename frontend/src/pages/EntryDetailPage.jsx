import React, { useState, useEffect } from 'react';
import { getJournalEntryById, updateJournalEntry, deleteJournalEntry } from '../api/journal';
import { useToast } from '../context/ToastContext';
import { CONFIG } from '../config';
import EntryModal from '../components/EntryModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { ArrowLeft, Clock, Calendar, Edit2, Trash2, FileText } from 'lucide-react';

export default function EntryDetailPage({ entryId }) {
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const { showSuccess, showError } = useToast();

  const loadEntry = async () => {
    setLoading(true);
    try {
      const data = await getJournalEntryById(entryId);
      setEntry(data);
    } catch (err) {
      showError(err.message || 'Could not load journal entry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (entryId) loadEntry();
  }, [entryId]);

  const handleUpdate = async (updatedFields) => {
    const updated = await updateJournalEntry(entryId, updatedFields);
    setEntry(updated);
    showSuccess('Entry updated successfully!');
  };

  const handleDelete = async () => {
    try {
      await deleteJournalEntry(entryId);
      showSuccess('Entry deleted.');
      window.location.hash = '#/dashboard';
    } catch (err) {
      showError(err.message || 'Failed to delete entry');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Undated';
    try {
      if (Array.isArray(dateString)) {
        const [year, month, day, hour = 0, minute = 0] = dateString;
        const d = new Date(year, month - 1, day, hour, minute);
        return d.toLocaleDateString(undefined, {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      }
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return String(dateString);
      return d.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return String(dateString);
    }
  };

  const getSentimentBadge = (sentimentVal) => {
    const s = CONFIG.SENTIMENTS.find((item) => item.value === sentimentVal);
    if (!s) return null;
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
          s.value === 'HAPPY'
            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
            : s.value === 'SAD'
            ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/30'
            : s.value === 'ANGRY'
            ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/30'
            : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30'
        }`}
      >
        <span className="text-sm">{s.emoji}</span>
        <span>{s.label} Sentiment</span>
      </span>
    );
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 animate-pulse">
        <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-10 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="h-5 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-64 w-full bg-slate-200 dark:bg-slate-800 rounded-3xl mt-8" />
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold font-display">Entry not found</h2>
        <p className="mt-2 text-sm text-slate-500">The requested journal entry could not be located.</p>
        <a
          href="#/dashboard"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </a>
      </div>
    );
  }

  const wordCount = entry.content ? entry.content.trim().split(/\s+/).length : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button & Action buttons */}
      <div className="flex items-center justify-between">
        <a
          href="#/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </a>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditModalOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors flex items-center gap-1.5"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => setConfirmDeleteOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Reading Card */}
      <article className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-slate-950/50 space-y-6">
        {/* Meta badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>{getSentimentBadge(entry.sentiment)}</div>
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(entry.date)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              {wordCount} words
            </span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          {entry.title || 'Untitled Entry'}
        </h1>

        {/* Full Content */}
        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-base sm:text-lg leading-relaxed whitespace-pre-wrap pt-2">
          {entry.content}
        </div>
      </article>

      {/* Edit Modal */}
      <EntryModal
        isOpen={editModalOpen}
        initialData={entry}
        onClose={() => setEditModalOpen(false)}
        onSave={handleUpdate}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={confirmDeleteOpen}
        title="Delete this Entry"
        message={`Are you sure you want to delete "${entry.title}"? This will permanently remove it from MongoDB.`}
        confirmLabel="Delete Permanently"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
    </div>
  );
}
