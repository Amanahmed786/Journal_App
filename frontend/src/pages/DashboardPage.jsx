import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  getJournalEntries,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
} from '../api/journal';
import { getUserGreeting } from '../api/user';
import { CONFIG } from '../config';
import EntryModal from '../components/EntryModal';
import ConfirmDialog from '../components/ConfirmDialog';
import {
  Plus,
  Search,
  SlidersHorizontal,
  Calendar,
  Clock,
  Sparkles,
  CloudSun,
  Edit2,
  Trash2,
  BookOpen,
  ArrowUpDown,
  FileText,
  Smile,
  BarChart2,
} from 'lucide-react';

export default function DashboardPage({ triggerNewEntry, onResetTrigger }) {
  const { user } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();

  const [entries, setEntries] = useState([]);
  const [greeting, setGreeting] = useState('');
  const [loading, setLoading] = useState(true);

  // Filters & sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSentiment, setSelectedSentiment] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'title'

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  // Delete dialog
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Trigger from navbar "+ New Entry"
  useEffect(() => {
    if (triggerNewEntry) {
      setEditingEntry(null);
      setModalOpen(true);
      if (onResetTrigger) onResetTrigger();
    }
  }, [triggerNewEntry, onResetTrigger]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [fetchedEntries, greetingText] = await Promise.all([
        getJournalEntries(),
        getUserGreeting(),
      ]);
      setEntries(fetchedEntries || []);
      setGreeting(greetingText || '');
    } catch (err) {
      showError(err.message || 'Could not retrieve journal entries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Stats calculation
  const stats = useMemo(() => {
    const total = entries.length;
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    let thisWeek = 0;
    let totalWords = 0;
    const sentimentCounts = {};

    entries.forEach((e) => {
      const entryTime = e.date ? new Date(e.date).getTime() : 0;
      if (entryTime >= oneWeekAgo) {
        thisWeek++;
      }
      const words = e.content ? e.content.trim().split(/\s+/).length : 0;
      totalWords += words;

      if (e.sentiment) {
        sentimentCounts[e.sentiment] = (sentimentCounts[e.sentiment] || 0) + 1;
      }
    });

    let topSentiment = null;
    let maxCount = 0;
    for (const [sent, count] of Object.entries(sentimentCounts)) {
      if (count > maxCount) {
        topSentiment = sent;
        maxCount = count;
      }
    }

    return { total, thisWeek, totalWords, topSentiment };
  }, [entries]);

  // Filter & sort entries
  const filteredEntries = useMemo(() => {
    let result = [...entries];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) => (e.title && e.title.toLowerCase().includes(q)) || (e.content && e.content.toLowerCase().includes(q))
      );
    }

    if (selectedSentiment !== 'ALL') {
      result = result.filter((e) => e.sentiment === selectedSentiment);
    }

    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.date || 0) - new Date(a.date || 0);
      }
      if (sortBy === 'oldest') {
        return new Date(a.date || 0) - new Date(b.date || 0);
      }
      if (sortBy === 'title') {
        return (a.title || '').localeCompare(b.title || '');
      }
      return 0;
    });

    return result;
  }, [entries, searchQuery, selectedSentiment, sortBy]);

  // Create / Update handler
  const handleSaveEntry = async (entryData) => {
    if (editingEntry) {
      // Optimistic update
      const previous = [...entries];
      const updatedList = entries.map((e) =>
        e.id === editingEntry.id ? { ...e, ...entryData } : e
      );
      setEntries(updatedList);

      try {
        const saved = await updateJournalEntry(editingEntry.id, entryData);
        setEntries((prev) => prev.map((e) => (e.id === editingEntry.id ? saved : e)));
        showSuccess('Entry updated successfully!');
      } catch (err) {
        // Rollback
        setEntries(previous);
        throw err;
      }
    } else {
      // Create new
      const saved = await createJournalEntry(entryData);
      setEntries((prev) => [saved, ...prev]);
      showSuccess('New journal entry created!');
    }
  };

  // Delete handler with Undo support
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);

    // Optimistic remove
    const previousEntries = [...entries];
    setEntries((prev) => prev.filter((e) => e.id !== target.id));

    let undone = false;

    // Toast with Undo action
    showInfo(`Deleted "${target.title || 'Entry'}"`, {
      duration: 6000,
      action: {
        label: 'Undo',
        onClick: async () => {
          undone = true;
          // Restore entry via create
          try {
            const restored = await createJournalEntry({
              title: target.title,
              content: target.content,
              sentiment: target.sentiment,
            });
            setEntries((prev) => [restored, ...prev]);
            showSuccess('Entry restored!');
          } catch (e) {
            setEntries(previousEntries);
            showError('Could not restore entry');
          }
        },
      },
    });

    // Actually delete on server
    try {
      await deleteJournalEntry(target.id);
    } catch (err) {
      if (!undone) {
        setEntries(previousEntries);
        showError(err.message || 'Failed to delete entry');
      }
    }
  };

  const getSentimentBadge = (sentimentVal) => {
    const s = CONFIG.SENTIMENTS.find((item) => item.value === sentimentVal);
    if (!s) return null;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
          s.value === 'HAPPY'
            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
            : s.value === 'SAD'
            ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/30'
            : s.value === 'ANGRY'
            ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/30'
            : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30'
        }`}
      >
        <span>{s.emoji}</span>
        <span>{s.label}</span>
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Undated';
    try {
      // Defensive parsing for array date [yyyy, mm, dd, hh, mm] or ISO string
      if (Array.isArray(dateString)) {
        const [year, month, day, hour = 0, minute = 0] = dateString;
        const d = new Date(year, month - 1, day, hour, minute);
        return d.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      }
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return String(dateString);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return String(dateString);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Greeting Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-900/20 via-violet-900/10 to-transparent border border-brand-500/20 shadow-sm backdrop-blur-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">
              {greeting ? (
                <span>{greeting}</span>
              ) : (
                <span>Hello, {user?.username || 'Writer'} 👋</span>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Personalized live weather & journal metrics delivered from the Spring Boot API.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingEntry(null);
              setModalOpen(true);
            }}
            className="self-start md:self-auto px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm shadow-md shadow-brand-500/20 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Write New Entry</span>
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Entries</span>
            <BookOpen className="w-4 h-4 text-brand-500" />
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">
            {stats.total}
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Past 7 Days</span>
            <Calendar className="w-4 h-4 text-brand-500" />
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">
            {stats.thisWeek}
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Words</span>
            <FileText className="w-4 h-4 text-brand-500" />
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">
            {stats.totalWords.toLocaleString()}
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Top Mood</span>
            <Smile className="w-4 h-4 text-brand-500" />
          </div>
          <div className="mt-2">
            {stats.topSentiment ? (
              getSentimentBadge(stats.topSentiment)
            ) : (
              <span className="text-sm font-medium text-slate-400">Neutral</span>
            )}
          </div>
        </div>
      </div>

      {/* Search, Filter & Sort Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search entries by title or text..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs sm:text-sm shadow-sm"
          />
        </div>

        {/* Sentiment & Sort controls */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <select
            value={selectedSentiment}
            onChange={(e) => setSelectedSentiment(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
          >
            <option value="ALL">All Moods</option>
            {CONFIG.SENTIMENTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.emoji} {s.label}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Title (A - Z)</option>
          </select>
        </div>
      </div>

      {/* Content Area: Skeletons, Grid or Empty State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse space-y-4"
            >
              <div className="flex justify-between items-center">
                <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
                <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
              <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 mx-auto flex items-center justify-center mb-4">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white">
            {searchQuery || selectedSentiment !== 'ALL'
              ? 'No matching entries found'
              : 'Your journal is waiting for its first thought'}
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {searchQuery || selectedSentiment !== 'ALL'
              ? 'Try adjusting your search criteria or sentiment filter.'
              : 'Record architectural designs, debugging logs, personal goals, or sprint retrospectives.'}
          </p>
          <button
            onClick={() => {
              if (searchQuery || selectedSentiment !== 'ALL') {
                setSearchQuery('');
                setSelectedSentiment('ALL');
              } else {
                setEditingEntry(null);
                setModalOpen(true);
              }
            }}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all"
          >
            {searchQuery || selectedSentiment !== 'ALL' ? 'Clear Filters' : 'Create First Entry'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntries.map((entry) => {
            const words = entry.content ? entry.content.trim().split(/\s+/).length : 0;

            return (
              <div
                key={entry.id}
                className="group relative flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-brand-500/40 hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div>
                  {/* Card top bar */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div>{getSentimentBadge(entry.sentiment)}</div>
                    <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(entry.date)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2">
                    <a href={`#/entry/${entry.id}`}>{entry.title || 'Untitled Entry'}</a>
                  </h3>

                  {/* Snippet */}
                  <p className="mt-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-4 leading-relaxed whitespace-pre-wrap">
                    {entry.content || 'No content provided.'}
                  </p>
                </div>

                {/* Card footer */}
                <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>{words} words</span>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <a
                      href={`#/entry/${entry.id}`}
                      className="p-1.5 rounded-lg hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Read entry"
                      aria-label="Read entry"
                    >
                      <BookOpen className="w-4 h-4" />
                    </a>

                    <button
                      onClick={() => {
                        setEditingEntry(entry);
                        setModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Edit entry"
                      aria-label="Edit entry"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setDeleteTarget(entry)}
                      className="p-1.5 rounded-lg hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Delete entry"
                      aria-label="Delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Entry Modal for Create & Edit */}
      <EntryModal
        isOpen={modalOpen}
        initialData={editingEntry}
        onClose={() => {
          setModalOpen(false);
          setEditingEntry(null);
        }}
        onSave={handleSaveEntry}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Journal Entry"
        message={`Are you sure you want to delete "${deleteTarget?.title || 'this entry'}"? This action can be undone immediately from the toast notification.`}
        confirmLabel="Delete Entry"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
