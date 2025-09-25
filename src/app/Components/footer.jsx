"use client";
import { FaFacebookF, FaInstagram, FaPinterestP, FaTelegramPlane, FaRedditAlien, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className=" text-white">
      <div className=" max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h2 className="text-3xl font-black mb-3">#aitoolcity</h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Discover the best AI tools and resources. <br />
            Stay ahead with cutting-edge technology and innovative solutions.
          </p>
          <div className="flex space-x-4 text-xl">
            <a href="#" className="hover:text-pink-400"><FaFacebookF /></a>
            <a href="#" className="hover:text-pink-400"><FaInstagram /></a>
            <a href="#" className="hover:text-pink-400"><FaPinterestP /></a>
            <a href="#" className="hover:text-pink-400"><FaTelegramPlane /></a>
            <a href="#" className="hover:text-pink-400"><FaTiktok /></a>
            <a href="#" className="hover:text-pink-400"><FaRedditAlien /></a>
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-black mb-4 relative">
            Useful Links
            <span className="absolute left-0 -bottom-1 w-40 h-1 bg-[#9901BF]"></span>
          </h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><a href="#" className="hover:text-white">Home</a></li>
            <li><a href="#" className="hover:text-white">AI Tools Category</a></li>
            <li><a href="#" className="hover:text-white">Blogs</a></li>
            <li><a href="#" className="hover:text-white">Submit a Tool</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-2xl font-black mb-4 relative ">
            Company
            <span className="absolute left-0 -bottom-1 w-32 h-1 bg-[#9901BF]"></span>
          </h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><a href="#" className="hover:text-white">Hire Us</a></li>
            <li><a href="#" className="hover:text-white">Contact Us</a></li>
            <li><a href="#" className="hover:text-white">Sitemap</a></li>
            <li><a href="#" className="hover:text-white">Blog Sitemap</a></li>
            <li><a href="#" className="hover:text-white">Search Keyword Sitemap</a></li>
            <li><a href="#" className="hover:text-white">Terms & Condition</a></li>
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-2xl font-black mb-4 relative">
            Contact
            <span className="absolute left-0 -bottom-1 w-28 h-1 bg-[#9901BF]"></span>
          </h3>
          <p className="text-gray-300 text-sm">hello@aitoolcity.com</p>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-gray-400 py-8">
        <p className="text-center text-sm ">
          Copyright AI Tool City © {new Date().getFullYear()} All Rights Reserved by AI Tool City
        </p>
      </div>
    </footer>
  );
}
