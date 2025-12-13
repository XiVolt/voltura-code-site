"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ClientLayout from "@/components/ClientLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Mail, Send, Trash2 } from "lucide-react";

function MessageCard({ msg, userId, isAdmin, refreshMessages }: {
  msg: any,
  userId: string,
  isAdmin: boolean,
  refreshMessages: () => void
}) {
  const [showReply, setShowReply] = useState(false);
  const [loading, setLoading] = useState(false);
  const [replySubject, setReplySubject] = useState(`Re: ${msg.subject}`);
  const [replyContent, setReplyContent] = useState('');

  const handleUpdateIsRead = async () => {
    setLoading(true);
    await supabase
      .from("messages")
      .update({ is_read: !msg.is_read })
      .eq("id", msg.id);
    setLoading(false);
    refreshMessages();
  };

  const handleDelete = async () => {
    if (!confirm('Supprimer ce message ?')) return;
    await supabase.from("messages").delete().eq("id", msg.id);
    refreshMessages();
  };

  const handleSendReply = async () => {
    if (!replyContent.trim()) return;

    setLoading(true);
    const { error } = await supabase.from('messages').insert([{
      sender_id: userId,
      recipient_id: msg.sender_id,
      subject: replySubject,
      content: replyContent,
      is_read: false
    }]);

    if (error) {
      alert('Erreur lors de l\'envoi');
    } else {
      setReplyContent('');
      setShowReply(false);
      refreshMessages();
    }
    setLoading(false);
  };

  const senderEmail = (msg.sender as any)?.email || 'Anonyme';
  const senderName = (msg.sender as any)?.full_name || senderEmail;

  return (
    <Card className={`p-6 border-l-4 ${msg.is_read ? 'border-gray-300' : 'border-electric-blue'}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg text-anthracite">{msg.subject}</h3>
          <p className="text-sm text-gray-600 mt-1">De : {senderName}</p>
        </div>
        <div className="text-xs text-gray-500">
          {new Date(msg.created_at).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>

      <div className="mb-4 text-sm text-gray-700 whitespace-pre-line bg-gray-50 p-4 rounded">
        {msg.content}
      </div>

      <div className="flex flex-wrap gap-2">
        <span className={`text-xs font-semibold px-2 py-1 rounded ${msg.is_read ? 'bg-gray-200' : 'bg-green-100 text-green-700'}`}>
          {msg.is_read ? 'Lu' : 'Non lu'}
        </span>

        <Button size="sm" variant="outline" onClick={handleUpdateIsRead} disabled={loading}>
          {msg.is_read ? 'Marquer comme non lu' : 'Marquer comme lu'}
        </Button>

        {isAdmin && msg.sender_id && (
          <Button size="sm" variant="secondary" onClick={() => setShowReply(!showReply)}>
            <Send className="w-4 h-4 mr-1" />
            {showReply ? 'Annuler' : 'Répondre'}
          </Button>
        )}

        <Button size="sm" variant="outline" className="!text-red-600" onClick={handleDelete}>
          <Trash2 className="w-4 h-4 mr-1" />
          Supprimer
        </Button>
      </div>

      {showReply && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Répondre à {senderName}</h4>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded mb-2"
            placeholder="Sujet"
            value={replySubject}
            onChange={e => setReplySubject(e.target.value)}
          />
          <textarea
            className="w-full border px-3 py-2 rounded mb-2"
            placeholder="Votre réponse..."
            rows={4}
            value={replyContent}
            onChange={e => setReplyContent(e.target.value)}
          />
          <Button size="sm" loading={loading} onClick={handleSendReply}>
            Envoyer
          </Button>
        </div>
      )}
    </Card>
  );
}

export default function MessagesPage() {
  const [received, setReceived] = useState<any[]>([]);
  const [sent, setSent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  const fetchMessages = async () => {
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/auth/login');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('id', session.user.id)
      .single();

    if (!profile) {
      setLoading(false);
      return;
    }

    setUserId(profile.id);
    setIsAdmin(profile.role === 'admin');

    // Messages reçus
    const { data: recData } = await supabase
      .from("messages")
      .select(`
        *,
        sender:profiles!sender_id(email, full_name)
      `)
      .eq("recipient_id", profile.id)
      .order("created_at", { ascending: false });

    // Messages envoyés
    const { data: sentData } = await supabase
      .from("messages")
      .select(`
        *,
        recipient:profiles!recipient_id(email, full_name)
      `)
      .eq("sender_id", profile.id)
      .order("created_at", { ascending: false });

    console.log('Messages reçus:', recData);
    console.log('Messages envoyés:', sentData);

    setReceived(recData || []);
    setSent(sentData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-blue"></div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-anthracite mb-8">Messages</h1>

          <div className="space-y-8">
            {/* Messages reçus */}
            <div>
              <h2 className="text-2xl font-bold text-anthracite mb-4 flex items-center gap-2">
                <Mail className="w-6 h-6" />
                Messages reçus ({received.length})
              </h2>

              {received.length === 0 ? (
                <Card className="p-8 text-center text-gray-500">
                  Aucun message reçu
                </Card>
              ) : (
                <div className="space-y-4">
                  {received.map(msg => (
                    <MessageCard
                      key={msg.id}
                      msg={msg}
                      userId={userId!}
                      isAdmin={isAdmin}
                      refreshMessages={fetchMessages}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Messages envoyés */}
            <div>
              <h2 className="text-2xl font-bold text-anthracite mb-4 flex items-center gap-2">
                <Send className="w-6 h-6" />
                Messages envoyés ({sent.length})
              </h2>

              {sent.length === 0 ? (
                <Card className="p-8 text-center text-gray-500">
                  Aucun message envoyé
                </Card>
              ) : (
                <div className="space-y-4">
                  {sent.map(msg => {
                    const recipientEmail = (msg.recipient as any)?.email || 'N/A';
                    const recipientName = (msg.recipient as any)?.full_name || recipientEmail;

                    return (
                      <Card key={msg.id} className="p-6 border-l-4 border-blue-300">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{msg.subject}</h3>
                            <p className="text-sm text-gray-600">À : {recipientName}</p>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(msg.created_at).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-line">{msg.content}</p>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}

