"use client";

import React from "react";
import ClientLayout from "@/components/ClientLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { CheckCircle } from "lucide-react";

const ConfirmEmailPage = () => (
  <ClientLayout>
    <section className="min-h-screen flex items-center justify-center bg-light-gray px-4">
      <Card className="max-w-md w-full text-center py-16">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-anthracite mb-4">Email confirmé !</h2>
        <p className="text-gray-600 mb-6">
          Votre adresse email a bien été confirmée.<br />
          Vous pouvez maintenant vous connecter à votre espace Voltura Code.
        </p>
        <a href="/auth/login">
          <Button className="w-full">Se connecter</Button>
        </a>
      </Card>
    </section>
  </ClientLayout>
);

export default ConfirmEmailPage;
