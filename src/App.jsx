/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  FileText, 
  Calculator as CalcIcon, 
  Settings, 
  Plus, 
  Trash2, 
  ChevronRight,
  Gamepad2,
  X,
  Search,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';

const TEXTBOOKS = [
  { id: '1', title: 'Advanced Calculus', subject: 'Mathematics', author: 'Dr. Emily Stone', cover: 'https://picsum.photos/seed/math/200/300' },
  { id: '2', title: 'Quantum Physics', subject: 'Physics', author: 'Prof. Alan Watts', cover: 'https://picsum.photos/seed/physics/200/300' },
  { id: '3', title: 'World History', subject: 'History', author: 'Sarah Jenkins', cover: 'https://picsum.photos/seed/history/200/300' },
  { id: '4', title: 'Organic Chemistry', subject: 'Chemistry', author: 'Dr. Robert Boyle', cover: 'https://picsum.photos/seed/chem/200/300' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('notes');
  const [isSecretUnlocked, setIsSecretUnlocked] = useState(false);
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('studyhub_notes');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Welcome to StudyHub', content: 'Start taking notes for your classes here!', date: new Date().toLocaleDateString() }
    ];
  });
  const [selectedNote, setSelectedNote] = useState(notes[0]);
  const [calcDisplay, setCalcDisplay] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    localStorage.setItem('studyhub_notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      date: new Date().toLocaleDateString()
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
  };

  const deleteNote = (id) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    if (selectedNote?.id === id) {
      setSelectedNote(updated[0] || null);
    }
  };

  const updateNote = (id, field, value) => {
    const updated = notes.map(n => n.id === id ? { ...n, [field]: value } : n);
    setNotes(updated);
    if (selectedNote?.id === id) {
      setSelectedNote({ ...selectedNote, [field]: value });
    }
  };

  const handleCalcClick = (val) => {
    if (val === '=') {
      if (calcDisplay === '412') {
        setIsSecretUnlocked(true);
        setCalcDisplay('');
      } else {
        try {
          // Safer evaluation using Function constructor instead of eval
          // and basic sanitization
          const sanitized = calcDisplay.replace(/[^-+*/0-9.]/g, '');
          if (sanitized) {
            // eslint-disable-next-line no-new-func
            const result = new Function(`return ${sanitized}`)();
            setCalcDisplay(result.toString());
          }
        } catch {
          setCalcDisplay('Error');
        }
      }
    } else if (val === 'C') {
      setCalcDisplay('');
    } else {
      // Prevent multiple operators in a row
      const lastChar = calcDisplay.slice(-1);
      const operators = ['+', '-', '*', '/'];
      if (operators.includes(val) && (calcDisplay === '' || operators.includes(lastChar))) {
        return;
      }
      setCalcDisplay(prev => prev + val);
    }
  };

  const [gameLoading, setGameLoading] = useState(false);

  const openGame = (game) => {
    setGameLoading(true);
    setSelectedGame(game);
    // Simulate a "Flash" loading feel
    setTimeout(() => setGameLoading(false), 1500);
  };

  if (isSecretUnlocked) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white p-8 font-mono">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-600 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)]">
                <Gamepad2 className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tighter uppercase italic">Unblocked Zone</h1>
                <p className="text-xs text-indigo-400 mt-1">v4.1.2 // ACCESS GRANTED</p>
              </div>
            </div>
            <button 
              onClick={() => setIsSecretUnlocked(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors group"
            >
              <X className="w-8 h-8 group-hover:rotate-90 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gamesData.map((game) => (
              <motion.div 
                key={game.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden cursor-pointer group hover:border-indigo-500/50 transition-colors"
                onClick={() => openGame(game)}
              >
                <div className="aspect-video bg-zinc-800 flex items-center justify-center relative overflow-hidden border-b-4 border-indigo-600/30 group-hover:border-indigo-600 transition-colors">
                  <img 
                    src={game.thumbnail} 
                    alt={game.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent opacity-60" />
                  <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Gamepad2 className="w-12 h-12 text-zinc-700 group-hover:text-indigo-400 transition-colors z-10" />
                  <div className="absolute bottom-4 left-4 z-10">
                    <span className="px-2 py-1 bg-indigo-600 text-[10px] font-bold rounded uppercase tracking-widest">Play Now</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-400 transition-colors">{game.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{game.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {selectedGame && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
            >
              <div className="relative w-full max-w-5xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-black italic uppercase tracking-tighter text-indigo-400">
                    {selectedGame.title}
                  </h2>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => {
                        const iframe = document.querySelector('iframe');
                        if (iframe) {
                          if (iframe.requestFullscreen) {
                            iframe.requestFullscreen();
                          } else if (iframe.webkitRequestFullscreen) {
                            iframe.webkitRequestFullscreen();
                          } else if (iframe.msRequestFullscreen) {
                            iframe.msRequestFullscreen();
                          }
                        }
                      }}
                      className="text-white hover:text-indigo-400 flex items-center gap-2 font-bold uppercase text-xs tracking-widest bg-white/5 px-4 py-2 rounded-full transition-all"
                    >
                      Fullscreen
                    </button>
                    <button 
                      onClick={() => setSelectedGame(null)}
                      className="text-white hover:text-red-500 flex items-center gap-2 font-bold uppercase text-xs tracking-widest bg-white/5 px-4 py-2 rounded-full transition-all"
                    >
                      <X className="w-4 h-4" /> Close
                    </button>
                  </div>
                </div>
                
                  <div className="game-container relative border-4 border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    <div className="absolute top-2 left-2 z-20 flex items-center gap-1 opacity-40">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-[8px] font-black text-white uppercase tracking-tighter">Flash Player 11.2</span>
                    </div>
                    {gameLoading ? (
                      <div className="absolute inset-0 bg-zinc-900 flex flex-col items-center justify-center">
                        <div className="mb-8 relative">
                          <div className="w-20 h-20 border-4 border-indigo-600 rounded-full animate-spin border-t-transparent" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-black text-indigo-400 italic">f</span>
                          </div>
                        </div>
                        <div className="w-64 h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-4">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1.2, ease: "easeInOut" }}
                            className="h-full bg-indigo-600"
                          />
                        </div>
                        <p className="text-indigo-400 text-[10px] font-bold animate-pulse tracking-[0.4em] uppercase">Initializing Flash Engine...</p>
                      </div>
                    ) : (
                    <iframe 
                      src={selectedGame.url} 
                      className="w-full h-full border-none"
                      title={selectedGame.title}
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
                <div className="mt-4 flex justify-center gap-4">
                  <div className="px-4 py-1 bg-zinc-900 border border-white/5 rounded text-[10px] text-zinc-500 uppercase font-bold">
                    Resolution: 1280x720
                  </div>
                  <div className="px-4 py-1 bg-zinc-900 border border-white/5 rounded text-[10px] text-zinc-500 uppercase font-bold">
                    Engine: WebGL/JS
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <GraduationCap className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">StudyHub</span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <NavItem 
            active={activeTab === 'notes'} 
            onClick={() => setActiveTab('notes')}
            icon={<FileText className="w-5 h-5" />}
            label="My Notes"
          />
          <NavItem 
            active={activeTab === 'textbooks'} 
            onClick={() => setActiveTab('textbooks')}
            icon={<BookOpen className="w-5 h-5" />}
            label="Textbooks"
          />
          <NavItem 
            active={activeTab === 'calculator'} 
            onClick={() => setActiveTab('calculator')}
            icon={<CalcIcon className="w-5 h-5" />}
            label="Calculator"
          />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-700 truncate">John Doe</p>
              <p className="text-xs text-slate-500 truncate">Premium Student</p>
            </div>
            <Settings className="w-4 h-4 text-slate-400 cursor-pointer" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'notes' && (
          <div className="flex h-full">
            {/* Notes List */}
            <div className="w-80 border-r border-slate-200 bg-white flex flex-col">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h2 className="font-bold text-slate-800">Notes</h2>
                <button 
                  onClick={addNote}
                  className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {notes.map(note => (
                  <div 
                    key={note.id}
                    onClick={() => setSelectedNote(note)}
                    className={`p-3 rounded-xl cursor-pointer transition-all ${
                      selectedNote?.id === note.id 
                        ? 'bg-indigo-50 border-indigo-100' 
                        : 'hover:bg-slate-50 border-transparent'
                    } border`}
                  >
                    <h3 className="font-semibold text-slate-800 truncate">{note.title || 'Untitled'}</h3>
                    <p className="text-xs text-slate-500 mt-1">{note.date}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Note Editor */}
            <div className="flex-1 bg-white p-8 overflow-y-auto">
              {selectedNote ? (
                <div className="max-w-3xl mx-auto">
                  <div className="flex justify-between items-start mb-8">
                    <input 
                      type="text"
                      value={selectedNote.title}
                      onChange={(e) => updateNote(selectedNote.id, 'title', e.target.value)}
                      className="text-4xl font-bold text-slate-900 border-none focus:ring-0 w-full p-0 bg-transparent"
                      placeholder="Note Title"
                    />
                    <button 
                      onClick={() => deleteNote(selectedNote.id)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <textarea 
                    value={selectedNote.content}
                    onChange={(e) => updateNote(selectedNote.id, 'content', e.target.value)}
                    className="w-full h-[60vh] text-lg text-slate-700 border-none focus:ring-0 p-0 resize-none bg-transparent leading-relaxed"
                    placeholder="Start typing your study notes..."
                  />
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <FileText className="w-16 h-16 mb-4 opacity-20" />
                  <p>Select a note or create a new one</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'textbooks' && (
          <div className="p-8 overflow-y-auto h-full">
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Digital Library</h1>
                  <p className="text-slate-500 mt-1">Access your assigned reading materials</p>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search textbooks..."
                    className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {TEXTBOOKS.map(book => (
                  <div key={book.id} className="group cursor-pointer">
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-300 relative">
                      <img 
                        src={book.cover} 
                        alt={book.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                    </div>
                    <div className="mt-4">
                      <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{book.subject}</span>
                      <h3 className="font-bold text-slate-800 mt-1 group-hover:text-indigo-600 transition-colors">{book.title}</h3>
                      <p className="text-sm text-slate-500">{book.author}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'calculator' && (
          <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
            <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-200 w-full max-w-sm">
              <div className="mb-6">
                <div className="bg-slate-900 text-white p-6 rounded-2xl text-right text-4xl font-mono h-24 flex items-center justify-end overflow-hidden">
                  {calcDisplay || '0'}
                </div>
              </div>
              <div className="calculator-grid">
                {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', 'C', '0', '=', '+'].map(btn => (
                  <button
                    key={btn}
                    onClick={() => handleCalcClick(btn)}
                    className={`p-4 rounded-xl text-xl font-bold transition-all ${
                      btn === '=' 
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 col-span-1' 
                        : btn === 'C'
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : ['/', '*', '-', '+'].includes(btn)
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'bg-white border border-slate-100 text-slate-800 hover:bg-slate-50 shadow-sm'
                    }`}
                  >
                    {btn}
                  </button>
                ))}
              </div>
              <div className="mt-6 text-center text-xs text-slate-400">
                Scientific Calculator v2.4
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        active 
          ? 'bg-indigo-50 text-indigo-600 font-semibold' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
      }`}
    >
      {icon}
      <span>{label}</span>
      {active && <ChevronRight className="w-4 h-4 ml-auto" />}
    </button>
  );
}
