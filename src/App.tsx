/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  RotateCcw, 
  Settings2, 
  Type, 
  Zap, 
  Maximize2, 
  ChevronRight,
  BookOpen,
  Sparkles,
  Loader2,
  Wand2,
  Moon,
  Sun,
  Palette
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "undefined") {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

const STORY_THEMES = [
  { id: 'dinosaurs', label: 'Dinossauros', icon: '🦖', prompt: 'uma história curta sobre um dinossauro amigo' },
  { id: 'space', label: 'Espaço', icon: '🚀', prompt: 'uma aventura curta no espaço sideral' },
  { id: 'animals', label: 'Animais', icon: '🐾', prompt: 'uma fábula curta com animais falantes' },
  { id: 'superheroes', label: 'Heróis', icon: '🦸', prompt: 'um herói a salvar o dia com gentileza' },
  { id: 'magic', label: 'Magia', icon: '🪄', prompt: 'um conto curto sobre um castelo mágico' },
];

const FONTS = [
  { id: 'sans', label: 'Moderna', className: 'font-sans' },
  { id: 'serif', label: 'Livro', className: 'font-serif' },
  { id: 'handwriting', label: 'Escolar', className: 'font-handwriting' },
];

export default function App() {
  const [text, setText] = useState("O rato roeu a rolha da garrafa do rei de Roma. 🐭 O rápido raposo salta sobre o cão preguiçoso! 🦊");
  const [speed, setSpeed] = useState(15); 
  const [fontSize, setFontSize] = useState(72);
  const [isPlaying, setIsPlaying] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('');
  
  // Customization states
  const [fontFamily, setFontFamily] = useState('sans');
  const [textColor, setTextColor] = useState('#1e293b');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleRestart = () => {
    setResetKey(prev => prev + 1);
  };

  const toggleDarkMode = () => {
    if (!isDarkMode) {
      setIsDarkMode(true);
      setTextColor('#e2e8f0');
      setBgColor('#121212');
    } else {
      setIsDarkMode(false);
      setTextColor('#1e293b');
      setBgColor('#ffffff');
    }
  };

  const generateStory = async (themePrompt: string, themeLabel: string) => {
    const ai = getAI();
    if (!ai) {
      alert("A chave da API (GEMINI_API_KEY) não está configurada. Por favor, configura as Variáveis de Ambiente no Vercel.");
      return;
    }
    setIsGenerating(true);
    setSelectedTheme(themeLabel);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Escreve uma história curta e simples (máximo 2-3 frases) para uma criança de 8 anos aprender a ler em Português de Portugal. O tema é: ${themePrompt}. O texto deve ser divertido, ter uma linha só e incluir alguns emojis relacionados. Usa vocabulário adequado para PT-PT (ex: utiliza "autocarro" em vez de "ônibus", etc, se aplicável).`,
      });
      
      const newStory = response.text?.trim() || "";
      if (newStory) {
        setText(newStory);
        handleRestart();
      }
    } catch (error) {
      console.error("Erro ao gerar história:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const currentFont = FONTS.find(f => f.id === fontFamily)?.className || 'font-sans';

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-[#F0F7FF]'} font-sans overflow-hidden flex flex-col transition-colors duration-500`}>
      {/* Header */}
      <header className={`p-4 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-blue-100'} border-b-2 flex justify-between items-center z-10 shrink-0 transition-colors`}>
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 p-2 rounded-2xl shadow-lg shadow-blue-200">
            <BookOpen className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">SUPER LEITOR</h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-xl transition-all ${isDarkMode ? 'bg-amber-400 text-slate-900' : 'bg-slate-100 text-slate-600'}`}
            title={isDarkMode ? "Modo Diurno" : "Modo Noturno"}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button 
            onClick={handleRestart}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-full font-bold hover:bg-red-200 transition-colors"
            id="restart-btn"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Recomeçar</span>
          </button>
        </div>
      </header>

      {/* Main Reading Area */}
      <main 
        className="flex-1 relative flex items-center m-4 rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-white transition-all duration-300"
        style={{ backgroundColor: bgColor }}
      >
        {/* Background Grid Accent */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: `radial-gradient(${textColor} 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        
        {isGenerating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-50/80 backdrop-blur-sm z-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="bg-blue-500 p-4 rounded-full shadow-xl mb-4"
            >
              <Sparkles className="text-white w-8 h-8" />
            </motion.div>
            <p className="text-blue-900 font-black text-xl animate-pulse">
              A criar história de {selectedTheme}...
            </p>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={resetKey + (isPlaying ? 'playing' : 'paused') + text + fontFamily}
            initial={{ x: '100vw' }}
            animate={isPlaying ? { x: '-200%' } : {}}
            transition={{
              duration: speed * (text.length / 40), 
              repeat: Infinity,
              ease: "linear"
            }}
            className={`whitespace-nowrap font-bold tracking-tight px-10 select-none ${currentFont}`}
            style={{ 
              fontSize: `${fontSize}px`,
              color: textColor
            }}
          >
            {text}
          </motion.div>
        </AnimatePresence>

        {/* Guides */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-32 pointer-events-none z-10" 
          style={{ background: `linear-gradient(to right, ${bgColor}, ${bgColor}CC, transparent)` }}
        />
        <div 
          className="absolute right-0 top-0 bottom-0 w-32 pointer-events-none z-10" 
          style={{ background: `linear-gradient(to left, ${bgColor}, ${bgColor}CC, transparent)` }}
        />
      </main>

      {/* Control Panel */}
      <footer className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-blue-50'} p-6 border-t-2 overflow-y-auto max-h-[45vh] shrink-0 transition-colors`}>
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* AI Story Wizard */}
          <section className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-[2rem] shadow-xl shadow-indigo-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white/20 p-2 rounded-xl">
                <Wand2 className="text-white w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-white tracking-wide uppercase">História Mágica (IA)</h2>
              <span className="bg-white/10 text-white/80 px-3 py-1 rounded-full text-xs font-bold ml-auto">
                Gemini AI
              </span>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {STORY_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  disabled={isGenerating}
                  onClick={() => generateStory(theme.prompt, theme.label)}
                  className="flex-1 min-w-[140px] bg-white/10 hover:bg-white/20 border-2 border-white/20 rounded-2xl p-4 text-center transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="text-3xl mb-2 group-hover:scale-125 transition-transform">{theme.icon}</div>
                  <div className="text-white font-bold text-sm">{theme.label}</div>
                </button>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Text Input */}
            <div className="lg:col-span-3">
               <label className={`flex items-center gap-2 mb-3 text-sm font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                <Type className="w-4 h-4" />
                <span>O que vamos ler hoje?</span>
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className={`w-full border-2 rounded-2xl p-4 text-lg font-medium focus:outline-none transition-colors resize-none h-24 ${
                  isDarkMode 
                  ? 'bg-slate-700 border-slate-600 text-white focus:border-indigo-400' 
                  : 'bg-blue-50 border-blue-100 text-slate-700 focus:border-blue-400'
                }`}
                placeholder="Escreve aqui o que queres que o teu filho leia..."
                id="reader-text-input"
              />
            </div>

            {/* Customization Options */}
            <div className="space-y-6 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
              
              {/* Font Choice */}
              <div className="space-y-4">
                <label className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  <Settings2 className="w-4 h-4 text-purple-500" />
                  <span>Tipo de Letra</span>
                </label>
                <div className="flex gap-2">
                  {FONTS.map(f => (
                    <button
                      key={f.id}
                      onClick={() => setFontFamily(f.id)}
                      className={`flex-1 py-2 px-3 rounded-xl border-2 font-bold transition-all ${
                        fontFamily === f.id
                        ? 'bg-indigo-500 text-white border-indigo-500'
                        : isDarkMode 
                          ? 'bg-slate-700 border-slate-600 text-slate-300'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      } ${f.className}`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Picks */}
              <div className="space-y-4">
                <label className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  <Palette className="w-4 h-4 text-pink-500" />
                  <span>Cores Personalizadas</span>
                </label>
                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <span className="text-xs font-bold text-slate-400">Texto</span>
                    <input 
                      type="color" 
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-full h-10 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <span className="text-xs font-bold text-slate-400">Fundo</span>
                    <input 
                      type="color" 
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-full h-10 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                  </div>
                </div>
              </div>

              {/* Speed Control */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    <Zap className="w-4 h-4 text-orange-500" />
                    <span>Velocidade</span>
                  </label>
                  <span className={`px-3 py-1 rounded-full text-xs font-black ${isDarkMode ? 'bg-orange-900 text-orange-200' : 'bg-orange-100 text-orange-600'}`}>
                    {speed >= 30 ? 'Muito Lento' : speed >= 15 ? 'Normal' : speed >= 8 ? 'Rápido' : 'Relâmpago!'}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="2" 
                  max="40" 
                  step="1"
                  value={42 - speed} 
                  onChange={(e) => setSpeed(42 - parseInt(e.target.value))}
                  className="w-full h-3 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  id="speed-range"
                />
              </div>

              {/* Font Size Control */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    <Maximize2 className="w-4 h-4 text-blue-500" />
                    <span>Tamanho</span>
                  </label>
                  <span className={`px-3 py-1 rounded-full text-xs font-black ${isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-600'}`}>
                    {fontSize}px
                  </span>
                </div>
                <input 
                  type="range" 
                  min="24" 
                  max="180" 
                  value={fontSize} 
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full h-3 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  id="size-range"
                />
              </div>

              {/* Play/Pause Button */}
              <div className="flex items-end lg:col-span-1">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`w-full h-14 rounded-2xl flex items-center justify-center gap-3 text-lg font-bold transition-all shadow-lg ${
                    isPlaying 
                    ? isDarkMode 
                      ? 'bg-amber-900/40 text-amber-200 border-2 border-amber-800' 
                      : 'bg-amber-100 text-amber-700 hover:bg-amber-200 border-2 border-amber-200' 
                    : 'bg-blue-500 text-white hover:bg-blue-600 shadow-blue-200'
                  }`}
                  id="play-pause-btn"
                >
                  {isPlaying ? (
                    <>
                      <div className="w-3 h-3 bg-current rounded-sm shadow-sm" />
                      <span>Parar</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-current" />
                      <span>Continuar</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
