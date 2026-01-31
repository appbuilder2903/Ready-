import { SecurityTool, GameMetadata } from './types';
import { ENV } from './env.config';

export const COLORS = {
  bg: '#050505',
  panel: '#0a0a0a',
  neonGreen: '#00ff41',
  neonBlue: '#00f3ff',
  neonPurple: '#bc13fe',
  neonRed: '#ff003c',
  warning: '#ffae00',
  darkGray: '#1a1a1a'
};

export const MODELS = {
  logic: 'gemini-3-pro-preview',
  speed: 'gemini-3-flash-preview',
  lite: 'gemini-flash-lite-latest',
  image: 'gemini-2.5-flash-image', 
  imagePro: 'gemini-3-pro-image-preview',
  video: 'veo-3.1-fast-generate-preview',
  audio: 'gemini-2.5-flash-native-audio-preview-09-2025',
  tts: 'gemini-2.5-flash-preview-tts',
  groundingSearch: 'gemini-3-flash-preview',
  groundingMaps: 'gemini-2.5-flash'
};

// API keys are now securely loaded from environment variables
export const SUPPORT_KEYS = {
  EDEN_AI: ENV.EDEN_AI_KEY,
  OPEN_AI: ENV.OPENAI_KEY,
  OPEN_ROUTER: ENV.OPENROUTER_KEY
};

export const OS_LIST = [
  "Kali Linux 2024.1", 
  "Parrot Security OS 6.0", 
  "BlackArch Linux", 
  "Tails 6.0 (Amnesic)", 
  "Qubes OS 4.2", 
  "Ubuntu 24.04 LTS", 
  "Red Hat Enterprise Linux 9",
  "Alpine Linux 3.19",
  "TempleOS (Simulated)",
  "SerenityOS"
];

export const SUPPORTED_LANGUAGES = ["Python", "JavaScript", "TypeScript", "C++", "Rust", "Go", "Lua", "Swift", "Ruby", "Haskell"];

