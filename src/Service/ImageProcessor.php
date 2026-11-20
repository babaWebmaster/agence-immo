<?php

namespace App\Service;

use Imagine\Gd\Imagine; //  pas oublier l'import de Imagine.Gd.Imagine (ou Imagick si vous l'avez)
use Imagine\Image\Box;
use Imagine\Image\ImageInterface;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Filesystem\Filesystem; // Pour créer les dossiers si besoin
use App\Enum\ImageSuffix;
/**
 * format images
 * thumbnail
 * medium
 * large
 * original_compressed
 * original
 */


class ImageProcessor
{
    private string $uploadDir;
    private Filesystem $filesystem;
    private Imagine $imagine;
    private $sizes = [
            'xLarge' => 1920,
            'large' => 1200,    // Pour les grands écrans
            'medium' => 800,   // Taille standard pour le contenu
            'small' => 400,    // Pour les miniatures ou des images de petite taille
            'thumbnail' => 150,
    ];

    // Le constructeur reçoit le chemin du répertoire du projet grâce à la configuration de service
    public function __construct(string $projectDir, Imagine $imagine)
    {
        // Définit le répertoire où les images seront stockées (doit correspondre à vich_uploader.yaml)
        $this->uploadDir = $projectDir . '/public/uploads/images';
        $this->filesystem = new Filesystem();
        $this->imagine = $imagine;
    }

    /**
     * Traite une image uploadée pour générer différents formats et la compresser.
     *
     * @param File   $file     Le fichier temporaire uploadé.
     * @param string $fileName Le nom du fichier généré par VichUploader (ex: 'unique-hash.jpg').
     * @return array Un tableau associatif des chemins URL publics des formats générés.
     */
    public function processImage(File $file, string $fileName): array
    {
      
        $originalPath = $file->getRealPath(); // Chemin physique du fichier original temporaire
        $image = $this->imagine->open($originalPath); // Ouvre l'image avec Imagine

        $originalWidth = $image->getSize()->getWidth();
        $originalHeight = $image->getSize()->getHeight();

        $formats = []; // Tableau pour stocker les chemins des formats générés
        
        $sizes = $this->sizes;
        $sizes['original'] = $originalWidth ;
       
        // Extrait le nom de base du fichier sans extension pour créer des sous-dossiers et des noms propres
        $info = pathinfo($fileName);
        $baseFileName = $info['filename']; // ex: 'unique-hash'
        // Chemin du sous-dossier pour cette image spécifique
        $imageSpecificDir = sprintf('%s/%s', $this->uploadDir, $baseFileName);

        // Assurez-vous que le répertoire existe
        if (!$this->filesystem->exists($imageSpecificDir)) {
            $this->filesystem->mkdir($imageSpecificDir);
        }

        $generatedFormats = [];

        // Détermination du format d'origine (ex: 'jpg', 'jpeg', 'png')
        $extension = strtolower($info['extension']);

        switch ($extension) {
            case 'jpg':
            case 'jpeg':
                $generatedFormats = array_merge($generatedFormats, $this->generateImageByFormat($image, $imageSpecificDir, $baseFileName, $originalPath, 75, '_jpg', $sizes));
                break;

            case 'png':
                $generatedFormats = array_merge($generatedFormats, $this->generateImageByFormat($image, $imageSpecificDir, $baseFileName, $originalPath, 75, '_png', $sizes));
                break;
        }

        // Génération systématique des formats modernes WebP et AVIF
        $generatedFormats = array_merge($generatedFormats, $this->generateImageByFormat($image, $imageSpecificDir, $baseFileName, $originalPath, 75, '_webp', $sizes));
        $generatedFormats = array_merge($generatedFormats, $this->generateImageByFormat($image, $imageSpecificDir, $baseFileName, $originalPath, 60, '_avif', $sizes));

       

        return [
            'formats' => $generatedFormats,
            'size' => [
                'width' => $originalWidth,
                'height' => $originalHeight,
            ],
        ];
    }

    /**
     * Redimensionne une image à la largeur spécifiée en conservant les proportions.
     */
    private function resizeImage(ImageInterface $image, int $width): ImageInterface
    {
        $originalWidth = $image->getSize()->getWidth();
        // Si l'image originale est déjà plus petite ou égale à la largeur demandée, pas besoin de redimensionner
        if ($originalWidth <= $width) {
            return $image->copy(); // Retourne une copie pour éviter de modifier l'originale si elle est réutilisée
        }

        // Redimensionne l'image en conservant les proportions
        return $image->resize($image->getSize()->widen($width));
    }

    /**
     * Sauvegarde l'image dans un format spécifié avec une qualité donnée.
     */
    private function saveImage(ImageInterface $image, string $filePath, int $quality, string $format = null): void
    {
        // Crée le dossier si inexistant (la propriété $filesystem le gère maintenant)
        $directory = dirname($filePath);
        if (!$this->filesystem->exists($directory)) {
            $this->filesystem->mkdir($directory, 0777, true);
        }

        // Détermine les options de sauvegarde en fonction du format
        $options = [];
         // Détermine les options de sauvegarde en fonction du format
    switch (strtolower($format)) {
        case 'jpeg':
        case 'jpg':
            $options['jpeg_quality'] = $quality;
            $options['format'] = 'jpeg';
            // Ajout de l'option clé pour le JPG progressif
            $options['progressive'] = true; 
            break;

        case 'png':
            // La qualité PNG est inversée (0=pas de compression, 9=compression max)
            $options['png_compression_level'] = round(9 - ($quality / 100 * 9));
            $options['format'] = 'png';
            break;

        case 'webp':
            $options['webp_quality'] = $quality;
            $options['format'] = 'webp';
            break;
        
        case 'avif':
            $options['avif_quality'] = $quality;
            $options['format'] = 'avif';
            break;

        // Vous pouvez ajouter d'autres formats ici si nécessaire
    }

        $image->save($filePath, $options);
    }

    public function getUploadDir(): string
    {
        return $this->uploadDir;
    }

    public function generateImageByFormat(ImageInterface $image, string $imageSpecificDir, string $baseFileName, string $originalPath, int $quality, string $suffixImage,
    array $sizes=[]):array
    {
        $formats = [];
       // 1. Extraction des valeurs autorisées depuis l'Enum
        $allowedSuffixes = array_map(fn(ImageSuffix $case) => $case->value, ImageSuffix::cases());

        // 2. Si le suffixe n'est pas valide : on abandonne silencieusement sans tout casser
        if (!in_array($suffixImage, $allowedSuffixes, true)) {
            return [];
        }
        
        // 3. Fallback sur les tailles de la classe si le tableau transmis est vide
        $sizes = !empty($sizes) ? $sizes : $this->sizes;
        $extension = ltrim($suffixImage, '_');

        foreach ($sizes as $name => $width) {

                $name = $name.$suffixImage;
                // Re-ouvre l'image originale pour repartir d'une source propre sans perte accumulée
              
                $currentImage = ($name === 'original'.$suffixImage) 
                    ? $image 
                    : $this->resizeImage($this->imagine->open($originalPath), $width);

                $outputFilePath = sprintf('%s/%s-%s.%s',
                $imageSpecificDir,
                $baseFileName,
                $name,
                $extension 
                );

                $this->saveImage($currentImage, $outputFilePath, $quality,$extension);
                $formats[$name] = str_replace($this->uploadDir, '', $outputFilePath);
            }
            return $formats;
    }
}