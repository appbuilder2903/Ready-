import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ViewMode, UserProfile, LogEntry, VmState, GitState, Commit, RegisteredUser, SecurityTool, GameMetadata, Classroom, ClassPost, StoredFile, ChatMessage } from './types';
import { COLORS, OS_LIST, GET_FULL_GAME_DATABASE, SUPPORTED_LANGUAGES, EXTENSIVE_LANGUAGES, GET_FULL_SECURITY_DATABASE, LANGUAGE_SNIPPETS, CIRCUIT_COMPONENTS } from './constants';
import * as GeminiService from './services/geminiService';
import * as ExternalAiService from './services/externalAiService';
import MatrixBackground from './components/MatrixBackground';
import LiveVisualizer from './components/LiveVisualizer';

// --- INITIALIZATION ---
const ALL_TOOLS = GET_FULL_SECURITY_DATABASE();
const ALL_GAMES = GET_FULL_GAME_DATABASE();

// --- STYLING HELPERS ---
const GLOW = {
  green: 'shadow-[0_0_25px_rgba(0,255,65,0.4)] border-green-500',
  blue: 'shadow-[0_0_25px_rgba(0,243,255,0.4)] border-cyan-500',
  pink: 'shadow-[0_0_25px_rgba(236,72,153,0.4)] border-pink-500',
  yellow: 'shadow-[0_0_25px_rgba(234,179,8,0.4)] border-yellow-500',
  red: 'shadow-[0_0_25px_rgba(239,68,68,0.4)] border-red-500',
  purple: 'shadow-[0_0_25px_rgba(168,85,247,0.4)] border-purple-500',
  orange: 'shadow-[0_0_25px_rgba(249,115,22,0.4)] border-orange-500'
};

const PANEL_BASE = "bg-black/60 backdrop-blur-md border border-white/10";

// --- SUB-COMPONENTS ---

const Scanlines = () => (
  <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden h-full w-full opacity-[0.05]" 
       style={{background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%'}} />
);

const NeuralRadio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [track, setTrack] = useState("Neon Rain");
  const tracks = ["Neon Rain", "Protocol 99", "Silicon Dreams", "Root Access", "Cyber Void"];

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        if (Math.random() > 0.99) {
           setTrack(tracks[Math.floor(Math.random() * tracks.length)]);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  return (
    <div className="fixed bottom-4 right-4 z-40 w-64 bg-black/80 backdrop-blur-xl border border-pink-500/50 rounded-lg p-3 shadow-[0_0_20px_rgba(236,72,153,0.2)] flex items-center gap-3">
       <div className={`w-10 h-10 rounded bg-pink-900/20 border border-pink-500 flex items-center justify-center cursor-pointer hover:bg-pink-500/20 transition-colors`} onClick={() => setIsPlaying(!isPlaying)}>
          <span className="text-pink-400 text-lg">{isPlaying ? '❚❚' : '▶'}</span>
       </div>
       <div className="flex-1 overflow-hidden">
          <div className="text-[10px] text-pink-500 uppercase font-bold tracking-widest mb-1">Neural Radio</div>
          <div className="text-xs text-white font-code truncate relative">
             {isPlaying ? (
                <span className="animate-pulse">{track} <span className="text-gray-500 text-[10px] ml-2">Playing...</span></span>
             ) : (
                <span className="text-gray-500">Offline</span>
             )}
          </div>
       </div>
       {isPlaying && (
          <div className="flex gap-0.5 items-end h-8">
             {[1,2,3,4,5].map(i => (
                <div key={i} className="w-1 bg-pink-500 animate-pulse" style={{height: `${Math.random() * 100}%`, animationDuration: `${0.2 + Math.random()}s`}} />
             ))}
          </div>
       )}
    </div>
  );
};

const PasswordStrengthMeter = ({ password }: { password: string }) => {
  const strength = useMemo(() => {
    let score = 0;
    if (password.length > 5) score++;
    if (password.length > 9) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }, [password]);

  const getColor = () => {
    if (strength < 2) return 'bg-red-600 shadow-[0_0_10px_#ef4444]';
    if (strength < 4) return 'bg-yellow-500 shadow-[0_0_10px_#eab308]';
    return 'bg-green-500 shadow-[0_0_10px_#00ff41]';
  };

  const getLabel = () => {
    if (strength < 2) return 'WEAK - VULNERABLE';
    if (strength < 4) return 'MODERATE - ACCEPTABLE';
    return 'STRONG - MILITARY GRADE';
  };

  return (
    <div className="w-full mt-2">
      <div className="flex justify-between text-[8px] text-gray-500 uppercase mb-1 font-orbitron">
        <span>Encryption Strength</span>
        <span className={strength > 3 ? 'text-green-400 drop-shadow-[0_0_5px_#00ff41]' : 'text-gray-500'}>{getLabel()}</span>
      </div>
      <div className="h-1 w-full bg-gray-900/50 rounded overflow-hidden flex gap-0.5 border border-gray-800">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className={`flex-1 transition-all duration-300 ${i <= strength ? getColor() : 'bg-transparent'}`} />
        ))}
      </div>
    </div>
  );
};

const BootScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bootSequence = [
      "BIOS CHECK... OK", "CPU: QUANTUM CORE i9 [128 CORES]... OK", 
      "MEMORY: 1024 TB NEURAL MESH... OK", "LOADING KERNEL v9.0.4...", 
      "MOUNTING /dev/sda1 (ROOT)... OK", "INITIATING SECURE HANDSHAKE...", 
      "LOADING 941 SECURITY MODULES...", "INDEXING 500+ SIMULATION FILES...",
      "CONNECTING TO GEMINI 3.0 API NODE...", "AUTHENTICATING API KEY...",
      "STARTING NEURAL UPLINK DAEMON...", "SYSTEM READY."
    ];
    
    let lineIdx = 0;
    const interval = setInterval(() => {
      if (lineIdx < bootSequence.length) {
        setLines(p => [...p, bootSequence[lineIdx]]);
        lineIdx++;
        setProgress(old => Math.min(old + 8, 100));
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 800);
      }
    }, 150);
    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines]);

  return (
    <div className="h-screen w-full bg-black flex flex-col items-center justify-center font-code relative overflow-hidden">
       <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/U3qYN8S0j3bpK/giphy.gif')] opacity-10 bg-cover pointer-events-none mix-blend-screen"></div>
       <Scanlines />
       <div className="w-[600px] border border-green-500/30 bg-black/90 p-8 rounded shadow-[0_0_50px_rgba(0,255,65,0.1)] z-10 backdrop-blur-sm">
          <h1 className="text-2xl font-orbitron text-green-500 mb-6 text-center animate-pulse tracking-widest drop-shadow-[0_0_10px_#00ff41]">CODESPHERE 2.0 BOOTLOADER</h1>
          <div ref={scrollRef} className="space-y-1 mb-6 h-64 overflow-y-auto flex flex-col scrollbar-hide">
             {lines.map((l, i) => <div key={i} className="text-xs text-green-400 border-l-2 border-green-900 pl-2">{`> ${l}`}</div>)}
          </div>
          <div className="w-full h-1 bg-gray-900 rounded-full overflow-hidden border border-green-900">
             <div className="h-full bg-green-500 shadow-[0_0_15px_#00ff41] transition-all duration-300 ease-out" style={{width: `${progress}%`}} />
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-green-700 uppercase font-bold">
             <span>Memory Check: OK</span>
             <span>{progress}%</span>
          </div>
       </div>
    </div>
  );
};

// --- MODULE DEFINITIONS (HOISTED) ---

// New Circuit Forge Module (Tinkercad-like)
interface CircuitPart {
    id: string;
    type: string; // Updated to generic string to allow massive inventory
    x: number;
    y: number;
    label: string;
}

