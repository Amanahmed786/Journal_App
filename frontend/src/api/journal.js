// Journal API service
import { apiClient } from './client';

// Defensive ID normalizer: handles hex string, ObjectId object {date, timestamp}, or MongoDB $oid
export function normalizeEntryId(rawId) {
  if (!rawId) return '';
  if (typeof rawId === 'string') return rawId;
  if (typeof rawId === 'object') {
    if (rawId.$oid) return rawId.$oid;
    // Fallback if object has toHexString or toString
    if (typeof rawId.toString === 'function') {
      const s = rawId.toString();
      if (s !== '[object Object]') return s;
    }
  }
  return String(rawId);
}

export function normalizeEntry(entry) {
  if (!entry) return null;
  return {
    ...entry,
    id: normalizeEntryId(entry.id),
    title: entry.title || '',
    content: entry.content || '',
    sentiment: entry.sentiment || null,
    date: entry.date || new Date().toISOString(),
  };
}

// GET /Journal - returns list of entries or empty list
export async function getJournalEntries() {
  const result = await apiClient('/Journal', { method: 'GET' });
  if (!Array.isArray(result)) return [];
  return result.map(normalizeEntry);
}

// GET /Journal/id/{id} - get single entry
export async function getJournalEntryById(id) {
  const cleanId = normalizeEntryId(id);
  const result = await apiClient(`/Journal/id/${cleanId}`, { method: 'GET' });
  return normalizeEntry(result);
}

// POST /Journal - create new entry
export async function createJournalEntry({ title, content, sentiment }) {
  const payload = {
    title: (title || '').trim(),
    content: (content || '').trim(),
    sentiment: sentiment || null,
  };

  const result = await apiClient('/Journal', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return normalizeEntry(result);
}

// PUT /Journal/id/{id} - update entry
// Backend quirk: title & content must not be null to prevent NPE
export async function updateJournalEntry(id, { title, content, sentiment }) {
  const cleanId = normalizeEntryId(id);
  const payload = {
    title: title !== undefined ? String(title) : '',
    content: content !== undefined ? String(content) : '',
    sentiment: sentiment || null,
  };

  const result = await apiClient(`/Journal/id/${cleanId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return normalizeEntry(result);
}

// DELETE /Journal/id/{id} - delete entry
export async function deleteJournalEntry(id) {
  const cleanId = normalizeEntryId(id);
  return await apiClient(`/Journal/id/${cleanId}`, {
    method: 'DELETE',
  });
}
