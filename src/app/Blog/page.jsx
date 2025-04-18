// app/page.jsx
import React from "react";
import Link from "next/link";
import Navbar from "../Components/Navbar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

export default async function Home() {
  const querySnapshot = await getDocs(collection(db, "tools"));
  const tools = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return (
    <main className="min-h-screen  text-white">
      <Navbar />

      {/* Banner Image */}
      <section className="w-full">
        <img
          src="https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y292ZXJ8ZW58MHx8MHx8fDA%3D" // Replace with your actual image path in /public
          alt="Banner"
          className="w-full max-h-80 object-cover"
        />
      </section>

      <section className="p-8">
        <h2 className="text-3xl font-bold text-purple-400 mb-2">
          Wamiq's Amazing Site
        </h2>
        <p className="mb-4 max-w-xl">
          I’m not doing it anymore I’m just going on the road and then we are in
          a rush and I have a few things that can do for the kids to be there
          and
        </p>
        <div className="flex gap-4 mb-4">
          <button className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">
            Visit Website
          </button>
          <button className="bg-gray-700 px-4 py-2 rounded">Share</button>
          <button className="bg-gray-700 px-4 py-2 rounded">Save</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4  p-4 rounded-lg border border-gray-700">
          <div className="space-y-1">
            <h4 className="text-lg font-semibold">Key Features</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>AI-powered assistance</li>
              <li>Cross-platform compatibility</li>
              <li>Extensive documentation</li>
              <li>Intuitive user interface</li>
              <li>Regular updates</li>
              <li>Community support</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="p-8">
        <h3 className="text-2xl font-semibold border-b border-gray-600 pb-2 mb-4">
          Gallery
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="border-2 h-32 rounded">1</div>
          <div className="border-2 h-32 rounded">2</div>
          <div className="border-2 h-32 rounded">3</div>
        </div>
        <div className="mt-4 text-sm text-gray-400">
          Wamiq’s Amazing Site features a clean, intuitive interface designed
          for both beginners and professionals...
        </div>
      </section>

      <section className="bg-purple-800 p-8 rounded-lg mx-8 my-4 text-center">
        <h3 className="text-xl font-bold mb-2">
          Ready to try Wamiq’s Amazing Site?
        </h3>
        <p className="mb-4">
          Join thousands of users who have already enhanced their workflow with
          Wamiq’s Amazing Site.
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-white text-purple-800 px-4 py-2 rounded">
            Get Started
          </button>
          <button className="bg-purple-600 px-4 py-2 rounded text-white">
            Try Demo
          </button>
        </div>
      </section>

      <section className="p-8">
        <h3 className="text-xl font-semibold mb-2">
          💗 Related Tools You Might Like
        </h3>
        <div className="bg-gray-700 p-4 rounded-lg">
          <h4 className="font-bold text-white">Wameq Hussain</h4>
          <p className="text-sm mt-2">
            Hi I don’t want to use whoop, please refund my money
          </p>
          <Link href="#" className="text-blue-400 text-sm mt-2 inline-block">
            Learn more
          </Link>
        </div>
      </section>

      <footer className="text-center text-sm text-gray-500 py-6 border-t border-gray-700">
        <p>&copy; 2025 Alpha. Built with ❤️ by Wameq.</p>
        <div className="mt-2">
          <Link href="/privacy" className="hover:underline mr-4">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms of Service
          </Link>
        </div>
      </footer>
    </main>
  );
}
