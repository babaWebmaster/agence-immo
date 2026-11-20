<?php

namespace App\Entity;

use App\Repository\AnnonceRepository;
use App\Entity\Villes;
use App\Enum\TypeBien;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AnnonceRepository::class)]
class Annonce
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $descriptionCourte = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
    private ?string $loyer = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 8, scale: 2)]
    private ?string $surface = null;

    #[ORM\Column]
    private ?int $nombreChambres = null;

    #[ORM\Column(length: 10)]
    private ?string $dpe = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: true)]
    private ?Villes $ville = null;

    #[ORM\Column(enumType: TypeBien::class)]
    private ?TypeBien $type = TypeBien::MAISON;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $slug = null;

  

    /**
     * @var Collection<int, AnnonceImage>
     */
    #[ORM\OneToMany(targetEntity: AnnonceImage::class, mappedBy: 'annonce', orphanRemoval: true,cascade: ['persist'])]
    private Collection $annonceImages;

    public function __construct()
    {
        $this->annonceImages = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getDescriptionCourte(): ?string
    {
        return $this->descriptionCourte;
    }

    public function setDescriptionCourte(?string $descriptionCourte): static
    {
        $this->descriptionCourte = $descriptionCourte;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getLoyer(): ?string
    {
        return $this->loyer;
    }

    public function setLoyer(string $loyer): static
    {
        $this->loyer = $loyer;

        return $this;
    }

    public function getSurface(): ?string
    {
        return $this->surface;
    }

    public function setSurface(string $surface): static
    {
        $this->surface = $surface;

        return $this;
    }

    public function getNombreChambres(): ?int
    {
        return $this->nombreChambres;
    }

    public function setNombreChambres(int $nombreChambres): static
    {
        $this->nombreChambres = $nombreChambres;

        return $this;
    }

    public function getDpe(): ?string
    {
        return $this->dpe;
    }

    public function setDpe(string $dpe): static
    {
        $this->dpe = $dpe;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
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
            $annonceImage->setAnnonce($this);
        }

        return $this;
    }

    public function removeAnnonceImage(AnnonceImage $annonceImage): static
    {
        if ($this->annonceImages->removeElement($annonceImage)) {
            // set the owning side to null (unless already changed)
            if ($annonceImage->getAnnonce() === $this) {
                $annonceImage->setAnnonce(null);
            }
        }

        return $this;
    }


     public function getVille(): ?Villes
        {
            return $this->ville;
        }

        public function setVille(?Villes $ville): static
        {
            $this->ville = $ville;

            return $this;
        }

         public function getType(): ?TypeBien
         {
            return $this->type;
         }

        public function setType(TypeBien $type): static
        {
            $this->type = $type;

            return $this;
        }

        public function getSlug(): ?string
        {
         return $this->slug;
        }

        public function setSlug(?string $slug): static
        {
            $this->slug = $slug;

            return $this;
        }
   
}
