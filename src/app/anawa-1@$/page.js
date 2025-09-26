"use client";
import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { db, auth } from "../lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [tools, setTools] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    link: "",
    category: "",
    longDescription: "",
  });
  const [selectedTools, setSelectedTools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [editingToolId, setEditingToolId] = useState(null);
  const router = useRouter();

  // ✅ Auth effect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/login");
      }
      setCheckingAuth(false);
    });
    return () => unsubscribe();
  }, [router]);

  // ✅ Fetch tools
  const fetchTools = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "tools"));
      const toolList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const sortedTools = toolList.sort(
        (a, b) => b.createdAt?.seconds - a.createdAt?.seconds
      );
      setTools(sortedTools);
    } catch (err) {
      console.error("Error fetching tools:", err);
    }
  }, []);

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  // ✅ Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // ✅ Loading state
  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading...
      </div>
    );
  }

  if (!user) return null;

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!form.name || !form.description || !form.link || !form.category) {
      setMessage("❌ All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const dataToSave = {
        ...form,
        slug: form.name.toLowerCase().replace(/\s+/g, "-"),
        updatedAt: Timestamp.now(),
      };

      if (editingToolId) {
        await updateDoc(doc(db, "tools", editingToolId), dataToSave);
        setMessage("✅ Tool updated successfully!");
      } else {
        await addDoc(collection(db, "tools"), {
          ...dataToSave,
          createdAt: Timestamp.now(),
        });
        setMessage("✅ Tool added successfully!");
      }

      setForm({
        name: "",
        description: "",
        image: "",
        link: "",
        category: "",
        longDescription: "",
      });
      setEditingToolId(null);
      await fetchTools();
    } catch (error) {
      console.error("Error saving tool: ", error);
      setMessage("❌ Failed to save tool.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMessage("⏳ Uploading image...");

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "aitoolsdashboard");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dlxldpmsp/image/upload",
        { method: "POST", body: data }
      );
      const result = await res.json();
      if (result.secure_url) {
        setForm((prev) => ({ ...prev, image: result.secure_url }));
        setMessage("✅ Image uploaded successfully.");
      } else throw new Error("Upload failed");
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage("❌ Failed to upload image.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "tools", id));
      setTools(tools.filter((tool) => tool.id !== id));
    } catch (error) {
      console.error("Error deleting tool:", error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedTools.map((id) => deleteDoc(doc(db, "tools", id))));
      setTools(tools.filter((tool) => !selectedTools.includes(tool.id)));
      setSelectedTools([]);
      setMessage("🗑️ Selected tools deleted!");
    } catch (error) {
      console.error("Error deleting selected tools:", error);
    }
  };

  const toggleSelectTool = (id) => {
    setSelectedTools((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleEdit = (tool) => {
    setForm({
      name: tool.name,
      description: tool.description,
      image: tool.image,
      link: tool.link,
      category: tool.category,
      longDescription: tool.longDescription || "",
    });
    setEditingToolId(tool.id);
    setMessage("✏️ Editing mode enabled");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const categories = ["Text", "Image", "Chatbots", "Code", "Video"];

  const normalizeLink = (link) => {
    if (!link) return "#";
    return link.startsWith("http") ? link : `https://${link}`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1e1e2f] to-[#2a0d35] text-white">
      <Head>
        <title>Admin Panel | Alpha Tools</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      {/* 🔹 Navbar */}
      <nav className="bg-[#2c1a3f] px-6 py-4 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold">⚡ Alpha Tools Admin</h1>
        <div className="flex gap-4 items-center">
          
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* 🔹 Content */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-[#252537] p-6 rounded-xl border border-white/10 shadow-xl mb-12"
        >
          <h2 className="text-xl font-semibold mb-4">
            {editingToolId ? "✏️ Edit Tool" : "➕ Add New Tool"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Tool Name"
              value={form.name}
              onChange={handleChange}
              required
              className="p-3 rounded bg-[#1b1b2f] border border-gray-700 placeholder-gray-400"
            />
            <input
              type="text"
              name="description"
              placeholder="Short Description"
              value={form.description}
              onChange={handleChange}
              required
              className="p-3 rounded bg-[#1b1b2f] border border-gray-700 placeholder-gray-400"
            />
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileUpload}
              className="p-3 rounded bg-[#1b1b2f] border border-gray-700 text-gray-400"
            />
            <input
              type="text"
              name="link"
              placeholder="Website Link"
              value={form.link}
              onChange={handleChange}
              required
              className="p-3 rounded bg-[#1b1b2f] border border-gray-700 placeholder-gray-400"
            />
            <select
              name="category"
              value={form.category || ""}
              onChange={handleChange}
              required
              className="p-3 rounded bg-[#1b1b2f] border border-gray-700 text-white"
            >
              <option value="" disabled>
                Select Category
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <textarea
            name="longDescription"
            placeholder="Detailed Description"
            value={form.longDescription}
            onChange={handleChange}
            className="w-full p-3 rounded bg-[#1b1b2f] border border-gray-700 placeholder-gray-400 h-32"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-700 hover:bg-purple-800 px-6 py-3 rounded-lg font-semibold transition shadow-md"
          >
            {loading ? "Saving..." : editingToolId ? "Update Tool" : "Add Tool"}
          </button>

          {message && <p className="mt-4 text-sm text-green-400">{message}</p>}
        </form>

        {/* Bulk Delete */}
        {selectedTools.length > 0 && (
          <div className="mb-6 flex justify-end">
            <button
              onClick={handleBulkDelete}
              className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg font-medium shadow"
            >
              🗑️ Delete Selected ({selectedTools.length})
            </button>
          </div>
        )}

        {/* Tool List */}
        {categories.map((cat) => {
          const toolsInCategory = tools.filter((tool) => tool.category === cat);
          if (toolsInCategory.length === 0) return null;
          return (
            <div key={cat} className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 border-b border-white/20 pb-2">
                {cat} ({toolsInCategory.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {toolsInCategory.map((tool) => (
                  <div
                    key={tool.id}
                    className="bg-[#2c2c44] p-5 rounded-xl border border-white/10 shadow-lg hover:shadow-purple-500/20 transition"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold">{tool.name}</h3>
                      <input
                        type="checkbox"
                        checked={selectedTools.includes(tool.id)}
                        onChange={() => toggleSelectTool(tool.id)}
                        className="h-5 w-5 text-blue-500 bg-gray-800 border-gray-600 rounded"
                      />
                    </div>
                    <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                      {tool.description}
                    </p>
                    <div className="flex gap-3 flex-wrap">
                      <button
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm"
                        onClick={() => window.open(normalizeLink(tool.link), "_blank")}
                      >
                        View
                      </button>
                      <button
                        className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-md text-sm"
                        onClick={() => handleEdit(tool)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm"
                        onClick={() => handleDelete(tool.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
