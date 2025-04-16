"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Function to toggle the sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Check scroll position and update `isScrolled`
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <h1 className="flex text-center text-xs md:text-sm justify-center items-center py-6 border-b border-gray-700 text-white z-50">
        🏆 Ranking #1 in AI Tools – Submit Your Tool Today! 🚀
      </h1>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? " shadow-md backdrop-blur-md"
            : "bg-transparent text-white"
        }`}
      >
        {/* Main Navbar Content */}
        {!isSidebarOpen && (
          <div className="flex items-center justify-between px-6 md:px-5 xl:px-28 py-4">
            {/* Logo */}
            <div className="text-3xl font-black">
              <Link href="/">#aitoolcity</Link>
            </div>

            {/* Navigation Links for Desktop */}
            <ul className="hidden md:flex space-x-8">
              <li>
                <Link className="hover:text-gray-400" href="/">
                  Home
                </Link>
              </li>
              <li>
                <Link className="hover:text-gray-400" href="/about">
                  About
                </Link>
              </li>
              <li>
                <Link className="hover:text-gray-400" href="/services">
                  Services
                </Link>
              </li>
              <li>
                <Link className="hover:text-gray-400" href="/blog">
                  Blog
                </Link>
              </li>
              <li>
                <Link className="hover:text-gray-400" href="/contact">
                  Contact
                </Link>
              </li>
            </ul>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                className="text-2xl focus:outline-none"
                onClick={toggleSidebar}
              >
                <FiMenu size={32} />
              </button>
            </div>

            {/* Button */}
            <div className="hidden md:block">
              <Link href="/admin" className="px-4 py-2 bg-[#9901BF] text-white rounded-full">
                Submit a tool
              </Link>
            </div>
          </div>
        )}

        {/* Overlay Background when Sidebar is Open */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-40"
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Sidebar */}
        {isSidebarOpen && (
          <div className="fixed top-0 left-0 w-64 h-full border bg-[#341166] border-[#4f075c99] text-white z-50">
            <button
              className="absolute top-4 right-4 text-2xl focus:outline-none"
              onClick={toggleSidebar}
            >
              <FiX className="mt-2" />
            </button>
            <div className="mt-5 space-y-6 px-6 text-3xl font-black">
              <Link href="/">#aitoolcity</Link>
            </div>
            <ul className="mt-5 space-y-6 px-6">
              <li>
                <Link
                  className="block hover:text-gray-400"
                  href="/"
                  onClick={toggleSidebar}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  className="block hover:text-gray-400"
                  href="/about"
                  onClick={toggleSidebar}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  className="block hover:text-gray-400"
                  href="/services"
                  onClick={toggleSidebar}
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  className="block hover:text-gray-400"
                  href="/blog"
                  onClick={toggleSidebar}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  className="block hover:text-gray-400"
                  href="/contact"
                  onClick={toggleSidebar}
                >
                  Contact
                </Link>
              </li>
              <li>
                <button className="w-full mt-6 px-4 py-2 bg-[#9901BF] text-white rounded-lg">
                  Submit a tool
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
