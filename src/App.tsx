/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Film,
  Sparkles,
  Settings2,
  Image as ImageIcon,
  Video,
  Clock3,
  Play,
  Wand2,
  Layers3,
  Upload,
  Search,
  SlidersHorizontal,
  FolderKanban,
  ChevronRight,
  Plus,
  PauseCircle,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Zap,
  Eye,
  Activity,
  Sun,
  Loader2,
} from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const demoProjects = [
  {
    id: 1,
    title: "Northern Road Blizzard",
    status: "Rendering",
    progress: 72,
    duration: "00:15",
    ratio: "16:9",
    preset: "Cinematic Realism",
  },
  {
    id: 2,
    title: "Forest Encounter",
    status: "Queued",
    progress: 18,
    duration: "00:10",
    ratio: "9:16",
    preset: "Moody Thriller",
  },
  {
    id: 3,
    title: "Cafe Dialogue Scene",
    status: "Ready",
    progress: 100,
    duration: "00:08",
    ratio: "16:9",
    preset: "Docudrama",
  },
];

const gallery = [
  {
    id: 1,
    title: "Shot_014",
    type: "video",
    length: "15s",
    tag: "Cinematic",
  },
  {
    id: 2,
    title: "Shot_015",
    type: "video",
    length: "10s",
    tag: "Vertical",
  },
  {
    id: 3,
    title: "Concept_Frame_A",
    type: "image",
    length: "Still",
    tag: "Reference",
  },
  {
    id: 4,
    title: "Shot_016",
    type: "video",
    length: "20s",
    tag: "Story",
  },
];

const storyboardFrames = [
  "Wide establishing shot of a snowy back road at night.",
  "Interior driver close-up with dashboard glow and windshield blizzard.",
  "Tense side profile as headlights sweep past snowbanks.",
  "Final push-in as something dark appears through the storm.",
];

function StatusPill({ status }: { status: string }) {
  const map: Record<string, React.ReactNode> = {
    Rendering: (
      <Badge className="gap-1 rounded-full">
        <PauseCircle className="h-3.5 w-3.5" />
        Rendering
      </Badge>
    ),
    Queued: (
      <Badge variant="secondary" className="gap-1 rounded-full">
        <Clock3 className="h-3.5 w-3.5" />
        Queued
      </Badge>
    ),
    Ready: (
      <Badge variant="outline" className="gap-1 rounded-full">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Ready
      </Badge>
    ),
  };
  return <>{map[status] ?? <Badge className="rounded-full">{status}</Badge>}</>;
}

function SidebarItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition ${
        active
          ? "bg-zinc-800 text-white shadow-sm"
          : "text-zinc-400 hover:bg-zinc-900 transition-colors"
      }`}
    >
      <span className="flex items-center gap-3">
        {icon}
        <span className="font-medium">{label}</span>
      </span>
      <ChevronRight className="h-4 w-4 opacity-40" />
    </button>
  );
}

export default function SoraStyleVideoApp() {
  // Debug React version
  useEffect(() => {
    console.log("React version:", React.version);
  }, []);

  const [prompt, setPrompt] = React.useState(
    "Ultra-cinematic winter night drive on a remote back road during a violent blizzard, grounded realism, soft dashboard glow, tense atmosphere, subtle handheld feel, feature film lighting, photorealistic snow physics."
  );
  const [title, setTitle] = React.useState("Untitled Scene");
  const [duration, setDuration] = React.useState("15s");
  const [ratio, setRatio] = React.useState("16:9");
  const [quality, setQuality] = React.useState("High");
  const [mode, setMode] = React.useState("Text to Video");
  const [search, setSearch] = React.useState("");
  const [gpuCluster, setGpuCluster] = React.useState("h100-ultra");
  const [isEnhancing, setIsEnhancing] = React.useState(false);
  const [realismScore, setRealismScore] = React.useState(94);
  const [activeTab, setActiveTab] = React.useState("parameters");

  const enhanceRealism = async () => {
    setIsEnhancing(true);
    try {
      const apiKey = typeof process !== 'undefined' && process.env ? process.env.GEMINI_API_KEY : '';
      const ai = new GoogleGenAI({ apiKey: apiKey || "" });
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Refine this video generation prompt to be ultra-realistic, photorealistic, and physically grounded. Focus on lighting, textures, physics, and camera technicals. Prompt: ${prompt}. Return ONLY the refined prompt text.`,
      });
      if (result.text) {
        setPrompt(result.text.trim());
        setRealismScore(98);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsEnhancing(false);
    }
  };

  const gpuData = React.useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      time: i,
      load: 40 + Math.random() * 50,
      memory: 60 + Math.random() * 30,
    }));
  }, []);

  const filteredGallery = React.useMemo(() => {
    if (!search.trim()) return gallery;
    return gallery.filter(
      (item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.tag.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-white selection:text-black">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="border-r border-zinc-800 bg-[#0c0c0e] flex flex-col p-4">
          <div className="p-6 flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center">
              <Film className="h-5 w-5 text-black" />
            </div>
            <span className="text-lg font-bold tracking-tight uppercase italic">Motion Lab</span>
          </div>

          <nav className="px-2 space-y-1">
            <SidebarItem
              icon={<Sparkles className="h-4 w-4" />}
              label="Create"
              active
            />
            <SidebarItem
              icon={<Layers3 className="h-4 w-4" />}
              label="Storyboard"
            />
            <SidebarItem
              icon={<FolderKanban className="h-4 w-4" />}
              label="Projects"
            />
            <SidebarItem
              icon={<ImageIcon className="h-4 w-4" />}
              label="Assets"
            />
            <SidebarItem
              icon={<Settings2 className="h-4 w-4" />}
              label="Settings"
            />
          </nav>

          <div className="mt-auto p-2">
            <div className="bg-[#18181b] rounded-2xl p-4 border border-zinc-800">
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                Render Queue
              </h3>
              <div className="space-y-4">
                {demoProjects.slice(0, 1).map((project) => (
                  <div key={project.id} className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-300 truncate w-32">{project.title}</span>
                      <span className="text-blue-400">{project.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 transition-all duration-500" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span>2 Active</span>
                  <span className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    Live
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col p-6 overflow-y-auto">
          <header className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-white">
                Create Cinema
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                Generate high-fidelity motion from text prompts.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="px-4 py-2 rounded-xl border border-zinc-800 bg-transparent text-zinc-100 hover:bg-zinc-900"
              >
                <Upload className="mr-2 h-4 w-4" /> Import Frames
              </Button>
              <Button className="px-5 py-2 rounded-xl bg-white text-black text-sm font-bold shadow-lg shadow-white/5 hover:bg-zinc-200">
                <Wand2 className="mr-2 h-4 w-4" /> Generate Sequence
              </Button>
            </div>
          </header>

          <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
            <div className="col-span-7 flex flex-col gap-6 min-h-0">
              <div className="bg-[#0c0c0e] rounded-2xl border border-zinc-800 p-5 flex flex-col">
                <div className="flex items-center gap-2 text-zinc-400 mb-4">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Prompt Composer</span>
                </div>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your cinematic vision..."
                  className="flex-1 min-h-[180px] bg-transparent border-none text-zinc-100 placeholder:text-zinc-600 resize-none focus:ring-0 text-lg leading-relaxed p-0 focus-visible:ring-0"
                />
                
                <div className="flex items-center justify-between gap-2 mt-4 pt-4 border-t border-zinc-900/50">
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Cinematic Lighting",
                      "35mm Anamorphic",
                      "Soft Bokeh",
                    ].map((tag) => (
                      <span 
                        key={tag}
                        className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400"
                      >
                        {tag}
                      </span>
                    ))}
                    <button className="px-3 py-1 rounded-full border border-dashed border-zinc-700 text-xs text-zinc-500 hover:border-zinc-500 hover:text-zinc-400 transition-colors uppercase font-bold tracking-tighter">
                      + Style
                    </button>
                  </div>
                  
                  <Button 
                    onClick={enhanceRealism}
                    disabled={isEnhancing}
                    variant="outline" 
                    className="h-8 rounded-full border-blue-500/30 bg-blue-500/5 text-blue-400 text-[10px] uppercase font-bold hover:bg-blue-500/10 hover:text-blue-300"
                  >
                    {isEnhancing ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Sparkles className="h-3 w-3 mr-2 text-blue-400" />}
                    Boost Realism
                  </Button>
                </div>
              </div>

              <div className="flex-1 bg-[#0c0c0e] rounded-2xl border border-zinc-800 p-5">
                <h3 className="text-sm font-medium text-zinc-400 mb-4">Sequence Storyboard</h3>
                <div className="grid grid-cols-4 gap-4">
                  {storyboardFrames.map((text, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06 }}
                      className="space-y-2 group cursor-pointer"
                    >
                      <div className="aspect-[3/4] bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-center relative overflow-hidden group-hover:border-zinc-600 transition-colors">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <span className="absolute bottom-2 left-2 text-[10px] text-zinc-500">
                          Frame 0{i + 1}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 leading-tight line-clamp-2">
                        {text}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-span-12 xl:col-span-5 flex flex-col gap-6 min-h-0">
              <div className="aspect-video bg-zinc-900 rounded-2xl border border-zinc-800 relative overflow-hidden group cursor-pointer shadow-2xl">
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all">
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 hover:scale-110 transition-transform">
                    <Play className="h-6 w-6 text-white ml-1 fill-current" />
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <span className="px-2 py-1 rounded bg-black/60 text-[10px] text-white border border-white/10 uppercase font-bold tracking-wider">
                    Preview 1080P
                  </span>
                  <div className="px-2 py-1 rounded bg-blue-500/20 backdrop-blur-md border border-blue-500/30 flex items-center gap-1.5">
                    <Activity className="h-2.5 w-2.5 text-blue-400" />
                    <span className="text-[10px] text-blue-300 uppercase font-bold tracking-wider">{realismScore}% Verified Realistic</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#0c0c0e] rounded-2xl border border-zinc-800 p-5">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="grid grid-cols-3 rounded-xl bg-zinc-900 p-0.5 w-64">
                      <button 
                        onClick={() => setActiveTab("parameters")}
                        className={`rounded-lg text-[10px] uppercase font-bold py-1 h-7 transition-all ${activeTab === 'parameters' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-400'}`}
                      >
                        Params
                      </button>
                      <button 
                        onClick={() => setActiveTab("realism")}
                        className={`rounded-lg text-[10px] uppercase font-bold py-1 h-7 transition-all flex items-center justify-center gap-1 ${activeTab === 'realism' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-400'}`}
                      >
                        <Eye className="h-3 w-3" /> Realism
                      </button>
                      <button 
                        onClick={() => setActiveTab("compute")}
                        className={`rounded-lg text-[10px] uppercase font-bold py-1 h-7 transition-all flex items-center justify-center gap-1.5 ${activeTab === 'compute' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-400'}`}
                      >
                        <Cpu className="h-3 w-3" /> Compute
                      </button>
                    </div>
                    <button className="text-xs text-blue-500 hover:underline">Restore</button>
                  </div>

                  {activeTab === 'parameters' && (
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                          <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Duration</label>
                          <select 
                            value={duration} 
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 h-9 text-xs text-zinc-100 outline-none focus:border-blue-500/50 appearance-none cursor-pointer"
                          >
                            <option value="5s">5 Seconds</option>
                            <option value="10s">10 Seconds</option>
                            <option value="15s">15 Seconds</option>
                            <option value="20s">20 Seconds</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Aspect Ratio</label>
                          <select 
                            value={ratio} 
                            onChange={(e) => setRatio(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 h-9 text-xs text-zinc-100 outline-none focus:border-blue-500/50 appearance-none cursor-pointer"
                          >
                            <option value="16:9">16:9 HD</option>
                            <option value="9:16">9:16 Vertical</option>
                            <option value="1:1">1:1 Square</option>
                            <option value="2.35:1">2.35:1 Cinema</option>
                          </select>
                        </div>
                        <div className="col-span-2 space-y-1.5">
                          <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Sora GPU Cluster</label>
                          <select 
                            value={gpuCluster} 
                            onChange={(e) => setGpuCluster(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 h-9 text-xs text-zinc-100 outline-none focus:border-blue-500/50 appearance-none cursor-pointer"
                          >
                            <option value="h100-ultra">NVIDIA H100 Ultra-Cluster (Pre-emptible)</option>
                            <option value="a100-hq">NVIDIA A100 High-Compute (Reserved)</option>
                            <option value="l40s-eco">NVIDIA L40S Eco-Compute</option>
                          </select>
                        </div>
                      </div>
                      <div className="pt-2 space-y-2 border-t border-zinc-900/50">
                        <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Variation Scale</label>
                        <div className="h-1.5 w-full bg-zinc-900 rounded-full flex items-center relative">
                            <div className="h-full bg-zinc-700 w-1/2 rounded-full"></div>
                            <div className="absolute left-1/2 w-3 h-3 bg-white rounded-full -translate-x-1/2 border-2 border-zinc-900"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'realism' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Physical Grounding</span>
                          <span className="text-blue-400 text-[10px] font-mono">STABLE</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2.5 bg-zinc-900/50 rounded-xl border border-zinc-800 flex flex-col gap-1">
                            <span className="text-[9px] text-zinc-500 uppercase font-bold">Fluid Physics</span>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-zinc-200">High-Res</span>
                              <div className="w-8 h-4 rounded-full bg-blue-500 relative cursor-pointer">
                                <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                              </div>
                            </div>
                          </div>
                          <div className="p-2.5 bg-zinc-900/50 rounded-xl border border-zinc-800 flex flex-col gap-1">
                            <span className="text-[9px] text-zinc-500 uppercase font-bold">Light Bounce</span>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-zinc-200">Unbiased</span>
                              <div className="w-8 h-4 rounded-full bg-zinc-700 relative cursor-pointer">
                                <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-zinc-400 rounded-full"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest leading-none block">Optical Distortion</span>
                        <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl space-y-3">
                          <div className="space-y-1.5 text-[10px] text-zinc-400">
                            <div className="flex justify-between">
                              <span>Chromatic Aberration</span>
                              <span className="text-zinc-500">2.4%</span>
                            </div>
                            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 w-[24%]"></div>
                            </div>
                          </div>
                          <div className="space-y-1.5 text-[10px] text-zinc-400">
                            <div className="flex justify-between">
                              <span>Film Grain Intensity</span>
                              <span className="text-zinc-500">12%</span>
                            </div>
                            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 w-[12%]"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'compute' && (
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-[10px] uppercase font-bold">
                          <span className="text-zinc-500">Live GPU Utilization (H100)</span>
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                            <span className="text-blue-400">920 TFLOPS</span>
                          </div>
                        </div>
                        <div className="h-24 w-full rounded-xl border border-zinc-900 bg-black/40 overflow-hidden relative flex items-center justify-center">
                          <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-blue-500/10 to-transparent"></div>
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={gpuData}>
                              <Area 
                                type="monotone" 
                                dataKey="load" 
                                stroke="#3b82f6" 
                                strokeWidth={2}
                                fill="rgba(59, 130, 246, 0.1)" 
                                isAnimationActive={false} 
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 pb-2">
                        <div className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800">
                          <div className="text-[9px] text-zinc-500 uppercase font-black mb-1">VRAM Allocation</div>
                          <div className="text-sm font-mono text-zinc-200">76.4<span className="text-zinc-500">/80GB</span></div>
                        </div>
                        <div className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800">
                          <div className="text-[9px] text-zinc-500 uppercase font-black mb-1">Node Latency</div>
                          <div className="text-sm font-mono text-zinc-200">12ms</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 bg-[#0c0c0e] rounded-2xl border border-zinc-800 p-5 flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium">Library</h3>
                  <Search className="h-4 w-4 text-zinc-600" />
                </div>
                <ScrollArea className="flex-1 -mx-2 px-2 h-[200px]">
                  <div className="space-y-3 pb-2">
                    {filteredGallery.map((item) => (
                      <div 
                        key={item.id} 
                        className="flex items-center gap-3 p-2 hover:bg-zinc-900/50 rounded-xl border border-transparent hover:border-zinc-800 transition-all cursor-pointer group"
                      >
                        <div className="h-10 w-12 bg-zinc-800 rounded-md flex items-center justify-center">
                          {item.type === "video" ? <Video className="h-3 w-3 text-zinc-500" /> : <ImageIcon className="h-3 w-3 text-zinc-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium truncate">{item.title}</div>
                          <div className="text-[10px] text-zinc-500">22 Jan • {item.length} • MP4</div>
                        </div>
                        <Badge variant="ghost" className="h-6 w-6 rounded-full text-zinc-600 hover:text-zinc-300">
                          <ChevronRight className="h-3 w-3" />
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>

          <footer className="mt-8 flex items-center justify-between py-4 border-t border-zinc-900">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-500 uppercase font-medium">API Status:</span>
                <span className="text-[10px] text-green-500 font-bold uppercase">Optimal</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-500 uppercase font-medium">GPU Cloud:</span>
                <span className="text-[10px] text-blue-500 font-bold uppercase flex items-center gap-1">
                  <Zap className="h-2.5 w-2.5" /> Active (H100)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-500 uppercase font-medium">Credits:</span>
                <span className="text-[10px] text-zinc-200 font-bold uppercase">1,284 Remaining</span>
              </div>
            </div>
            <div className="text-[10px] text-zinc-600 tracking-wider font-bold uppercase">
              SORA-NODE-7 // GPU CLUSTER A
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
