import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Plus, Trash2, Edit3, Save, X, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface QuestionForm {
  title: string;
  question_text: string;
  starter_code: string;
  language: string;
  difficulty: "easy" | "medium" | "hard";
  xp_reward: number;
  topic: string;
  tags: string;        // comma-separated
  companies: string;   // comma-separated
  acceptance_rate: number;
  estimated_minutes: number;
  example_input: string;
  example_output: string;
  constraints: string;
  hint1: string;
  hint2: string;
  hint3: string;
}

const EMPTY_FORM: QuestionForm = {
  title: "", question_text: "", starter_code: "", language: "Python",
  difficulty: "easy", xp_reward: 10, topic: "", tags: "", companies: "",
  acceptance_rate: 65, estimated_minutes: 15,
  example_input: "", example_output: "", constraints: "",
  hint1: "", hint2: "", hint3: "",
};

const LANGUAGES = ["Python", "JavaScript", "Java", "C++", "DSA", "SQL"];

const Admin = () => {
  // Role comes from AuthContext — fetched from Supabase via get_my_role() RPC.
  // No emails are hardcoded anywhere in this file.
  const { user, loading, isAdmin, roleLoading } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Array<{ id: string; title: string; language: string; difficulty: string; xp_reward: number }>>([]);
  const [form, setForm] = useState<QuestionForm>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!loading && !user) { navigate("/auth"); return; }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Only fetch questions once we know the user is an admin.
    // roleLoading=false means the role has been resolved from Supabase.
    if (isAdmin && !roleLoading) fetchQuestions();
  }, [isAdmin, roleLoading]);

  const fetchQuestions = async () => {
    const { data } = await supabase
      .from("questions")
      .select("id, title, language, difficulty, xp_reward")
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) setQuestions(data);
  };

  const handleSave = async () => {
    if (!form.title || !form.question_text) {
      setMessage({ type: "error", text: "Title and question text are required." });
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      companies: form.companies.split(",").map(c => c.trim()).filter(Boolean),
    };

    try {
      if (editingId) {
        const { error } = await supabase.from("questions").update(payload).eq("id", editingId);
        if (error) throw error;
        setMessage({ type: "success", text: "Question updated successfully!" });
      } else {
        const { error } = await supabase.from("questions").insert(payload);
        if (error) throw error;
        setMessage({ type: "success", text: "Question added successfully!" });
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
      fetchQuestions();
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Save failed." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this question? This cannot be undone.")) return;
    const { error } = await supabase.from("questions").delete().eq("id", id);
    if (!error) fetchQuestions();
  };

  const handleEdit = (q: { id: string; title: string; language: string; difficulty: string; xp_reward: number }) => {
    setEditingId(q.id);
    setForm({ ...EMPTY_FORM, title: q.title, language: q.language, difficulty: q.difficulty as "easy" | "medium" | "hard", xp_reward: q.xp_reward });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Show spinner while auth or role is resolving
  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin h-10 w-10 border-b-2 border-primary rounded-full mx-auto" />
          <p className="text-sm text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Role resolved — not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-6 pt-28 pb-20 text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Access Denied</h1>
          <p className="text-muted-foreground mb-2">
            This page requires admin privileges.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            To grant admin access, run this in Supabase SQL Editor:
          </p>
          <pre className="bg-muted text-left text-xs rounded-xl p-4 mb-6 overflow-x-auto">
{`UPDATE public.profiles
SET role = 'admin'
WHERE user_id = 'YOUR-USER-UUID';`}
          </pre>
          <Link to="/dashboard"><Button>Go to Dashboard</Button></Link>
        </main>
      </div>
    );
  }

  const input = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";
  const textarea = `${input} min-h-[80px] resize-y font-mono`;
  const label = "block text-xs font-semibold text-foreground mb-1";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-6 pb-20 pt-28 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center">
            <Shield className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">Manage questions, content, and settings</p>
          </div>
          <Button
            className="ml-auto"
            onClick={() => { setShowForm(true); setForm(EMPTY_FORM); setEditingId(null); }}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Question
          </Button>
        </div>

        {/* Status message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 flex items-center gap-2 p-4 rounded-xl border ${
              message.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {message.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            {message.text}
            <button onClick={() => setMessage(null)} className="ml-auto"><X className="h-4 w-4" /></button>
          </motion.div>
        )}

        {/* Question Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-foreground">{editingId ? "Edit Question" : "Add New Question"}</h2>
              <button onClick={() => setShowForm(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={label}>Title *</label>
                <input className={input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Reverse a String" />
              </div>

              <div>
                <label className={label}>Language *</label>
                <select className={input} value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))}>
                  {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>

              <div>
                <label className={label}>Difficulty *</label>
                <select className={input} value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value as "easy" | "medium" | "hard" }))}>
                  <option value="easy">Easy (10 XP)</option>
                  <option value="medium">Medium (20 XP)</option>
                  <option value="hard">Hard (35 XP)</option>
                </select>
              </div>

              <div>
                <label className={label}>XP Reward</label>
                <input type="number" className={input} value={form.xp_reward} onChange={e => setForm(f => ({ ...f, xp_reward: Number(e.target.value) }))} />
              </div>

              <div>
                <label className={label}>Topic</label>
                <input className={input} value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))} placeholder="e.g. Arrays, Hash Maps, DP" />
              </div>

              <div>
                <label className={label}>Tags (comma-separated)</label>
                <input className={input} value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="array, iteration, basics" />
              </div>

              <div>
                <label className={label}>Companies (comma-separated)</label>
                <input className={input} value={form.companies} onChange={e => setForm(f => ({ ...f, companies: e.target.value }))} placeholder="Google, Amazon, Microsoft" />
              </div>

              <div>
                <label className={label}>Acceptance Rate (%)</label>
                <input type="number" className={input} value={form.acceptance_rate} onChange={e => setForm(f => ({ ...f, acceptance_rate: Number(e.target.value) }))} />
              </div>

              <div>
                <label className={label}>Estimated Minutes</label>
                <input type="number" className={input} value={form.estimated_minutes} onChange={e => setForm(f => ({ ...f, estimated_minutes: Number(e.target.value) }))} />
              </div>

              <div className="sm:col-span-2">
                <label className={label}>Question Text *</label>
                <textarea className={textarea} value={form.question_text} onChange={e => setForm(f => ({ ...f, question_text: e.target.value }))} placeholder="Write the full problem description here..." />
              </div>

              <div>
                <label className={label}>Example Input</label>
                <textarea className={textarea} value={form.example_input} onChange={e => setForm(f => ({ ...f, example_input: e.target.value }))} placeholder='reverse_string("hello")' />
              </div>

              <div>
                <label className={label}>Example Output</label>
                <textarea className={textarea} value={form.example_output} onChange={e => setForm(f => ({ ...f, example_output: e.target.value }))} placeholder='"olleh"' />
              </div>

              <div className="sm:col-span-2">
                <label className={label}>Constraints</label>
                <textarea className={textarea} value={form.constraints} onChange={e => setForm(f => ({ ...f, constraints: e.target.value }))} placeholder="1 <= len(s) <= 1000" />
              </div>

              <div className="sm:col-span-2">
                <label className={label}>Starter Code</label>
                <textarea className={`${textarea} min-h-[120px] font-mono text-xs`} value={form.starter_code} onChange={e => setForm(f => ({ ...f, starter_code: e.target.value }))} placeholder="def solution(s: str) -> str:&#10;    # Your code here&#10;    pass" />
              </div>

              <div>
                <label className={label}>Hint 1 (Gentle nudge)</label>
                <textarea className={textarea} value={form.hint1} onChange={e => setForm(f => ({ ...f, hint1: e.target.value }))} placeholder="Think about iterating the string..." />
              </div>

              <div>
                <label className={label}>Hint 2 (More specific)</label>
                <textarea className={textarea} value={form.hint2} onChange={e => setForm(f => ({ ...f, hint2: e.target.value }))} placeholder="Python has slicing syntax that can..." />
              </div>

              <div>
                <label className={label}>Hint 3 (Near solution)</label>
                <textarea className={textarea} value={form.hint3} onChange={e => setForm(f => ({ ...f, hint3: e.target.value }))} placeholder='Try: return s[::-1]' />
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <Button onClick={handleSave} disabled={saving} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : editingId ? "Update Question" : "Add Question"}
              </Button>
              <Button variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }}>
                Cancel
              </Button>
            </div>
          </motion.div>
        )}

        {/* Questions list */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-bold text-foreground">Questions ({questions.length})</h2>
          </div>
          <div className="divide-y divide-border">
            {questions.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No questions yet. Add one above.</div>
            ) : (
              questions.map(q => (
                <div key={q.id} className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">{q.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{q.language}</span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] h-4 ${
                          q.difficulty === "easy" ? "text-green-600 border-green-300"
                          : q.difficulty === "medium" ? "text-yellow-600 border-yellow-300"
                          : "text-red-600 border-red-300"
                        }`}
                      >
                        {q.difficulty}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{q.xp_reward} XP</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => handleEdit(q)} className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(q.id)} className="p-1.5 rounded hover:bg-red-50 transition-colors text-muted-foreground hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
