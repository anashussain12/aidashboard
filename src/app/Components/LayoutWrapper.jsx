"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./footer";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const hideLayout = pathname === "/login" || pathname.startsWith("/admin");

  return (
    <>
      {!hideLayout && <Navbar />}
      <main>{children}</main>
      {!hideLayout && <Footer />}
    </>
  );
}