// Massive list of supported languages for the Universal Neural IDE
export const EXTENSIVE_LANGUAGES = Array.from(new Set([
  "4D", "6502 Assembly", "A-0", "A-Script", "ABAP", "ACEDB", "ACL2", "ADL", "AEPL", "AIML", "AIMMS", 
  "ALGOL", "ALGOL 60", "ALGOL 68", "ALGOL W", "AMOS", "AMOS BASIC", "AMPL", "AMPL Plus", "AMPL Script", 
  "ANOVA Script", "APL", "APL2", "ATS", "ATS2", "AVR Assembly", "Aardappel", "Abaqus Script", 
  "Abbreviated C", "Abc", "Able", "AbsInt", "Acorn BASIC", "ActionScript", "Active Oberon", "Actor", 
  "Ada", "Adabas", "Add these all languages", "AdventScript", "Afnix", "Agda", "Agora", "Aire", "Ajax", 
  "Aladin", "Aldor", "Alef", "Alex", "Algae", "Alma-0", "Alpha", "Alphard", "Amiga E", "Analytica", 
  "AngelScript", "Anubis", "AnyScript", "Apex", "AplX", "App Inventor Blocks", "Arbb", "Arc", "Argdown", 
  "Argus", "Arisia", "ArnoldC", "AspectJ", "Assembly", "Asymptote", "Aurelius", "AutoHotkey", "AutoIt", 
  "AutoLISP", "Averest", "Awk", "Axiom", "Axon", "Axum", "B", "BBC BASIC", "BC", "BCPL", "BETA", 
  "BLISS", "Babbage", "Babel", "Ballerina", "Ballerina Cloud", "Ballerina Script", "Balsa", "Bash", 
  "Basic", "Batchfile", "BayesX", "Bc", "Beef", "Befunge", "BennuGD", "Bertrand", "Bhailang", "Bigloo", 
  "Binary Lambda Calculus", "BiwaScheme", "Black", "Bliss", "Bliss++", "BlitzMax", "Blockly", "Blue", 
  "BlueJ", "Blueprints (Unreal)", "Boo", "BooScript", "Bosque", "BosqueScript", "Bourne Shell", 
  "Brainfuck", "BrighterScript", "Bro", "BTrace", "Bucklescript", "BuildXL", "Bython", "C", "C--", 
  "C#", "C++", "C/AL", "C-shell", "CASL", "CDuce", "CEEMAC", "CLIPS", "CLIST", "CLU", "CMS-2", 
  "CMUCL", "COBOL", "COBOLScript", "COMAL", "CPL", "CSP", "CUDA", "Caché ObjectScript", "Cadabra", 
  "Cadence (Flow)", "Caffe", "Cairo", "Cal", "Calypso", "Caml", "Caml Light", "Candle", 
  "Cap’n Proto Schema", "Carbon", "CarbonLang", "Cat", "Catrobat", "Cayenne", "Ceylon", "Cg", 
  "Cg Shader", "Chapel", "ChapelScript", "Charm++", "Chef", "Chicken", "ChucK Script", "Chuck", 
  "Cilk", "Circus", "Clarion", "Clarity (Stacks)", "Clean", "Clipper", "Clojure", "ClojureScript", 
  "Clonk", "Closure Templates", "CodeQL", "CoffeeScript", "ColdBox", "ColdFusion", 
  "Command Prompt Script", "Component Pascal", "Converge", "Coq", "Coral", "Corn", "Cow", "Crom", 
  "Crystal", "Csound", "Cucumber", "Curl", "Curl Script", "Curry", "Cybil", "Cyclone", "Cygnus", 
  "Cypher", "Cython", "D", "D2", "DALE", "DASL", "DBase", "DCL", "DCPU-16 ASM", "DRAKON", "DTrace", 
  "Dafny", "Darcs Script", "Dart", "DataFlex", "DataWeave", "Datalog", "Delphi", "Deluge", "Dhall", 
  "DIBOL", "DIBOL Script", "Diesel", "Dingo", "DinkC", "DrRacket", "Dream Maker", "DuckScript", 
  "Dylan", "E", "E++", "EBNF", "ECL", "ECLiPSe", "ECMAScript 1", "ECMAScript 2", "ECMAScript 3", 
  "ECMAScript 4", "ECMAScript 5", "ECMAScript 6", "ECMAScript 7", "ECMAScript 8", "ECMAScript 9", 
  "ECMAScript 10", "EGL", "ELAN", "Ease", "EasyLanguage", "EazyText", "EcmaScript", "Edh", "Eiffel", 
  "Elastic Query DSL", "Elastos", "Elixir", "Elm", "Elmish", "Emacs Lisp", "Embedded C", "EmberScript", 
  "EmberScriptX", "Emerge", "Epigram", "Epsilon", "Equinox", "Erlang", "Erlang Script", "Ermine", 
  "Escapade", "Escher", "Espresso", "Espruino", "Esterel", "Etoys", "Euler", "Euphoria", 
  "Euphoria Script", "Euphoria++", "Event-B", "Ezhil", "Ezhil++", "F#", "F*", "FAUST", "FBSL", 
  "FCL", "FISH", "FISH Script", "FOCUS", "Factor", "FactorScript", "Falcon", "Fancy", "Fantom", 
  "Fargo", "Felix", "Fennel", "Ferite", "FlatBuffers Schema", "Flex", "Flix", "Flow", "Fluent", 
  "Focal", "Formality", "Forth", "ForthScript", "Fortran", "FoxPro", "FPrime", "Franca IDL", 
  "FreeBASIC", "Frege", "FScript", "Funnel", "Futhark", "Fuzion", "GAMS", "GAP", "GCC RTL", 
  "GDScript", "GDS", "GLBasic", "GLSL", "GML", "GRAIL", "Gambas", "Game Maker Language", 
  "Game Maker Language (GML)", "GameMonkey Script", "Gel", "Genie", "Gentee", "Gherkin", 
  "Gherkin++", "Ginger", "Gleam", "Glyph", "Gnuplot Script", "Go", "Godot Visual Script", 
  "Golang ASM", "Golo", "GoloScript", "Goo", "Google Apps Script", "Gordon", "Gosu", "GraphQL++", 
  "Gripe", "Groovy", "Groovy++", "Gura", "HCL", "HLSL", "HLSL++", "HOL", "HTML", "Hack", 
  "Hack Assembly", "Halide", "Haml", "Harbour", "Hare", "Haskell", "Haxe", "Helium", "Heptagon", 
  "Heron", "Hex", "High Level Assembly", "HolyC", "Hoon", "Hop", "Hope", "HScript", 
  "Hugo Templating", "Hy", "Hydra", "HyperTalk", "IBM JCL", "IDL", "IGOR Pro", "IL", "IML", "IPL", 
  "ISAM Script", "ISL", "ISLISP", "ISPC", "ISPF REXX", "Icon", "IconScript", "Idris", "Inform", 
  "Inform 6", "Inform 7", "InkScript", "Ink! (Polkadot)", "INTERCAL", "Io", "IoLang", 
  "IoLang Script", "IoScript", "Ioke", "IoT Script", "Isabelle", "J", "J#", "J++", "JAL", 
  "JASmin", "JCL Script", "JOVIAL", "JOVIAL Script", "JSON", "Jabaco", "Jade", "Jai", "Jakt", 
  "Janet", "Janino", "Janus", "Jasmin Script", "Java", "JavaFX Script", "JavaScript", "Jess", 
  "Jinja", "Jolie", "Jolie Script", "Joule", "Joy", "JoyScript", "JScript", "Julia", 
  "Jupyter Notebook", "Juttle", "K", "K3", "KEE", "KIF", "KRC", "KRL", "Kaitai Struct", "Karel", 
  "Karel++", "Kit", "Kixtart", "Koka", "Kojo", "Korn Shell", "Korn Shell Script", "KornShell (ksh)", 
  "Kotlin", "KUKA Robot Language", "Kusto Query Language", "L42", "LOLCODE", "LPC", "Lace", 
  "Ladder Logic", "LabTalk", "LabVIEW", "LabVIEW Script", "Larch", "Lasso", "Latte", "Lean", 
  "Leda", "Less", "LilyPond", "Limbo", "Lingo", "Lingo++", "LingoScript", "Linx", "Liquid", 
  "LiquidScript", "Lisaac", "Lisp", "Lite-C", "Little b", "LiveCode", "LiveScript", 
  "LiveScript++", "Locomotive BASIC", "LogiQL", "Loglan", "Logo", "Logos", "Logtalk", "Look", 
  "LoomScript", "LotusScript", "Lout", "Lua", "Lucid", "Lush", "Lustre", "M", "M4", "MAD", 
  "MAD/I", "MATH-MATIC", "MATLAB", "MDL", "MHEG Script", "MHEG-5", "MIIS", "MIXAL", "ML", "MLIR", 
  "MOO", "MQL4", "MQL5", "MS DOS Batch", "MS-DOS Batch", "MSL", "MUMPS", "Magic", "Magik", 
  "Magik Script", "Magma", "Malbolge", "Malina", "MapBasic", "Maple", "Markdown", "Mathematica", 
  "Maude", "Max/MSP", "MaxScript", "Medley", "Mercury", "Mercury Script", "Mercury++", "Mesa", 
  "Meson", "MetaOCaml", "Metafont", "Metal", "Metal Shader Language", "MicroPython", "Milk", 
  "MiniKanren", "MiniScript", "MiniZinc", "Mira", "Mirah", "Miranda", "MirageOS", "Mizar", 
  "Mobius", "Modelica", "Modula", "Modula Script", "Modula-2", "Modula-2+", "Modula-3", "Mojo", 
  "Monkey", "Monkey C", "Monkey X", "Moocode", "MoonScript", "Moonscript", "Mosel", 
  "Motoko (DFINITY)", "Move (Aptos)", "Move IR", "MuPAD", "MyHDL", "Myghty", "Myrddin", "NAT", 
  "NATURAL", "NQC", "NSIS", "NXT-G", "Nadeshiko", "Nano", "Neko", "NekoScript", "Nemerle", 
  "Nemerle++", "Neo4j Cypher", "NesC", "NetLogo", "NewLisp", "Newspeak", "Nginx", "Nial", 
  "Nial++", "NialScript", "Nickel", "Nikto", "Nim", "NimScript", "Nimrod", "Nit", "Nix", 
  "Not eXactly C (NXC)", "NPL", "Nu", "Nuva", "Nyquist", "OASYS", "OBSCRIPT", "OCaml", "OPS5", 
  "Object Pascal", "Object Rexx", "Objective-C", "Objective-J", "Obliq", "Occam", "Occam-pi", 
  "Octave", "Octave Script", "Odin", "Omega", "OmniMark", "Onyx", "Ooc", "Ook!", "Opa", "Opal", 
  "OpenACC", "OpenCL", "OpenCL C++", "OpenEdge ABL", "OpenEdge Script", "OpenFL Script", 
  "OpenGL Shading Language (GLSL)", "OpenHAB Rules", "OpenMP", "OpenMusic", "OpenQASM", 
  "OpenROAD", "OpenSCAD", "OpenVX", "Opus", "Oracle Forms", "Orc", "Oriel", "Orwell", "Ox", 
  "Oxygene", "Oz", "Oz++", "P4", "PCASTL", "PCF", "PDDL", "PEARL", "PEIRCE", "PEP8 DSL", "PHL", 
  "PHP", "PIC Assembly", "PL/I", "PL/M", "PL/P", "PL/SQL", "PL/pgSQL", "POPLOG", "POP-11", 
  "Pact", "Painless", "Pan", "ParaSail", "Pari/GP", "Parlog", "Parrot", "Pascal", "Pascal Script", 
  "PascalABC", "Pawn", "Perl", "Perl 6", "Pharo", "Pico", "PicoLisp", "Pict", "PictScript", 
  "Piet", "PietScript", "Pike", "Pike VM Script", "PikeScript", "Pilot", "Pliant", "Pliant++", 
  "PogoScript", "Pony", "Portugol", "PostgreSQL Procedural", "PostScript", "PostScript++", 
  "Power FX", "Power Query M", "PowerBuilder", "PowerPC Assembly", "PowerShell", "Prisma", 
  "Processing", "Processing++", "Prograph", "Progress", "Prolog", "Prolog II", "PromQL", 
  "Promela", "Propeller Spin", "Pseudocode", "Puppet", "Pure", "Pure Data", "PureBasic", 
  "PureData Script", "PureScript", "Pyret", "Python", "Python 2", "Python 3", "Q", "Q#", 
  "Q# Script", "QBasic", "QL", "QML", "QML++", "QPL", "Qi", "Qalb", "QlikView", "QuakeC", 
  "Quantum", "Query", "QuickBASIC", "R", "R++", "RAML", "RAPID", "REBOL", "REBOL Script", 
  "REFAL Script", "REXX", "ROOP", "RPG", "RPG Maker Script", "RPL", "RQ", "RSL", "RSL Script", 
  "RSL+", "RUNE", "Racket", "Ragel", "Raku", "Rapira", "RapiraScript", "Rascal", "Ratchet", 
  "Ratfor", "Raven", "Razor", "Real-Time Assembler", "RealBasic", "ReasonML", "Red", 
  "Red/System", "Redcode", "Redex", "Refal", "RenderScript", "Rexx", "Rexx Script", "Rhope", 
  "Ring", "Ring++", "Riot", "Rlab", "RobotFramework", "Rockstar", "Rouge", "Ruby", 
  "RubyMotion", "Rust", "S-Lang", "S3", "S3K", "S3L", "SALSA", "SAMOS", "SAPscript", "SAS", 
  "SASL", "SBL", "SCADE", "SCHEME48", "SCILAB", "SCSS Script", "SETL", "SETL2", "SHIFT", 
  "SISAL", "SITBOL", "SL5", "SLIP", "SLIPScript", "SMALL", "SMEQL", "SMK", "SMT-LIB", 
  "SNAP!", "SNOBOL", "SNUSP", "SP/k", "SP/k Script", "SPADE", "SPARK", "SPARK/Ada", 
  "SPARQL", "SPARQL++", "SPL/3000", "SPSS", "SPSS Syntax", "SPWN", "SQL", "SQL++", "SR", 
  "Sacred", "Sail", "SailScript", "Salome", "Sass", "Sather", "Sather++", "Scala", "Scaml", 
  "Scenic", "Scheme", "Scilab", "Scilab Script", "Scratch", "Scratch++", "Sed", "Seed7", 
  "SeedScript", "Self", "Self++", "Semgrep Rule Language", "ShaderLab", "Shakespeare", 
  "Sheerpower 4GL", "Shell", "Shen", "Sieve", "Silver", "SimTalk", "Simula", "Simula67", 
  "Simulink", "Sinatra", "Sisal++", "Skew", "Skylark", "Slash", "Slim", "SmallBASIC", 
  "SmallScript", "Smalltalk", "Smarty", "Snap++", "Snowball", "Sol", "Solidity", "Sonic Pi", 
  "SourcePawn", "Spin", "Spin++", "SproutCore", "Squeak", "Squirrel", "Stan", "Stan++", 
  "Standard ML", "StarLogo", "Stata", "Stata Script", "Stateflow", "Steel", "Stitch", 
  "StoneScript", "Stonex", "Stylus", "Subtext", "SuperBASIC", "SuperCollider", 
  "SuperCollider Script", "SuperSQL", "Swift", "SwiftScript", "SwiftUI DSL", "Synapse", 
  "Synergy/DE", "SystemVerilog", "TACL", "TACL Script", "TADS", "TADS 3", "TASM", "TECO Macro", 
  "TEX", "TITAN", "TLA+", "TMG", "TOM", "TOM Script", "TPU", "TSQL", "TTM", "TXL", 
  "TXL Script", "Tarantool Lua", "Tcl", "Tcl Script", "Tcl++", "Tcl/Tk", "Tea", "Teco", "Tera", 
  "Terra", "Text", "Thrift", "Thrift IDL", "Tie", "Tilt", "Titanium", "Toit", "Trac", 
  "Transact-SQL", "Turbo C", "Turbo Pascal", "TurboScript", "Turing", "Turing++", "TurtleScript", 
  "TypeDB Query", "TypeScript", "TypeScript++", "UCSD Pascal", "Ubercode", "Udon", "Umka", 
  "Umple", "Unicon", "Unicon Script", "Uniface", "Uno", "Unreal Kismet", "Unreal Verse", 
  "UnrealScript", "UrWeb", "Urbi", "V", "V++", "VB.NET", "VB.NET Script", "VB6", "VBScript", 
  "VCL", "VHDL", "VHDL-A", "VHDL-AMS", "VSScript", "VSXu", "Vala", "Vala Script", "Verilog", 
  "Verilog-A", "Vertex Shader Language", "Verus", "Vim Script", "VimL", "Viper", 
  "Viper (crypto)", "ViperScript", "Visual Basic", "Visual Basic .NET", "Visual DialogScript", 
  "Visual FoxPro", "Visual LISP", "Visual Prolog", "Volt", "Vue", "Vyper++", "WASP", "WATFIV", 
  "WATFOR", "WLambda", "WMLScript", "WebAssembly", "WebAssembly (Wasm)", "WebAssembly Text", 
  "WebDNA", "WebQL", "Whitespace", "Wolfram", "Wolfram Language", "Wolfram Mathematica", 
  "Wren", "Wren++", "X# (XSharp)", "X++", "X10", "X16 BASIC", "XBL", "XC", "XCore", "XL", 
  "XLang", "XMI", "XML", "XOTcl", "XOTcl Script", "XPL", "XPL0", "XProc", "XQuery", "XScript", 
  "XSLT", "XBase++", "Xojo", "XojoScript", "XojoScript Advanced", "Xtend", "Xtend++", "YAML", 
  "YARA++", "YQL", "Yacc", "Yara", "Yeti", "Yorick", "Yorick Script", "Z++", "Z80 Assembly", 
  "ZPL", "ZPL Script", "ZPL2", "ZShell", "Zeno", "Zeno Script", "Zephir", "ZetaLisp", "Zig", 
  "ZigLang Script", "ZigZag", "Zimbu", "Zimpl", "Zorba", "Zsh Script", "Zsh++", "dc", "xHarbour", 
  "xLisp"
])).sort();

