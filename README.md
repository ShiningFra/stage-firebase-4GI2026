This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Configuration de l'environnement

### Variables d'environnement Backend
1. Copiez le fichier `.env.example` vers `.env` dans le dossier `backend/` :
```bash
cp backend/.env.example backend/.env
```

2. Modifiez les valeurs dans `backend/.env` avec vos propres configurations :
- `JWT_SECRET_KEY` : Clé secrète pour la génération des tokens JWT
- `DB_URL` : URL de votre base de données MySQL
- `DB_USERNAME` : Nom d'utilisateur de la base de données
- `DB_PASSWORD` : Mot de passe de la base de données
- `SERVER_PORT` : Port du serveur backend (par défaut: 8081)
- `CORS_ALLOWED_ORIGINS` : URL du frontend (par défaut: http://localhost:3000)

### Variables d'environnement Frontend
1. Copiez le fichier `.env.example` vers `.env` à la racine du projet :
```bash
cp .env.example .env
```

2. Modifiez les valeurs dans `.env` avec vos propres configurations :
- `NEXT_PUBLIC_API_URL` : URL de l'API backend (par défaut: http://localhost:8080/api)
- `NEXT_PUBLIC_APP_URL` : URL de l'application frontend (par défaut: http://localhost:3000)

### Sécurité
- Les fichiers `.env` sont ignorés par Git pour protéger les informations sensibles
- Ne commitez JAMAIS de fichiers contenant des secrets ou mots de passe
- Utilisez toujours des variables d'environnement pour les informations sensibles

## Installation

### Backend (Spring Boot)
```bash
cd backend
./mvnw clean install
```

### Frontend (React)
```bash
npm install
```

## Démarrage

### Backend
```bash
cd backend
./mvnw spring-boot:run
```

### Frontend
```bash
npm start
```

L'application sera accessible à l'adresse : http://localhost:3000

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
