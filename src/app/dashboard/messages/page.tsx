"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ClientLayout from "@/components/ClientLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const AdminMessagesPage = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("messages")
        .select("id, created_at, subject, content, sender_id")
        .order("created_at", { ascending: false });
      if (error) setError("Erreur lors du chargement des messages");
      else setMessages(data || []);
      setLoading(false);
    };
    fetchMessages();
  }, []);

  return (
    <ClientLayout>
      <section className="py-16 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-anthracite">Messages reçus</h1>
        {loading ? (
          <div>Chargement...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : messages.length === 0 ? (
          <div>Aucun message reçu pour le moment.</div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg) => (
              <Card key={msg.id} className="p-6 border-l-4 border-electric-blue bg-white/90">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-semibold text-anthracite">{msg.subject}</div>
                  <div className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleString()}</div>
                </div>
                <div className="mb-2 text-sm text-gray-700 whitespace-pre-line">{msg.content}</div>
                <div className="text-xs text-gray-500">Expéditeur: {msg.sender_id}</div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </ClientLayout>
  );
};

export default AdminMessagesPage;