export const LANGUAGE_SNIPPETS: Record<string, string> = {
  "Python": "import os\nimport sys\n\ndef neural_handshake():\n    print('Initializing Codesphere Uplink...')\n    return True\n\nif __name__ == '__main__':\n    status = neural_handshake()\n    print(f'System Status: {status}')",
  "JavaScript": "const system = require('neural-core');\n\nasync function init() {\n    console.log('Connecting to Grid...');\n    await system.sleep(100);\n    console.log('Online.');\n}\n\ninit();",
  "TypeScript": "import { NeuralNet } from '@codesphere/core';\n\ninterface Node {\n    id: string;\n    active: boolean;\n}\n\nconst node: Node = { id: 'ALPHA-1', active: true };\nconsole.log(`Node ${node.id} is ready.`);",
  "C++": "#include <iostream>\n#include <vector>\n\nint main() {\n    std::cout << \"Kernel v9.0.1 Loaded\" << std::endl;\n    std::vector<int> buffer(1024);\n    return 0;\n}",
  "Rust": "fn main() {\n    println!(\"Safety checks passed. Memory safe.\");\n    let mut uplink = true;\n}",
  "Go": "package main\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"Go Routines active: 500\")\n}",
  "Lua": "print(\"Scripting engine active\")",
  "Swift": "print(\"iOS Bridge Active\")",
  "Ruby": "puts 'Gemfile loaded.'",
  "Haskell": "main = putStrLn \"Functional purity achieved.\""
};

