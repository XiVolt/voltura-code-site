"use client";
import React from "react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-anthracite text-white px-6 py-4 flex gap-6 items-center">
        <Link href="/dashboard/admin/users" className="hover:underline">Utilisateurs</Link>
        <Link href="/dashboard/admin/messages" className="hover:underline">Messages</Link>
        <Link href="/dashboard/admin/editor" className="hover:underline text-volt-yellow">✏️ Éditeur de Contenu</Link>
        <Link href="/dashboard" className="ml-auto hover:underline">Retour dashboard</Link>
      </nav>
      <main className="max-w-4xl mx-auto py-10 px-4">{children}</main>
    </div>
  );
}
