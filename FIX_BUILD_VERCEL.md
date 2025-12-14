# ✅ FIX - Erreur de Build Vercel (STRIPE_SECRET_KEY)

## 🔧 Problème Résolu

**Erreur lors du build Vercel** :
```
Error: STRIPE_SECRET_KEY manquante dans les variables d'environnement
```

### Cause

Lors du build, Next.js charge tous les fichiers pour vérifier la syntaxe. Le fichier `stripe.ts` lançait une erreur si `STRIPE_SECRET_KEY` n'était pas définie, ce qui bloquait le build avant même le déploiement.

### Solution

✅ **Initialisation conditionnelle de Stripe** :
- Stripe n'est initialisé que si `STRIPE_SECRET_KEY` est définie
- Pas d'erreur lors du build
- Erreur claire au runtime si la clé manque

---

## 🚀 Déploiement sur Vercel

### 1. Committez et Poussez

```powershell
git add .
git commit -m "Fix: Initialisation conditionnelle de Stripe pour le build Vercel"
git push origin main
```

### 2. Configurez les Variables d'Environnement sur Vercel

⚠️ **IMPORTANT** : Vous DEVEZ configurer ces variables dans Vercel :

1. **Allez sur** : https://vercel.com/dashboard
2. **Sélectionnez** votre projet
3. **Settings → Environment Variables**
4. **Ajoutez ces variables** :

| Variable | Valeur | Environnement |
|----------|--------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | https://xxx.supabase.co | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | eyJxxx... | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | eyJxxx... | Production |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | pk_test_xxx (ou pk_live_xxx) | Production, Preview, Development |
| `STRIPE_SECRET_KEY` | sk_test_xxx (ou sk_live_xxx) | Production |
| `STRIPE_WEBHOOK_SECRET` | whsec_xxx | Production |
| `NEXT_PUBLIC_SITE_URL` | https://votre-domaine.vercel.app | Production |

### 3. Redéployez

Après avoir ajouté les variables :
- Cliquez sur **Deployments**
- Cliquez sur **⋯** à côté du dernier déploiement
- **Redeploy**

OU attendez simplement que Vercel détecte votre nouveau commit et redéploie automatiquement.

---

## 🔧 Configuration du Webhook Stripe (Production)

Une fois déployé, configurez le webhook Stripe :

### 1. Créez l'Endpoint Webhook

1. **Allez sur** : https://dashboard.stripe.com/webhooks
2. **Cliquez sur** : "Add endpoint"
3. **URL du endpoint** :
   ```
   https://votre-domaine.vercel.app/api/stripe/webhook
   ```
4. **Événements à écouter** :
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed`
5. **Cliquez sur** : "Add endpoint"

### 2. Copiez la Clé de Signature

1. **Cliquez** sur votre nouvel endpoint
2. **Cliquez** sur "Reveal" pour voir la clé de signature
3. **Copiez** la clé qui commence par `whsec_...`

### 3. Ajoutez-la dans Vercel

1. **Vercel Dashboard** → Votre projet → Settings → Environment Variables
2. **Ajoutez** :
   - **Variable** : `STRIPE_WEBHOOK_SECRET`
   - **Valeur** : `whsec_...` (la clé copiée)
   - **Environnement** : Production
3. **Save**

### 4. Redéployez (Important !)

Les variables d'environnement ne prennent effet qu'après un redéploiement :
- Deployments → ⋯ → Redeploy

---

## ✅ Vérifications Post-Déploiement

### 1. Le Site est Accessible

Allez sur votre domaine Vercel :
```
https://votre-projet.vercel.app
```

✅ Le site se charge sans erreur

### 2. Connexion Admin Fonctionne

1. Connectez-vous avec votre compte admin
2. Dashboard Admin → Factures & Paiements
3. Créez une facture de test

✅ La facture est créée avec un lien Stripe

### 3. Le Lien Stripe Fonctionne

1. Cliquez sur le lien de paiement
2. Vous arrivez sur Stripe Checkout

✅ La page de paiement s'affiche

### 4. Le Webhook Fonctionne

1. Effectuez un paiement de test (carte : 4242 4242 4242 4242)
2. Vérifiez dans Dashboard Admin → Factures
3. La facture devrait passer en "Payée"

✅ Le webhook met à jour la facture automatiquement

---

## 🐛 Dépannage

### Le build échoue toujours

**Vérifiez** :
- Vous avez bien committé et poussé les changements
- Le commit est bien sur la branche `main`
- Vercel utilise bien la bonne branche

### Les factures ne se créent pas en production

**Erreur probable** : `STRIPE_SECRET_KEY` manquante

**Solution** :
1. Vérifiez dans Vercel → Settings → Environment Variables
2. `STRIPE_SECRET_KEY` doit être définie pour Production
3. Redéployez après l'avoir ajoutée

### Le webhook ne fonctionne pas

**Vérifications** :
1. L'endpoint webhook existe dans Stripe Dashboard
2. L'URL est correcte : `https://votre-domaine.vercel.app/api/stripe/webhook`
3. `STRIPE_WEBHOOK_SECRET` est configurée dans Vercel
4. Vous avez redéployé après avoir ajouté la variable

**Test** :
- Allez dans Stripe Dashboard → Webhooks → Votre endpoint
- Cliquez sur "Send test webhook"
- Vérifiez que la requête aboutit (code 200)

### Erreur "Stripe n'est pas initialisé"

Cette erreur apparaît au runtime si `STRIPE_SECRET_KEY` n'est pas définie.

**Solution** :
1. Ajoutez `STRIPE_SECRET_KEY` dans Vercel Environment Variables
2. Redéployez

---

## 📋 Checklist de Déploiement

- [ ] Code committé et poussé sur GitHub
- [ ] Variables d'environnement configurées dans Vercel :
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - [ ] `STRIPE_SECRET_KEY`
  - [ ] `NEXT_PUBLIC_SITE_URL`
- [ ] Build réussi sur Vercel
- [ ] Site accessible
- [ ] Webhook Stripe configuré :
  - [ ] Endpoint créé sur Stripe Dashboard
  - [ ] `STRIPE_WEBHOOK_SECRET` ajoutée dans Vercel
  - [ ] Redéployé
- [ ] Tests effectués :
  - [ ] Création de facture
  - [ ] Lien de paiement fonctionne
  - [ ] Paiement de test réussi
  - [ ] Webhook met à jour la facture

---

## 🎉 Succès !

Une fois toutes les étapes complétées, votre système de facturation Stripe est **100% opérationnel en production** ! 🚀

---

**Questions ?** volturacode@gmail.com

