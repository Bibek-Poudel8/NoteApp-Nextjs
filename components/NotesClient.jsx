"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const NotesClient = ({ initialNotes }) => {
  const [notes, setNotes] = useState(initialNotes || []);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingContent, setEditingContent] = useState("");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("list"); // 'list' | 'grid'
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatDate = (d) => {
    try {
      return new Date(d).toLocaleString();
    } catch {
      return "";
    }
  };

  const createNote = async (e) => {
    e.preventDefault();
    if (title.trim() === "" || content.trim() === "") {
      setError("Title and content are required");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      const result = await response.json();
      if (result.success) {
        setNotes([result.data, ...notes]);
        toast.success("Notes created successfully");
        setTitle("");
        setContent("");
        setSuccess(true);
      }
    } catch (error) {
      console.error(error);
      setError(error.message);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        setNotes(notes.filter((note) => note._id !== id));
        toast.success("Note deleted successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete note");
    }
  };

  const startEditing = (note) => {
    setEditingId(note._id);
    setEditingTitle(note.title);
    setEditingContent(note.content);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingTitle("");
    setEditingContent("");
  };

  const updateNote = async (id) => {
    if (editingTitle.trim() === "" || editingContent.trim() === "") {
      toast.error("Title and content are required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editingTitle, content: editingContent }),
      });
      const result = await response.json();
      if (result.success) {
        toast.success("Note updated successfully");
        setNotes(notes.map((note) => (note._id === id ? result.data : note)));
        cancelEditing();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update note");
    } finally {
      setLoading(false);
    }
  };

  const displayedNotes = notes.filter((n) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (n.title || "").toLowerCase().includes(q) ||
      (n.content || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      <form
        className="rounded-2xl bg-white/70 backdrop-blur ring-1 ring-gray-200 shadow-lg p-6 dark:bg-gray-900/60 dark:ring-gray-700"
        onSubmit={createNote}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Create New Note</h2>
          <span className="inline-flex items-center rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1 ring-1 ring-indigo-100 dark:bg-indigo-950/30 dark:text-indigo-300 dark:ring-indigo-900/50">
            Quick add
          </span>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="title">
              Note Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="e.g. Project ideas, shopping list"
              className="w-full rounded-xl bg-gray-50/70 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition dark:bg-gray-800/60 dark:text-gray-100 dark:ring-gray-700 dark:placeholder:text-gray-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="content">
              Note Content
            </label>
            <textarea
              placeholder="Write your thoughts..."
              id="content"
              rows={5}
              className="w-full rounded-xl bg-gray-50/70 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition dark:bg-gray-800/60 dark:text-gray-100 dark:ring-gray-700 dark:placeholder:text-gray-500"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-2 font-medium shadow hover:from-indigo-500 hover:to-violet-500 active:from-indigo-700 active:to-violet-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed cursor-default hover:cursor-pointer"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Note"}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Existing Notes</h2>
            <span className="rounded-full bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700">
              {notes.length} total
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notes..."
                className="w-56 rounded-lg bg-white px-3 py-1.5 text-sm text-gray-900 shadow-sm ring-1 ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition dark:bg-gray-900 dark:text-gray-100 dark:ring-gray-700 dark:placeholder:text-gray-500"
              />
            </div>
            <div className="inline-flex rounded-lg ring-1 ring-gray-200 overflow-hidden dark:ring-gray-700">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 text-sm ${viewMode === "list" ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100" : "text-gray-600 dark:text-gray-300"}`}
              >
                List
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 text-sm ${viewMode === "grid" ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100" : "text-gray-600 dark:text-gray-300"}`}
              >
                Grid
              </button>
            </div>
          </div>
        </div>
        {displayedNotes.length === 0 ? (
          <div className="rounded-xl bg-white/70 p-10 text-center ring-1 ring-gray-200 dark:bg-gray-900/60 dark:ring-gray-700">
            <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center dark:bg-indigo-950/30 dark:text-indigo-300">✍️</div>
            <p className="text-gray-700 dark:text-gray-300">No matching notes. Try a different search.</p>
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
            {displayedNotes.map((note) => (
              <div
                key={note._id}
                className="group relative rounded-xl bg-white/80 ring-1 ring-gray-200 p-5 shadow-sm hover:shadow-lg transition dark:bg-gray-900/60 dark:ring-gray-700"
              >
              {editingId === note._id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="w-full rounded-xl bg-gray-50/70 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition dark:bg-gray-800/60 dark:text-gray-100 dark:ring-gray-700 dark:placeholder:text-gray-500"
                    required
                  />
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    rows={5}
                    className="w-full rounded-xl bg-gray-50/70 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition dark:bg-gray-800/60 dark:text-gray-100 dark:ring-gray-700 dark:placeholder:text-gray-500"
                    required
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateNote(note._id)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 text-white px-4 py-2 font-medium shadow hover:bg-green-500 active:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Update"}
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-600 text-white px-4 py-2 font-medium shadow hover:bg-gray-500 active:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 flex-1 pr-4 dark:text-gray-100">
                      {note.title}
                    </h3>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => startEditing(note)}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-indigo-600 ring-1 ring-indigo-100 hover:bg-indigo-50 transition text-sm font-medium dark:text-indigo-300 dark:ring-indigo-900/50 dark:hover:bg-indigo-950/30"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16.862 3.487a2.25 2.25 0 1 1 3.182 3.182L7.5 19.313 3 21l1.687-4.5L16.862 3.487z"/></svg>
                        Edit
                      </button>
                      <button
                        onClick={() => deleteNote(note._id)}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-red-600 ring-1 ring-red-100 hover:bg-red-50 transition text-sm font-medium dark:text-red-300 dark:ring-red-900/50 dark:hover:bg-red-950/30"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 7h12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m1 0v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7m3 4v6m4-6v6"/></svg>
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed dark:text-gray-300">
                    {note.content}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700" suppressHydrationWarning>
                      Created {mounted ? formatDate(note.createdAt) : ""}
                    </span>
                    {note.updatedAt !== note.createdAt && (
                      <span className="inline-flex items-center rounded-full bg-amber-50 text-amber-700 text-xs font-medium px-3 py-1 ring-1 ring-amber-100 dark:bg-amber-950/20 dark:text-amber-300 dark:ring-amber-900/40" suppressHydrationWarning>
                        Updated {mounted ? formatDate(note.updatedAt) : ""}
                      </span>
                    )}
                  </div>
                </>
              )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesClient;
