<?php

namespace App\Entity;

use App\Repository\ImageRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Validator\Constraints as Assert;




#[ORM\Entity(repositoryClass: ImageRepository::class)]
#[Vich\Uploadable]
class Image
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $fileName = null;

    #[Vich\UploadableField(mapping: 'image_upload', fileNameProperty: 'fileName')] // <<< ICI !
    #[Assert\File(
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    mimeTypesMessage: 'Seuls les fichiers JPG, PNG, WEBP ou AVIF sont autorisés.'
    )]
    private ?File $imageFile = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $originalName = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $altText = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\Column(type: 'json', nullable: true)]
    private ?array $formats = null;

    #[ORM\Column(nullable: true)]
    private ?int $width = null;

    #[ORM\Column(nullable: true)]
    private ?int $height = null;

    /**
     * @var Collection<int, AnnonceImage>
     */
    #[ORM\OneToMany(targetEntity: AnnonceImage::class, mappedBy: 'image')]
    private Collection $annonceImages;

    public function __construct()
    {
        $this->annonceImages = new ArrayCollection();
    }
   

    public function getId(): ?int
    {
        return $this->id;
    }

/**
     * If manually uploading a file (i.e. not using Symfony Form)
     * set this to null to trigger the update of the file.
     *
     * @param File|\Symfony\Component\HttpFoundation\File\UploadedFile|null $imageFile
     */
    public function setImageFile(?File $imageFile = null): void
    {
        $this->imageFile = $imageFile;

        // IMPT: If you are using Doctrine, you should also persist and flush this entity
        // to ensure the changed uploadedAt (below) is refreshed in the database.
        if (null !== $imageFile) {
            $this->updatedAt = new \DateTimeImmutable(); // Mettre à jour la date si un nouveau fichier est uploadé
        }
    }

    public function getImageFile(): ?File
    {
        return $this->imageFile;
    }

    public function getFileName(): ?string
    {
        return $this->fileName;
    }

    public function setFileName(?string $fileName): static
    {
        $this->fileName = $fileName;

        return $this;
    }

    public function getOriginalName(): ?string
    {
        return $this->originalName;
    }

    public function setOriginalName(?string $originalName): static
    {
        $this->originalName = $originalName;

        return $this;
    }

    public function getAltText(): ?string
    {
        return $this->altText;
    }

    public function setAltText(?string $altText): static
    {
        $this->altText = $altText;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getFormats(): ?array
    {
        return $this->formats;
    }

    public function setFormats(?array $formats): static
    {
        $this->formats = $formats;

        return $this;
    }

    public function getWidth(): ?int
    {
        return $this->width;
    }

    public function setWidth(?int $width): static
    {
        $this->width = $width;

        return $this;
    }

    public function getHeight(): ?int
    {
        return $this->height;
    }

    public function setHeight(?int $height): static
    {
        $this->height = $height;

        return $this;
    }

  

    public function __toString(): string
    {
     return $this->getFileName() ?? 'Image #' . $this->getId();
    }

    /**
     * @return Collection<int, AnnonceImage>
     */
    public function getAnnonceImages(): Collection
    {
        return $this->annonceImages;
    }

    public function addAnnonceImage(AnnonceImage $annonceImage): static
    {
        if (!$this->annonceImages->contains($annonceImage)) {
            $this->annonceImages->add($annonceImage);
            $annonceImage->setImage($this);
        }

        return $this;
    }

    public function removeAnnonceImage(AnnonceImage $annonceImage): static
    {
        if ($this->annonceImages->removeElement($annonceImage)) {
            // set the owning side to null (unless already changed)
            if ($annonceImage->getImage() === $this) {
                $annonceImage->setImage(null);
            }
        }

        return $this;
    }
}