// Comprehensive component list matching Tinkercad's breadth
export const CIRCUIT_COMPONENTS = {
  "Basic": [
    "Resistor", "LED", "Pushbutton", "Potentiometer", "Slide Switch", "Capacitor", 
    "Photoresistor", "Diode", "Inductor", "Piezo"
  ],
  "Microcontrollers": [
    "Arduino Uno R3", "Arduino Micro", "ATtiny", "Micro:bit"
  ],
  "Input": [
    "Ultrasonic Distance Sensor", "PIR Sensor", "Temperature Sensor [TMP36]", "Gas Sensor", 
    "Keypad 4x4", "DIP Switch 4", "Tilt Sensor", "Force Sensor [FSR]", "Flex Sensor", "IR Receiver"
  ],
  "Output": [
    "DC Motor", "Servo Micro", "Vibration Motor", "Hobby Gearmotor", 
    "NeoPixel Ring 12", "NeoPixel Strip", "7-Segment Display", "LCD 16x2 (I2C)", 
    "OLED 128x64", "Relay SPDT", "Bulb", "RGB LED"
  ],
  "Power": [
    "9V Battery", "1.5V Battery (AA)", "Coin Cell 3V", "Solar Panel", "Potato Battery", 
    "Lemon Battery", "Power Supply"
  ],
  "Breadboards": [
    "Breadboard Small", "Breadboard Mini", "Breadboard Large"
  ],
  "Instruments": [
    "Multimeter", "Function Generator", "Oscilloscope", "Logic Analyzer"
  ],
  "Integrated Circuits": [
    "555 Timer", "OpAmp 741", "Shift Register 74HC595", "Motor Driver L293D", 
    "Optocoupler 4N35", "Quad NAND 74HC00", "Quad AND 74HC08", "Quad OR 74HC32", "Inverter 74HC04"
  ]
};

