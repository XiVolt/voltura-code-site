"use client";
import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/lib/supabase";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("messages").select("id, subject, content, sender_id, receiver_id, is_read, created_at").order("created_at", { ascending: false });
    if (error) setError("Erreur lors du chargement des messages");
    else setMessages(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleDelete = async (id: string) => {
    await supabase.from("messages").delete().eq("id", id);
    fetchMessages();
  };

  const handleRead = async (id: string, isRead: boolean) => {
    await supabase.from("messages").update({ is_read: isRead }).eq("id", id);
    fetchMessages();
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Gestion des messages</h1>
      <div className="bg-white rounded-lg shadow p-6">
        {loading ? <p>Chargement...</p> : error ? <p className="text-red-600">{error}</p> : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th>Sujet</th>
                <th>Expéditeur</th>
                <th>Destinataire</th>
                <th>Lu</th>
                <th>Reçu le</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map(m => (
                <tr key={m.id} className="border-b hover:bg-gray-50">
                  <td>{m.subject}</td>
                  <td>{m.sender_id}</td>
                  <td>{m.receiver_id}</td>
                  <td>
                    <button className={m.is_read ? "text-green-600" : "text-gray-400"} onClick={() => handleRead(m.id, !m.is_read)}>
                      {m.is_read ? "Lu" : "Non lu"}
                    </button>
                  </td>
                  <td>{new Date(m.created_at).toLocaleString()}</td>
                  <td>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(m.id)}>Supprimer</button>
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
