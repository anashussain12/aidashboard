"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { db } from "./lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import SearchBar from "./Components/SearchBar";
import Discover from "./Components/Discover";
import Aitoolscategory from "./Components/AiToolsCategory";
import FAQ from "./Components/FAQS";

export default function Home() {
  const [tools, setTools] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  let a = ">";
  const handleSearchChange = (value) => setSearchTerm(value);
  const handleClearSearch = () => setSearchTerm("");
  const handleCategoryChange = (category) => setActiveCategory(category);

  // useEffect(() => {
  //   const fetchTools = async () => {
  //     const q = query(collection(db, "tools"), orderBy("createdAt", "desc"));
  //     const querySnapshot = await getDocs(q);
  //     const toolList = querySnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //       createdAt: doc.data().createdAt?.toDate?.() || null,
  //     }));

  //     console.log("🔥 Tools fetched from Firebase:", toolList); // ← Ye line add karni hai

  //     setTools(toolList);
  //   };
  //   fetchTools();
  // }, []);

  useEffect(() => {
    const fetchTools = async () => {
      const q = query(collection(db, "tools"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const toolList = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || null, // ✅ always stable
        };
      });
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
        <title>AI ToolCity | Explore Top AI Tools</title>
        <meta
          name="description"
          content="Discover and explore powerful AI tools for productivity, creativity, and growth. Curated and categorized for easy access."
        />
      </Head>

      <div className="flex flex-col min-h-screen ">
        <main className="flex-1 text-white px-4 sm:px-6 lg:px-12 py-12 sm:py-16 md:py-20 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent pointer-events-none"></div>

          <div className="max-w-screen-xl mx-auto relative z-10">
            <Discover />

            <SearchBar
              searchValue={searchTerm}
              onSearchChange={handleSearchChange}
              onClearSearch={handleClearSearch}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
            />

            {/* ✅ Categories Section */}
            <div className="mt-10 sm:mt-14 pt-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight underline decoration-[#9901bf] decoration-4">
                AI Tool Categories
              </h1>
              <Link
                href={"/category"}
                className="hover:underline text-sm md:text-base cursor-pointer"
              >
                View all {a}
              </Link>
            </div>
            <p className="pt-3 md:pt-4 text-base sm:text-lg md:text-2xl tracking-tight">
              Unlock innovation with our diverse range of cutting-edge solutions.
            </p>
            <Aitoolscategory />

            {/* ✅ Popular Tools */}
            <div className="mt-10 sm:mt-14 pt-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight underline decoration-[#9901bf] decoration-4">
                Popular AI Tools
              </h1>
              <p className="hover:underline text-sm md:text-base cursor-pointer">
                View all {a}
              </p>
            </div>
            <p className="pt-3 md:pt-4 pb-6 md:pb-10 text-base sm:text-lg md:text-2xl tracking-tight">
              Discover the Best AI Tools Making Your Life Easier and More Efficient.
            </p>

            {/* ✅ Tools Grid */}
            <section>
              {filteredTools.length === 0 ? (
                <div className="text-center text-gray-400 mt-20">No tool found</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8">
                  {filteredTools.map((tool) => (
                    <div
                      key={tool.id}
                      className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6 text-white shadow-xl hover:shadow-2xl transition duration-300 block hover:scale-[1.025]"
                    >
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
                        className="w-full h-40 sm:h-48 md:h-56 object-cover rounded-lg mb-4 border border-white/10 group-hover:opacity-90"
                      />
                      <div className="flex justify-between items-center mb-2 text-xs sm:text-sm">
                        <span className="inline-block bg-purple-700 text-white px-2 py-1 rounded-full shadow">
                          {tool.category}
                        </span>

                        {tool.createdAt && (
                          <span>{new Date(tool.createdAt).toLocaleDateString("en-US")}</span>
                        )}

                      </div>
                      <h2 className="text-lg sm:text-xl font-semibold mb-1">
                        {tool.name}
                      </h2>
                      <p className="text-sm text-gray-300 mb-3 line-clamp-3">
                        {tool.description}
                      </p>
                      <Link
                        href={tool.slug}
                        className="inline-block mt-2 text-xs sm:text-sm font-medium bg-[#9901BF] hover:bg-purple-800 text-white px-4 py-2 rounded-lg transition"
                      >
                        View Tool
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </section>
            <FAQ />
          </div>
        </main>
      </div>
    </>
  );
}
