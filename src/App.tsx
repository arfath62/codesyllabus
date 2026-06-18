import React, { useState, useEffect } from "react";
import { 
  Terminal, 
  Cpu, 
  Layout, 
  Database, 
  ShieldAlert, 
  Boxes, 
  Grid, 
  Network, 
  Smartphone, 
  Award, 
  Trophy, 
  PlayCircle, 
  Undo2, 
  Wrench, 
  Lightbulb, 
  Zap, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  BookOpen, 
  AlertTriangle,
  Flame,
  Star,
  Coins,
  User,
  LogIn,
  LogOut,
  Share2,
  Key,
  Lock,
  FolderUp,
  Download,
  Mail,
  FileText,
  Code,
  HelpCircle,
  Compass,
  Users
} from "lucide-react";
import { CURRICULUM } from "./data/curriculum";
import { UserStats, GradingReport, City, Floor } from "./types";
import { SkylineMap } from "./components/SkylineMap";
import { AiCoach } from "./components/AiCoach";
import founderImage from "./assets/images/founder.png";
import { apiFetch } from "./lib/api";

export default function App() {
  const [activeTab, setActiveTab ] = useState<"landing" | "workspace" | "about">("landing");
  const [activeCityId, setActiveCityId ] = useState<string>("python");
  const [activeFloorIndex, setActiveFloorIndex ] = useState<number>(0);
  const [editorValue, setEditorValue ] = useState<string>("");
  const [analogyMode, setAnalogyMode ] = useState<boolean>(true);
  const [isLoadingGrade, setIsLoadingGrade ] = useState<boolean>(false);
  const [gradeLogs, setGradeLogs ] = useState<string>("Standing by for validation loops...");
  const [gradeReport, setGradeReport ] = useState<GradingReport | null>(null);
  const [showSuccessModal, setShowSuccessModal ] = useState<boolean>(false);
  const [editorOutputTab, setEditorOutputTab ] = useState<"stdout" | "preview">("stdout");

  // User persistent state
  const [userStats, setUserStats ] = useState<UserStats>({
    level: 1,
    xp: 0,
    maxXp: 150,
    gold: 150,
    completedFloors: {
      python: 0,
      javascript: 0,
      html: 0,
      sql: 0,
      rust: 0,
      go: 0,
      c: 0,
      csharp: 0,
      kotlin: 0,
      bash: 0
    }
  });

  // Authentication State
  const [currentUser, setCurrentUser] = useState<{ username: string; email: string } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [emailInput, setEmailInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");

  // Progress Export / Import token state
  const [importToken, setImportToken] = useState<string>("");
  const [exportToken, setExportToken] = useState<string>("");
  const [showExportSuccess, setShowExportSuccess] = useState<boolean>(false);
  const [showImportSuccess, setShowImportSuccess] = useState<boolean>(false);
  const [importError, setImportError] = useState<string>("");

  // Restore state on mount
  useEffect(() => {
    (async () => {
      try {
        const { user } = await apiFetch<{ user: { username: string; email: string; stats: UserStats } }>("/api/auth/me");
        setCurrentUser({ username: user.username, email: user.email });
        if (user.stats?.completedFloors) {
          setUserStats(user.stats);
        }
        return;
      } catch {
        // Guest mode — load local progress only
      }

      const cached = localStorage.getItem("codecity_universe_stats_v3");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed.completedFloors) {
            setUserStats(parsed);
          }
        } catch (err) {
          console.warn("Could not parse cached stats", err);
        }
      }
    })();
  }, []);

  // Sync state to server (logged in) or local guest cache
  const syncStats = async (updated: UserStats) => {
    setUserStats(updated);

    if (currentUser) {
      try {
        await apiFetch("/api/auth/stats", {
          method: "PUT",
          body: JSON.stringify({ stats: updated }),
        });
      } catch (e) {
        console.error("Failed to sync account profile stats", e);
      }
    } else {
      localStorage.setItem("codecity_universe_stats_v3", JSON.stringify(updated));
    }
  };

  // Auth Operations
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccessMsg("");

    const name = usernameInput.trim();
    const email = emailInput.trim();
    const pass = passwordInput;

    if (!name || !pass || (authMode === "signup" && !email)) {
      setAuthError("All fields are strictly required.");
      return;
    }

    if (authMode === "signup" && pass.length < 8) {
      setAuthError("Password must be at least 8 characters.");
      return;
    }

    try {
      const endpoint = authMode === "signup" ? "/api/auth/register" : "/api/auth/login";
      const body =
        authMode === "signup"
          ? { username: name, email, password: pass, stats: userStats }
          : { username: name, password: pass };

      const { user } = await apiFetch<{
        user: { username: string; email: string; stats: UserStats };
      }>(endpoint, { method: "POST", body: JSON.stringify(body) });

      setCurrentUser({ username: user.username, email: user.email });
      if (user.stats) {
        setUserStats(user.stats);
      }
      localStorage.removeItem("codesyllabus_registered_accounts");
      localStorage.removeItem("codesyllabus_session");
      setAuthSuccessMsg(
        authMode === "signup"
          ? "Account registered successfully! Progress synced to server."
          : `Welcome back, ${user.username}! Loaded progress.`
      );
      setPasswordInput("");
      setTimeout(() => {
        setShowAuthModal(false);
        setAuthSuccessMsg("");
      }, 1500);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Authentication failed.");
    }
  };

  const handleSignOut = async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Continue local sign-out even if request fails
    }
    setCurrentUser(null);
    setGradeLogs("🔒 Signed out. Guest mode active — sign in again for live code execution.");
  };

  // Export Progress Token (HMAC-signed on server)
  const generateExportToken = async () => {
    try {
      const { token } = currentUser
        ? await apiFetch<{ token: string }>("/api/progress/export", { method: "POST" })
        : await apiFetch<{ token: string }>("/api/progress/sign", {
            method: "POST",
            body: JSON.stringify({
              stats: {
                completedFloors: userStats.completedFloors,
                level: userStats.level,
                xp: userStats.xp,
                gold: userStats.gold,
              },
            }),
          });
      setExportToken(token);
      navigator.clipboard.writeText(token);
      setShowExportSuccess(true);
      setTimeout(() => setShowExportSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  // Import Progress Token (verified on server)
  const handleImportToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setImportError("");
    setShowImportSuccess(false);

    if (!importToken.trim()) {
      setImportError("Token is empty.");
      return;
    }

    try {
      const { stats: parsed } = await apiFetch<{ stats: Partial<UserStats> }>(
        currentUser ? "/api/progress/import" : "/api/progress/verify",
        {
          method: "POST",
          body: JSON.stringify({ token: importToken.trim() }),
        }
      );

      if (parsed && typeof parsed === "object" && parsed.completedFloors) {
        const mergedStats: UserStats = {
          level: Number(parsed.level) || userStats.level,
          xp: Number(parsed.xp) || userStats.xp,
          maxXp: userStats.maxXp,
          gold: Number(parsed.gold) || userStats.gold,
          completedFloors: {
            ...userStats.completedFloors,
            ...parsed.completedFloors,
          },
        };

        await syncStats(mergedStats);
        setShowImportSuccess(true);
        setImportToken("");
        setTimeout(() => setShowImportSuccess(false), 3000);
      } else {
        setImportError("Invalid structured schema token representation.");
      }
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "Invalid progress token.");
    }
  };

  // Get active selected track modules
  const currentCity: City = CURRICULUM[activeCityId] || CURRICULUM.python;
  
  // Set current floor index based on completed levels (prevent locking user if they want to study what they did)
  const currentFloor: Floor = currentCity.floors[activeFloorIndex] || currentCity.floors[0];

  // Initialize editor with current floor starter code
  useEffect(() => {
    setEditorValue(currentFloor.starter);
    setGradeReport(null);
    setGradeLogs(`🛠️ Ported grid connections to ${currentCity.name} mainframe. Ready to evaluate floor ${activeFloorIndex + 1}.`);
    setEditorOutputTab(activeCityId === "html" ? "preview" : "stdout");
  }, [activeCityId, activeFloorIndex]);

  // Map icon strings to Lucide elements
  const getCityIcon = (iconName: string, color: string) => {
    const props = { style: { color: color }, className: "w-6 h-6 stroke-[2.5]" };
    switch (iconName) {
      case "Terminal": return <Terminal {...props} />;
      case "Cpu": return <Cpu {...props} />;
      case "Layout": return <Layout {...props} />;
      case "Database": return <Database {...props} />;
      case "ShieldAlert": return <ShieldAlert {...props} />;
      case "Boxes": return <Boxes {...props} />;
      case "Grid": return <Grid {...props} />;
      case "Network": return <Network {...props} />;
      case "Smartphone": return <Smartphone {...props} />;
      default: return <Terminal {...props} />;
    }
  };

  // Handler to switch focus language
  const selectCity = (cityId: string) => {
    setActiveCityId(cityId);
    const completed = userStats.completedFloors[cityId] || 0;
    // Auto-focus on the first uncompleted floor, or index 0
    const targetFloorIdx = Math.min(completed, CURRICULUM[cityId].floors.length - 1);
    setActiveFloorIndex(targetFloorIdx);
  };

  // Re-run original source reset
  const resetSourceCode = () => {
    setEditorValue(currentFloor.starter);
    setGradeLogs("🔄 Workspace code reverted to lesson start parameters.");
    setGradeReport(null);
  };

  // Grading API Pipeline Call
  const evaluateSkyscraperFloor = async (runOnly: boolean = false) => {
    setIsLoadingGrade(true);
    if (runOnly) {
      setGradeLogs("⚡ Spawning custom runtime container...\n⚙️ Direct subprocess compiling and capturing stdout...");
    } else {
      setGradeLogs("🚀 Initializing code compilers...\n🌐 Dispatching payload to server-side python parser...");
      setGradeReport(null);
    }

    try {
      const response = await fetch("/api/grade", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: activeCityId,
          code: editorValue,
          expected: runOnly ? "" : currentFloor.testCode,
          floor: currentFloor.number
        }),
      });

      if (!response.ok) {
        throw new Error("HTTP connection failed compiling code.");
      }

      const report: GradingReport = await response.json();
      
      let executionPrefix = "";
      if (report.executionOutput) {
        executionPrefix = `📥 [CAPTURE SYLLABUS RUN STDOUT]:\n--------------------------------------------\n${report.executionOutput}\n--------------------------------------------\n\n`;
      }

      if (runOnly) {
        setGradeLogs(`${executionPrefix}🟩 RUN SUCCESS!\n⚡ Code successfully compiled & executed within the sandboxed sub-process container.`);
        return;
      }

      setGradeReport(report);

      if (report.success) {
        setGradeLogs(`${executionPrefix}🟩 SYNTAX VERIFICATION: SUCCESS!\n✅ Solution conforms perfectly to the active technical curriculum standard.`);
        
        // Award XP & Credits
        const currentCompletedLevel = userStats.completedFloors[activeCityId] || 0;
        const isNewFloorCompleted = currentFloor.number > currentCompletedLevel;

        let statsCopy = { ...userStats };
        if (isNewFloorCompleted) {
          statsCopy.completedFloors[activeCityId] = currentFloor.number;
        }

        // Give gold and XP increment
        statsCopy.xp += 100;
        statsCopy.gold += 50;

        // Level up evaluation
        if (statsCopy.xp >= statsCopy.maxXp) {
          statsCopy.xp -= statsCopy.maxXp;
          statsCopy.level += 1;
          statsCopy.maxXp = Math.floor(statsCopy.maxXp * 1.5);
        }

        syncStats(statsCopy);
        setShowSuccessModal(true);

      } else {
        setGradeLogs(`${executionPrefix}🟥 VALIDATION EXCEPTION: Test failures.\n❌ Code did not pass curriculum checks.\n${report.feedback.validationDetails}`);
      }
    } catch (err: any) {
      setGradeLogs(`⚠️ [Compilation Engine Error]: Failed to grade. Please check Express/Python routes. Details: ${err.message}`);
    } finally {
      setIsLoadingGrade(false);
    }
  };

  const getSyllabusProgress = (cityId: string) => {
    const completed = userStats.completedFloors[cityId] || 0;
    const total = CURRICULUM[cityId].floors.length;
    return { completed, total, pct: Math.round((completed / total) * 100) };
  };

  const currentLevelTitle = () => {
    if (userStats.level >= 5) return "Senior Systems Fellow";
    if (userStats.level >= 3) return "Associate Engineer";
    return "Cohorts Apprentice";
  };

  const handleModalContinue = () => {
    setShowSuccessModal(false);
    // Auto advance to next floor if available in this language
    if (activeFloorIndex + 1 < currentCity.floors.length) {
      setActiveFloorIndex(activeFloorIndex + 1);
    } else {
      // Completed the final 3rd floor! Guide them back to Syllabus Hub smoothly to see all towers completed
      setActiveTab("landing");
    }
  };

  return (
    <div className="bg-stone-50 text-slate-900 min-h-screen flex flex-col font-sans selection:bg-cyan-300 selection:text-black">
      
      {/* Neo-brutalist Header HUD */}
      <header className="border-b-4 border-black bg-white sticky top-0 z-40 p-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Brand Engine Logo */}
          <div className="flex items-center gap-3 cursor-pointer self-start md:self-auto" onClick={() => setActiveTab("landing")}>
            <div className="p-3 bg-cyan-300 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Zap className="w-6 h-6 text-black fill-black" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight uppercase text-black flex items-center gap-1.5">
                CodeSyllabus <span className="text-xs bg-yellow-300 border-2 border-black px-1.5 py-0.5 font-black">PLAYGROUND</span>
              </h1>
              <p className="text-[10px] text-stone-500 font-bold tracking-wide uppercase flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Zero-Knowledge Multi-Language System Engine
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex gap-2 w-full md:w-auto">
            <button 
              onClick={() => setActiveTab("landing")}
              className={`flex-1 md:flex-none brutalist-btn px-4 py-2 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 border-4 border-black transition-all ${
                activeTab === "landing" ? "bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" : "bg-white hover:bg-stone-50"
              }`}
            >
              <BookOpen className="w-4 h-4" /> Syllabus Hub
            </button>
            <button 
              onClick={() => {
                if (!currentUser) {
                  setAuthError("You must log in or sign up using the system portal to unlock active compilers.");
                  setAuthMode("signup");
                  setShowAuthModal(true);
                } else {
                  setActiveTab("workspace");
                }
              }}
              className={`flex-1 md:flex-none brutalist-btn px-4 py-2 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 border-4 border-black transition-all ${
                activeTab === "workspace" ? "bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" : "bg-white hover:bg-stone-50"
              }`}
            >
              <Wrench className="w-4 h-4" /> Code Workspace
            </button>
            <button 
              onClick={() => setActiveTab("about")}
              className={`flex-1 md:flex-none brutalist-btn px-4 py-2 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 border-4 border-black transition-all ${
                activeTab === "about" ? "bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" : "bg-white hover:bg-stone-50"
              }`}
            >
              <User className="w-4 h-4" /> Founder & Docs
            </button>
          </div>

          {/* User Stats Display */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-start md:justify-end">

            {/* Level Badge */}
            <div className="bg-white border-2 border-black px-3 py-1 flex items-center gap-2 font-black text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <div>
                <span className="text-[7px] text-stone-500 block uppercase leading-none">BUILD LEVEL</span>
                <span className="text-xs">{userStats.level} ({currentLevelTitle()})</span>
              </div>
            </div>

            {/* XP ProgressBar */}
            <div className="bg-white border-2 border-black px-3 py-1 flex flex-col justify-center w-28 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex justify-between text-[7px] font-black uppercase text-stone-600 mb-0.5">
                <span>XP Progress</span>
                <span>{userStats.xp}/{userStats.maxXp}</span>
              </div>
              <div className="w-full bg-stone-100 h-1.5 border border-black overflow-hidden">
                <div 
                  className="bg-violet-400 h-full transition-all duration-300" 
                  style={{ width: `${Math.min((userStats.xp / userStats.maxXp) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Credits currency */}
            <div className="bg-yellow-300 border-2 border-black px-3 py-1 flex items-center gap-2 font-black text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Coins className="w-4 h-4 text-black" />
              <div>
                <span className="text-[7px] text-black/70 block uppercase leading-none">POWER CREDITS</span>
                <span className="text-xs">{userStats.gold} CC</span>
              </div>
            </div>

            {/* Zero-Knowledge Toggle Button */}
            <button 
              onClick={() => setAnalogyMode(!analogyMode)}
              className={`flex items-center gap-2 px-3 py-1.5 border-2 border-black text-xs font-black uppercase transition-all ${
                analogyMode ? "bg-emerald-300 hover:bg-emerald-400" : "bg-stone-200 text-stone-600 hover:bg-stone-300"
              }`}
            >
              <span className="text-sm">💡</span>
              <span>Anology Mode: <span className="underline">{analogyMode ? "ON" : "OFF"}</span></span>
            </button>
            
            {/* Account authentication display */}
            {currentUser ? (
              <div className="bg-emerald-50 border-2 border-black px-3 py-1 flex items-center gap-2.5 font-black text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-emerald-100 transition-all">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse border border-black"></span>
                <div>
                  <span className="text-[7px] text-stone-500 block uppercase leading-none">SIGNED IN PLAYER</span>
                  <span className="text-xs uppercase">{currentUser.username}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  title="Sign out of multi-language workspace profile session"
                  className="ml-1 text-[9px] font-mono font-black text-red-600 hover:text-red-800 uppercase underline"
                >
                  [OUT]
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setAuthMode("login"); setShowAuthModal(true); }}
                className="bg-white hover:bg-stone-100 border-2 border-black px-3 py-1.5 flex items-center gap-1.5 font-black text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5"
              >
                <LogIn className="w-3.5 h-3.5 text-purple-700" />
                <span>GUEST ACCESS (SIGN UP)</span>
              </button>
            )}

          </div>
        </div>
      </header>

      {/* VIEW 1: THE SYLLABUS DIRECTORY / LANDING */}
      {activeTab === "landing" && (
        <main className="max-w-7xl w-full mx-auto p-4 md:p-6 space-y-12 flex-1">
          
          {/* Hero Masthead Banner */}
          <section className="bg-white border-4 border-black p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-red-400 via-yellow-300 to-cyan-300 border-b-4 border-black"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
              
              {/* Left Column: Info Description */}
              <div className="lg:col-span-7 flex flex-col items-start justify-center gap-4">
                <div className="bg-black text-yellow-300 text-[10px] px-3 py-1 font-mono font-black uppercase tracking-widest border-2 border-black inline-block">
                  BUILD RUNTIME KNOWLEDGE TOPIC-BY-TOPIC
                </div>
                
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight uppercase text-black leading-none mt-1">
                  WELCOME TO THE <br />
                  <span className="bg-cyan-300 border-4 border-black px-2 inline-block my-1.5 -rotate-1">CYBERNETIC SYLLABUS ROADMAPS</span>
                </h2>
                
                <p className="text-xs md:text-sm text-stone-700 font-bold max-w-2xl leading-relaxed mt-2">
                  CodeSyllabus is a hands-on, multi-language technical programming sandbox. No dry slides, no boring lectures—learning here is active code evaluation. Choose from multiple professional language tracks, satisfy precise compiler checks, and watch your interactive syllabus timeline light up in real-time.
                </p>

                {currentUser ? (
                  <div className="flex flex-wrap gap-3 mt-4">
                    <button 
                      onClick={() => { enterLanguage("python"); }} 
                      className="brutalist-btn px-5 py-3 bg-red-400 hover:bg-red-500 text-black font-black uppercase text-xs tracking-wider border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2"
                    >
                      <PlayCircle className="w-4 h-4" /> Start Assembly Now (Python)
                    </button>
                    <button 
                      onClick={() => { enterLanguage("javascript"); }}
                      className="brutalist-btn px-5 py-3 bg-white hover:bg-stone-50 text-black font-black uppercase text-xs tracking-wider border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2"
                    >
                      <Wrench className="w-4 h-4" /> JS Workspace
                    </button>
                  </div>
                ) : (
                  <div className="text-xs font-bold text-purple-700 bg-purple-50 border-2 border-dashed border-purple-500 p-3 mt-4 rounded">
                    🔑 Authenticate using the access terminal to unlock active code compilers and tracking modules.
                  </div>
                )}
              </div>

              {/* Right Column: Clean Authentication Panel (Only if not logged in) */}
              {!currentUser && (
                <div className="lg:col-span-5 bg-[#fbfbf9] border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
                  <div className="border-b-2 border-black pb-2 mb-3">
                    <h3 className="text-xs font-black uppercase text-black tracking-wider flex items-center gap-1.5 justify-center lg:justify-start">
                      <Lock className="w-4 h-4" /> SECURE SYSTEM PORTAL
                    </h3>
                    <p className="text-[9px] text-stone-500 font-bold uppercase tracking-wide mt-0.5">
                      Registration / Login Terminal (Local Key Cache)
                    </p>
                  </div>

                  {/* Auth mode selector */}
                  <div className="grid grid-cols-2 gap-1.5 border-2 border-black p-0.5 bg-white mb-3">
                    <button
                      type="button"
                      onClick={() => { setAuthMode("signup"); setAuthError(""); setAuthSuccessMsg(""); }}
                      className={`py-1 text-[10px] font-black uppercase tracking-wider transition-all ${
                        authMode === "signup" 
                          ? "bg-black text-white" 
                          : "bg-white text-stone-600 hover:bg-stone-100"
                      }`}
                    >
                      Sign Up
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAuthMode("login"); setAuthError(""); setAuthSuccessMsg(""); }}
                      className={`py-1 text-[10px] font-black uppercase tracking-wider transition-all ${
                        authMode === "login" 
                          ? "bg-black text-white" 
                          : "bg-white text-stone-600 hover:bg-stone-100"
                      }`}
                    >
                      Sign In
                    </button>
                  </div>

                  {/* Status banner outputs */}
                  {authError && (
                    <div className="bg-red-50 border-2 border-red-500 text-red-700 p-2 text-[10px] font-bold mb-3 leading-normal">
                      ⚠️ {authError}
                    </div>
                  )}
                  {authSuccessMsg && (
                    <div className="bg-emerald-50 border-2 border-emerald-500 text-emerald-800 p-2 text-[10px] font-bold mb-3 leading-normal">
                      ✓ {authSuccessMsg}
                    </div>
                  )}

                  {/* Authentication Form */}
                  <form onSubmit={handleAuthSubmit} className="space-y-2.5">
                    <div>
                      <label className="block text-[8.5px] font-mono font-black text-stone-500 uppercase mb-0.5">
                        Username ID:
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. growhigh"
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        className="w-full bg-white border-2 border-black p-1.5 text-xs font-bold text-black focus:bg-yellow-50 outline-none"
                      />
                    </div>

                    {authMode === "signup" && (
                      <div>
                        <label className="block text-[8.5px] font-mono font-black text-stone-500 uppercase mb-0.5">
                          Email Address:
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. assistant@domain.com"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          className="w-full bg-white border-2 border-black p-1.5 text-xs font-bold text-black focus:bg-yellow-50 outline-none"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-[8.5px] font-mono font-black text-stone-500 uppercase mb-0.5">
                        System Password:
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••••"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full bg-white border-2 border-black p-1.5 text-xs font-bold text-black focus:bg-yellow-50 outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-yellow-300 hover:bg-yellow-400 text-black border-2 border-black font-black text-xs uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none"
                    >
                      {authMode === "signup" ? "INITIALIZE ACCOUNT 🚀" : "RESOLVE CREDENTIALS 🔑"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </section>

          {/* Syllabus Tracks Catalog Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b-4 border-black pb-3">
              <div className="p-2 bg-emerald-300 border-4 border-black">
                <Flame className="w-5 h-5 text-black" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase text-black tracking-tight">THE ACADEMIC LANGUAGE COURSES</h3>
                <p className="text-xs text-stone-600 font-bold uppercase">Beginner Foundations through Advanced Systems</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.values(CURRICULUM).map((city) => {
                const progress = getSyllabusProgress(city.id);
                return (
                  <div 
                    key={city.id}
                    className="bg-white border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Badge category tag */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[8px] bg-stone-900 text-white font-mono font-black px-2 py-0.5 uppercase tracking-wider">
                          {city.category}
                        </span>
                        <span className="text-[10px] font-mono font-black text-stone-500">
                          {progress.pct}% DONE
                        </span>
                      </div>

                      {/* Header Title with Custom Icon */}
                      <div className="flex items-center gap-2.5 mb-2.5">
                        <div className="p-1.5 border-2 border-black" style={{ backgroundColor: `${city.color}15` }}>
                          {getCityIcon(city.icon, city.color)}
                        </div>
                        <h4 className="font-black text-base text-black uppercase tracking-tight">{city.name}</h4>
                      </div>

                      <p className="text-xs text-stone-600 font-semibold leading-relaxed mb-4">
                        {city.description}
                      </p>

                      {/* Level previews inside card */}
                      <div className="bg-stone-50 border-2 border-black p-2 bg-stone-50 text-[10px] font-mono leading-normal space-y-1">
                        <strong className="text-black block text-[10px] uppercase border-b border-stone-200 pb-0.5 mb-1 text-stone-700">Topic Blueprints Checklist</strong>
                        {city.floors.map((fl) => {
                          const isFloorCompleted = fl.number <= progress.completed;
                          return (
                            <div key={fl.number} className="flex items-center justify-between">
                              <span className="text-stone-600">Lesson {fl.number}: {fl.title}</span>
                              <span className={isFloorCompleted ? "text-emerald-600 font-extrabold" : "text-stone-400"}>
                                {isFloorCompleted ? "✓ VERIFIED" : "○ LOCKED"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <button 
                      onClick={() => enterLanguage(city.id)}
                      className="w-full brutalist-btn mt-5 py-2.5 bg-black hover:bg-stone-800 text-white border-2 border-black font-black text-xs uppercase tracking-wider active:translate-y-0.5 transition-all text-center flex items-center justify-center gap-1.5"
                    >
                      Enter Track Workspace <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Zero-Knowledge Blueprint Manifesto */}
          <section className="bg-stone-900 border-4 border-black p-6 text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-yellow-300"></div>
            
            <h3 className="text-base font-black uppercase text-yellow-300 flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-yellow-300" /> THE ZERO-KNOWLEDGE CODE MANIFESTO
            </h3>
            
            <p className="text-xs font-semibold leading-relaxed text-stone-300 mb-6 max-w-3xl">
              Too many programming platforms lock learning paths behind absolute equations, abstract syntax trees, and redundant variables terminology. Here, you are a builder. We map complex subroutines directly into physical tools you run inside a warehouse, making coding as intuitive as lego bricks.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-stone-800 border-2 border-yellow-300 p-3.5">
                <span className="text-yellow-300 font-mono text-xs block font-black uppercase mb-1">Let Storage Slots = Boxes</span>
                <p className="text-[11px] text-stone-400 font-semibold leading-relaxed">
                  Instead of 'heap references block stack space', variables are simple labeled cardboard containers that house precisely one specific parcel weight inside.
                </p>
              </div>
              <div className="bg-stone-800 border-2 border-yellow-300 p-3.5">
                <span className="text-yellow-300 font-mono text-xs block font-black uppercase mb-1">Active Routines = Vending Vats</span>
                <p className="text-[11px] text-stone-400 font-semibold leading-relaxed">
                  Avoid dry definitions of 'polymorphic nested functions'. A function is a soda vending machine. You chuck in a coin, and a cold drink immediately drops.
                </p>
              </div>
              <div className="bg-stone-800 border-2 border-yellow-300 p-3.5">
                <span className="text-yellow-300 font-mono text-xs block font-black uppercase mb-1">Index SELECT Queries = Catalog Sheets</span>
                <p className="text-[11px] text-stone-400 font-semibold leading-relaxed">
                  Rather than normal relational database maps, SQL databases are tidy filing cabinets. Queries act as laser scanners sorting lists in seconds.
                </p>
              </div>
            </div>
          </section>

        </main>
      )}

      {/* VIEW 2: ACTIVE CODE WORKSPACE / SANDBOX */}
      {activeTab === "workspace" && (
        <main className="max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
          
          {/* COLUMN Left (3 columns): District selection map & syllabus tower blueprint navigator */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            
            {/* Real-time interactive Syllabus Roadmap visualizer */}
            <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center justify-between mb-3 border-b-2 border-black pb-2">
                <h3 className="text-xs font-black uppercase text-black flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500" /> SYLLABUS ROADMAP
                </h3>
                <span className="text-[9px] font-mono bg-black text-white font-black px-1.5 py-0.5 uppercase tracking-wide">
                  Timeline Map
                </span>
              </div>

              {/* Interactive Roadmap Map */}
              <SkylineMap 
                completedFloors={userStats.completedFloors}
                activeCityId={activeCityId}
                onSelectCity={selectCity}
                activeTopicIndex={activeFloorIndex}
                onSelectTopic={(idx) => {
                  setActiveFloorIndex(idx);
                  setGradeReport(null);
                }}
              />
              
              <p className="text-[9px] text-stone-500 font-semibold font-mono mt-2 uppercase text-center leading-relaxed">
                *Nodes unlock as you complete targets. Click unlocked nodes to switch lessons.
              </p>
            </div>

            {/* List and indexes of all tracks */}
            <div className="bg-white border-4 border-black p-4 flex flex-col shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-1 max-h-[380px] overflow-y-auto">
              <div className="flex items-center justify-between mb-3 border-b-2 border-black pb-2">
                <h3 className="text-xs font-black uppercase text-black">
                  CURRICULUM TRACK STATIONS
                </h3>
                <span className="text-[9px] font-mono bg-black text-white px-2 py-0.5 font-bold">
                  {Object.keys(CURRICULUM).length} TRACKS
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                {Object.values(CURRICULUM).map((city) => {
                  const isSelected = city.id === activeCityId;
                  const progress = getSyllabusProgress(city.id);
                  return (
                    <div 
                      key={city.id}
                      onClick={() => selectCity(city.id)}
                      className={`p-2.5 border-2 border-black bg-white cursor-pointer transition-all flex items-center justify-between ${
                        isSelected 
                          ? "bg-yellow-105 border-l-8 border-l-black translate-x-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" 
                          : "hover:bg-stone-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="p-1 border border-black rounded" style={{ backgroundColor: `${city.color}15` }}>
                          {getCityIcon(city.icon, city.color)}
                        </div>
                        <div>
                          <h4 className="text-[11px] font-black uppercase text-black leading-none">{city.name}</h4>
                          <span className="text-[8px] text-stone-500 font-semibold font-mono uppercase tracking-wider block mt-0.5">
                            Completed: {progress.completed}/{progress.total} Lessons
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-mono font-black text-black">{progress.pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Real-World Libraries & Utilities Reference Section */}
            {currentCity.libraryReferences && currentCity.libraryReferences.length > 0 && (
              <div className="bg-white border-4 border-black p-4 flex flex-col shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-grow">
                <div className="flex items-center justify-between mb-3 border-b-2 border-black pb-2">
                  <h3 className="text-xs font-black uppercase text-black flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-purple-700 animate-pulse" /> REAL-WORLD LIBRARIES
                  </h3>
                  <span className="text-[9px] font-mono bg-purple-700 text-white font-black px-1.5 py-0.5 uppercase tracking-wide">
                    {activeCityId === "html" ? "WEB ECOSYSTEM" : activeCityId.toUpperCase() + " ECOSYSTEM"}
                  </span>
                </div>
                
                <p className="text-[10px] text-stone-600 font-bold mb-3 leading-relaxed">
                  Go beyond core syntax! Learn industry-standard external libraries used in production:
                </p>

                <div className="flex flex-col gap-3 max-h-[365px] overflow-y-auto pr-1">
                  {currentCity.libraryReferences.map((lib, idx) => (
                    <div key={idx} className="bg-purple-50/50 border-2 border-black p-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <div className="flex items-center justify-between mb-1.5 gap-1.5">
                        <span className="text-[11px] font-black text-purple-950 uppercase">{lib.name}</span>
                        <span className="text-[7.5px] font-mono bg-white border border-black text-stone-700 px-1 py-0.5 font-bold uppercase shrink-0">{lib.category}</span>
                      </div>
                      <p className="text-[9px] text-stone-600 font-medium leading-relaxed mb-2">{lib.purpose}</p>
                      
                      <div className="bg-stone-950 p-2 border border-black mb-2 select-all overflow-x-auto rounded truncate">
                        <pre className="text-[8.5px] font-mono text-emerald-400 whitespace-pre leading-normal">{lib.example}</pre>
                      </div>

                      {lib.docUrl && (
                        <a 
                          href={lib.docUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[8px] font-black uppercase font-mono text-purple-700 hover:text-purple-900 flex items-center gap-1 self-start inline-flex border-b-2 border-purple-700"
                        >
                          Official Docs ↗
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* COLUMN Center (6 columns): Active workspace, code terminal editor, syllabus requirements */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            {/* Lesson requirements block card */}
            <div className="bg-white border-4 border-black p-4 flex flex-col shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative justify-between">
              
              {/* Header stats trackers */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black pb-2.5 mb-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-black px-2 py-1 border-2 border-black uppercase" style={{ backgroundColor: `${currentCity.color}15`, borderColor: "#000000" }}>
                    {currentCity.name}
                  </span>
                  
                  {/* Interactive Lesson Selector Tabs */}
                  <div className="flex items-center gap-1 bg-stone-100 p-0.5 border border-black rounded">
                    {currentCity.floors.map((fl, idx) => {
                      const completedCount = userStats.completedFloors[activeCityId] || 0;
                      const isCompleted = fl.number <= completedCount;
                      const isActive = idx === activeFloorIndex;
                      return (
                        <button
                          key={fl.number}
                          onClick={() => {
                            setActiveFloorIndex(idx);
                            setGradeReport(null);
                          }}
                          className={`text-[9.5px] font-mono px-2 py-0.5 border border-black uppercase font-black transition-all ${
                            isActive
                              ? "bg-stone-900 text-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                              : isCompleted
                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-dashed"
                                : "bg-stone-50 text-stone-400 hover:bg-stone-100"
                          }`}
                          title={`Go to Lesson ${fl.number}: ${fl.title}`}
                        >
                          LSN {fl.number}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <span className="text-[9px] bg-red-400 text-black border-2 border-black font-black px-2 py-0.5 uppercase font-mono self-start sm:self-auto">
                  {currentFloor.difficulty}
                </span>
              </div>

              {/* Theory text */}
              <div className="text-slate-900 leading-relaxed text-xs">
                <h4 className="font-extrabold text-sm text-black mb-1.5 uppercase leading-none">{currentFloor.title}</h4>
                <p className="text-stone-600 font-semibold" dangerouslySetInnerHTML={{ __html: currentFloor.theory }} />
              </div>

              {/* Collapsible analogy mode helper block */}
              {analogyMode && (
                <div className="bg-teal-100 border-2 border-black p-3 mt-3 flex items-start gap-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-sm">💡</span>
                  <div className="text-[10px] text-slate-900 leading-relaxed">
                    <strong className="block text-black text-xs uppercase mb-0.5">ELIF5 ANALOGY (Visual Metaphor):</strong>
                    <span>{currentFloor.analogy}</span>
                  </div>
                </div>
              )}

              {/* Targets box specifying EXACT requirements for compilers */}
              <div className="bg-stone-900 border-2 border-black text-white p-3 mt-3.5">
                <span className="text-[8px] text-cyan-300 font-mono font-black uppercase tracking-widest block mb-1">
                  ⚙️ TECHNICAL SYLLABUS CODE TARGET
                </span>
                <p className="text-stone-300 text-[11px] font-semibold leading-relaxed">
                  {currentFloor.problem} Include exactly: <code className="text-emerald-300 font-mono font-extrabold bg-stone-950 px-1 py-0.5 border border-stone-800">{currentFloor.testCode}</code>
                </p>
              </div>

            </div>

            {/* Brutalist coding editor panel */}
            <div className="bg-white border-4 border-black flex flex-col shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden min-h-[460px]">
              
              {/* Editor control header bar */}
              <div className="bg-stone-900 px-3.5 py-2.5 border-b-4 border-black flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 border border-black"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-black"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black"></span>
                  </div>
                  <span className="text-xs font-mono text-stone-300 ml-2">ApprenticeWorkspace.{activeCityId === "html" ? "html" : activeCityId === "sql" ? "sql" : activeCityId === "rust" ? "rs" : "py"}</span>
                </div>
                
                {/* Reset button */}
                <button 
                  onClick={resetSourceCode}
                  className="text-[9px] bg-stone-800 hover:bg-stone-700 border-2 border-black px-2.5 py-0.5 text-white font-mono flex items-center gap-1 active:translate-y-0.5 transition-all w-auto"
                >
                  <Undo2 className="w-3 h-3" /> RESET SOURCE
                </button>
              </div>

              {/* Code text submission field with fake mock lines to make it look highly professional */}
              <div className="flex-grow flex bg-stone-950">
                <div className="w-9 bg-stone-900 border-r-2 border-black py-3 text-right pr-2 text-stone-500 select-none text-[10px] font-mono leading-relaxed">
                  <div>1</div>
                  <div>2</div>
                  <div>3</div>
                  <div>4</div>
                  <div>5</div>
                  <div>6</div>
                  <div>7</div>
                  <div>8</div>
                  <div>9</div>
                  <div>10</div>
                  <div>11</div>
                  <div>12</div>
                </div>
                <textarea 
                  value={editorValue}
                  onChange={(e) => setEditorValue(e.target.value)}
                  className="flex-grow bg-black text-emerald-400 p-3 outline-none resize-none font-mono text-xs leading-relaxed placeholder:text-stone-700 font-semibold"
                  style={{ minHeight: "340px", width: "100%" }}
                  placeholder="# Write your program declarations here according to the specifications above..."
                />
              </div>

              {/* Tab Selector bar between Compiler Logs/STDOUT output and Live HTML Canvas preview */}
              <div className="bg-stone-900 border-t-4 border-black flex border-b-2 border-black shrink-0">
                <button
                  onClick={() => setEditorOutputTab("stdout")}
                  className={`px-4 py-2 text-[10px] uppercase font-bold font-mono flex items-center gap-1.5 border-r-2 border-black ${
                    editorOutputTab === "stdout" ? "bg-stone-950 text-emerald-400 font-extrabold" : "bg-stone-800 text-stone-400 hover:text-white"
                  }`}
                >
                  🖥️ COMPILERLOGS::BUFFER
                </button>
                <button
                  onClick={() => setEditorOutputTab("preview")}
                  className={`px-4 py-2 text-[10px] uppercase font-bold font-mono flex items-center gap-1.5 border-r-2 border-black ${
                    editorOutputTab === "preview" ? "bg-stone-950 text-yellow-300 font-extrabold" : "bg-stone-800 text-stone-400 hover:text-white"
                  }`}
                >
                  🎨 LIVE PREVIEW {activeCityId === "html" && "🟢"}
                </button>
              </div>

              {/* Output Tab Container Area */}
              {editorOutputTab === "stdout" ? (
                <div className="bg-stone-950 p-3 h-[140px] overflow-y-auto shrink-0">
                  <div className="font-mono text-[9px] text-stone-300 space-y-1 whitespace-pre-wrap leading-relaxed">
                    {gradeLogs}
                  </div>
                </div>
              ) : (
                <div className="bg-white p-3 h-[140px] overflow-y-auto shrink-0 border-t border-stone-200">
                  {activeCityId === "html" ? (
                    <iframe
                      id="live-preview-iframe"
                      title="Live HTML Sandbox Preview"
                      srcDoc={`
                        <!DOCTYPE html>
                        <html>
                          <head>
                            <meta charset="utf-8">
                            <style>
                              body { 
                                font-family: system-ui, -apple-system, sans-serif; 
                                padding: 12px; 
                                margin: 0; 
                                background: #fcfbf7; 
                                color: #1c1917; 
                              }
                              h1, h2, h3 { color: #000; font-weight: 800; margin-top: 0; text-transform: uppercase; }
                              p { font-size: 13px; line-height: 1.5; color: #44403c; font-weight: 500; }
                              button {
                                padding: 6px 12px;
                                background: #fde047;
                                border: 2px solid #000;
                                cursor: pointer;
                                font-weight: 800;
                                box-shadow: 2px 2px 0 #000;
                                text-transform: uppercase;
                                font-size: 11px;
                              }
                              button:active {
                                transform: translate(1px, 1px);
                                box-shadow: 1px 1px 0 #000;
                              }
                            </style>
                          </head>
                          <body>
                            ${editorValue}
                          </body>
                        </html>
                      `}
                      className="w-full h-full min-h-[110px] border border-black bg-stone-50"
                      sandbox="allow-scripts"
                    />
                  ) : (
                    <div className="font-mono text-[10px] text-stone-500 h-full flex flex-col justify-center items-center text-center p-2 leading-relaxed">
                      <span className="font-bold text-black uppercase mb-1">⚡ STDOUT CAPTURER ENABLED</span>
                      <span>Run your Python, JS, or SQL query using the <strong>RUN CODE</strong> button.</span>
                      <span className="text-[9px] text-amber-600 mt-1">Live canvas rendering is active for HTML/CSS levels. For programming lines, toggle logs to COMPILERLOGS tab.</span>
                    </div>
                  )}
                </div>
              )}

              {/* Footer control panel triggers */}
              <div className="bg-white border-t-4 border-black px-4 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (activeFloorIndex > 0) {
                        setActiveFloorIndex(activeFloorIndex - 1);
                        setGradeReport(null);
                      }
                    }}
                    disabled={activeFloorIndex === 0}
                    className="text-[11px] font-mono px-2.5 py-1.5 border-2 border-black bg-stone-100 hover:bg-stone-200 uppercase font-black text-black disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Previous Lesson"
                  >
                    ❮ Prev
                  </button>
                  <button
                    onClick={() => {
                      if (activeFloorIndex < currentCity.floors.length - 1) {
                        setActiveFloorIndex(activeFloorIndex + 1);
                        setGradeReport(null);
                      }
                    }}
                    disabled={activeFloorIndex === currentCity.floors.length - 1}
                    className="text-[11px] font-mono px-2.5 py-1.5 border-2 border-black bg-stone-100 hover:bg-stone-200 uppercase font-black text-black disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Next Lesson"
                  >
                    Next ❯
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => evaluateSkyscraperFloor(true)}
                    disabled={isLoadingGrade}
                    className={`text-[11px] font-mono px-3.5 py-2 border-2 border-black bg-purple-100 hover:bg-purple-200 uppercase font-black text-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 ${
                      isLoadingGrade ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    title="Run code in dynamic hardware execution container to check stdout"
                  >
                    <PlayCircle className="w-3.5 h-3.5 text-purple-700" />
                    <span>RUN CODE</span>
                  </button>

                  <button
                    onClick={() => evaluateSkyscraperFloor(false)}
                    disabled={isLoadingGrade}
                    className={`brutalist-btn bg-yellow-300 hover:bg-yellow-400 text-black font-black text-xs px-5 py-2.5 border-4 border-black flex items-center gap-1.5 uppercase ${
                      isLoadingGrade ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <Wrench className="w-3.5 h-3.5" /> 
                    <span>{isLoadingGrade ? "EVALUATING..." : "VERIFY & GRADE SOLUTION"}</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* COLUMN Right (3 columns): AI Coach chat terminal and Badges box */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            
            {/* AI Coach Container Component */}
            <AiCoach 
              languageId={activeCityId}
              floorNumber={activeFloorIndex + 1}
              currentCode={editorValue}
            />

            {/* Achievements & Unlocked Badges Panel */}
            <div className="bg-white border-4 border-black p-4 flex flex-col shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-1 max-h-[220px] overflow-y-auto">
              <h3 className="text-xs font-black uppercase text-black mb-3 border-b-2 border-black pb-1.5 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-yellow-500" /> SYSTEM BADGES VAULT
              </h3>
              
              <div className="flex flex-col gap-2">
                <div className="bg-stone-50 border-2 border-black p-2 flex items-center gap-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div className="w-7 h-7 bg-cyan-300 border-2 border-black flex items-center justify-center text-xs text-black font-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    ⚓
                  </div>
                  <div>
                    <h4 className="text-[9px] font-black text-black uppercase leading-none">GRID ENTRY PERMIT</h4>
                    <p className="text-[8px] text-stone-500 font-bold leading-none mt-1">Silo connections unlocked</p>
                  </div>
                </div>

                {/* Badge 2 unlocked dynamically based on general floor scores */}
                {(Object.values(userStats.completedFloors) as number[]).some(c => c >= 2) ? (
                  <div className="bg-emerald-50 border-2 border-emerald-500 p-2 flex items-center gap-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <div className="w-7 h-7 bg-emerald-300 border-2 border-emerald-500 flex items-center justify-center text-xs text-black font-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                      👑
                    </div>
                    <div>
                      <h4 className="text-[9px] font-black text-emerald-950 uppercase leading-none">CURRICULUM CHAMPION</h4>
                      <p className="text-[8px] text-emerald-700 font-bold leading-none mt-1">Completed level 2 lesson modules</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-stone-50 border-2 border-black p-2 flex items-center gap-2.5 opacity-40 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <div className="w-7 h-7 bg-stone-300 border-2 border-black flex items-center justify-center text-xs text-black font-black">
                      🔒
                    </div>
                    <div>
                      <h4 className="text-[9px] font-black text-black uppercase leading-none">CURRICULUM CHAMPION</h4>
                      <p className="text-[8px] text-stone-500 font-bold leading-none mt-1">Complete Lesson 2 of any active language track</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

        </main>
      )}

      {/* SUCCESS MODAL TRIGGERED DIALOG TOAST */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black p-6 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-sm w-full">
            
            <div className="w-16 h-16 bg-yellow-300 border-4 border-black mx-auto flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
              <CheckCircle2 className="w-10 h-10 text-black stroke-[2.5]" />
            </div>

            <h3 className="text-lg font-black text-black uppercase mb-1">
              {activeFloorIndex + 1 === currentCity.floors.length ? "👑 COURSE COMPLETED!" : "LESSON MODULE VERIFIED!"}
            </h3>
            <p className="text-xs text-stone-600 font-bold mb-4">
              {activeFloorIndex + 1 === currentCity.floors.length 
                ? `Sensational knowledge advancement! You have verified all ${currentCity.floors.length} curriculum lessons of the ${currentCity.name} syllabus. Excellent achievement!` 
                : "Your program execution complies with curriculum standards and has passed all test checks perfectly."}
            </p>

            {/* Custom static calculations derived from python grading metrics */}
            <div className="bg-stone-50 p-3 border-2 border-black text-[9px] font-mono mb-4 text-left space-y-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-emerald-700 font-black uppercase text-center mb-1">🪙 STUDY SESSION PAYLIST</div>
              <div className="flex justify-between">
                <span>Gold/Points earned:</span> <span className="font-extrabold text-stone-800">+50 Gold</span>
              </div>
              <div className="flex justify-between">
                <span>Intellect Points:</span> <span className="font-extrabold text-stone-800">+100 XP</span>
              </div>
              {gradeReport && (
                <>
                  <div className="border-t border-stone-200 my-1 pt-1 flex justify-between">
                    <span>Lines Checked:</span> <span className="font-extrabold text-stone-800">{gradeReport.metrics.linesOfCode} LOC</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Complexity Load:</span> <span className="font-extrabold text-emerald-600 font-extrabold">{gradeReport.metrics.complexityRating}</span>
                  </div>
                </>
              )}
            </div>

            <button 
              onClick={handleModalContinue}
              className="w-full py-2.5 bg-cyan-300 hover:bg-cyan-400 text-black border-4 border-black font-black text-xs uppercase tracking-wider transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none"
            >
              {activeFloorIndex + 1 === currentCity.floors.length ? "EXPLORE OTHER TRACKS 🚀" : "NEXT LESSON CHALLENGE \u2192"}
            </button>
          </div>
        </div>
      )}

      {/* VIEW 3: CEO & FOUNDER, SYSTEM DOCS & REGISTRATION */}
      {activeTab === "about" && (
        <main className="max-w-7xl w-full mx-auto p-4 md:p-6 space-y-12 flex-1">
          
          {/* Top Banner section */}
          <section className="bg-white border-4 border-black p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden text-center">
            <div className="absolute top-0 left-0 right-0 h-3 bg-purple-700"></div>
            <h2 className="text-2xl md:text-3xl font-black uppercase text-black tracking-tight mb-2">
              CODE SYLLABUS DIRECTIVES & PLATFORM MANUAL 
            </h2>
            <p className="text-xs md:text-sm text-stone-600 font-bold max-w-3xl mx-auto leading-relaxed">
              CodeSyllabus is a multi-language programming development workspace. By matching academic learning tracks with instant execution feedback, developers skip passive tutorials and directly build production proficiency under zero-nonsense guidelines.
            </p>
          </section>

          {/* 1. PRIMARY CENTERPIECE: CEO & FOUNDER */}
          <section className="max-w-2xl mx-auto bg-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col items-center justify-center text-center">
            <div className="absolute top-0 left-0 right-0 h-2 bg-yellow-300"></div>
            <div className="absolute top-2 right-2 bg-purple-700 text-white border-2 border-black px-3 py-1 text-[9px] font-mono font-black uppercase tracking-wider">
              PLATFORM FELLOW
            </div>

            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-black uppercase text-black tracking-tight">
                ARFATH PASHA
              </h2>
              <p className="text-sm font-black font-mono tracking-wider text-purple-700 bg-purple-100 border-2 border-purple-700 inline-block px-3 py-1 mt-1">
                CEO & FOUNDER
              </p>
              <div className="w-16 h-1.5 bg-black mx-auto mt-3"></div>
            </div>

            {/* Centered Image and Info */}
            <div className="flex flex-col items-center justify-center w-full max-w-md space-y-6">
              <div className="founder-portrait-shell relative group shrink-0 w-64 max-w-full md:w-72">
                <div className="absolute inset-0 bg-black border-2 border-black translate-x-3 translate-y-3 transition-all"></div>
                <div className="founder-portrait-halo absolute -inset-3 border-2 border-purple-700 bg-yellow-200/70"></div>
                <img 
                  src={founderImage} 
                  alt="Arfath Pasha, CEO & Founder" 
                  referrerPolicy="no-referrer"
                  className="founder-portrait-image relative z-10 w-full aspect-[4/5] object-contain border-4 border-black bg-[#fffdfa] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] p-2"
                />
              </div>

              <div className="space-y-4 w-full text-center">
                <p className="text-xs md:text-sm font-semibold text-stone-600 leading-relaxed italic max-w-sm mx-auto">
                  "I designed CodeSyllabus because traditional resources overly complicate syntax. Learning here is concrete, active code evaluation with physical metaphors. No abstract hand-waving."
                </p>

                <div className="bg-purple-50 p-4 border-2 border-black space-y-2 rounded text-xs font-semibold w-full max-w-sm mx-auto">
                  <div className="flex items-center justify-between border-b border-purple-200 pb-1.5">
                    <span className="text-stone-500 font-bold uppercase text-[9px]">Syllabus Role:</span>
                    <span className="text-purple-950 font-mono font-black text-[10px]">SENIOR WORKSPACE FELLOW</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-purple-200 pb-1.5">
                    <span className="text-stone-500 font-bold uppercase text-[9px]">Platform Rank:</span>
                    <span className="text-purple-950 font-mono font-black text-[10px]">ASSOCIATE SYSTEMS ENGINEER</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 font-bold uppercase text-[9px]">Support Desk Email:</span>
                    <a 
                      href="mailto:arfathpasha772@gmail.com" 
                      className="text-purple-700 font-black hover:underline cursor-pointer font-mono text-[10px]"
                    >
                      arfathpasha772@gmail.com ↗
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. THREE-COLUMN EXPANSE FOR EVERYTHING ELSE: (Analogies / Registration / Progress Backup) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* COLUMN 1: ZERO-KNOWLEDGE ANALOGIES */}
            <div className="space-y-6">
              <div className="bg-white border-4 border-black p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full">
                <div className="flex items-center gap-1.5 border-b-2 border-black pb-2 mb-3">
                  <Compass className="w-5 h-5 text-purple-700 animate-spin" />
                  <h3 className="text-xs font-black uppercase text-black">
                    ZERO-KNOWLEDGE METAPHORS
                  </h3>
                </div>

                <p className="text-[10px] text-stone-500 font-bold uppercase mb-3 leading-tight">
                  Our core pedagogical philosophy explains logic via physical real-world constructs:
                </p>

                <div className="space-y-3.5 flex-grow">
                  <div className="border-l-4 border-red-500 pl-2.5">
                    <h4 className="text-[11px] font-black uppercase text-black">Variables</h4>
                    <p className="text-[10.5px] text-stone-600 font-medium">Labeled cardboard boxes stamped with types, holding a single content value at any moment.</p>
                  </div>

                  <div className="border-l-4 border-yellow-500 pl-2.5">
                    <h4 className="text-[11px] font-black uppercase text-black">Functions</h4>
                    <p className="text-[10.5px] text-stone-600 font-medium">Mechanical vending machines. You drop parameters inside the hopper, and a computed value drops out below.</p>
                  </div>

                  <div className="border-l-4 border-cyan-500 pl-2.5">
                    <h4 className="text-[11px] font-black uppercase text-black">Relational SQL</h4>
                    <p className="text-[10.5px] text-stone-600 font-medium">Steel office filing cabinet organizers configured with rigid drawers, indexed tags, and unique key locks.</p>
                  </div>

                  <div className="border-l-4 border-orange-500 pl-2.5">
                    <h4 className="text-[11px] font-black uppercase text-black">Memory Safety (Rust)</h4>
                    <p className="text-[10.5px] text-stone-600 font-medium">Rigid building permits and physical borrow checklists inspected by a master structural systems engineer.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 2: GUEST SIGNUP AND LOGIN (REARRANGED & PROMINENTLY EMBEDDED) */}
            <div className="space-y-6">
              <div className="bg-white border-4 border-black p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-1.5 border-b-2 border-black pb-2 mb-3">
                    <Users className="w-5 h-5 text-purple-700" />
                    <h3 className="text-xs font-black uppercase text-black">
                      APPRENTICE ACCOUNT SECURITY
                    </h3>
                  </div>

                  <p className="text-[10.5px] text-stone-600 font-bold mb-4 leading-relaxed">
                    Lock down your verified syllabus checkpoints! Save achievements directly to your custom account profile profile.
                  </p>

                  {currentUser ? (
                    <div className="bg-emerald-50 border-2 border-black p-4 text-center space-y-3">
                      <p className="text-xs font-black text-emerald-800 uppercase flex items-center justify-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full border border-black animate-ping"></span>
                        Active Session: {currentUser.username}
                      </p>
                      <p className="text-[10px] text-stone-600 font-semibold text-center">
                        Your progress is synced with personal storage coordinates. Ready to compile safely.
                      </p>
                      <button
                        onClick={handleSignOut}
                        className="w-full py-1.5 border-2 border-black bg-red-100 hover:bg-red-200 text-red-700 font-black text-xs uppercase"
                      >
                        Sign Out of Session
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleAuthSubmit} className="space-y-3">
                      <div className="flex bg-stone-100 border-2 border-black p-1 mb-2">
                        <button
                          type="button"
                          onClick={() => { setAuthMode("login"); setAuthError(""); }}
                          className={`flex-1 text-[10px] py-1 font-black uppercase ${authMode === "login" ? "bg-white border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]" : "text-stone-500"}`}
                        >
                          Sign In
                        </button>
                        <button
                          type="button"
                          onClick={() => { setAuthMode("signup"); setAuthError(""); }}
                          className={`flex-1 text-[10px] py-1 font-black uppercase ${authMode === "signup" ? "bg-white border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]" : "text-stone-500"}`}
                        >
                          Register (Signup)
                        </button>
                      </div>

                      <div>
                        <input 
                          type="text"
                          required
                          value={usernameInput}
                          onChange={(e) => setUsernameInput(e.target.value)}
                          placeholder="Apprentice Username"
                          className="w-full text-xs font-semibold p-2 bg-stone-50 border-2 border-black outline-none focus:bg-white"
                        />
                      </div>

                      {authMode === "signup" && (
                        <div>
                          <input 
                            type="email"
                            required
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            placeholder="System Email"
                            className="w-full text-xs font-semibold p-2 bg-stone-50 border-2 border-black outline-none focus:bg-white"
                          />
                        </div>
                      )}

                      <div>
                        <input 
                          type="password"
                          required
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                          placeholder="Password / Security Pin"
                          className="w-full text-xs font-semibold p-2 bg-stone-50 border-2 border-black outline-none focus:bg-white"
                        />
                      </div>

                      {authError && (
                        <p className="text-[9px] font-mono font-black text-red-600 text-center animate-pulse">⚠ Error: {authError}</p>
                      )}

                      {authSuccessMsg && (
                        <p className="text-[9px] font-mono font-black text-emerald-600 text-center animate-pulse">✓ {authSuccessMsg}</p>
                      )}

                      <button
                        type="submit"
                        className="w-full py-2 bg-yellow-300 hover:bg-yellow-400 text-black border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      >
                        {authMode === "login" ? "PROCEED TO SIGNIN" : "CREATE NEW ACCOUNT ID"}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* COLUMN 3: BACKUP / RESTORE PROGRESS EXPORT */}
            <div className="space-y-6">
              <div className="bg-white border-4 border-black p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-1.5 border-b-2 border-black pb-2 mb-3">
                    <Share2 className="w-5 h-5 text-purple-700" />
                    <h3 className="text-xs font-black uppercase text-black">
                      PROGRESS EXPORT ENGINE
                    </h3>
                  </div>

                  <p className="text-[10.5px] text-stone-600 font-bold mb-4 leading-relaxed">
                    Back up your completed syllabus checks to a cryptographically safe transportable text token!
                  </p>

                  <div className="space-y-3">
                    <button
                      onClick={generateExportToken}
                      className="w-full brutalist-btn py-2 bg-purple-700 hover:bg-purple-800 text-white font-black text-xs uppercase tracking-wide border-2 border-black flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <Download className="w-3.5 h-3.5" /> Export Progress Token
                    </button>

                    {showExportSuccess && (
                      <p className="text-[9px] text-emerald-600 font-mono font-black text-center animate-pulse">
                        ✓ TOKEN COPIED TO CLIPBOARD SUCCESS!
                      </p>
                    )}

                    {exportToken && (
                      <div className="bg-stone-950 p-2 border border-black max-h-[85px] overflow-y-auto rounded text-left">
                        <pre className="text-[8px] font-mono text-emerald-400 whitespace-pre select-all truncate">{exportToken}</pre>
                      </div>
                    )}

                    <form onSubmit={handleImportToken} className="border-t border-stone-200 pt-3 space-y-2">
                      <strong className="block text-[10px] uppercase text-black text-left">Restore progress checklist:</strong>
                      <div className="flex gap-1.5">
                        <input 
                          type="text" 
                          value={importToken}
                          onChange={(e) => setImportToken(e.target.value)}
                          placeholder="Paste transport token..."
                          className="flex-1 text-[10px] p-1.5 bg-stone-50 border border-black outline-none font-semibold text-left"
                        />
                        <button
                          type="submit"
                          className="bg-cyan-300 hover:bg-cyan-400 text-black font-black text-[10px] px-2.5 border border-black uppercase"
                        >
                          Restore
                        </button>
                      </div>
                      {showImportSuccess && (
                        <p className="text-[9px] text-emerald-600 font-mono font-black animate-pulse text-center">✓ Progress recovered successfully!</p>
                      )}
                      {importError && (
                        <p className="text-[9px] text-red-600 font-mono font-black text-center">⚠ Error: {importError}</p>
                      )}
                    </form>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Manual detailing core instructions in depth */}
          <section className="bg-stone-50 border-4 border-black p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-4">
            <h3 className="text-sm font-black uppercase text-black flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-700 animate-pulse" /> COMPILER OPERATIONS & GRADING Blueprints
            </h3>
            <p className="text-xs text-stone-600 font-bold leading-relaxed">
              Our workspace compilers run a real-time system integration framework. The system parses your code edits, checks them against structural constraints, and provides precise logs. For any developer track:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-stone-700 leading-relaxed font-semibold">
              <div className="bg-white p-4 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <h4 className="font-black text-black uppercase mb-1 flex items-center gap-1"><span className="w-2 h-2 bg-purple-700 rounded-full"></span> Syntax Compiler</h4>
                <p>Translates developer grammar into parsed execution blocks. We check that key phrases, assignment structures, and syntax trees match standard library specifications exactly.</p>
              </div>
              <div className="bg-white p-4 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <h4 className="font-black text-black uppercase mb-1 flex items-center gap-1"><span className="w-2 h-2 bg-yellow-400 rounded-full"></span> Physical Analogy Coach</h4>
                <p>Translates complex algorithmic logic into intuitive tangible metaphors. When you are stuck, activate analogy mode to ground abstract problems in pure physical mechanics.</p>
              </div>
              <div className="bg-white p-4 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <h4 className="font-black text-black uppercase mb-1 flex items-center gap-1"><span className="w-2 h-2 bg-cyan-400 rounded-full"></span> Relational Integrity</h4>
                <p>Validates data pipelines, query operations, interface elements, and systems constraints in memory safely, mimicking professional testing loops used on production clusters.</p>
              </div>
            </div>
          </section>

        </main>
      )}

      {/* AUTHENTICATION REGISTER & LOGIN DIALOG MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-sm w-full relative">
            
            <button
              onClick={() => { setShowAuthModal(false); setAuthError(""); }}
              className="absolute top-2 right-2 font-mono font-black text-lg text-black hover:text-stone-600 px-2 uppercase"
            >
              [✖]
            </button>

            <div className="text-center mb-5 border-b-2 border-black pb-3">
              <h3 className="text-lg font-black text-black uppercase">
                {authMode === "login" ? "USER LOGIN SECURITY" : "REGISTER CODESYLLABUS ACCOUNT"}
              </h3>
              <p className="text-[10px] text-stone-500 font-bold uppercase mt-1">
                Sync active verified level checklist variables
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              
              <div>
                <label className="block text-[10px] uppercase font-mono font-black text-stone-700 mb-1">
                  Apprentice Username
                </label>
                <div className="relative">
                  <User className="absolute left-2.5 top-2.5 w-4 h-4 text-stone-500" />
                  <input 
                    type="text" 
                    required
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Enter unique builder name"
                    className="w-full text-xs font-semibold pl-9 p-2.5 bg-stone-50 border-2 border-black outline-none focus:bg-white"
                  />
                </div>
              </div>

              {authMode === "signup" && (
                <div>
                  <label className="block text-[10px] uppercase font-mono font-black text-stone-700 mb-1">
                    System Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-2.5 w-4 h-4 text-stone-500" />
                    <input 
                      type="email" 
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="arfathpasha772@gmail.com"
                      className="w-full text-xs font-semibold pl-9 p-2.5 bg-stone-50 border-2 border-black outline-none focus:bg-white"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] uppercase font-mono font-black text-stone-700 mb-1">
                  Access Keyword / Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-2.5 w-4 h-4 text-stone-500" />
                  <input 
                    type="password" 
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs pl-9 p-2.5 bg-stone-50 border-2 border-black outline-none focus:bg-white"
                  />
                </div>
              </div>

              {authError && (
                <div className="p-2 border-2 border-red-500 bg-red-50 text-[10px] font-mono font-black text-red-600 uppercase text-center animate-pulse">
                  ⚠ Error: {authError}
                </div>
              )}

              {authSuccessMsg && (
                <div className="p-2 border-2 border-emerald-500 bg-emerald-50 text-[10px] font-mono font-black text-emerald-600 uppercase text-center animate-pulse">
                  ✓ {authSuccessMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-yellow-300 hover:bg-yellow-400 text-black border-4 border-black font-black text-xs uppercase tracking-wider transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5"
              >
                {authMode === "login" ? "SIGN IN APPRENTICE PROFILE" : "CREATE NEW ACCOUNT PROFILE"}
              </button>

              <div className="text-center pt-2">
                {authMode === "login" ? (
                  <p className="text-[10px] font-semibold text-stone-600">
                    New builder?{" "}
                    <button 
                      type="button" 
                      onClick={() => { setAuthMode("signup"); setAuthError(""); }}
                      className="text-purple-700 font-extrabold underline uppercase"
                    >
                      Register Account Now
                    </button>
                  </p>
                ) : (
                  <p className="text-[10px] font-semibold text-stone-600">
                    Already registered?{" "}
                    <button 
                      type="button" 
                      onClick={() => { setAuthMode("login"); setAuthError(""); }}
                      className="text-purple-700 font-extrabold underline uppercase"
                    >
                      Login Profile
                    </button>
                  </p>
                )}
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Footer credits bar */}
      <footer className="bg-white border-t-4 border-black p-4 text-center mt-12 shrink-0">
        <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">
          © 2026 CodeSyllabus Platform. Operating under cloud-managed container compiler standards.
        </p>
      </footer>

    </div>
  );

  // Short helper to switch from Landing card directly to target coding track
  function enterLanguage(cityId: string) {
    if (!currentUser) {
      setAuthError("You must log in or sign up using the system portal to unlock active compilers.");
      setAuthMode("signup");
      setShowAuthModal(true);
      return;
    }
    selectCity(cityId);
    setActiveTab("workspace");
  }
}