/* 
   ========================================================================
   MASTER DATABASE GENERATION
   ========================================================================
*/

const TOOL_CATEGORIES = [
  "Information Gathering", "Vulnerability Analysis", "Web Application Analysis", 
  "Database Assessment", "Password Attacks", "Wireless Attacks", 
  "Reverse Engineering", "Exploitation Tools", "Sniffing & Spoofing", 
  "Post Exploitation", "Forensics", "Reporting Tools", "Social Engineering",
  "Hardware Hacking", "Automotive Hacking", "Bluetooth Attacks",
  "Mobile Forensics", "Malware Analysis", "Cryptography", "Cloud Security"
];

// The "Hero" list - Real famous tools
const HERO_TOOLS: SecurityTool[] = [
  { id: 't1', name: 'Nmap', category: 'Information Gathering', version: '7.94', complexity: 'Medium', description: 'Network exploration tool and security / port scanner.', cli_usage: 'nmap -v -A -sV <target>' },
  { id: 't2', name: 'Metasploit Framework', category: 'Exploitation Tools', version: '6.3.5', complexity: 'High', description: 'Advanced platform for developing, testing, and executing exploits.', cli_usage: 'msfconsole' },
  { id: 't3', name: 'Wireshark', category: 'Sniffing & Spoofing', version: '4.2.0', complexity: 'Medium', description: 'The world\'s foremost network protocol analyzer.', cli_usage: 'wireshark -i <interface>' },
  { id: 't4', name: 'Burp Suite Pro', category: 'Web Application Analysis', version: '2024.1', complexity: 'High', description: 'Integrated platform for performing security testing of web applications.', cli_usage: 'java -jar burpsuite.jar' },
  { id: 't5', name: 'Aircrack-ng', category: 'Wireless Attacks', version: '1.7', complexity: 'High', description: 'Complete suite to assess WiFi network security.', cli_usage: 'aircrack-ng <capture_file>' },
  { id: 't6', name: 'John the Ripper', category: 'Password Attacks', version: '1.9.0', complexity: 'Medium', description: 'Fast password cracker.', cli_usage: 'john --wordlist=<list> <hashfile>' },
  { id: 't7', name: 'Hydra', category: 'Password Attacks', version: '9.5', complexity: 'Medium', description: 'Parallelized login cracker which supports numerous protocols.', cli_usage: 'hydra -l user -P passlist.txt ftp://<target>' },
  { id: 't8', name: 'SQLMap', category: 'Database Assessment', version: '1.7.2', complexity: 'Medium', description: 'Automatic SQL injection and database takeover tool.', cli_usage: 'sqlmap -u <url> --dbs' },
  { id: 't9', name: 'Nikto', category: 'Vulnerability Analysis', version: '2.5.0', complexity: 'Low', description: 'Web server scanner which performs comprehensive tests.', cli_usage: 'nikto -h <host>' },
  { id: 't10', name: 'Maltego', category: 'Information Gathering', version: '4.6.0', complexity: 'High', description: 'Open source intelligence and forensics application.', cli_usage: 'maltego' },
  { id: 't11', name: 'Ghidra', category: 'Reverse Engineering', version: '11.0', complexity: 'Extreme', description: 'Software reverse engineering (SRE) suite of tools.', cli_usage: './ghidraRun' },
  { id: 't12', name: 'Autopsy', category: 'Forensics', version: '4.21.0', complexity: 'Medium', description: 'Digital forensics platform and graphical interface to The Sleuth Kit.', cli_usage: 'autopsy' },
  { id: 't13', name: 'Social Engineer Toolkit', category: 'Social Engineering', version: '8.0.3', complexity: 'Medium', description: 'Open-source penetration testing framework designed for social engineering.', cli_usage: 'setoolkit' },
  { id: 't14', name: 'Recon-ng', category: 'Information Gathering', version: '5.1.2', complexity: 'Medium', description: 'Full-featured Web Reconnaissance framework.', cli_usage: 'recon-ng' },
  { id: 't15', name: 'Hashcat', category: 'Password Attacks', version: '6.2.6', complexity: 'High', description: 'World\'s fastest password recovery utility.', cli_usage: 'hashcat -m 0 -a 0 <hash> <wordlist>' },
  { id: 't16', name: 'Responder', category: 'Sniffing & Spoofing', version: '3.1.4', complexity: 'Medium', description: 'LLMNR, NBT-NS and MDNS poisoner.', cli_usage: 'responder -I eth0' },
  { id: 't17', name: 'Bettercap', category: 'Sniffing & Spoofing', version: '2.32', complexity: 'High', description: 'The Swiss Army knife for 802.11, BLE, IPv4 and IPv6 networks.', cli_usage: 'bettercap' },
  { id: 't18', name: 'Wifite2', category: 'Wireless Attacks', version: '2.7.0', complexity: 'Low', description: 'Automated wireless attack tool.', cli_usage: 'wifite' },
  { id: 't19', name: 'Commix', category: 'Web Application Analysis', version: '3.9', complexity: 'Medium', description: 'Automated all-in-one OS command injection and exploitation tool.', cli_usage: 'commix --url="http://target.com?id=1"' },
  { id: 't20', name: 'BeEF', category: 'Exploitation Tools', version: '0.5.4', complexity: 'High', description: 'The Browser Exploitation Framework.', cli_usage: 'beef-xss' },
  { id: 't21', name: 'Skipfish', category: 'Web Application Analysis', version: '2.10', complexity: 'Medium', description: 'Active web application security reconnaissance tool.', cli_usage: 'skipfish -o output_dir http://target' },
  { id: 't22', name: 'Yara', category: 'Malware Analysis', version: '4.5.0', complexity: 'Medium', description: 'Tool aimed at (but not limited to) helping malware researchers to identify and classify malware samples.', cli_usage: 'yara rules.yar target_file' },
  { id: 't23', name: 'Volatility', category: 'Forensics', version: '3.0.0', complexity: 'High', description: 'Advanced memory forensics framework.', cli_usage: 'vol -f dump.mem windows.info' },
  { id: 't24', name: 'Binwalk', category: 'Forensics', version: '2.3.4', complexity: 'Medium', description: 'Firmware analysis tool.', cli_usage: 'binwalk -e firmware.bin' },
  { id: 't25', name: 'Kismet', category: 'Wireless Attacks', version: '2023-07', complexity: 'Medium', description: 'Wireless network detector, sniffer, and intrusion detection system.', cli_usage: 'kismet' }
];

