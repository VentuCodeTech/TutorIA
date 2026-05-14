'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Sidebar from '@/components/Sidebar';

interface Note {
  id: string;
  title: string;
  content: string;
  subject: string;
  color: string;
  created_at: string;
  updated_at: string;
}

const COLORS = ['bg-yellow-100', 'bg-blue-100', 'bg-green-100', 'bg-pink-100', 'bg-purple-100', 'bg-orange-100'];
const SUBJECTS = ['Geral', 'Matemática', 'Português', 'História', 'Ciências', 'Física', 'Química', 'Biologia', 'Geografia', 'Inglês', 'Filosofia', 'Sociologia'];

export default function AnotacoesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subject, setSubject] = useState('Geral');
  const [color, setColor] = useState(COLORS[0]);
  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState('Todos');
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const stored = localStorage.getItem(`tutoria_notes_${user.id}`);
      if (stored) {
        setNotes(JSON.parse(stored));
      }
    }
    setLoading(false);
  };

  const saveNotes = async (newNotes: Note[]) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      localStorage.setItem(`tutoria_notes_${user.id}`, JSON.stringify(newNotes));
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;
    let updated: Note[];
    if (editingId) {
      updated = notes.map(n => n.id === editingId
        ? { ...n, title, content, subject, color, updated_at: new Date().toISOString() }
        : n
      );
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        title,
        content,
        subject,
        color,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      updated = [newNote, ...notes];
    }
    setNotes(updated);
    await saveNotes(updated);
    resetForm();
  };

  const handleEdit = (note: Note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setSubject(note.subject);
    setColor(note.color);
    setShowNew(true);
  };

  const handleDelete = async (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    await saveNotes(updated);
  };

  const resetForm = () => {
    setShowNew(false);
    setEditingId(null);
    setTitle('');
    setContent('');
    setSubject('Geral');
    setColor(COLORS[0]);
  };

  const filtered = notes.filter(n => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase());
    const matchSubject = filterSubject === 'Todos' || n.subject === filterSubject;
    return matchSearch && matchSubject;
  });

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📒 Anotações</h1>
              <p className="text-gray-600 mt-1">Suas anotações de estudo, sempre sincronizadas</p>
            </div>
            <button
              onClick={() => { resetForm(); setShowNew(true); }}
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
              + Nova Anotação
            </button>
          </div>

          {showNew && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                {editingId ? 'Editar Anotação' : 'Nova Anotação'}
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Título da anotação"
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escreva sua anotação aqui..."
                className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none mb-4"
                rows={6}
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="text-sm text-gray-600 mr-2">Cor:</span>
                  {COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full ${c} border-2 ${color === c ? 'border-indigo-600' : 'border-transparent'} transition-all`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={resetForm} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
                  >
                    {editingId ? 'Salvar Alterações' : 'Salvar Anotação'}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4 mb-6">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Buscar anotações..."
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Todos">Todas matérias</option>
              {SUBJECTS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500">Carregando anotações...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📒</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {notes.length === 0 ? 'Nenhuma anotação ainda' : 'Nenhuma anotação encontrada'}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {notes.length === 0 ? 'Crie sua primeira anotação de estudo!' : 'Tente buscar com outras palavras.'}
              </p>
              {notes.length === 0 && (
                <button
                  onClick={() => { resetForm(); setShowNew(true); }}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Criar Primeira Anotação
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(note => (
                <div key={note.id} className={`${note.color} rounded-2xl p-5 relative group`}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm flex-1 pr-2">{note.title}</h3>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(note)}
                        className="text-gray-500 hover:text-indigo-600 text-xs p-1"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="text-gray-500 hover:text-red-600 text-xs p-1"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 bg-white/50 px-2 py-0.5 rounded-full mb-2 inline-block">
                    {note.subject}
                  </span>
                  <p className="text-gray-700 text-xs leading-relaxed line-clamp-4">{note.content}</p>
                  <p className="text-xs text-gray-400 mt-3">{formatDate(note.updated_at)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
