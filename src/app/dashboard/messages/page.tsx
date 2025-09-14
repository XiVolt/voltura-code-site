"use client";

import React, { useEffect, useState } from "react";
import { supabase, getCurrentUser } from "@/lib/supabase";
import ClientLayout from "@/components/ClientLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const extractEmail = (content: string) => {
  const match = content.match(/Email:\s*([^\n\s]+)/i);
  return match ? match[1] : null;
};

const MessagesPage = () => {
  const [received, setReceived] = useState<any[]>([]);
  const [sent, setSent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const u = await getCurrentUser();
      setUser(u);
      if (!u) {
        setLoading(false);
        return;
      }
      // Détection admin (user.user_metadata.role ou user.role)
      const isAdmin = u?.user_metadata?.role === 'admin' || u?.role === 'admin';
      let rec, errRec;
      if (isAdmin) {
        // Admin : voir tous les messages reçus
        const res = await supabase
          .from("messages")
          .select("id, created_at, subject, content, sender_id, is_read, receiver_id")
          .order("created_at", { ascending: false });
        rec = res.data;
        errRec = res.error;
      } else {
        // Utilisateur : voir seulement ses messages reçus
        const res = await supabase
          .from("messages")
          .select("id, created_at, subject, content, sender_id, is_read, receiver_id")
          .eq("receiver_id", u.id)
          .order("created_at", { ascending: false });
        rec = res.data;
        errRec = res.error;
      }
      // Messages envoyés
      const { data: sentData, error: errSent } = await supabase
        .from("messages")
        .select("id, created_at, subject, content, sender_id, is_read, receiver_id")
        .eq("sender_id", u.id)
        .order("created_at", { ascending: false });
      if (errRec || errSent) setError("Erreur lors du chargement des messages");
      else {
        setReceived(rec || []);
        setSent(sentData || []);
      }
      setLoading(false);
    };
    fetchAll();
  }, []);

  const updateIsRead = async (id: string, isRead: boolean) => {
    await supabase.from("messages").update({ is_read: isRead }).eq("id", id);
    setReceived((msgs: any[]) => msgs.map((m: any) => m.id === id ? { ...m, is_read: isRead } : m));
  };

  const deleteMessage = async (id: string, type: "received" | "sent") => {
    await supabase.from("messages").delete().eq("id", id);
    if (type === "received") setReceived((msgs: any[]) => msgs.filter((m: any) => m.id !== id));
    else setSent((msgs: any[]) => msgs.filter((m: any) => m.id !== id));
  };

  return (
    <ClientLayout>
      <section className="py-16 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-anthracite">Messagerie</h1>
        {loading ? (
          <div>Chargement...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4 text-anthracite">Messages reçus</h2>
            {received.length === 0 ? <div>Aucun message reçu.</div> : (
              <div className="space-y-6 mb-10">
                {received.map((msg) => {
                  const email = extractEmail(msg.content);
                  return (
                    <Card key={msg.id} className={`p-6 border-l-4 ${msg.is_read ? 'border-gray-300' : 'border-electric-blue'} bg-white/90`}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-semibold text-anthracite">{msg.subject}</div>
                        <div className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleString()}</div>
                      </div>
                      <div className="mb-2 text-sm text-gray-700 whitespace-pre-line">{msg.content}</div>
                      <div className="flex flex-wrap gap-2 items-center mt-2">
                        <span className={`text-xs font-semibold ${msg.is_read ? 'text-gray-400' : 'text-green-600'}`}>{msg.is_read ? 'Lu' : 'Non lu'}</span>
                        <Button size="sm" variant="outline" onClick={() => updateIsRead(msg.id, !msg.is_read)}>
                          {msg.is_read ? 'Marquer comme non lu' : 'Marquer comme lu'}
                        </Button>
                        <Button size="sm" variant="outline" className="!text-red-600 border-red-300 hover:bg-red-50" onClick={() => deleteMessage(msg.id, "received")}>Supprimer</Button>
                        {email && (
                          <a href={`mailto:${email}?subject=Réponse à votre message Voltura Code`}>
                            <Button size="sm" variant="secondary">Répondre</Button>
                          </a>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">Expéditeur: {msg.sender_id}</div>
                    </Card>
                  );
                })}
              </div>
            )}
            <h2 className="text-xl font-bold mb-4 text-anthracite">Messages envoyés</h2>
            {sent.length === 0 ? <div>Aucun message envoyé.</div> : (
              <div className="space-y-6">
                {sent.map((msg) => (
                  <Card key={msg.id} className="p-6 border-l-4 border-gray-200 bg-white/90">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-semibold text-anthracite">{msg.subject}</div>
                      <div className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleString()}</div>
                    </div>
                    <div className="mb-2 text-sm text-gray-700 whitespace-pre-line">{msg.content}</div>
                    <div className="flex flex-wrap gap-2 items-center mt-2">
                      <Button size="sm" variant="outline" className="!text-red-600 border-red-300 hover:bg-red-50" onClick={() => deleteMessage(msg.id, "sent")}>Supprimer</Button>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">Destinataire: {msg.receiver_id}</div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </ClientLayout>
  );
};

export default MessagesPage;