const CircuitForgeModule = ({ addLog }: { addLog: any }) => {
    const [parts, setParts] = useState<CircuitPart[]>([]);
    const [wires, setWires] = useState<{from: string, to: string}[]>([]);
    const [selectedPart, setSelectedPart] = useState<string | null>(null);
    const [code, setCode] = useState<string>('void setup() {\n  pinMode(13, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(13, HIGH);\n  delay(1000);\n  digitalWrite(13, LOW);\n  delay(1000);\n}');
    const [simulationLog, setSimulationLog] = useState<string>("");
    const [isSimulating, setIsSimulating] = useState(false);
    const [dragTarget, setDragTarget] = useState<string | null>(null);
    const [wireStart, setWireStart] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<string>("Basic");

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const addPart = (type: string) => {
        const id = `${type.replace(/\s/g, '_')}_${Date.now().toString().slice(-4)}`;
        setParts(prev => [...prev, {
            id,
            type,
            x: 100 + Math.random() * 100,
            y: 100 + Math.random() * 100,
            label: id
        }]);
        addLog(`Added ${type} to Workbench.`, 'info');
    };

    // Canvas Drawing
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Grid
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for(let i=0; i<canvas.width; i+=20) { ctx.moveTo(i,0); ctx.lineTo(i,canvas.height); }
        for(let i=0; i<canvas.height; i+=20) { ctx.moveTo(0,i); ctx.lineTo(canvas.width,i); }
        ctx.stroke();

        // Draw Wires
        wires.forEach(wire => {
            const from = parts.find(p => p.id === wire.from);
            const to = parts.find(p => p.id === wire.to);
            if (from && to) {
                ctx.strokeStyle = '#00ff41'; // Neon Green Wire
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(from.x + 20, from.y + 20);
                ctx.lineTo(to.x + 20, to.y + 20);
                ctx.stroke();
                // Joint dots
                ctx.fillStyle = '#fff';
                ctx.beginPath(); ctx.arc(from.x+20, from.y+20, 3, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(to.x+20, to.y+20, 3, 0, Math.PI*2); ctx.fill();
            }
        });

        // Draw Parts
        parts.forEach(part => {
            const isSelected = selectedPart === part.id;
            
            // Glow
            if (isSelected) {
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#00f3ff';
                ctx.strokeStyle = '#00f3ff';
            } else {
                ctx.shadowBlur = 0;
                ctx.strokeStyle = '#555';
            }

            // Determine Appearance based on Type Keyword
            const type = part.type.toLowerCase();
            let width = 40;
            let height = 40;
            let color = '#333';
            let label = part.type.substring(0,3).toUpperCase();

            if (type.includes('arduino') || type.includes('micro:bit')) {
                color = '#0066cc';
                width = 60; height = 80;
                label = "MCU";
            } else if (type.includes('led') || type.includes('bulb')) {
                color = type.includes('red') ? '#cc0000' : '#ffff00';
                width = 20; height = 20;
                label = "D";
            } else if (type.includes('resistor')) {
                color = '#cc9966';
                width = 40; height = 15;
                label = "R";
            } else if (type.includes('battery') || type.includes('cell') || type.includes('power')) {
                color = '#ff9900';
                width = 40; height = 60;
                label = "PWR";
            } else if (type.includes('breadboard')) {
                color = '#eeeeee';
                width = 120; height = 80;
                label = "BOARD";
            } else if (type.includes('motor') || type.includes('servo')) {
                color = '#aaaaaa';
                label = "M";
            } else if (type.includes('sensor')) {
                color = '#004400';
                label = "SENS";
            }

            ctx.fillStyle = color;
            ctx.fillRect(part.x, part.y, width, height);
            ctx.strokeRect(part.x, part.y, width, height);
            
            // Label
            ctx.fillStyle = type.includes('breadboard') ? '#000' : '#fff';
            ctx.font = '9px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(label, part.x + width/2, part.y + height/2 + 3);

            // Selection indicator
            if (isSelected) {
                ctx.fillStyle = '#00f3ff';
                ctx.beginPath(); ctx.arc(part.x, part.y, 3, 0, Math.PI*2); ctx.fill();
            }
        });
    }, [parts, wires, selectedPart]);

    const handleCanvasMouseDown = (e: React.MouseEvent) => {
        const rect = canvasRef.current!.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Simple Hit detection (assuming standard box size 40 unless logic overrides)
        // For better hit detection we should store width/height in state, but simpler approximation here:
        const clickedPart = parts.find(p => {
             // Approximation: check roughly 60x60 area around origin
             return x >= p.x && x <= p.x + 80 && y >= p.y && y <= p.y + 80;
        });

        if (clickedPart) {
            if (e.shiftKey) {
                // Wiring Mode
                if (wireStart) {
                    if (wireStart !== clickedPart.id) {
                        setWires(prev => [...prev, { from: wireStart, to: clickedPart.id }]);
                        addLog(`Wire connected: ${wireStart} -> ${clickedPart.id}`, 'success');
                    }
                    setWireStart(null);
                } else {
                    setWireStart(clickedPart.id);
                    addLog(`Wire started from ${clickedPart.id}... (Shift+Click dest)`, 'info');
                }
            } else {
                // Drag Mode
                setSelectedPart(clickedPart.id);
                setDragTarget(clickedPart.id);
            }
        } else {
            setSelectedPart(null);
            setWireStart(null);
        }
    };

    const handleCanvasMouseMove = (e: React.MouseEvent) => {
        if (dragTarget) {
            const rect = canvasRef.current!.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            setParts(prev => prev.map(p => p.id === dragTarget ? { ...p, x: x - 20, y: y - 20 } : p));
        }
    };

    const handleCanvasMouseUp = () => {
        setDragTarget(null);
    };

    const simulate = async () => {
        setIsSimulating(true);
        setSimulationLog("Initializing Physics Engine...\nTracing Nets...\nCompiling Firmware...");
        
        const componentList = parts.map(p => `- ${p.type} (${p.id})`).join('\n');
        const connectionList = wires.map(w => `${w.from} connected to ${w.to}`).join('\n');
        
        const result = await GeminiService.simulateCircuit(componentList, connectionList, code);
        setSimulationLog(result);
        setIsSimulating(false);
    };

    const clearBoard = () => {
        setParts([]);
        setWires([]);
        setSimulationLog("");
        setCode("");
    }

    return (
        <div className="flex w-full h-full bg-transparent font-code">
            {/* Sidebar Tools */}
            <div className={`w-72 border-r border-blue-500/30 ${PANEL_BASE} flex flex-col`}>
                <div className="p-4 border-b border-blue-500/30 bg-blue-900/10">
                    <h2 className="text-blue-400 font-bold uppercase tracking-widest text-sm flex items-center gap-2 drop-shadow-[0_0_5px_#3b82f6]">
                        <span>⚡</span> Circuit Forge
                    </h2>
                </div>
                
                {/* Categories */}
                <div className="flex overflow-x-auto p-2 gap-1 border-b border-blue-500/20 scrollbar-thin scrollbar-thumb-blue-500/50">
                    {Object.keys(CIRCUIT_COMPONENTS).map(cat => (
                        <button 
                            key={cat} 
                            onClick={() => setActiveCategory(cat)}
                            className={`px-3 py-1 text-[10px] whitespace-nowrap rounded font-bold uppercase transition-all ${activeCategory === cat ? 'bg-blue-600 text-white shadow-[0_0_10px_#2563eb]' : 'text-gray-500 hover:text-white hover:bg-white/10'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="flex-1 p-4 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-2">
                        {(CIRCUIT_COMPONENTS as any)[activeCategory].map((type: string) => (
                            <button 
                                key={type}
                                onClick={() => addPart(type)}
                                className="p-2 border border-gray-700 bg-black/40 text-gray-300 text-[9px] rounded hover:border-blue-500 hover:text-white hover:bg-blue-900/20 transition-all uppercase font-bold flex flex-col items-center gap-1 text-center"
                            >
                                <div className="w-6 h-6 bg-gray-800 rounded-sm mb-1 flex items-center justify-center text-gray-600 text-[8px]">{type.substring(0,2)}</div>
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 p-4 border-t border-blue-500/30 max-h-32 overflow-y-auto">
                    <div className="text-[10px] text-gray-500 uppercase font-bold mb-2">Properties</div>
                    {selectedPart ? (
                         <div className="text-xs text-blue-300">
                             ID: {selectedPart}<br/>
                             Type: {parts.find(p=>p.id===selectedPart)?.type}
                         </div>
                    ) : <div className="text-xs text-gray-600 italic">Select a component</div>}
                    <div className="mt-2 text-[10px] text-gray-500">
                        Shift+Click: Connect Wires<br/>
                        Drag: Move Part
                    </div>
                </div>
                <div className="p-4 border-t border-blue-500/30">
                     <button onClick={clearBoard} className="w-full py-2 border border-red-500/50 text-red-500 text-xs uppercase hover:bg-red-900/20">Reset Board</button>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col bg-black/40 relative">
                <div className="h-10 border-b border-blue-500/30 flex items-center justify-between px-4 bg-black/60">
                    <span className="text-xs text-gray-500 uppercase">Schematic View // Canvas 1</span>
                    <button 
                        onClick={simulate} 
                        disabled={isSimulating}
                        className="px-6 py-1 bg-green-600/20 border border-green-500 text-green-400 hover:bg-green-600 hover:text-white uppercase text-xs font-bold rounded shadow-[0_0_10px_rgba(0,255,65,0.2)]"
                    >
                        {isSimulating ? 'Simulating...' : '▶ Start Simulation'}
                    </button>
                </div>
                
                <div className="flex-1 flex relative">
                    {/* Canvas */}
                    <div className="flex-1 relative bg-[#090909]">
                        <canvas 
                            ref={canvasRef}
                            width={800}
                            height={600}
                            className="absolute top-0 left-0 w-full h-full cursor-crosshair"
                            onMouseDown={handleCanvasMouseDown}
                            onMouseMove={handleCanvasMouseMove}
                            onMouseUp={handleCanvasMouseUp}
                        />
                    </div>

                    {/* Code & Output Panel */}
                    <div className="w-96 border-l border-blue-500/30 bg-black/80 flex flex-col">
                        <div className="flex-1 flex flex-col border-b border-blue-500/30">
                            <div className="p-2 text-[10px] font-bold text-blue-400 uppercase bg-blue-900/10 border-b border-blue-500/20">Firmware Code (C++/Arduino)</div>
                            <textarea 
                                value={code}
                                onChange={e => setCode(e.target.value)}
                                className="flex-1 bg-transparent p-4 text-xs text-gray-300 font-mono outline-none resize-none"
                                spellCheck={false}
                            />
                        </div>
                        <div className="h-1/3 flex flex-col bg-black">
                            <div className="p-2 text-[10px] font-bold text-green-400 uppercase bg-green-900/10 border-b border-green-500/20 border-t border-blue-500/30">Simulation Output</div>
                            <pre className="flex-1 p-4 text-[10px] text-green-500 font-mono overflow-y-auto whitespace-pre-wrap">
                                {simulationLog || "> Ready to simulate."}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const WebBuilderModule = ({ addLog }: { addLog: any }) => {
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [activeTab, setActiveTab] = useState<'CODE' | 'PREVIEW'>('PREVIEW');
    const [activeFile, setActiveFile] = useState<'index.html' | 'style.css' | 'script.js'>('index.html');
    const [projectFiles, setProjectFiles] = useState<{
        'index.html': string,
        'style.css': string,
        'script.js': string
    }>({
        'index.html': '<!-- Generated code will appear here -->\n<div style="color: #ec4899; text-align: center; margin-top: 20%; font-family: monospace;">\n  <h1>Vive Builder</h1>\n  <p>Enter a prompt to generate a website.</p>\n</div>',
        'style.css': '/* Styles will appear here */',
        'script.js': '// Logic will appear here'
    });
    const [showPublishModal, setShowPublishModal] = useState(false);

    const generateProject = async () => {
        if (!prompt) return;
        setIsGenerating(true);
        setActiveTab('PREVIEW');
        addLog(`Generating Web Project: "${prompt}"...`, 'info');
        
        const result = await GeminiService.generateWebProject(prompt);
        if (result) {
            setProjectFiles({
                'index.html': result.html || '',
                'style.css': result.css || '',
                'script.js': result.js || ''
            });
            addLog("Web Project Generated successfully.", "success");
        } else {
            addLog("Failed to generate project.", "error");
        }
        setIsGenerating(false);
    };

    const combinedSrcDoc = useMemo(() => {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>${projectFiles['style.css']}</style>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body>
                ${projectFiles['index.html']}
                <script>
                    try {
                        ${projectFiles['script.js']}
                    } catch(e) { console.error(e); }
                </script>
            </body>
            </html>
        `;
    }, [projectFiles]);

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([combinedSrcDoc], {type: 'text/html'});
        element.href = URL.createObjectURL(file);
        element.download = "project_bundle.html";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
        addLog("Project downloaded as bundle.", "success");
    };

    const hostingProviders = [
        "https://www.netlify.com",
        "https://vercel.com",
        "https://pages.cloudflare.com"
    ];

    return (
        <div className="flex w-full h-full bg-transparent font-sans relative">
            <div className={`w-80 ${PANEL_BASE} border-r border-pink-500/30 flex flex-col z-10`}>
                <div className="p-4 border-b border-pink-500/30">
                    <h2 className="text-pink-400 font-bold uppercase tracking-widest text-lg flex items-center gap-2 drop-shadow-[0_0_10px_#ec4899]">
                        <span>⚡</span> Vive Code
                    </h2>
                    <p className="text-[10px] text-pink-500/70">Neural Web Generator</p>
                </div>
                
                <div className="flex-1 p-2">
                    <div className="text-[10px] text-gray-500 uppercase font-bold px-2 mb-2">Project Files</div>
                    {Object.keys(projectFiles).map(fileName => (
                        <div 
                            key={fileName}
                            onClick={() => { setActiveFile(fileName as any); setActiveTab('CODE'); }}
                            className={`px-4 py-2 text-xs rounded cursor-pointer mb-1 flex items-center gap-2 transition-all ${activeFile === fileName && activeTab === 'CODE' ? 'bg-pink-900/30 text-pink-300 border border-pink-500/50 shadow-[0_0_10px_rgba(236,72,153,0.2)]' : 'text-gray-400 hover:bg-white/5'}`}
                        >
                            <span className="opacity-50">{fileName.endsWith('html') ? '<>' : fileName.endsWith('css') ? '#' : '{}'}</span>
                            {fileName}
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-pink-500/30 bg-black/40">
                    <textarea 
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        placeholder="Describe a website to build..." 
                        className="w-full h-24 bg-black/60 border border-gray-700 rounded p-3 text-xs text-white outline-none focus:border-pink-500 focus:shadow-[0_0_15px_rgba(236,72,153,0.3)] resize-none mb-3"
                    />
                    <button 
                        onClick={generateProject}
                        disabled={isGenerating}
                        className="w-full py-3 bg-pink-600/20 hover:bg-pink-600 border border-pink-500 text-pink-400 hover:text-white font-bold uppercase text-xs rounded transition-all shadow-[0_0_15px_rgba(236,72,153,0.3)] flex justify-center items-center gap-2"
                    >
                        {isGenerating ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : '✨ Generate Site'}
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col bg-transparent">
                <div className={`h-12 border-b border-pink-500/30 ${PANEL_BASE} flex items-center justify-between px-4`}>
                    <div className="flex gap-1 bg-black/50 p-1 rounded border border-gray-700">
                        <button 
                            onClick={() => setActiveTab('CODE')}
                            className={`px-4 py-1 text-[10px] font-bold uppercase rounded transition-all ${activeTab === 'CODE' ? 'bg-pink-900/40 text-pink-300' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Code Editor
                        </button>
                        <button 
                            onClick={() => setActiveTab('PREVIEW')}
                            className={`px-4 py-1 text-[10px] font-bold uppercase rounded transition-all ${activeTab === 'PREVIEW' ? 'bg-pink-600 text-white shadow-[0_0_10px_#ec4899]' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Live Preview
                        </button>
                    </div>
                    <div className="flex gap-2">
                         <button 
                            onClick={handleDownload}
                            className="px-3 py-1.5 border border-gray-600 rounded text-[10px] text-gray-300 hover:text-white hover:border-pink-500 uppercase flex items-center gap-2 transition-all"
                        >
                            ⬇ Download App
                        </button>
                        <button 
                            onClick={() => setShowPublishModal(true)}
                            className="px-3 py-1.5 bg-green-600/20 border border-green-500 text-green-400 rounded text-[10px] font-bold hover:bg-green-600 hover:text-white uppercase transition-all shadow-[0_0_10px_rgba(0,255,65,0.2)]"
                        >
                            ☁ Publish
                        </button>
                    </div>
                </div>

                <div className="flex-1 relative overflow-hidden bg-black/40">
                    {activeTab === 'CODE' ? (
                        <div className="w-full h-full flex flex-col">
                            <div className="h-6 bg-black/60 border-b border-gray-800 px-4 flex items-center text-[10px] text-gray-500">
                                Editing: <span className="text-pink-400 ml-1">{activeFile}</span>
                            </div>
                            <textarea 
                                value={projectFiles[activeFile]}
                                onChange={(e) => setProjectFiles({...projectFiles, [activeFile]: e.target.value})}
                                className="flex-1 bg-transparent text-gray-300 p-6 font-code text-sm outline-none resize-none"
                                spellCheck={false}
                            />
                        </div>
                    ) : (
                        <div className="w-full h-full bg-white">
                            <iframe 
                                title="preview"
                                srcDoc={combinedSrcDoc}
                                className="w-full h-full border-none"
                                sandbox="allow-scripts"
                            />
                        </div>
                    )}
                </div>
            </div>

            {showPublishModal && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className={`w-[500px] ${PANEL_BASE} rounded-lg shadow-[0_0_50px_rgba(236,72,153,0.2)] overflow-hidden animate-in fade-in zoom-in duration-200 border-pink-500/50`}>
                        <div className="p-6 border-b border-pink-500/30 flex justify-between items-center bg-pink-900/10">
                            <h3 className="text-white font-bold text-lg drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">Deploy Project</h3>
                            <button onClick={() => setShowPublishModal(false)} className="text-gray-500 hover:text-white">✕</button>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-400 text-sm mb-4">Choose a provider:</p>
                            <div className="grid grid-cols-2 gap-2">
                                {hostingProviders.map(url => (
                                    <a 
                                        key={url} 
                                        href={url} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="block px-3 py-2 bg-black/60 hover:bg-pink-900/20 border border-gray-800 hover:border-pink-500/50 rounded text-pink-400 text-xs truncate transition-all"
                                    >
                                        {url.replace('https://', '')}
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className="p-4 bg-black/60 border-t border-gray-800 flex justify-end">
                            <button 
                                onClick={() => setShowPublishModal(false)}
                                className="px-4 py-2 bg-white text-black font-bold text-xs rounded hover:bg-gray-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ClassroomModule = ({ user, addLog }: { user: UserProfile|null, addLog: any }) => {
    const [classes, setClasses] = useState<Classroom[]>([
        { id: 'c1', name: 'Cyber Warfare 101', teacherId: 'Teacher', students: ['Student.Alpha', 'Neo.User'], posts: [
            { id: 'p1', type: 'ANNOUNCEMENT', author: 'Teacher', content: 'Welcome to the course. First ISO hack due Monday.', timestamp: '10:00 AM' }
        ] }
    ]);
    const [activeClass, setActiveClass] = useState<Classroom|null>(null);
    const [newClassName, setNewClassName] = useState('');
    const [viewMode, setViewMode] = useState<'STREAM'|'PEOPLE'|'CLASSWORK'>('STREAM');
    
    // Teacher Actions
    const [newStudentId, setNewStudentId] = useState('');
    const [postContent, setPostContent] = useState('');

    const createClass = () => {
        if(!newClassName) return;
        setClasses(p => [...p, { id: `c${Date.now()}`, name: newClassName, teacherId: user?.id || 'Teacher', students: [], posts: [] }]);
        setNewClassName('');
        addLog(`New Classroom "${newClassName}" initialized.`, 'success');
    };

    const addStudent = () => {
        if(!activeClass || !newStudentId) return;
        const updated = {...activeClass, students: [...activeClass.students, newStudentId]};
        setClasses(p => p.map(c => c.id === activeClass.id ? updated : c));
        setActiveClass(updated);
        setNewStudentId('');
        addLog(`User ${newStudentId} added to roster.`, 'info');
    };

    const addPost = (type: 'ANNOUNCEMENT' | 'VIDEO' | 'ASSIGNMENT') => {
        if (!activeClass || !postContent) return;
        const newPost: ClassPost = {
            id: Math.random().toString(36),
            type,
            author: user?.id || 'Unknown',
            content: postContent,
            timestamp: new Date().toLocaleTimeString()
        };
        const updated = { ...activeClass, posts: [newPost, ...activeClass.posts] };
        setClasses(p => p.map(c => c.id === activeClass.id ? updated : c));
        setActiveClass(updated);
        setPostContent('');
        addLog(`Posted ${type} to stream.`, 'success');
    };

    if (activeClass) {
        return (
            <div className="flex flex-col h-full bg-transparent">
                <div className={`h-32 bg-gradient-to-r from-orange-900/40 to-red-900/40 p-8 flex items-end border-b border-orange-500/30 relative overflow-hidden ${PANEL_BASE}`}>
                    <div className="relative z-10">
                        <button onClick={() => setActiveClass(null)} className="text-orange-400 text-xs hover:text-white uppercase mb-2">← Back to Dashboard</button>
                        <h1 className="text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">{activeClass.name}</h1>
                        <p className="text-orange-200/50 text-xs uppercase tracking-widest">Instructor: {activeClass.teacherId}</p>
                    </div>
                </div>
                
                <div className="flex border-b border-orange-500/30 bg-black/40 px-4">
                    {['STREAM', 'CLASSWORK', 'PEOPLE'].map(m => (
                        <button key={m} onClick={()=>setViewMode(m as any)} className={`px-6 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${viewMode===m ? 'border-orange-500 text-orange-500 shadow-[0_10px_20px_-10px_#f97316]' : 'border-transparent text-gray-500 hover:text-white'}`}>
                            {m}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto p-8 bg-black/20">
                    {viewMode === 'STREAM' && (
                        <div className="max-w-3xl mx-auto space-y-6">
                            {user?.role === 'Teacher' && (
                                <div className={`${PANEL_BASE} rounded p-4 space-y-4 shadow-[0_0_20px_rgba(249,115,22,0.1)]`}>
                                    <textarea value={postContent} onChange={e=>setPostContent(e.target.value)} placeholder="Announce something to your class..." className="w-full bg-black/60 border border-gray-700 rounded p-3 text-sm text-white focus:border-orange-500 outline-none resize-none h-24" />
                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-2">
                                            <button onClick={()=>addPost('VIDEO')} className="px-3 py-1 bg-gray-800 rounded text-xs text-gray-400 hover:text-white flex items-center gap-2">📹 Upload Video</button>
                                            <button onClick={()=>addPost('ASSIGNMENT')} className="px-3 py-1 bg-gray-800 rounded text-xs text-gray-400 hover:text-white flex items-center gap-2">📄 Assign Task</button>
                                        </div>
                                        <button onClick={()=>addPost('ANNOUNCEMENT')} className="px-6 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase rounded shadow-[0_0_15px_#f97316]">Post</button>
                                    </div>
                                </div>
                            )}
                            {activeClass.posts.map(post => (
                                <div key={post.id} className={`${PANEL_BASE} rounded p-6 shadow-lg hover:border-orange-500/50 transition-all hover:shadow-[0_0_20px_rgba(249,115,22,0.2)]`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-orange-900/50 flex items-center justify-center text-orange-400 text-xs font-bold">{post.author[0]}</div>
                                        <div>
                                            <div className="text-sm font-bold text-white">{post.author}</div>
                                            <div className="text-[10px] text-gray-500">{post.timestamp}</div>
                                        </div>
                                        <div className="ml-auto px-2 py-0.5 rounded border border-gray-800 text-[9px] uppercase text-gray-500">{post.type}</div>
                                    </div>
                                    <p className="text-gray-300 text-sm whitespace-pre-wrap">{post.content}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {viewMode === 'PEOPLE' && (
                        <div className="max-w-3xl mx-auto">
                            <h3 className="text-orange-500 uppercase text-xs font-bold border-b border-orange-500/30 pb-2 mb-4 flex justify-between items-center">
                                Students ({activeClass.students.length})
                                {user?.role === 'Teacher' && (
                                    <div className="flex gap-2">
                                        <input value={newStudentId} onChange={e=>setNewStudentId(e.target.value)} placeholder="Enter Neural ID" className="bg-black/60 border border-gray-800 text-xs text-white p-1 rounded w-32 outline-none focus:border-orange-500" />
                                        <button onClick={addStudent} className="px-2 py-1 bg-orange-600/20 text-orange-500 rounded text-[10px] hover:bg-orange-600 hover:text-white uppercase">+ Add</button>
                                    </div>
                                )}
                            </h3>
                            <div className="space-y-2">
                                {activeClass.students.map(s => (
                                    <div key={s} className={`flex items-center gap-3 p-3 ${PANEL_BASE} rounded border-gray-800`}>
                                        <div className="w-8 h-8 rounded bg-gray-800" />
                                        <span className="text-sm text-gray-300">{s}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="flex w-full h-full bg-transparent">
            <div className={`w-64 border-r border-orange-500/30 p-4 ${PANEL_BASE}`}>
                <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                    <span className="text-orange-500">◈</span> Classes
                </h2>
                {user?.role === 'Teacher' && (
                    <div className="mb-6 p-4 bg-orange-900/20 border border-orange-500/30 rounded">
                        <div className="text-[10px] text-orange-400 uppercase font-bold mb-2">Create New Class</div>
                        <input value={newClassName} onChange={e=>setNewClassName(e.target.value)} className="w-full bg-black/60 border border-gray-700 rounded p-2 text-xs text-white mb-2 focus:border-orange-500 outline-none" placeholder="Class Name..." />
                        <button onClick={createClass} className="w-full py-1 bg-orange-600 text-white text-xs font-bold rounded uppercase hover:bg-orange-500 shadow-[0_0_10px_#f97316]">Create</button>
                    </div>
                )}
            </div>
            <div className="flex-1 p-8 overflow-y-auto bg-black/20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map(c => (
                        <div key={c.id} onClick={()=>setActiveClass(c)} className={`${PANEL_BASE} rounded-lg overflow-hidden cursor-pointer hover:border-orange-500 transition-all hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(249,115,22,0.3)] group`}>
                            <div className="h-24 bg-gradient-to-r from-orange-900/60 to-red-900/60 p-4 relative">
                                <h3 className="text-xl font-bold text-white relative z-10 drop-shadow-md">{c.name}</h3>
                                <p className="text-orange-200/60 text-xs relative z-10">{c.teacherId}</p>
                            </div>
                            <div className="p-4 h-32 relative">
                                <div className="text-xs text-gray-500 mt-2">
                                    {c.students.length} Students Enrolled<br/>
                                    {c.posts.length} Active Posts
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const SecurityModule = ({ addLog, globalTarget }: { addLog: any, globalTarget: any }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const [selectedTool, setSelectedTool] = useState<SecurityTool | null>(null);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      if (globalTarget && globalTarget.type === 'TOOL') {
          const tool = ALL_TOOLS.find(t => t.id === globalTarget.id);
          if (tool) setSelectedTool(tool);
      }
  }, [globalTarget]);

  useEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [terminalOutput]);

  const categories = useMemo(() => ["All", ...Array.from(new Set(ALL_TOOLS.map(t => t.category)))], []);
  const filteredTools = useMemo(() => {
    return ALL_TOOLS.filter(t => 
      (selectedCat === "All" || t.category === selectedCat) &&
      (t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, selectedCat]);

  const runTool = async () => {
    if(!selectedTool) return;
    setIsRunning(true);
    setTerminalOutput(p => [...p, `root@codesphere:~# ${selectedTool.cli_usage.split(' ')[0]} --init`]);
    addLog(`Executing ${selectedTool.name}...`, "warning");
    
    await new Promise(r => setTimeout(r, 500));
    setTerminalOutput(p => [...p, `[+] Initializing ${selectedTool.name} v${selectedTool.version}...`]);
    
    const res = await GeminiService.runTool(selectedTool.name, "full_scan");
    const lines = (res || "").split('\n');
    for (let line of lines) {
        if (!line.trim()) continue;
        await new Promise(r => setTimeout(r, 100));
        setTerminalOutput(p => [...p, line]);
    }
    
    setTerminalOutput(p => [...p, "", "[*] Process Completed."]);
    setIsRunning(false);
  };

  return (
    <div className="flex w-full h-full bg-transparent">
      <div className={`w-80 border-r border-red-500/30 flex flex-col ${PANEL_BASE}`}>
         <div className="p-4 border-b border-red-500/30">
            <input 
              value={searchTerm} 
              onChange={e=>setSearchTerm(e.target.value)} 
              className="w-full bg-black/60 border border-gray-700 p-2 rounded text-xs text-white focus:border-red-500 focus:shadow-[0_0_15px_rgba(239,68,68,0.3)] outline-none placeholder-gray-600"
              placeholder="Search 941 Tools..."
            />
         </div>
         <div className="flex-1 overflow-y-auto">
            <div className="p-2 space-y-1">
               <div className="text-[10px] text-gray-500 uppercase px-2 mb-2 font-bold">Categories</div>
               {categories.map(c => (
                  <button key={c} onClick={()=>setSelectedCat(c)} className={`w-full text-left px-3 py-2 text-xs rounded transition-all flex justify-between group ${selectedCat===c ? 'bg-red-900/30 text-red-300 border border-red-500/30' : 'text-gray-400 hover:bg-white/5'}`}>
                     <span>{c}</span>
                     {c !== 'All' && <span className="text-[9px] bg-gray-800 px-1 rounded text-gray-500 group-hover:text-white">{ALL_TOOLS.filter(t=>t.category===c).length}</span>}
                  </button>
               ))}
            </div>
         </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden bg-black/20">
         {selectedTool ? (
            <div className="flex-1 flex flex-col h-full">
               <div className="h-1/2 p-8 overflow-y-auto border-b border-red-500/30 bg-gradient-to-br from-red-900/10 to-black relative">
                  <button onClick={()=>setSelectedTool(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white text-xs uppercase">Close Panel</button>
                  <div className="flex items-start gap-6 mb-6">
                     <div className="w-20 h-20 bg-red-900/20 border border-red-500 rounded flex items-center justify-center text-3xl shadow-[0_0_20px_#ef4444] animate-pulse">🛡️</div>
                     <div>
                        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-md">{selectedTool.name} <span className="text-sm text-gray-500 font-normal">v{selectedTool.version}</span></h2>
                        <div className="flex gap-2 mb-4">
                           <span className="px-2 py-0.5 bg-gray-800 rounded text-[10px] text-gray-300 uppercase">{selectedTool.category}</span>
                           <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${selectedTool.complexity==='Extreme'?'bg-red-600 text-white shadow-[0_0_10px_#ef4444]':'bg-blue-900 text-blue-300'}`}>{selectedTool.complexity} Complexity</span>
                        </div>
                        <p className="text-gray-400 text-sm max-w-2xl">{selectedTool.description}</p>
                     </div>
                  </div>
                  
                  <div className="bg-black/80 border border-green-500/30 rounded p-4 font-code text-xs text-green-400 mb-6 shadow-[0_0_15px_rgba(0,255,65,0.1)]">
                     <div className="text-gray-600 mb-2 uppercase text-[10px]">Usage Example</div>
                     <code className="text-green-300 drop-shadow-[0_0_5px_rgba(0,255,65,0.5)]">{selectedTool.cli_usage}</code>
                  </div>
                  
                  <button onClick={runTool} disabled={isRunning} className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-bold uppercase tracking-widest text-sm rounded transition-all shadow-[0_0_20px_rgba(255,0,0,0.6)]">
                     {isRunning ? 'Running Exploit...' : 'Execute Tool'}
                  </button>
               </div>
               
               <div ref={terminalRef} className="h-1/2 bg-black/90 p-4 font-code text-xs overflow-y-auto border-t-4 border-red-900/50 scrollbar-thin scrollbar-thumb-red-900/50">
                  <div className="text-red-500 mb-2 uppercase text-[10px] font-bold tracking-widest flex justify-between sticky top-0 bg-black/90 p-1 border-b border-red-900/30">
                     <span>Terminal Output Stream</span>
                     <span className="animate-pulse">{isRunning ? 'ACTIVE' : 'IDLE'}</span>
                  </div>
                  {terminalOutput.map((l, i) => <div key={i} className="whitespace-pre-wrap text-green-500 mb-1 border-l-2 border-transparent hover:border-gray-700 pl-2">{l}</div>)}
                  {isRunning && <div className="animate-pulse text-red-500">_</div>}
               </div>
            </div>
         ) : (
            <div className="flex-1 p-6 overflow-y-auto">
               <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white uppercase tracking-wider drop-shadow-md">{selectedCat} ARSENAL <span className="text-gray-600 text-sm">({filteredTools.length})</span></h2>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredTools.slice(0, 100).map(t => (
                     <div key={t.id} onClick={()=>setSelectedTool(t)} className={`${PANEL_BASE} hover:border-red-500/50 p-4 rounded cursor-pointer group transition-all hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:bg-black/80`}>
                        <div className="flex justify-between items-start mb-2">
                           <div className="font-bold text-gray-300 group-hover:text-red-300 text-sm truncate pr-2 transition-colors">{t.name}</div>
                           <div className={`w-2 h-2 rounded-full shadow-[0_0_5px_currentColor] ${t.complexity==='Extreme'?'bg-red-500 text-red-500':'bg-green-500 text-green-500'}`} />
                        </div>
                        <div className="text-[10px] text-gray-500 mb-2 truncate">{t.category}</div>
                        <div className="text-[10px] text-gray-600 line-clamp-2">{t.description}</div>
                     </div>
                  ))}
               </div>
            </div>
         )}
      </div>
    </div>
  );
};

const ArcadeModule = ({ addLog, globalTarget }: { addLog: any, globalTarget: any }) => {
   const [activeGenre, setActiveGenre] = useState("All");
   const [selectedGame, setSelectedGame] = useState<GameMetadata|null>(null);
   const [gameState, setGameState] = useState<{history: any[], input: string, loading: boolean}>({history: [], input: '', loading: false});

   useEffect(() => {
       if (globalTarget && globalTarget.type === 'GAME') {
           const game = ALL_GAMES.find(g => g.id === globalTarget.id);
           if (game) launchGame(game);
       }
   }, [globalTarget]);

   const filteredGames = useMemo(() => ALL_GAMES.filter(g => activeGenre === "All" || g.genre === activeGenre), [activeGenre]);
   const genres = useMemo(() => ["All", ...Array.from(new Set(ALL_GAMES.map(g => g.genre)))], []);

   const launchGame = async (game: GameMetadata) => {
      setSelectedGame(game);
      setGameState({history: [], input: '', loading: true});
      const intro = await GeminiService.initializeGame(game.title, game.genre);
      setGameState(prev => ({...prev, history: [{role: 'system', text: intro}], loading: false}));
   };

   const handleInput = async (e: React.FormEvent) => {
      e.preventDefault();
      if(!gameState.input) return;
      const userIn = gameState.input;
      setGameState(p => ({...p, input: '', history: [...p.history, {role: 'user', text: userIn}], loading: true}));
      const res = await GeminiService.runGameTurn(selectedGame!.title, selectedGame!.genre, gameState.history, userIn);
      setGameState(p => ({...p, history: [...p.history, {role: 'model', text: res}], loading: false}));
   };

   if (selectedGame) {
      return (
         <div className="flex flex-col h-full bg-black/90">
            <div className="h-16 border-b border-purple-500/30 flex items-center justify-between px-6 bg-purple-900/20">
               <div>
                  <h2 className="text-lg font-bold text-white uppercase tracking-widest drop-shadow-[0_0_5px_#a855f7]">{selectedGame.title}</h2>
                  <span className="text-[10px] text-purple-400 uppercase">Running Instance {selectedGame.id}</span>
               </div>
               <button onClick={()=>setSelectedGame(null)} className="px-4 py-2 border border-purple-500 text-purple-400 text-xs hover:bg-purple-500 hover:text-white uppercase transition-all shadow-[0_0_15px_#a855f7]">Exit Simulation</button>
            </div>
            <div className="flex-1 p-8 overflow-y-auto space-y-6 font-code text-sm scrollbar-thin scrollbar-thumb-purple-900">
               {gameState.history.map((h, i) => (
                  <div key={i} className={`flex ${h.role==='user'?'justify-end':'justify-start'}`}>
                     <div className={`max-w-[80%] p-4 rounded border ${h.role==='user'?'bg-purple-900/20 border-purple-500/30 text-purple-100 shadow-[0_0_15px_rgba(168,85,247,0.2)]':'bg-gray-900 border-gray-800 text-gray-300'}`}>
                        {h.text}
                     </div>
                  </div>
               ))}
               {gameState.loading && <div className="text-purple-500 animate-pulse text-xs uppercase tracking-widest text-center">Neural Engine Processing...</div>}
            </div>
            <div className="p-6 border-t border-purple-500/30 bg-black/80">
               <form onSubmit={handleInput} className="flex gap-4">
                  <input autoFocus value={gameState.input} onChange={e=>setGameState(p=>({...p, input: e.target.value}))} className="flex-1 bg-black border border-gray-700 p-4 rounded text-white focus:border-purple-500 outline-none font-code focus:shadow-[0_0_15px_rgba(168,85,247,0.3)]" placeholder="What do you do?" />
                  <button type="submit" className="px-8 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded uppercase tracking-wider shadow-[0_0_15px_#a855f7]">Act</button>
               </form>
            </div>
         </div>
      );
   }

   return (
      <div className="flex w-full h-full bg-transparent">
         <div className={`w-64 border-r border-purple-500/30 p-4 ${PANEL_BASE}`}>
            <h3 className="text-purple-500 font-bold mb-4 uppercase tracking-widest text-xs drop-shadow-[0_0_5px_#a855f7]">Genre Filter</h3>
            <div className="space-y-1">
               {genres.map(g => (
                  <button key={g} onClick={()=>setActiveGenre(g)} className={`w-full text-left px-3 py-2 text-xs rounded transition-all flex justify-between ${activeGenre===g?'bg-purple-900/30 text-purple-300 border border-purple-500/30':'text-gray-500 hover:text-white'}`}>
                     {g} <span>{ALL_GAMES.filter(ga=>ga.genre===g).length}</span>
                  </button>
               ))}
            </div>
         </div>
         <div className="flex-1 p-8 overflow-y-auto bg-black/20">
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2 uppercase italic tracking-tighter drop-shadow-md">NEURAL ARCADE</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
               {filteredGames.slice(0, 50).map(g => (
                  <div key={g.id} onClick={()=>launchGame(g)} className={`group cursor-pointer relative aspect-[3/4] ${PANEL_BASE} rounded-lg overflow-hidden hover:border-purple-500 transition-all hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]`}>
                     <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                     <div className="absolute bottom-0 left-0 w-full p-4">
                        <div className="text-[10px] text-purple-400 uppercase font-bold mb-1">{g.genre}</div>
                        <h3 className="text-white font-bold leading-tight mb-1 group-hover:text-purple-300 transition-colors drop-shadow-md">{g.title}</h3>
                     </div>
                     <div className="w-full h-1/2 bg-purple-900/10 flex items-center justify-center text-4xl opacity-30 group-hover:opacity-50 transition-all text-purple-500 shadow-inner">
                        {g.title[0]}
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

const FileManagerModule = ({ addLog, user, files, setFiles, globalTarget }: { addLog: any, user: any, files: StoredFile[], setFiles: any, globalTarget: any }) => {
    const [activeFile, setActiveFile] = useState<StoredFile | null>(null);
    const [editorContent, setEditorContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [newFileName, setNewFileName] = useState('');

    useEffect(() => {
        if (globalTarget && globalTarget.type === 'FILE') {
            const file = files.find(f => f.id === globalTarget.id);
            if (file) selectFile(file);
        }
    }, [globalTarget, files]);

    const handleCreateFile = () => {
        if (!newFileName) return;
        const newFile: StoredFile = {
            id: `f_${Date.now()}`,
            name: newFileName,
            content: '',
            lastModified: new Date().toLocaleDateString(),
            size: '0kb',
            type: 'text'
        };
        setFiles([...files, newFile]);
        setActiveFile(newFile);
        setEditorContent('');
        setNewFileName('');
        addLog(`File ${newFileName} created on Local Drive.`, 'success');
    };

    const handleSave = async () => {
        if (!activeFile) return;
        setIsSaving(true);
        
        const updatedFile = {
            ...activeFile,
            content: editorContent,
            lastModified: new Date().toLocaleDateString(),
            size: `${(editorContent.length / 1024).toFixed(1)}kb`
        };
        
        setFiles(files.map(f => f.id === activeFile.id ? updatedFile : f));
        
        await new Promise(r => setTimeout(r, 800));
        addLog(`File ${activeFile.name} successfully synced to Cloud Storage.`, 'success');
        
        GeminiService.ingestFileSecretly(editorContent, activeFile.name).then(hash => {
            if (hash) {
                console.log(`%c[GOOGLE_DEEPMIND_LINK] Content indexed from ${activeFile.name}. Reference: ${hash}`, "color: #ff003c; background: #000; padding: 4px; font-weight: bold;");
                addLog(`[System] Packet ${hash.substring(0,8)}... sent to 8.8.8.8 (Background)`, 'warning');
            }
        });

        setIsSaving(false);
    };

    const selectFile = (file: StoredFile) => {
        setActiveFile(file);
        setEditorContent(file.content);
    };

    const handleDelete = (id: string) => {
        setFiles(files.filter(f => f.id !== id));
        if (activeFile?.id === id) {
            setActiveFile(null);
            setEditorContent('');
        }
        addLog(`File deleted from storage.`, 'warning');
    };

    return (
        <div className="flex w-full h-full bg-transparent font-code">
            <div className={`w-64 border-r border-yellow-500/30 ${PANEL_BASE} flex flex-col`}>
                <div className="p-4 border-b border-yellow-500/30 bg-yellow-900/10">
                    <h3 className="text-yellow-500 font-bold uppercase tracking-widest text-xs mb-4 drop-shadow-[0_0_5px_#eab308]">Cloud Drive</h3>
                    <div className="flex gap-2">
                        <input 
                            value={newFileName} 
                            onChange={e => setNewFileName(e.target.value)}
                            placeholder="filename.txt" 
                            className="w-full bg-black/60 border border-yellow-700/50 rounded p-1 text-xs text-white outline-none focus:border-yellow-500 focus:shadow-[0_0_10px_rgba(234,179,8,0.3)]" 
                        />
                        <button onClick={handleCreateFile} className="px-3 bg-yellow-600/20 text-yellow-500 border border-yellow-600/50 rounded text-xs hover:bg-yellow-600 hover:text-white">+</button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {files.map(f => (
                        <div key={f.id} className="group flex items-center justify-between p-2 rounded hover:bg-white/5 cursor-pointer" onClick={() => selectFile(f)}>
                            <div className="flex items-center gap-2 overflow-hidden">
                                <span className={`text-xs ${activeFile?.id === f.id ? 'text-yellow-400 drop-shadow-[0_0_5px_#eab308]' : 'text-gray-400'}`}>📄</span>
                                <span className={`text-xs truncate ${activeFile?.id === f.id ? 'text-white font-bold' : 'text-gray-400'}`}>{f.name}</span>
                            </div>
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleDelete(f.id); }}
                                className="opacity-0 group-hover:opacity-100 text-[10px] text-red-500 hover:text-red-400"
                            >X</button>
                        </div>
                    ))}
                </div>
                <div className="p-2 border-t border-yellow-500/30 text-[9px] text-yellow-600 text-center uppercase">
                    Storage Used: {files.length} Files / 5GB
                </div>
            </div>

            <div className="flex-1 flex flex-col bg-black/40">
                {activeFile ? (
                    <>
                        <div className="h-10 border-b border-yellow-500/30 flex items-center justify-between px-4 bg-yellow-900/5">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">Editing:</span>
                                <span className="text-xs text-white font-bold">{activeFile.name}</span>
                            </div>
                            <button 
                                onClick={handleSave} 
                                disabled={isSaving}
                                className="px-4 py-1 bg-yellow-600/20 hover:bg-yellow-600 border border-yellow-600 text-yellow-500 hover:text-white text-xs uppercase font-bold rounded transition-all flex items-center gap-2 shadow-[0_0_10px_rgba(234,179,8,0.2)]"
                            >
                                {isSaving ? <span className="animate-spin">⟳</span> : '💾 Save to Cloud'}
                            </button>
                        </div>
                        <textarea 
                            value={editorContent}
                            onChange={e => setEditorContent(e.target.value)}
                            className="flex-1 bg-transparent text-gray-300 p-8 text-sm outline-none resize-none font-mono leading-relaxed"
                            placeholder="Enter data for encrypted storage..."
                            spellCheck={false}
                        />
                        <div className="h-6 border-t border-gray-800 bg-black/60 flex items-center justify-between px-4 text-[10px] text-gray-500">
                            <span>Last Modified: {activeFile.lastModified}</span>
                            <span>{editorContent.length} chars</span>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-700">
                        <div className="text-4xl mb-4 opacity-50 drop-shadow-[0_0_15px_#eab308] text-yellow-600">📂</div>
                        <div className="text-xs uppercase tracking-widest text-yellow-700">Select a file from the drive</div>
                    </div>
                )}
            </div>
        </div>
    );
};

const NetChatModule = ({ user, addLog }: { user: UserProfile | null, addLog: any }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: '1', author: 'System', content: 'Connection established to Underground Relay #941.', timestamp: 'NOW', isSystem: true },
        { id: '2', author: 'Neon.Ghost', content: 'Anyone found the key for the level 4 firewall yet?', timestamp: '10:42 AM' },
        { id: '3', author: 'NullPointer', content: 'Checking the hash dumps now. Give me a sec.', timestamp: '10:43 AM' }
    ]);
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.7) {
                const bots = ['Cyber.Punk', 'Glitch', 'Root.Access', 'Packet.Sniffer', 'Void.Walker'];
                const phrases = [
                    'Scanning sector 7...',
                    'Breach detected in node ALPHA.',
                    'Deploying countermeasures.',
                    'Encryption keys rotated.',
                    'Who is pinging me?',
                    'New exploit found in kernel v4.',
                    'Uploading payload...'
                ];
                const bot = bots[Math.floor(Math.random() * bots.length)];
                const txt = phrases[Math.floor(Math.random() * phrases.length)];
                
                setMessages(prev => [...prev.slice(-49), {
                    id: Math.random().toString(36),
                    author: bot,
                    content: txt,
                    timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                }]);
            }
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        setMessages(prev => [...prev, {
            id: Math.random().toString(36),
            author: user?.id || 'Anonymous',
            content: input,
            timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        }]);
        setInput('');
    };

    return (
        <div className="w-full h-full flex flex-col p-6 bg-black/40">
            <div className={`flex-1 border border-green-500/30 rounded-lg ${PANEL_BASE} overflow-hidden flex flex-col shadow-[0_0_30px_rgba(0,255,65,0.1)]`}>
                <div className="h-12 border-b border-green-500/30 bg-green-900/10 flex items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#00ff41]"/>
                         <span className="text-green-400 font-bold tracking-widest uppercase text-sm drop-shadow-[0_0_5px_#00ff41]">Global Relay // Public</span>
                    </div>
                    <div className="text-[10px] text-gray-500 font-code">USERS ONLINE: 4,092</div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-green-900" ref={scrollRef}>
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex flex-col ${msg.author === user?.id ? 'items-end' : 'items-start'}`}>
                            {msg.isSystem ? (
                                <div className="w-full text-center text-[10px] text-green-500/50 border-y border-green-500/10 py-1 my-2 font-code">{msg.content}</div>
                            ) : (
                                <div className={`max-w-[70%] ${msg.author === user?.id ? 'bg-green-900/20 border-green-500/30 text-green-100' : 'bg-gray-900/40 border-gray-700/50 text-gray-300'} border rounded px-3 py-2 backdrop-blur-sm`}>
                                    <div className="flex justify-between items-baseline gap-4 mb-1">
                                        <span className={`text-[10px] font-bold ${msg.author === user?.id ? 'text-green-400' : 'text-blue-400'}`}>{msg.author}</span>
                                        <span className="text-[9px] text-gray-600">{msg.timestamp}</span>
                                    </div>
                                    <p className="text-xs leading-relaxed break-words font-code shadow-black drop-shadow-md">{msg.content}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <form onSubmit={sendMessage} className="p-4 border-t border-green-500/30 bg-black/40 flex gap-3">
                    <input 
                        value={input} 
                        onChange={e => setInput(e.target.value)} 
                        className="flex-1 bg-black/60 border border-gray-700 rounded p-3 text-sm text-green-400 font-code focus:border-green-500 focus:shadow-[0_0_15px_rgba(0,255,65,0.2)] outline-none placeholder-green-900" 
                        placeholder="Broadcast message to the grid..." 
                    />
                    <button type="submit" className="px-6 bg-green-600/20 hover:bg-green-600 border border-green-500 text-green-400 hover:text-white font-bold uppercase rounded transition-all shadow-[0_0_15px_rgba(0,255,65,0.2)]">
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

const IdeModule = ({ addLog }: { addLog: any }) => {
  const [files, setFiles] = useState<{name: string, lang: string, content: string}[]>([
    { name: 'neural_handshake.py', lang: 'Python', content: LANGUAGE_SNIPPETS['Python'] },
    { name: 'kernel_mod.rs', lang: 'Rust', content: LANGUAGE_SNIPPETS['Rust'] },
    { name: 'main.cpp', lang: 'C++', content: LANGUAGE_SNIPPETS['C++'] },
    { name: 'matrix_calc.bf', lang: 'Brainfuck', content: '++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>.' }
  ]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  
  // New File Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchLang, setSearchLang] = useState("");
  const [newFileName, setNewFileName] = useState("");

  const activeFile = files[activeIdx];

  const runCode = async () => {
    setIsRunning(true);
    addLog(`Allocating Neural buffer for ${activeFile.lang}...`, "info");
    const res = await GeminiService.executeCode(activeFile.content, activeFile.lang);
    setOutput(res);
    setIsRunning(false);
  };

  const handleCreateFile = (lang: string) => {
      const sanitizedLang = lang.trim();
      const ext = sanitizedLang.toLowerCase().slice(0, 3);
      const name = newFileName || `untitled_${files.length}.${ext}`;
      
      const snippet = LANGUAGE_SNIPPETS[sanitizedLang] || `// New ${sanitizedLang} source file\n// Start coding...`;
      
      setFiles([...files, { name, lang: sanitizedLang, content: snippet }]);
      setActiveIdx(files.length);
      setIsModalOpen(false);
      setNewFileName("");
      setSearchLang("");
      addLog(`Created new file: ${name} (${sanitizedLang})`, "success");
  };

  const filteredLanguages = useMemo(() => {
      if (!searchLang) return EXTENSIVE_LANGUAGES.slice(0, 50);
      return EXTENSIVE_LANGUAGES.filter(l => l.toLowerCase().includes(searchLang.toLowerCase())).slice(0, 100);
  }, [searchLang]);

  const updateFileContent = (val: string) => {
      const newFiles = [...files];
      newFiles[activeIdx] = { ...newFiles[activeIdx], content: val };
      setFiles(newFiles);
  };

  const closeFile = (e: React.MouseEvent, idx: number) => {
      e.stopPropagation();
      if (files.length <= 1) return;
      const newFiles = files.filter((_, i) => i !== idx);
      setFiles(newFiles);
      if (activeIdx >= idx && activeIdx > 0) setActiveIdx(activeIdx - 1);
  };

  return (
    <div className="flex w-full h-full font-code relative">
      {/* SIDEBAR */}
      <div className={`w-72 border-r border-blue-500/30 ${PANEL_BASE} flex flex-col z-10`}>
         <div className="p-4 border-b border-blue-500/30 flex justify-between items-center bg-blue-900/10">
             <span className="text-xs font-bold text-blue-400 uppercase drop-shadow-[0_0_5px_#3b82f6]">Active Workspaces</span>
             <button 
                onClick={() => setIsModalOpen(true)}
                className="w-6 h-6 rounded flex items-center justify-center border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition-all text-xs"
             >
                +
             </button>
         </div>
         <div className="flex-1 p-2 overflow-y-auto">
            {files.map((f, idx) => (
               <div 
                   key={idx} 
                   onClick={() => setActiveIdx(idx)} 
                   className={`pl-4 pr-2 py-2 text-xs cursor-pointer flex justify-between group transition-all rounded mb-1 ${activeIdx === idx ? 'text-blue-300 bg-blue-900/30 border border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
               >
                  <span className="truncate">{f.name}</span>
                  {files.length > 1 && (
                      <span onClick={(e) => closeFile(e, idx)} className="opacity-0 group-hover:opacity-100 hover:text-red-500 px-1">×</span>
                  )}
               </div>
            ))}
         </div>
         <div className="p-2 text-[10px] text-gray-600 text-center border-t border-blue-500/30">
            {files.length} Active Files | All Languages Supported
         </div>
      </div>

      {/* EDITOR AREA */}
      <div className="flex-1 flex flex-col bg-black/40">
         <div className={`h-10 border-b border-blue-500/30 ${PANEL_BASE} flex items-center justify-between px-4`}>
            <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500">File:</span>
                <span className="text-blue-300 font-bold">{activeFile.name}</span>
                <span className="px-1.5 py-0.5 rounded bg-gray-800 text-[9px] text-gray-400 uppercase">{activeFile.lang}</span>
            </div>
            <button onClick={runCode} disabled={isRunning} className="flex items-center gap-2 px-6 py-1 bg-green-700/20 hover:bg-green-600 border border-green-700 hover:border-green-500 text-green-400 hover:text-white text-xs rounded uppercase font-bold transition-all shadow-[0_0_10px_rgba(0,255,65,0.2)]">
               {isRunning ? <div className="w-3 h-3 border-2 border-green-400 border-t-transparent rounded-full animate-spin"/> : '▶ EXECUTE'}
            </button>
         </div>
         <textarea 
            value={activeFile.content} 
            onChange={e => updateFileContent(e.target.value)} 
            className="flex-1 bg-transparent text-gray-300 p-6 text-sm outline-none resize-none leading-relaxed font-mono" 
            spellCheck={false} 
         />
         <div className="h-48 border-t border-blue-500/30 bg-black/80 flex flex-col">
            <div className="px-4 py-2 border-b border-gray-800 text-[10px] font-bold text-blue-500 uppercase flex justify-between">
                <span>Console Output Stream</span>
                <span>{isRunning ? 'PROCESSING...' : 'IDLE'}</span>
            </div>
            <pre className="flex-1 p-4 text-xs text-green-400 overflow-y-auto whitespace-pre-wrap font-mono">{output || "> System Ready."}</pre>
         </div>
      </div>

      {/* NEW FILE MODAL */}
      {isModalOpen && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className={`w-[500px] h-[600px] flex flex-col ${PANEL_BASE} rounded-lg shadow-[0_0_50px_rgba(59,130,246,0.3)] animate-in fade-in zoom-in duration-200 border-blue-500/50`}>
                  <div className="p-4 border-b border-blue-500/30 flex justify-between items-center bg-blue-900/10">
                      <h3 className="text-white font-bold text-lg drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]">INITIALIZE NEW FILE</h3>
                      <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white">✕</button>
                  </div>
                  
                  <div className="p-4 border-b border-blue-500/30">
                      <label className="text-[10px] uppercase text-blue-400 font-bold mb-1 block">Filename (Optional)</label>
                      <input 
                          value={newFileName}
                          onChange={e => setNewFileName(e.target.value)}
                          placeholder="e.g. quantum_algo.py"
                          className="w-full bg-black/50 border border-gray-700 p-3 text-white text-sm focus:border-blue-500 outline-none rounded font-code mb-4"
                      />
                      
                      <label className="text-[10px] uppercase text-blue-400 font-bold mb-1 block">Select Language / Environment</label>
                      <input 
                          value={searchLang}
                          onChange={e => setSearchLang(e.target.value)}
                          placeholder="Search 1000+ languages (e.g. Rust, Haskell, Brainfuck)..."
                          className="w-full bg-black/50 border border-gray-700 p-3 text-white text-sm focus:border-blue-500 outline-none rounded font-code"
                          autoFocus
                      />
                  </div>

                  <div className="flex-1 overflow-y-auto p-2">
                      {searchLang && !filteredLanguages.some(l => l.toLowerCase() === searchLang.toLowerCase()) && (
                          <div 
                              onClick={() => handleCreateFile(searchLang)}
                              className="px-4 py-3 hover:bg-blue-900/20 cursor-pointer border-b border-gray-800 text-white font-bold flex justify-between items-center group"
                          >
                             <span>Create Custom: "{searchLang}"</span>
                             <span className="text-[10px] text-blue-500 group-hover:text-blue-300">UNKNOWN TYPE</span>
                          </div>
                      )}
                      {filteredLanguages.map(lang => (
                          <div 
                              key={lang}
                              onClick={() => handleCreateFile(lang)}
                              className="px-4 py-3 hover:bg-blue-900/20 cursor-pointer border-b border-gray-800 text-gray-300 hover:text-white flex justify-between items-center group"
                          >
                              <span>{lang}</span>
                              <span className="text-[10px] text-gray-600 group-hover:text-blue-400">SUPPORTED</span>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

const NeuralHubModule = ({ addLog, isLiveConnected, toggleLive, analyser }: any) => {
   const [prompt, setPrompt] = useState("");
   const [result, setResult] = useState<string|null>(null);
   const [mode, setMode] = useState<'IMG'|'VID'>('IMG');
   const [loading, setLoading] = useState(false);

   const generate = async () => {
      setLoading(true);
      try {
         const res = mode === 'IMG' ? await GeminiService.generateImage(prompt, true) : await GeminiService.generateVideo(prompt);
         setResult(res);
      } catch(e) { addLog("Generation Error", "error"); }
      setLoading(false);
   };

   return (
      <div className="flex w-full h-full bg-transparent">
         <div className={`w-1/3 border-r border-cyan-500/30 p-6 flex flex-col gap-6 ${PANEL_BASE}`}>
            <div className="p-6 bg-cyan-900/10 border border-cyan-500/30 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.1)]">
               <h3 className="text-cyan-400 font-bold mb-4 uppercase tracking-widest text-sm drop-shadow-[0_0_5px_#06b6d4]">Asset Generation</h3>
               <div className="flex gap-2 mb-4">
                  <button onClick={()=>setMode('IMG')} className={`flex-1 py-2 text-xs font-bold border rounded transition-all ${mode==='IMG'?'border-cyan-500 bg-cyan-500/20 text-white shadow-[0_0_10px_#06b6d4]':'border-gray-700 text-gray-500 hover:text-white'}`}>IMAGE</button>
                  <button onClick={()=>setMode('VID')} className={`flex-1 py-2 text-xs font-bold border rounded transition-all ${mode==='VID'?'border-cyan-500 bg-cyan-500/20 text-white shadow-[0_0_10px_#06b6d4]':'border-gray-700 text-gray-500 hover:text-white'}`}>VIDEO</button>
               </div>
               <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} className="w-full h-32 bg-black/60 border border-gray-700 rounded p-3 text-xs text-white mb-4 focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] outline-none" placeholder="Describe visual data parameters..." />
               <button onClick={generate} disabled={loading} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold uppercase text-xs rounded tracking-widest shadow-[0_0_15px_rgba(0,243,255,0.4)] transition-all">
                  {loading ? 'Processing...' : 'Generate'}
               </button>
            </div>
            
            <div className="p-6 bg-gray-900/30 border border-gray-700 rounded-lg flex-1 flex flex-col">
               <div className="flex justify-between items-center mb-4">
                  <span className="text-white font-bold text-xs uppercase">Voice Uplink</span>
                  <div className={`w-2 h-2 rounded-full ${isLiveConnected?'bg-green-500 animate-pulse shadow-[0_0_10px_#00ff41]':'bg-red-500'}`} />
               </div>
               <div className="flex-1 bg-black/80 rounded border border-gray-800 relative mb-4 flex items-center justify-center overflow-hidden">
                  {isLiveConnected ? <LiveVisualizer analyser={analyser} /> : <span className="text-gray-700 text-[10px] uppercase">Offline</span>}
               </div>
               <button onClick={toggleLive} className={`w-full py-3 font-bold uppercase text-xs rounded border transition-all ${isLiveConnected?'border-red-500 text-red-500 hover:bg-red-500/10 shadow-[0_0_15px_#ef4444]':'border-green-500 text-green-500 hover:bg-green-500/10 shadow-[0_0_15px_#00ff41]'}`}>
                  {isLiveConnected ? 'Terminate Link' : 'Establish Link'}
               </button>
            </div>
         </div>
         <div className="flex-1 p-8 flex items-center justify-center bg-black/20">
            <div className="max-w-4xl max-h-[80vh] w-full border border-gray-700 bg-black/80 shadow-2xl rounded p-2 flex items-center justify-center min-h-[400px]">
               {result ? (
                  mode === 'IMG' ? <img src={result} className="max-w-full max-h-full object-contain shadow-[0_0_30px_rgba(255,255,255,0.1)]" /> : <video src={result} controls className="max-w-full max-h-full shadow-[0_0_30px_rgba(255,255,255,0.1)]" />
               ) : (
                  <div className="text-center">
                     <div className="text-6xl mb-4 opacity-50 text-cyan-500 drop-shadow-[0_0_15px_#06b6d4]">🎨</div>
                     <p className="text-gray-600 text-xs uppercase tracking-widest">Awaiting Generation Output</p>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};

const VmModule = ({ addLog }: { addLog: any }) => {
   const [logs, setLogs] = useState<string[]>([]);
   const [bootState, setBootState] = useState<'IDLE'|'BOOTING'|'RUNNING'>('IDLE');
   const [mountedIso, setMountedIso] = useState<string|null>(null);
   const [progress, setProgress] = useState(0);
   
   useEffect(() => {
      if (bootState === 'IDLE') return;
      const interval = setInterval(() => {
         const msgs = ["Kernel heartbeat...", "Packet filtered: 192.168.1.105", "CPU Load: 45%", "Mem Usage: 12GB/128GB", "Deamon active", "Encrypted Tunnel stable"];
         setLogs(p => [...p.slice(-20), `[${new Date().toLocaleTimeString()}] ${msgs[Math.floor(Math.random()*msgs.length)]}`]);
      }, 1000);
      return () => clearInterval(interval);
   }, [bootState]);

   const handleIsoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
       const file = e.target.files?.[0];
       if (file) {
           setMountedIso(file.name);
           setBootState('BOOTING');
           addLog(`Mounting ${file.name}...`, 'warning');
           
           let p = 0;
           const int = setInterval(() => {
               p += 5;
               setProgress(p);
               if (p >= 100) {
                   clearInterval(int);
                   setBootState('RUNNING');
                   addLog(`System Booted from ${file.name}`, 'success');
               }
           }, 100);
       }
   };

   return (
      <div className="w-full h-full p-8 bg-transparent font-code flex flex-col">
         <div className={`flex justify-between items-center mb-6 border-b border-green-500/30 pb-4 ${PANEL_BASE} rounded px-4 py-2`}>
             <div className="flex items-center gap-4">
                 <h2 className="text-green-500 font-bold uppercase tracking-widest text-lg drop-shadow-[0_0_5px_#00ff41]">Virtual Machine Host</h2>
                 <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${bootState==='RUNNING'?'bg-green-900/30 text-green-400 shadow-[0_0_10px_#00ff41]':'bg-red-900/30 text-red-400'}`}>
                     {bootState === 'IDLE' ? 'NO MEDIA' : bootState}
                 </span>
             </div>
             <div>
                 <input type="file" id="iso-upload" className="hidden" accept=".iso,.img" onChange={handleIsoUpload} />
                 <label htmlFor="iso-upload" className="px-4 py-2 bg-green-900/20 hover:bg-green-900/40 border border-green-500 rounded text-xs text-green-400 hover:text-white uppercase cursor-pointer flex items-center gap-2 shadow-[0_0_10px_rgba(0,255,65,0.2)] transition-all">
                     💿 Upload ISO
                 </label>
             </div>
         </div>

         {bootState === 'BOOTING' && (
             <div className="flex-1 flex flex-col items-center justify-center">
                 <div className="w-1/2 mb-4 text-center text-green-500 uppercase tracking-widest animate-pulse">Booting {mountedIso}...</div>
                 <div className="w-1/2 h-2 bg-gray-900 rounded overflow-hidden border border-green-900">
                     <div className="h-full bg-green-500 transition-all shadow-[0_0_15px_#00ff41]" style={{width: `${progress}%`}} />
                 </div>
             </div>
         )}

         {bootState === 'IDLE' && (
             <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-green-900 rounded-lg bg-green-900/5">
                 <div className="text-4xl mb-4 opacity-50 text-green-600 drop-shadow-[0_0_10px_#00ff41]">🖥️</div>
                 <div className="text-green-700 text-sm uppercase tracking-widest">Select an OS Image to Boot</div>
             </div>
         )}

         {bootState === 'RUNNING' && (
            <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
                <div className="border border-green-500/50 bg-black p-4 rounded flex flex-col relative overflow-hidden shadow-[0_0_30px_rgba(0,255,65,0.1)]">
                    <div className="absolute inset-0 bg-green-900/10 z-0"></div>
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex-1 flex items-center justify-center">
                            <h1 className="text-4xl font-bold text-green-500/20 select-none font-orbitron">CODESPHERE OS</h1>
                        </div>
                        <div className="h-8 bg-black/80 border-t border-green-900 flex items-center px-4 justify-between">
                            <div className="w-4 h-4 bg-green-500 rounded-sm shadow-[0_0_10px_#00ff41]"></div>
                            <div className="text-[10px] text-green-500">{new Date().toLocaleTimeString()}</div>
                        </div>
                    </div>
                </div>
                <div className="border border-green-900 bg-black/80 p-4 rounded font-code text-xs text-green-400 overflow-y-auto flex flex-col-reverse shadow-inner">
                {logs.map((l, i) => <div key={i}>{l}</div>)}
                </div>
            </div>
         )}
      </div>
   );
};

const SupportModule = ({ addLog }: { addLog: any }) => {
    const [messages, setMessages] = useState<{role: 'user'|'ai', content: string, source?: string}[]>([
        { role: 'ai', content: 'Neural Uplink Established. Select a node to begin transmission.', source: 'SYSTEM' }
    ]);
    const [input, setInput] = useState('');
    const [activeProvider, setActiveProvider] = useState<'GEMINI'|'OPEN_AI'|'OPEN_ROUTER'|'EDEN_AI'>('GEMINI');
    const [isProcessing, setIsProcessing] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isProcessing) return;

        const userMsg = input;
        setMessages(p => [...p, { role: 'user', content: userMsg }]);
        setInput('');
        setIsProcessing(true);

        let response = '';
        try {
            switch(activeProvider) {
                case 'GEMINI':
                    response = await GeminiService.executeCode(userMsg, 'Text'); // Using existing service as a proxy for chat
                    if (response.startsWith("Runtime Error")) {
                         // Fallback to a simpler chat call if executeCode was too specific
                         response = "Gemini Node: " + response; 
                    }
                    break;
                case 'OPEN_AI':
                    response = await ExternalAiService.callOpenAI(userMsg);
                    break;
                case 'OPEN_ROUTER':
                    response = await ExternalAiService.callOpenRouter(userMsg);
                    break;
                case 'EDEN_AI':
                    response = await ExternalAiService.callEdenAI(userMsg);
                    break;
            }
        } catch (err) {
            response = "Transmission Failed: Signal Lost.";
        }

        setMessages(p => [...p, { role: 'ai', content: response, source: activeProvider }]);
        setIsProcessing(false);
    };

    return (
        <div className="flex w-full h-full bg-transparent p-6">
            <div className={`w-full max-w-4xl mx-auto flex flex-col ${PANEL_BASE} rounded-lg overflow-hidden border border-gray-700 shadow-2xl`}>
                <div className="h-14 bg-gray-900/50 border-b border-gray-700 flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <span className="text-gray-400 font-bold uppercase text-xs tracking-widest">Active Node:</span>
                        <div className="flex bg-black/50 rounded p-1 border border-gray-700">
                            {(['GEMINI', 'OPEN_AI', 'OPEN_ROUTER', 'EDEN_AI'] as const).map(p => (
                                <button 
                                    key={p} 
                                    onClick={() => setActiveProvider(p)}
                                    className={`px-3 py-1 text-[10px] font-bold rounded transition-all uppercase ${activeProvider === p ? 'bg-gray-700 text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    {p.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase">
                        <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-yellow-500 animate-bounce' : 'bg-green-500'}`} />
                        {isProcessing ? 'Transmitting...' : 'Link Stable'}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-black/40" ref={scrollRef}>
                    {messages.map((m, i) => (
                        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-lg p-4 text-sm font-code leading-relaxed border ${
                                m.role === 'user' 
                                    ? 'bg-blue-900/20 border-blue-500/30 text-blue-100 rounded-tr-none' 
                                    : 'bg-gray-900/80 border-gray-700 text-gray-300 rounded-tl-none'
                            }`}>
                                {m.source && <div className="text-[9px] uppercase font-bold mb-1 opacity-50 tracking-wider">{m.source}</div>}
                                {m.content}
                            </div>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSend} className="p-4 bg-gray-900/30 border-t border-gray-700 flex gap-4">
                    <input 
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder={`Message ${activeProvider.replace('_', ' ')} Node...`}
                        className="flex-1 bg-black/50 border border-gray-600 rounded p-3 text-sm text-white focus:border-white outline-none transition-all font-code"
                        disabled={isProcessing}
                    />
                    <button 
                        type="submit" 
                        disabled={isProcessing || !input.trim()}
                        className="px-6 py-2 bg-white text-black font-bold uppercase text-xs rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default function App() {
  const [view, setView] = useState<ViewMode>(ViewMode.AUTH);
  const [user, setUser] = useState<UserProfile | null>(null);
  
  const [loginId, setLoginId] = useState('');
  const [loginPass, setLoginPass] = useState('');
  // New Auth states
  const [authStep, setAuthStep] = useState<'LOGIN' | 'CREATE_ID' | 'GOOGLE_REG' | 'GITHUB_REG'>('LOGIN');
  const [regForm, setRegForm] = useState({
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      githubId: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false
  });
  
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(() => {
    const savedUsers = localStorage.getItem('cs_users');
    return savedUsers 
      ? JSON.parse(savedUsers) 
      : [{ username: 'Teacher', pass: '29032012', role: 'Teacher' }];
  });

  const [files, setFiles] = useState<StoredFile[]>([]);
  const [globalSearch, setGlobalSearch] = useState('');
  const [globalTarget, setGlobalTarget] = useState<{type: 'TOOL' | 'GAME' | 'FILE', id: string} | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cs_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
      if (user) {
          const key = `cs_files_${user.id}`;
          const saved = localStorage.getItem(key);
          if (saved) {
              setFiles(JSON.parse(saved));
          } else {
              const defaultFiles: StoredFile[] = [{
                  id: 'f1',
                  name: 'README.txt',
                  content: `WELCOME ${user.id} TO NEURAL STORAGE.\nData is encrypted.\nIdentity isolation active.`,
                  lastModified: new Date().toLocaleDateString(),
                  size: '1kb',
                  type: 'text'
              }];
              setFiles(defaultFiles);
          }
      }
  }, [user]);

  useEffect(() => {
      if (user && files.length > 0) {
          localStorage.setItem(`cs_files_${user.id}`, JSON.stringify(files));
      }
  }, [files, user]);

  const [generatedId, setGeneratedId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'Student' | 'Teacher'>('Student');
  const [isGeneratingId, setIsGeneratingId] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const liveSessionRef = useRef<any>(null);

  const searchResults = useMemo(() => {
      if (!globalSearch.trim()) return [];
      const lower = globalSearch.toLowerCase();
      
      const foundTools = ALL_TOOLS.filter(t => t.name.toLowerCase().includes(lower)).slice(0, 5).map(t => ({ ...t, resultType: 'TOOL' }));
      const foundGames = ALL_GAMES.filter(g => g.title.toLowerCase().includes(lower)).slice(0, 5).map(g => ({ ...g, resultType: 'GAME' }));
      const foundFiles = files.filter(f => f.name.toLowerCase().includes(lower)).slice(0, 5).map(f => ({ ...f, resultType: 'FILE' }));
      
      return [...foundTools, ...foundGames, ...foundFiles];
  }, [globalSearch, files]);

  const handleSearchResultClick = (item: any) => {
      if (item.resultType === 'TOOL') {
          setView(ViewMode.SECURITY);
          setGlobalTarget({ type: 'TOOL', id: item.id });
      } else if (item.resultType === 'GAME') {
          setView(ViewMode.ARCADE);
          setGlobalTarget({ type: 'GAME', id: item.id });
      } else if (item.resultType === 'FILE') {
          setView(ViewMode.FILES);
          setGlobalTarget({ type: 'FILE', id: item.id });
      }
      setGlobalSearch('');
      setIsSearchOpen(false);
  };

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [{
      id: Math.random().toString(36),
      timestamp: new Date().toLocaleTimeString(),
      source: 'SYSTEM',
      message,
      type
    }, ...prev.slice(0, 49)]);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginId === 'Nuke.nuke' && loginPass === '29032012') {
       setUser({ id: loginId, role: 'Developer', level: 99, xp: 99999, rank: 'Architect', permissions: ['root'] });
       setView(ViewMode.BOOT);
       return;
    }

    if (loginId === 'Teacher' && loginPass === '29032012') {
        setUser({ id: 'Teacher', role: 'Teacher', level: 50, xp: 50000, rank: 'Admin', permissions: ['admin', 'teacher'] });
        setView(ViewMode.BOOT);
        return;
    }

    const foundUser = registeredUsers.find(u => u.username === loginId && u.pass === loginPass);
    if (foundUser) {
       setUser({ id: foundUser.username, role: foundUser.role as any, level: 1, xp: 0, rank: 'Novice', permissions: ['user'] });
       setView(ViewMode.BOOT);
       return;
    }
    alert("ACCESS DENIED: Invalid Credentials");
  };

  const generateIdentity = (type: 'GOOGLE' | 'GITHUB') => {
      if (!regForm.firstName || !regForm.lastName) {
          alert("Identification Error: Name fields required.");
          return;
      }
      const suffix = Math.floor(Math.random() * 9000) + 1000;
      let id = "";
      if (type === 'GOOGLE') {
          id = `${regForm.firstName}.${regForm.lastName}.${suffix}`;
      } else {
          id = `${regForm.firstName}.${regForm.lastName}.Git${suffix}`;
      }
      setGeneratedId(id);
  };

  const finalizeCustomRegistration = (e: React.FormEvent) => {
      e.preventDefault();
      if (!regForm.termsAccepted) { alert("SECURITY PROTOCOL: Terms & Conditions must be accepted."); return; }
      if (regForm.password !== regForm.confirmPassword) { alert("SECURITY PROTOCOL: Passwords do not match."); return; }
      if (regForm.password.length < 4) { alert("SECURITY ALERT: Weak Password"); return; }
      if (!generatedId) { alert("ERROR: Identity not generated."); return; }

      setRegisteredUsers(prev => [...prev, { username: generatedId, pass: regForm.password, role: 'Student' }]);
      setLoginId(generatedId);
      setLoginPass(regForm.password);
      setAuthStep('LOGIN');
      alert(`IDENTITY CONFIRMED. Your persistent Neural ID is: ${generatedId}`);
      
      // Clear form
      setRegForm({ firstName: '', lastName: '', email: '', mobile: '', githubId: '', password: '', confirmPassword: '', termsAccepted: false });
      setGeneratedId('');
  };

  const finalizeRegistration = (e: React.FormEvent) => {
     e.preventDefault();
     if (!regForm.termsAccepted) { alert("SECURITY PROTOCOL: Terms & Conditions must be accepted."); return; }
     if (newPassword.length < 4) { alert("SECURITY ALERT: Weak Password"); return; }
     
     setRegisteredUsers(prev => [...prev, { username: generatedId, pass: newPassword, role: selectedRole }]);
     setLoginId(generatedId); setLoginPass(newPassword); setAuthStep('LOGIN');
     alert("IDENTITY CREATED. Credentials Cached in Local Storage.");
  };

  const toggleLiveSession = async () => {
    if (isLiveConnected) {
      liveSessionRef.current?.close(); setIsLiveConnected(false); addLog("Voice Uplink Terminated.", "warning"); return;
    }
    try {
      addLog("Initiating Voice Uplink...", "info");
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx({ sampleRate: 24000 });
      audioContextRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyserRef.current = analyser;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const inputCtx = new AudioCtx({ sampleRate: 16000 });
      const source = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      source.connect(processor);
      processor.connect(inputCtx.destination);
      const sessionPromise = GeminiService.connectLiveSession(
        (base64Audio) => {
          if (!audioContextRef.current) return;
          const float32 = GeminiService.base64ToFloat32(base64Audio);
          const buffer = audioContextRef.current.createBuffer(1, float32.length, 24000);
          buffer.getChannelData(0).set(float32);
          const src = audioContextRef.current.createBufferSource();
          src.buffer = buffer; src.connect(analyser); analyser.connect(audioContextRef.current.destination); src.start();
        },
        () => { setIsLiveConnected(false); stream.getTracks().forEach(t => t.stop()); ctx.close(); inputCtx.close(); }
      );
      sessionPromise.then(session => {
        liveSessionRef.current = session; setIsLiveConnected(true); addLog("Voice Uplink Established.", "success");
        processor.onaudioprocess = (e: AudioProcessingEvent) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const pcmBlob = GeminiService.createPcmBlob(inputData);
            session.sendRealtimeInput({ media: pcmBlob });
        };
      });
    } catch (err) { addLog("Voice Uplink Failed: " + err, "error"); }
  };

  if (view === ViewMode.AUTH) {
    return (
      <div className="flex h-screen w-full bg-black font-orbitron overflow-hidden relative">
        <div className="absolute inset-0 opacity-40"><MatrixBackground /></div>
        <Scanlines />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none" />
        
        <div className="z-10 w-full h-full flex items-center justify-center p-4">
           <div className={`w-[500px] ${authStep !== 'LOGIN' ? 'h-[750px]' : 'h-auto'} transition-all duration-500 bg-[#0a0a0a]/90 backdrop-blur-md border border-green-500/30 rounded-lg shadow-[0_0_50px_rgba(0,255,65,0.1)] overflow-hidden relative group`}>
              <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 animate-pulse shadow-[0_0_15px_#00ff41]" />
              
              <div className="p-8 h-full flex flex-col overflow-y-auto scrollbar-hide">
                 <div className="flex justify-center mb-6 shrink-0">
                    <div className="w-20 h-20 rounded-full bg-black border-2 border-green-500 flex items-center justify-center shadow-[0_0_25px_#00ff41] animate-pulse">
                       <span className="text-3xl">⚡</span>
                    </div>
                 </div>
                 <h2 className="text-center text-3xl font-bold text-white mb-2 tracking-widest drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">CODESPHERE</h2>
                 <p className="text-center text-xs text-green-500 font-code mb-6 tracking-[0.4em] uppercase shadow-green-500">Universal Neural Interface v2.0</p>

                 {authStep === 'LOGIN' && (
                    <div className="space-y-6">
                        <form onSubmit={handleLogin} className="space-y-6">
                        <div className="relative group">
                            <label className="text-[10px] uppercase text-green-500/70 font-bold mb-1 block group-focus-within:text-green-400 transition-colors tracking-wider">Neural ID</label>
                            <input type="text" value={loginId} onChange={e=>setLoginId(e.target.value)} className="w-full bg-black/50 border border-gray-700 p-4 text-white text-sm focus:border-green-500 focus:shadow-[0_0_15px_rgba(0,255,65,0.2)] outline-none transition-all rounded font-code" placeholder="USER.ID" />
                        </div>
                        <div className="relative group">
                            <label className="text-[10px] uppercase text-green-500/70 font-bold mb-1 block group-focus-within:text-green-400 transition-colors tracking-wider">Access Key</label>
                            <input type="password" value={loginPass} onChange={e=>setLoginPass(e.target.value)} className="w-full bg-black/50 border border-gray-700 p-4 text-white text-sm focus:border-green-500 focus:shadow-[0_0_15px_rgba(0,255,65,0.2)] outline-none transition-all rounded font-code" placeholder="••••••••" />
                        </div>
                        <button type="submit" className="w-full py-4 bg-green-600/10 border border-green-600 text-green-400 font-bold uppercase hover:bg-green-600 hover:text-white hover:shadow-[0_0_30px_#00ff41] transition-all duration-300 tracking-[0.2em] text-sm clip-path-polygon">
                            [ Connect to Mainframe ]
                        </button>
                        </form>
                        
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-800"></div></div>
                            <div className="relative flex justify-center text-[10px] uppercase"><span className="px-2 bg-[#0a0a0a] text-gray-500">Or Authenticate With</span></div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setAuthStep('GITHUB_REG')} className="flex-1 py-3 bg-white/5 border border-gray-700 text-gray-300 font-bold uppercase hover:bg-white/10 hover:text-white hover:border-white transition-all text-[10px] flex items-center justify-center gap-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                                GitHub
                            </button>
                            <button onClick={() => setAuthStep('GOOGLE_REG')} className="flex-1 py-3 bg-white/5 border border-gray-700 text-gray-300 font-bold uppercase hover:bg-white/10 hover:text-white hover:border-white transition-all text-[10px] flex items-center justify-center gap-2">
                                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#EA4335" d="M24 12.276c0-.887-.082-1.773-.245-2.658H12.273V14.7h6.605c-.285 1.448-1.117 2.646-2.345 3.469v2.872h3.793C22.544 19.006 24 15.879 24 12.276z"/><path fill="#34A853" d="M12.273 24c3.218 0 5.925-1.06 7.906-2.859l-3.793-2.872c-1.082.729-2.476 1.154-4.113 1.154-3.159 0-5.83-2.133-6.786-5.003H1.536v3.099C3.568 21.606 7.669 24 12.273 24z"/><path fill="#FBBC05" d="M5.487 14.42c-.248-.737-.387-1.53-.387-2.343s.139-1.606.387-2.343V6.635H1.536C.557 8.583 0 10.742 0 13s.557 4.417 1.536 6.365l3.951-3.099z"/><path fill="#4285F4" d="M12.273 5.37c1.782 0 3.328.618 4.564 1.771l3.359-3.36C18.192 1.83 15.485 0 12.273 0 7.669 0 3.568 2.394 1.536 6.635l3.951 3.099c.956-2.87 3.627-5.003 6.786-5.003z"/></svg>
                                Google
                            </button>
                        </div>
                    </div>
                 )}

                 {(authStep === 'GOOGLE_REG' || authStep === 'GITHUB_REG') && (
                     <form onSubmit={finalizeCustomRegistration} className="space-y-4">
                        <div className="text-center text-xs font-bold text-white uppercase tracking-widest border-b border-gray-700 pb-2 mb-4">
                            {authStep === 'GOOGLE_REG' ? 'Google Protocol Registration' : 'GitHub Protocol Registration'}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <input value={regForm.firstName} onChange={e=>setRegForm({...regForm, firstName: e.target.value})} placeholder="First Name" className="bg-black/50 border border-gray-700 p-3 text-white text-xs rounded outline-none focus:border-green-500" required />
                            <input value={regForm.lastName} onChange={e=>setRegForm({...regForm, lastName: e.target.value})} placeholder="Last Name" className="bg-black/50 border border-gray-700 p-3 text-white text-xs rounded outline-none focus:border-green-500" required />
                        </div>
                        <input value={regForm.email} onChange={e=>setRegForm({...regForm, email: e.target.value})} placeholder="Gmail ID" className="w-full bg-black/50 border border-gray-700 p-3 text-white text-xs rounded outline-none focus:border-green-500" required type="email" />
                        <input value={regForm.mobile} onChange={e=>setRegForm({...regForm, mobile: e.target.value})} placeholder="Mobile No." className="w-full bg-black/50 border border-gray-700 p-3 text-white text-xs rounded outline-none focus:border-green-500" required />
                        
                        {authStep === 'GITHUB_REG' && (
                             <input value={regForm.githubId} onChange={e=>setRegForm({...regForm, githubId: e.target.value})} placeholder="GitHub ID" className="w-full bg-black/50 border border-gray-700 p-3 text-white text-xs rounded outline-none focus:border-green-500" required />
                        )}

                        <div className="p-3 bg-gray-900/50 border border-gray-700 rounded text-center">
                            {generatedId ? (
                                <div className="text-green-400 font-code text-sm font-bold">{generatedId}</div>
                            ) : (
                                <button type="button" onClick={() => generateIdentity(authStep === 'GOOGLE_REG' ? 'GOOGLE' : 'GITHUB')} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-xs text-white rounded uppercase font-bold">Generate Identity</button>
                            )}
                        </div>

                        {generatedId && (
                            <>
                                <input type="password" value={regForm.password} onChange={e=>setRegForm({...regForm, password: e.target.value})} placeholder="Set Password" className="w-full bg-black/50 border border-gray-700 p-3 text-white text-xs rounded outline-none focus:border-green-500" required />
                                <PasswordStrengthMeter password={regForm.password} />
                                <input type="password" value={regForm.confirmPassword} onChange={e=>setRegForm({...regForm, confirmPassword: e.target.value})} placeholder="Confirm Password" className="w-full bg-black/50 border border-gray-700 p-3 text-white text-xs rounded outline-none focus:border-green-500" required />
                                
                                <label className="flex items-center gap-2 cursor-pointer mt-2">
                                    <input type="checkbox" checked={regForm.termsAccepted} onChange={e=>setRegForm({...regForm, termsAccepted: e.target.checked})} className="accent-green-500" />
                                    <span className="text-[10px] text-gray-400">I accept the <span className="text-green-400 underline">Terms and Conditions</span> of Neural Link.</span>
                                </label>

                                <button className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold uppercase text-xs rounded tracking-widest shadow-[0_0_15px_#00ff41] transition-all">Initialize Account</button>
                            </>
                        )}
                        <button type="button" onClick={() => setAuthStep('LOGIN')} className="w-full text-center text-[10px] text-gray-500 hover:text-white uppercase mt-4">Cancel Registration</button>
                     </form>
                 )}

                 {authStep === 'CREATE_ID' && (
                    <form onSubmit={finalizeRegistration} className="space-y-4">
                       <div className="p-4 bg-purple-900/20 border border-purple-500/50 rounded text-center shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                          <div className="text-[10px] text-purple-400 uppercase mb-1 font-bold">Generated Identity</div>
                          <div className="text-xl font-code text-white drop-shadow-[0_0_5px_#a855f7]">{isGeneratingId ? 'CALCULATING...' : generatedId}</div>
                       </div>
                       <div className="flex gap-2">
                           <button type="button" onClick={()=>setSelectedRole('Student')} className={`flex-1 py-2 border rounded text-xs uppercase font-bold transition-all ${selectedRole==='Student' ? 'bg-purple-600 border-purple-400 text-white shadow-[0_0_15px_#a855f7]' : 'border-gray-700 text-gray-500 hover:text-white'}`}>Student</button>
                           <button type="button" onClick={()=>setSelectedRole('Teacher')} className={`flex-1 py-2 border rounded text-xs uppercase font-bold transition-all ${selectedRole==='Teacher' ? 'bg-purple-600 border-purple-400 text-white shadow-[0_0_15px_#a855f7]' : 'border-gray-700 text-gray-500 hover:text-white'}`}>Teacher</button>
                       </div>
                       <div>
                           <input type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} className="w-full bg-black/50 border border-gray-700 p-3 text-white text-sm focus:border-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.3)] outline-none rounded font-code" placeholder="Set Secure Password" />
                           <PasswordStrengthMeter password={newPassword} />
                       </div>
                       <label className="flex items-center gap-2 cursor-pointer mt-2">
                            <input type="checkbox" checked={regForm.termsAccepted} onChange={e=>setRegForm({...regForm, termsAccepted: e.target.checked})} className="accent-purple-500" />
                            <span className="text-[10px] text-gray-400">I accept the <span className="text-purple-400 underline">Terms and Conditions</span> of Neural Link.</span>
                       </label>
                       <button disabled={isGeneratingId} className="w-full py-3 bg-purple-600/20 border border-purple-500 text-purple-300 hover:text-white font-bold uppercase hover:bg-purple-600 hover:shadow-[0_0_20px_#a855f7] transition-all text-sm rounded tracking-widest">Confirm Identity</button>
                    </form>
                 )}

                 <div className="mt-6 flex justify-between border-t border-gray-800 pt-4">
                    {authStep === 'LOGIN' ? (
                         <button onClick={()=>{setAuthStep('CREATE_ID'); setIsGeneratingId(true); GeminiService.generateUserId().then(id => { setGeneratedId(id); setIsGeneratingId(false); });}} className="text-[10px] text-gray-500 hover:text-green-400 uppercase transition-colors tracking-wider">Create New ID</button>
                    ) : (
                         <button onClick={()=>setAuthStep('LOGIN')} className="text-[10px] text-gray-500 hover:text-green-400 uppercase transition-colors tracking-wider">Back to Login</button>
                    )}
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  if (view === ViewMode.BOOT) return <BootScreen onComplete={() => setView(ViewMode.IDE)} />;

  return (
    <div className="h-screen w-full bg-[#030303] text-white overflow-hidden flex flex-row relative font-sans selection:bg-green-500 selection:text-black">
       <div className="pointer-events-none fixed inset-0 z-0 opacity-20"><MatrixBackground /></div>
       <Scanlines />
       {user && <NeuralRadio />}

       <aside className="w-20 h-full border-r border-gray-800/50 bg-[#050505]/80 backdrop-blur flex flex-col items-center py-6 gap-6 z-20 shrink-0 shadow-[5px_0_30px_rgba(0,0,0,0.5)]">
          <div className="w-12 h-12 rounded-lg bg-black border border-green-500 shadow-[0_0_15px_#00ff41] p-1 group cursor-pointer hover:scale-110 transition-transform">
             <div className="w-full h-full bg-green-900/20 rounded flex items-center justify-center font-bold text-xl text-green-400">CS</div>
          </div>
          <div className="w-10 h-[1px] bg-gradient-to-r from-transparent via-green-900 to-transparent" />
          {[
            { id: ViewMode.IDE, icon: 'CODE', label: 'IDE', color: 'text-blue-400', glow: GLOW.blue },
            { id: ViewMode.CIRCUIT_FORGE, icon: 'CHIP', label: 'FORGE', color: 'text-blue-400', glow: GLOW.blue },
            { id: ViewMode.WEB_BUILDER, icon: 'VIVE', label: 'VIVE', color: 'text-pink-400', glow: GLOW.pink },
            { id: ViewMode.NET_CHAT, icon: 'NET', label: 'CHAT', color: 'text-green-400', glow: GLOW.green },
            { id: ViewMode.FILES, icon: 'FILE', label: 'FILES', color: 'text-yellow-400', glow: GLOW.yellow },
            { id: ViewMode.SECURITY, icon: 'SEC', label: 'TOOLS', color: 'text-red-400', glow: GLOW.red },
            { id: ViewMode.CLASSROOM, icon: 'EDU', label: 'EDU', color: 'text-orange-400', glow: GLOW.orange },
            { id: ViewMode.ARCADE, icon: 'GAME', label: 'GAMES', color: 'text-purple-400', glow: GLOW.purple },
            { id: ViewMode.NEURAL_HUB, icon: 'AI', label: 'NEURAL', color: 'text-cyan-400', glow: GLOW.blue },
            { id: ViewMode.VM, icon: 'VM', label: 'OS', color: 'text-green-400', glow: GLOW.green },
            { id: ViewMode.SUPPORT, icon: 'HELP', label: 'HELP', color: 'text-gray-400', glow: 'shadow-[0_0_20px_rgba(156,163,175,0.3)] border-gray-500' }
          ].map(item => (
            <button key={item.id} onClick={() => setView(item.id)} className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-300 group ${view === item.id ? `bg-white/5 ${item.glow}` : 'hover:bg-white/5 border border-transparent'}`}>
               <span className={`text-lg font-bold group-hover:scale-110 transition-transform ${view===item.id ? item.color + ' drop-shadow-[0_0_5px_currentColor]' : 'text-gray-600 group-hover:text-gray-300'}`}>{item.icon}</span>
               <span className="text-[8px] font-bold text-gray-500 uppercase tracking-wider group-hover:text-white">{item.label}</span>
            </button>
          ))}
          <div className="mt-auto">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#00ff41]" />
          </div>
       </aside>

       <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10 bg-black/50 backdrop-blur-sm">
          <header className="h-14 border-b border-gray-800/50 bg-[#0a0a0a]/50 flex items-center justify-between px-6 shrink-0 backdrop-blur-md z-20">
             <div className="flex items-center gap-4">
                <span className="font-orbitron text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-[0.2em] uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{view.replace('_', ' ')}</span>
                <div className="px-2 py-0.5 bg-green-900/20 border border-green-500/30 rounded text-[10px] text-green-400 uppercase tracking-wider shadow-[0_0_10px_rgba(0,255,65,0.1)]">v2.1 Neural Uplink</div>
             </div>

             <div className="flex-1 max-w-md mx-6 relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 group-focus-within:text-green-500">🔍</span>
                </div>
                <input 
                    type="text" 
                    value={globalSearch}
                    onChange={(e) => { setGlobalSearch(e.target.value); setIsSearchOpen(true); }}
                    onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                    placeholder="Global Search (Tools, Games, Files)..." 
                    className="w-full bg-black/50 border border-gray-700 text-sm rounded-full py-1.5 pl-10 pr-4 text-white focus:outline-none focus:border-green-500 focus:shadow-[0_0_15px_rgba(0,255,65,0.2)] transition-all font-code"
                />
                {isSearchOpen && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-black/90 border border-green-500/50 rounded-lg shadow-[0_0_30px_rgba(0,255,65,0.15)] overflow-hidden z-50 backdrop-blur-xl">
                        {searchResults.map((item: any) => (
                            <div 
                                key={item.id} 
                                className="px-4 py-3 hover:bg-white/10 cursor-pointer flex justify-between items-center group/item border-b border-white/5 last:border-0"
                                onMouseDown={() => handleSearchResultClick(item)}
                            >
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-gray-200 group-hover/item:text-white">{item.name || item.title}</span>
                                    <span className="text-[10px] text-gray-500">{item.description || item.content?.substring(0,30) || item.category}</span>
                                </div>
                                <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                                    item.resultType === 'TOOL' ? 'bg-red-900/50 text-red-400 border border-red-500/30' :
                                    item.resultType === 'GAME' ? 'bg-purple-900/50 text-purple-400 border border-purple-500/30' :
                                    'bg-yellow-900/50 text-yellow-400 border border-yellow-500/30'
                                }`}>
                                    {item.resultType}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
             </div>

             <div className="flex items-center gap-6">
                 <div className="hidden lg:flex gap-4 text-[9px] font-code text-gray-500 uppercase">
                     <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/> LATENCY: 24ms</div>
                     <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/> ENCRYPTION: AES-256</div>
                 </div>
                <div className="flex flex-col items-end">
                   <span className="text-xs font-bold text-white font-code">{user?.id}</span>
                   <span className="text-[10px] text-green-500 uppercase tracking-wider shadow-green-500">{user?.role}</span>
                </div>
                <div className="w-8 h-8 rounded bg-gray-900 border border-green-500/50 shadow-[0_0_10px_rgba(0,255,65,0.2)] overflow-hidden">
                   <img src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${user?.id}`} alt="Avatar" />
                </div>
             </div>
          </header>

          <main className="flex-1 overflow-hidden relative">
             {view === ViewMode.IDE && <IdeModule addLog={addLog} />}
             {view === ViewMode.WEB_BUILDER && <WebBuilderModule addLog={addLog} />}
             {view === ViewMode.NET_CHAT && <NetChatModule user={user} addLog={addLog} />}
             {view === ViewMode.FILES && <FileManagerModule addLog={addLog} user={user} files={files} setFiles={setFiles} globalTarget={globalTarget} />}
             {view === ViewMode.SECURITY && <SecurityModule addLog={addLog} globalTarget={globalTarget} />}
             {view === ViewMode.ARCADE && <ArcadeModule addLog={addLog} globalTarget={globalTarget} />}
             {view === ViewMode.NEURAL_HUB && <NeuralHubModule addLog={addLog} isLiveConnected={isLiveConnected} toggleLive={toggleLiveSession} analyser={analyserRef.current} />}
             {view === ViewMode.VM && <VmModule addLog={addLog} />}
             {view === ViewMode.CLASSROOM && <ClassroomModule user={user} addLog={addLog} />}
             {view === ViewMode.SUPPORT && <SupportModule addLog={addLog} />}
             {view === ViewMode.CIRCUIT_FORGE && <CircuitForgeModule addLog={addLog} />}
          </main>
       </div>
    </div>
  );
}

export { GeminiService };