// Procedural prefixes/suffixes for generating tools
const TOOL_PREFIXES = ["Net", "Cyber", "Dark", "Ghost", "Void", "Quantum", "Hyper", "Nano", "Giga", "Omni", "Shadow", "Iron", "Red", "Blue", "Black", "White", "Deep", "Flux", "Core", "Sys"];
const TOOL_ROOTS = ["Scan", "Crack", "Breach", "Wall", "Trace", "Map", "Shark", "Sploit", "Guard", "View", "Scope", "Box", "Shell", "Script", "Kit", "Flow", "Dump", "Sniff", "Hack", "Check"];
const TOOL_SUFFIXES = ["Pro", "Lite", "X", "NG", "v2", "Suite", "Framework", "Engine", "Daemon", "Wizard", "Zero", "One", "Analyzer", "Inspector", "Doctor", "Master"];

// Generator Function
export const GET_FULL_SECURITY_DATABASE = (): SecurityTool[] => {
  const tools = [...HERO_TOOLS];
  const totalTarget = 941;
  let count = tools.length;

  // Deterministic seed simulation using index
  for (let i = 0; i < totalTarget - HERO_TOOLS.length; i++) {
    const p = TOOL_PREFIXES[i % TOOL_PREFIXES.length];
    const r = TOOL_ROOTS[(i * 3) % TOOL_ROOTS.length];
    const s = TOOL_SUFFIXES[(i * 7) % TOOL_SUFFIXES.length];
    const cat = TOOL_CATEGORIES[i % TOOL_CATEGORIES.length];
    
    tools.push({
      id: `gen_t_${i}`,
      name: `${p}${r} ${s}`,
      category: cat,
      version: `${(i % 10) + 1}.${i % 9}.${i % 5}`,
      complexity: i % 10 === 0 ? 'Extreme' : i % 5 === 0 ? 'High' : 'Medium',
      description: `Advanced ${cat.toLowerCase()} utility for specific vector analysis. Auto-generated signature #${1000+i}.`,
      cli_usage: `${p.toLowerCase()}${r.toLowerCase()} --target <ip>`,
      is_procedural: true
    });
  }
  return tools;
};

