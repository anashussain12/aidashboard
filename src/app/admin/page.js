"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { db, auth, storage } from "../lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// You can remove these imports if not needed:

import { useRouter } from "next/navigation";
// import { onAuthStateChanged } from "firebase/auth";

export default function AdminPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    link: "",
    category: "",
    longDescription: "",
  });
  const [tools, setTools] = useState([]);
  const [selectedTools, setSelectedTools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [editingToolId, setEditingToolId] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       setUser(user);
  //     } else {
  //       router.push("/login");
  //     }
  //   });

  //   fetchTools();
  //   return () => unsubscribe();
  // }, []);

  const fetchTools = async () => {
    const querySnapshot = await getDocs(collection(db, "tools"));
    const toolList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const sortedTools = toolList.sort(
      (a, b) => b.createdAt?.seconds - a.createdAt?.seconds
    );
    setTools(sortedTools);
  };

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
        const toolRef = doc(db, "tools", editingToolId);
        await updateDoc(toolRef, dataToSave);
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
      fetchTools();
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
    data.append("upload_preset", "aitoolsdashboard"); // change to your preset
  
    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dlxldpmsp/image/upload", {
        method: "POST",
        body: data,
      });
  
      const result = await res.json();
      if (result.secure_url) {
        setForm((prev) => ({ ...prev, image: result.secure_url }));
        setMessage("✅ Image uploaded successfully.");
      } else {
        throw new Error("Upload failed");
      }
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
      await Promise.all(
        selectedTools.map((id) => deleteDoc(doc(db, "tools", id)))
      );
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

  return (
    <main  className="min-h-screen bg-gradient-to-br from-[#43203c] to-[#40044a75] text-white px-6 py-12">
      <Head>
        <title>Admin Panel | Alpha Tools</title>
      </Head>

      <header className="flex justify-between items-center max-w-4xl mx-auto mb-10">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <Link
          href="/"
          className="text-sm px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition"
        >
          Back to Home
        </Link>
      </header>

      <div className="max-w-4xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white/5 p-6 rounded-xl border border-white/10 shadow mb-12"
        >
          <input
            type="text"
            name="name"
            placeholder="Tool Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-[#111827] border border-gray-700 placeholder-gray-400"
          />
          <input
            type="text"
            name="description"
            placeholder="Short Description"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-[#111827] border border-gray-700 placeholder-gray-400"
          />
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileUpload}
            className="w-full p-3 rounded bg-[#111827] border border-gray-700 text-gray-400"
          />
          <textarea
            name="longDescription"
            placeholder="Detailed Description"
            value={form.longDescription}
            onChange={handleChange}
            className="w-full p-3 rounded bg-[#111827] border border-gray-700 placeholder-gray-400 h-32"
          />
          <input
            type="text"
            name="link"
            placeholder="Website Link"
            value={form.link}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-[#111827] border border-gray-700 placeholder-gray-400"
          />
          <select
            name="category"
            value={form.category || ""}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-[#111827] border border-gray-700 text-white"
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

          <button
            type="submit"
            disabled={loading}
            className="bg-purple-800 px-6 py-3 rounded-lg font-semibold transition shadow"
          >
            {loading ? "Saving..." : editingToolId ? "Update Tool" : "Add Tool"}
          </button>

          {message && <p className="mt-4 text-sm text-green-400">{message}</p>}
        </form>

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

        {categories.map((cat) => {
          const toolsInCategory = tools.filter((tool) => tool.category === cat);
          if (toolsInCategory.length === 0) return null;
          return (
            <div key={cat} className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">
                {cat} ({toolsInCategory.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {toolsInCategory.map((tool) => (
                  <div
                    key={tool.id}
                    className="bg-white/5 p-5 rounded-xl border border-white/10 shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="text-xl font-semibold mb-2">
                        {tool.name}
                      </h3>
                      <input
                        type="checkbox"
                        checked={selectedTools.includes(tool.id)}
                        onChange={() => toggleSelectTool(tool.id)}
                        className="form-checkbox h-5 w-5 text-blue-500 bg-gray-800 border-gray-600 rounded"
                      />
                    </div>
                    <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                      {tool.description}
                    </p>
                    <div className="flex gap-3 flex-wrap">
                      <button
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm"
                        onClick={() =>
                          window.open(`/tool/${tool.slug}`, "_blank")
                        }
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
