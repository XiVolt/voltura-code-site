"use client";
import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/lib/supabase";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("profiles").select("id, email, full_name, role, created_at");
    if (error) setError("Erreur lors du chargement des utilisateurs");
    else setUsers(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id: string) => {
    await supabase.from("profiles").delete().eq("id", id);
    fetchUsers();
  };

  const handleRole = async (id: string, role: "user" | "admin") => {
    await supabase.from("profiles").update({ role }).eq("id", id);
    fetchUsers();
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Gestion des utilisateurs</h1>
      <div className="bg-white rounded-lg shadow p-6">
        {loading ? <p>Chargement...</p> : error ? <p className="text-red-600">{error}</p> : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th>Email</th>
                <th>Nom</th>
                <th>Rôle</th>
                <th>Créé le</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td>{u.email}</td>
                  <td>{u.full_name || <span className="text-gray-400">-</span>}</td>
                  <td>
                    <select value={u.role} onChange={e => handleRole(u.id, e.target.value as "user" | "admin") } className="border rounded px-2 py-1">
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td>
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