const GAME_GENRES = ["Cyberpunk RPG", "Hacking Simulation", "Coding Puzzle", "Strategy", "Text Adventure", "Retro Arcade", "Neural Horror"];
const GAME_TITLES_A = ["Neon", "Silicon", "Binary", "Digital", "Virtual", "Neural", "Cyber", "Techno", "Data", "Glitch", "System", "Circuit", "Quantum", "Void", "Echo"];
const GAME_TITLES_B = ["Drifter", "Samurai", "Runner", "Hacker", "Architect", "Wasteland", "City", "Protocol", "Uprising", "Crisis", "Dreams", "Nightmare", "Warfare", "Link", "Soul"];

export const GET_FULL_GAME_DATABASE = (): GameMetadata[] => {
  const games: GameMetadata[] = [
    { id: 'g1', title: 'Cyberpunk 2077: Netrunner Ed.', genre: 'Cyberpunk RPG', rating: 4.8, players: '1.2M', description: 'The classic RPG, re-engineered for browser neural link.' },
    { id: 'g2', title: 'Watch Dogs: Legion Sim', genre: 'Hacking Simulation', rating: 4.5, players: '850K', description: 'Control the city infrastructure.' },
    { id: 'g3', title: 'System Shock 3', genre: 'Neural Horror', rating: 4.9, players: '200K', description: 'SHODAN is back.' },
    { id: 'g4', title: 'Uplink 2', genre: 'Hacking Simulation', rating: 4.7, players: '500K', description: 'High stakes hacking simulation.' },
    { id: 'g5', title: 'Hacknet Complete', genre: 'Hacking Simulation', rating: 4.8, players: '600K', description: 'Terminal-based hacking game.' },
    { id: 'g6', title: 'Deus Ex: Neural', genre: 'Cyberpunk RPG', rating: 4.9, players: '1M', description: 'You asked for this.' },
    { id: 'g7', title: 'TIS-100', genre: 'Coding Puzzle', rating: 4.6, players: '50K', description: 'The assembly language puzzle game.' },
    { id: 'g8', title: 'Shenzhen I/O', genre: 'Coding Puzzle', rating: 4.7, players: '60K', description: 'Build circuits. Write code.' },
    { id: 'g9', title: 'Quadrilateral Cowboy', genre: 'Hacking Simulation', rating: 4.4, players: '40K', description: '20th century cybercrime.' },
    { id: 'g10', title: 'Bitburner', genre: 'Strategy', rating: 4.5, players: '100K', description: 'Write JavaScript to automate the game.' }
  ];

  for (let i = 0; i < 490; i++) {
    const a = GAME_TITLES_A[i % GAME_TITLES_A.length];
    const b = GAME_TITLES_B[(i * 13) % GAME_TITLES_B.length];
    const year = 2050 + (i % 50);
    games.push({
      id: `gen_g_${i}`,
      title: `${a} ${b} ${year}`,
      genre: GAME_GENRES[i % GAME_GENRES.length],
      rating: 3.0 + (i % 20) / 10,
      players: `${(i * 123) % 900}K`,
      description: `Procedurally generated ${GAME_GENRES[i % GAME_GENRES.length].toLowerCase()} experience.`,
      is_procedural: true
    });
  }
  return games;
};