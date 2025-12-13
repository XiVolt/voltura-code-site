"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/lib/supabase";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
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
    fetchMessages();
  };

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("messages")
      .select(`
        id, 
        subject, 
        content, 
        sender_id, 
        recipient_id, 
        is_read, 
        created_at,
        sender:profiles!sender_id(email, full_name),
        recipient:profiles!recipient_id(email, full_name)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error('Erreur messages:', error);
      setError("Erreur lors du chargement des messages");
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  };


  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce message ?')) return;
    await supabase.from("messages").delete().eq("id", id);
    fetchMessages();
  };

  const handleRead = async (id: string, isRead: boolean) => {
    await supabase.from("messages").update({ is_read: !isRead }).eq("id", id);
    fetchMessages();
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
      <h1 className="text-2xl font-bold mb-6">Gestion des messages</h1>
      <div className="bg-white rounded-lg shadow p-6">
        {error ? <p className="text-red-600">{error}</p> : messages.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Aucun message</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-2">Sujet</th>
                <th className="p-2">Expéditeur</th>
                <th className="p-2">Destinataire</th>
                <th className="p-2">Lu</th>
                <th className="p-2">Reçu le</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map(m => (
                <tr key={m.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{m.subject}</td>
                  <td className="p-2">{(m.sender as any)?.email || 'Anonyme'}</td>
                  <td className="p-2">{(m.recipient as any)?.email || 'N/A'}</td>
                  <td className="p-2">
                    <button
                      className={m.is_read ? "text-green-600" : "text-gray-400"}
                      onClick={() => handleRead(m.id, m.is_read)}
                    >
                      {m.is_read ? "Lu" : "Non lu"}
                    </button>
                  </td>
                  <td className="p-2">{new Date(m.created_at).toLocaleDateString('fr-FR')}</td>
                  <td className="p-2">
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
