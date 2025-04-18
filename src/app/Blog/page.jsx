"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { db } from "../lib/firebase";
import { collection, getDocs, query, orderBy, where, limit } from "firebase/firestore";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState(null);
  const [allTags, setAllTags] = useState([]);
  const [featuredPost, setFeaturedPost] = useState(null);
  const particlesRef = useRef(null);

  // Particle animation effect (similar to home page)
  useEffect(() => {
    const createParticles = () => {
      const canvas = particlesRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const particles = [];
      const particleCount = 50;
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 1,
          color: `rgba(${Math.floor(Math.random() * 100) + 150}, ${Math.floor(Math.random() * 50) + 100}, 255, ${Math.random() * 0.2 + 0.1})`,
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25
        });
      }
      
      function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.fill();
          
          particle.x += particle.speedX;
          particle.y += particle.speedY;
          
          if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
          if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
        });
      }
      
      animate();
      
      const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    };
    
    createParticles();
  }, []);

  useEffect(() => {
    async function fetchPosts() {
      try {
        // Only fetch published posts
        // Using a simpler query to avoid needing a composite index
        // We'll sort the posts after fetching them
        const postsQuery = query(
          collection(db, "blog"),
          where("published", "==", true)
        );
        
        const querySnapshot = await getDocs(postsQuery);
        let postsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        // Sort posts by createdAt in descending order (newest first)
        postsList.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
          return dateB - dateA; // Descending order
        });
        
        // Set the first post as featured if it has a cover image
        if (postsList.length > 0) {
          const postWithImage = postsList.find(post => post.coverImage);
          if (postWithImage) {
            setFeaturedPost(postWithImage);
            // Remove the featured post from the regular posts list
            setPosts(postsList.filter(post => post.id !== postWithImage.id));
          } else {
            setFeaturedPost(postsList[0]);
            setPosts(postsList.slice(1));
          }
        } else {
          setPosts(postsList);
        }
        
        // Extract all unique tags
        const tags = new Set();
        postsList.forEach(post => {
          if (post.tags && Array.isArray(post.tags)) {
            post.tags.forEach(tag => tags.add(tag));
          }
        });
        
        setAllTags(Array.from(tags));
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPosts();
  }, []);

  // Filter posts by tag if a tag is selected
  const filteredPosts = selectedTag
    ? (featuredPost ? [featuredPost, ...posts] : posts).filter(post => post.tags && post.tags.includes(selectedTag))
    : posts;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0a0f2c] via-[#10172f] to-[#1e293b] text-white overflow-hidden">
      {/* Particle background */}
      <canvas 
        ref={particlesRef} 
        className="fixed inset-0 w-full h-full pointer-events-none opacity-60 z-0"
      />

      {/* Header */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full bg-[#0b1120]/90 backdrop-blur-md border-b border-white/10 shadow-xl sticky top-0 z-50"
      >
        <div className="max-w-screen-xl mx-auto px-4 py-5 flex items-center justify-between">
          <motion.h1 
            className="text-3xl font-extrabold text-white tracking-tight flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            Alpha<span className="text-purple-500">.</span>
          </motion.h1>
          <div className="flex gap-6 text-sm font-medium items-center">
            <Link href="/" className="text-gray-300 hover:text-white transition-all hover:scale-105">
              Home
            </Link>
            <Link href="/blog" className="text-white font-semibold hover:text-purple-300 transition-all hover:scale-105">
              Blog
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/admin"
                className="text-white bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 rounded-xl transition font-semibold shadow-lg hover:shadow-blue-500/20"
              >
                Admin
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      <main className="flex-1 px-6 py-12 relative z-10">
        <div className="max-w-screen-xl mx-auto">
          <motion.header 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-16 text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-5xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-purple-400 via-pink-400 to-blue-500 text-transparent bg-clip-text">
                Alpha Blog
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-6 rounded-full"></div>
              <p className="text-lg text-gray-300 mt-6 max-w-2xl mx-auto leading-relaxed">
                Insights, tutorials, and updates about AI tools and technology
              </p>
            </motion.div>
          </motion.header>

          {/* Tags filter */}
          {allTags.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-12 flex justify-center"
            >
              <div className="flex flex-wrap gap-2 items-center justify-center">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedTag === null
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                      : "bg-gray-800/80 text-white hover:bg-gray-700/80"
                  }`}
                >
                  All Posts
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedTag === tag
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                        : "bg-gray-800/80 text-white hover:bg-gray-700/80"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {featuredPost && !selectedTag && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mb-16"
                >
                  <h2 className="text-2xl font-bold text-white mb-6 inline-block border-b-2 border-purple-500 pb-2">
                    Featured Post
                  </h2>
                  <Link href={`/blog/${featuredPost.slug}`}>
                    <div className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl hover:shadow-2xl transition duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-70 transition-all duration-300"></div>
                      <div className="grid md:grid-cols-2 gap-6 p-6 relative">
                        {featuredPost.coverImage && (
                          <div className="h-64 md:h-auto overflow-hidden rounded-xl">
                            <img
                              src={featuredPost.coverImage}
                              alt={featuredPost.title}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                            />
                          </div>
                        )}
                        <div className="flex flex-col justify-center">
                          <div className="flex items-center text-sm text-gray-400 mb-3">
                            <span>
                              {featuredPost.createdAt?.toDate
                                ? new Date(featuredPost.createdAt.toDate()).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })
                                : "No date"}
                            </span>
                          </div>
                          <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                            {featuredPost.title}
                          </h3>
                          <p className="text-gray-300 mb-6 line-clamp-3">
                            {featuredPost.summary}
                          </p>
                          {featuredPost.tags && featuredPost.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                              {featuredPost.tags.map((tag, i) => (
                                <span key={i} className="bg-purple-900/50 text-purple-300 text-xs px-3 py-1 rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="inline-block">
                            <span className="text-white bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-2.5 rounded-lg font-medium group-hover:shadow-lg transition-all duration-300 inline-flex items-center gap-2">
                              Read Article
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Regular Posts */}
              <div className="mb-10">
                {selectedTag && (
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Posts tagged with "{selectedTag}"
                  </h2>
                )}
                {!selectedTag && posts.length > 0 && (
                  <h2 className="text-2xl font-bold text-white mb-6 inline-block border-b-2 border-purple-500 pb-2">
                    Latest Articles
                  </h2>
                )}

                {filteredPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPosts.map((post, index) => (
                      <motion.article 
                        key={post.id} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                        className="group relative"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-70 transition-all duration-300"></div>
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300 h-full flex flex-col relative z-10">
                          <Link href={`/blog/${post.slug}`}>
                            {post.coverImage && (
                              <div className="h-48 overflow-hidden">
                                <img
                                  src={post.coverImage}
                                  alt={post.title}
                                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                                />
                              </div>
                            )}
                            <div className="p-6 flex-grow flex flex-col">
                              <div className="flex items-center text-xs text-gray-400 mb-2">
                                <span>
                                  {post.createdAt?.toDate
                                    ? new Date(post.createdAt.toDate()).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      })
                                    : "No date"}
                                </span>
                              </div>
                              <h2 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                                {post.title}
                              </h2>
                              <p className="text-gray-300 mb-4 line-clamp-3 flex-grow">
                                {post.summary}
                              </p>
                              {post.tags && post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-auto">
                                  {post.tags.map((tag, i) => (
                                    <span key={i} className="bg-purple-900/50 text-purple-300 text-xs px-2 py-1 rounded-full">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </Link>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                    {selectedTag ? (
                      <p className="text-gray-300 text-lg">No posts found with the tag "{selectedTag}".</p>
                    ) : (
                      <p className="text-gray-300 text-lg">No blog posts available yet. Check back soon!</p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#0b1120] text-gray-400 text-sm text-center py-8 border-t border-white/10 relative z-10">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex items-center justify-center gap-1"
        >
          © {new Date().getFullYear()} Alpha. Built with <span className="text-red-500 animate-pulse">❤️</span> by Wameq.
        </motion.p>
      </footer>
    </div>
  );
}