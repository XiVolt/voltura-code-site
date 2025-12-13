"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/lib/supabase";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  const checkAuthAndFetch = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/auth/login');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    setAuthChecked(true);
    fetchUsers();
  };

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, role, created_at")
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur users:', error);
      setError("Erreur lors du chargement des utilisateurs");
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  };


  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    await supabase.from("profiles").delete().eq("id", id);
    fetchUsers();
  };

  const handleRole = async (id: string, role: "user" | "admin") => {
    await supabase.from("profiles").update({ role }).eq("id", id);
    fetchUsers();
  };

  if (!authChecked || loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-blue"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Gestion des utilisateurs</h1>
      <div className="bg-white rounded-lg shadow p-6">
        {error ? <p className="text-red-600">{error}</p> : users.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Aucun utilisateur</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-2">Email</th>
                <th className="p-2">Nom</th>
                <th className="p-2">Rôle</th>
                <th className="p-2">Créé le</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.full_name || <span className="text-gray-400">-</span>}</td>
                  <td className="p-2">
                    <select value={u.role} onChange={e => handleRole(u.id, e.target.value as "user" | "admin") } className="border rounded px-2 py-1">
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="p-2">{new Date(u.created_at).toLocaleDateString('fr-FR')}</td>
                  <td className="p-2">
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(u.id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
