"use client";
// Formulaire de réponse intégré, gère son propre état

// Formulaire de réponse intégré, gère son propre état

// Nouveau composant pour chaque message reçu avec gestion du formulaire de réponse
function MessageCardWithReply({ msg, user, updateIsRead, deleteMessage, refreshMessages }: { msg: any, user: any, updateIsRead: any, deleteMessage: any, refreshMessages?: () => void }) {
  const [showReply, setShowReply] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const isAdmin = user && user.role === 'admin';
  const handleUpdateIsRead = async () => {
    setLoading(true);
    await updateIsRead(msg.id, !msg.is_read);
    if (refreshMessages) await refreshMessages();
    setLoading(false);
  };
  const handleDelete = async () => {
    await deleteMessage(msg.id, "received");
    refreshMessages && refreshMessages();
  };
  return (
    <Card className={`p-6 border-l-4 ${msg.is_read ? 'border-gray-300' : 'border-electric-blue'} bg-white/90`}>
      <div className="flex justify-between items-center mb-2">
        <div className="font-semibold text-anthracite">{msg.subject}</div>
        <div className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleString()}</div>
      </div>
      <div className="mb-2 text-sm text-gray-700 whitespace-pre-line">{msg.content}</div>
      <div className="flex flex-wrap gap-2 items-center mt-2">
        <span className={`text-xs font-semibold ${msg.is_read ? 'text-gray-400' : 'text-green-600'}`}>{msg.is_read ? 'Lu' : 'Non lu'}</span>
        {user && msg.receiver_id === user.id && (
          <Button size="sm" variant="outline" onClick={handleUpdateIsRead} disabled={loading}>
            {msg.is_read ? 'Marquer comme non lu' : 'Marquer comme lu'}
          </Button>
        )}
        <Button size="sm" variant="outline" className="!text-red-600 border-red-300 hover:bg-red-50" onClick={handleDelete}>Supprimer</Button>
        {isAdmin && (
          <Button size="sm" variant="secondary" onClick={() => setShowReply((v) => !v)}>
            {showReply ? 'Annuler' : 'Répondre'}
          </Button>
        )}
      </div>
      {showReply && <ReplyForm user={user} msg={msg} onSuccess={() => { setShowReply(false); refreshMessages && refreshMessages(); }} />}
      <div className="text-xs text-gray-500 mt-2">Expéditeur: {msg.sender_id}</div>
    </Card>
  );
}
// Formulaire de réponse intégré, gère son propre état
const ReplyForm = ({ user, msg, onSuccess }: { user: any, msg: any, onSuccess?: () => void }) => {
  const [subject, setSubject] = React.useState('');
  const [content, setContent] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const handleReply = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.from('messages').insert([
        {
          sender_id: user.id,
          receiver_id: msg.sender_id,
          subject: subject || `Re: ${msg.subject}`,
          content: content,
        },
      ]);
      if (error) setError("Erreur lors de l'envoi de la réponse");
      else {
        setSuccess(true);
        setContent('');
        setSubject('');
        if (onSuccess) onSuccess();
      }
    } catch (e) {
      setError("Erreur inattendue");
    } finally {
      setLoading(false);
    }
  };
  if (success) return <div className="text-green-600 text-sm mt-2">Réponse envoyée !</div>;
  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="mb-2">
        <input
          type="text"
          className="w-full border px-3 py-2 rounded mb-2"
          placeholder="Sujet"
          value={subject}
          onChange={e => setSubject(e.target.value)}
        />
        <textarea
          className="w-full border px-3 py-2 rounded mb-2"
          placeholder="Votre réponse..."
          rows={3}
          value={content}
          onChange={e => setContent(e.target.value)}
        />
      </div>
      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
      <Button size="sm" loading={loading} onClick={handleReply}>
        Envoyer la réponse
      </Button>
    </div>
  );
};

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
      let profile = null;
      if (u) {
        const { data: prof } = await supabase
          .from('profiles')
          .select('id, role')
          .eq('id', u.id)
          .single();
        profile = prof;
      }
      setUser(profile);
      if (!profile) {
        setLoading(false);
        return;
      }
      const isAdmin = profile.role === 'admin';
      let rec = [], errRec, sentData = [], errSent;
      if (isAdmin) {
        // Messages reçus : tous les messages où receiver_id = admin.id ET sender_id != admin.id
        const recRes = await supabase
          .from("messages")
          .select("id, created_at, subject, content, sender_id, is_read, receiver_id")
          .eq("receiver_id", profile.id)
          .neq("sender_id", profile.id)
          .order("created_at", { ascending: false });
        rec = recRes.data || [];
        errRec = recRes.error;
        // Messages envoyés : tous les messages où sender_id = admin.id
        const sentRes = await supabase
          .from("messages")
          .select("id, created_at, subject, content, sender_id, is_read, receiver_id")
          .eq("sender_id", profile.id)
          .order("created_at", { ascending: false });
        sentData = sentRes.data || [];
        errSent = sentRes.error;
      } else {
        const res = await supabase
          .from("messages")
          .select("id, created_at, subject, content, sender_id, is_read, receiver_id")
          .eq("receiver_id", profile.id)
          .order("created_at", { ascending: false });
  rec = res.data || [];
        errRec = res.error;
        const sentRes = await supabase
          .from("messages")
          .select("id, created_at, subject, content, sender_id, is_read, receiver_id")
          .eq("sender_id", profile.id)
          .order("created_at", { ascending: false });
  sentData = sentRes.data || [];
        errSent = sentRes.error;
      }
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
    const { error } = await supabase.from("messages").update({ is_read: isRead }).eq("id", id);
    if (!error) {
      // Refetch la liste pour garantir la synchro
      const u = user;
      if (u) {
        const isAdmin = u.role === 'admin';
        let rec = [], errRec;
        if (isAdmin) {
          const recRes = await supabase
            .from("messages")
            .select("id, created_at, subject, content, sender_id, is_read, receiver_id")
            .eq("receiver_id", u.id)
            .order("created_at", { ascending: false });
          rec = recRes.data || [];
          errRec = recRes.error;
        } else {
          const res = await supabase
            .from("messages")
            .select("id, created_at, subject, content, sender_id, is_read, receiver_id")
            .eq("receiver_id", u.id)
            .order("created_at", { ascending: false });
          rec = res.data || [];
          errRec = res.error;
        }
        if (!errRec) setReceived(rec);
      }
    }
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
                {received.map((msg) => (
                  <MessageCardWithReply
                    key={msg.id}
                    msg={msg}
                    user={user}
                    updateIsRead={updateIsRead}
                    deleteMessage={deleteMessage}
                    refreshMessages={() => {
                      // Recharge les messages reçus après une réponse
                      if (user) {
                        const isAdmin = user?.user_metadata?.role === 'admin' || user?.role === 'admin';
                        let rec, errRec;
                        (async () => {
                          if (isAdmin) {
                            const res = await supabase
                              .from("messages")
                              .select("id, created_at, subject, content, sender_id, is_read, receiver_id")
                              .order("created_at", { ascending: false });
                            rec = res.data;
                            errRec = res.error;
                          } else {
                            const res = await supabase
                              .from("messages")
                              .select("id, created_at, subject, content, sender_id, is_read, receiver_id")
                              .eq("receiver_id", user.id)
                              .order("created_at", { ascending: false });
                            rec = res.data;
                            errRec = res.error;
                          }
                          if (!errRec) setReceived(rec || []);
                        })();
                      }
                    }}
                  />
                ))}
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