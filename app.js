const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;
const STORAGE_DIR = path.join(__dirname, 'qrcodes');

// Créer le répertoire de stockage s'il n'existe pas
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR);
}

// Middleware pour parser le corps de la requête en format binaire (pour le QR code)
app.use('/api/files/save/:courseId', express.raw({ type: 'application/octet-stream', limit: '10mb' }));

/**
 * Endpoint pour sauvegarder le QR code.
 * Exemple d'URL : POST /api/files/save/123456
 * Le corps de la requête doit contenir les bytes de l'image (Content-Type: application/octet-stream)
 */
app.post('/api/files/save/:courseId', (req, res) => {
  const courseId = req.params.courseId;
  const filePath = path.join(STORAGE_DIR, `${courseId}.png`);

  fs.writeFile(filePath, req.body, (err) => {
    if (err) {
      console.error('Erreur lors de la sauvegarde du fichier :', err);
      return res.status(500).send('Erreur lors de la sauvegarde du QR Code.');
    }
    res.send(`QR Code sauvegardé avec succès pour la course ${courseId}`);
  });
});

/**
 * Endpoint pour récupérer le QR code.
 * Exemple d'URL : GET /api/files/file/123456
 */
app.get('/api/files/file/:courseId', (req, res) => {
  const courseId = req.params.courseId;
  const filePath = path.join(STORAGE_DIR, `${courseId}.png`);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('Fichier non trouvé.');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
