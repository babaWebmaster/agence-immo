<?php
namespace App\Service;

use App\Entity\Image;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Psr\Log\LoggerInterface;

class ImageUploader
{
    public function __construct(
        private ParameterBagInterface $params,
        private EntityManagerInterface $em,
        private LoggerInterface $logger,
        private ImageProcessor $imageProcessor
    ) {}

    public function upload(UploadedFile $file): Image
    {
        $originalName = $file->getClientOriginalName();
        $extension = $file->guessExtension();
        $baseName = pathinfo($originalName, PATHINFO_FILENAME);

        $uploadedFileName = $baseName.'-'.uniqid().'.'.$extension;

        $image = new Image();
        $image->setOriginalName($originalName);
        $image->setFileName($uploadedFileName);
        $image->setUpdatedAt(new \DateTimeImmutable());

        $uploadDir = $this->params->get('app.upload_dir');

        try {
            $movedFile = $file->move($uploadDir, $uploadedFileName);

            $this->logger->info("Fichier déplacé : ".$uploadedFileName);

            $imageProcessor = $this->imageProcessor->processImage(
                $movedFile,
                $movedFile->getRealPath()
            );
            
            $formats = $imageProcessor['formats'];

            $image->setFormats($formats);
            $image->setWidth($imageProcessor['size']['width']);
            $image->setHeight($imageProcessor['size']['height']);

            $this->em->persist($image);

        } catch (\Throwable $e) {
            $this->logger->error("Upload failed", [
                'file' => $originalName,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }

        return $image;
    }

    public function flush(): void
    {
        $this->em->flush();
    }
}
