"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { db } from "./lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Navbar from "./Components/Navbar";
import SearchBar from "./Components/SearchBar";
import Discover from "./Components/Discover";

export default function Home() {
  const [tools, setTools] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const handleSearchChange = (value) => setSearchTerm(value);
  const handleClearSearch = () => setSearchTerm("");
  const handleCategoryChange = (category) => setActiveCategory(category);

  useEffect(() => {
    const fetchTools = async () => {
      const q = query(collection(db, "tools"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const toolList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || null,
      }));

      console.log("🔥 Tools fetched from Firebase:", toolList); // ← Ye line add karni hai

      setTools(toolList);
    };
    fetchTools();
  }, []);

  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Head>
        <title>Alpha – AI ToolCity | Explore Top AI Tools</title>
        <meta
          name="description"
          content="Discover and explore powerful AI tools for productivity, creativity, and growth. Curated and categorized for easy access."
        />
      </Head>

      <div className="flex flex-col min-h-screen ">
        {/* ✅ Header */}
        <Navbar />

        {/* ✅ Hero Section */}
        <main className="flex-1 text-white px-6 py-20 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent pointer-events-none"></div>
          <div className="max-w-screen-xl mx-auto relative z-10">
            <Discover />

            {/* ✅ Search & Filters */}
            <SearchBar
              searchValue={searchTerm}
              onSearchChange={handleSearchChange}
              onClearSearch={handleClearSearch}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
            />

            {/* ✅ Tool Cards Grid */}
            <section>
              {filteredTools.length === 0 ? (
                <p className="text-center text-gray-400 mt-20">
                  No tools found. Try a different search or filter.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                  {filteredTools.map((tool) => (
                    <div
                      key={tool.id}
                      className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl  transition duration-300 block hover:scale-[1.025]"
                    >
                      {/* <Image
                        src={tool.image || "https://via.placeholder.com/300x150?text=No+Image"}
                        alt={tool.name}
                        width={400}
                        height={160}
                        className="w-full h-40 object-cover rounded-lg mb-4 border border-white/10 group-hover:opacity-90"
                      /> */}

                      <Image
                        src={
                          typeof tool.image === "string" &&
                          (tool.image.trim().startsWith("http") ||
                            tool.image.trim().startsWith("/"))
                            ? tool.image.trim()
                            : "https://via.placeholder.com/300x150?text=No+Image"
                        }
                        alt={tool.name || "AI Tool"}
                        width={400}
                        height={200}
                        className="w-full h-40 object-cover rounded-lg mb-4 border border-white/10 group-hover:opacity-90"
                      />

                      <div className="flex justify-between items-center mb-2">
                        <span className="inline-block bg-purple-700 text-white text-xs px-2 py-1 rounded-full shadow">
                          {tool.category}
                        </span>
                        {tool.createdAt && (
                          <span className="text-sm ">
                            {new Intl.DateTimeFormat("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }).format(new Date(tool.createdAt))}
                          </span>
                        )}
                      </div>

                      <h2 className="text-xl font-semibold mb-1">
                        {tool.name}
                      </h2>
                      <p className="text-sm text-gray-300 mb-3 line-clamp-3">
                        {tool.description}
                      </p>

                      <Link
                        href={`/tool/${tool.slug}`}
                        className="inline-block mt-2 text-sm font-medium bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-lg transition"
                      >
                        View Tool
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>

        {/* ✅ Footer */}
        <footer className="w-full bg-[#0b1120] text-gray-400 text-sm text-center py-6 border-t border-white/10 relative z-10">
          <p>© {new Date().getFullYear()} Alpha. Built with ❤️ by Wameq.</p>
        </footer>
      </div>
    </>
  );
}
