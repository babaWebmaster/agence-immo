<?php

namespace App\Controller\Admin;

use App\Entity\Annonce;
use App\Entity\AnnonceImage;
use App\Entity\Post;
use App\Entity\SeoMetadata;
use Doctrine\ORM\EntityManagerInterface;
use App\Form\ImageChoiceType;
use App\Enum\FollowGoogle;
use App\Enum\IndexGoogle;
use App\Repository\PostRepository;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IntegerField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\CollectionField;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Field\HiddenField;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextareaField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Config\Assets;
use App\Controller\Admin\VillesCrudController;
use App\Repository\VillesRepository;
use App\Repository\OptionsRepository;
use App\Enum\TypeBien;
use App\Service\Url\ParseUrl;
use App\Service\AnnonceMetadataGenerator\AnnonceMetadataGenerator;
use Doctrine\ORM\QueryBuilder;

class AnnonceCrudController extends AbstractCrudController
{
    private VillesRepository $villesRepository;
    private OptionsRepository $optionsRepository;
    private ParseUrl $parseUrl;
    private AnnonceMetadataGenerator $metaData;
    private PostRepository $postRepository;

    public function __construct(
    VillesRepository $villesRepository,
    OptionsRepository $optionsRepository,
    ParseUrl $parseUrl, AnnonceMetadataGenerator $metaData,
    PostRepository $postRepository
    ) {
        $this->villesRepository = $villesRepository;
        $this->optionsRepository = $optionsRepository;
        $this->parseUrl = $parseUrl;
        $this->metaData = $metaData;
        $this->postRepository = $postRepository;

    }

    public static function getEntityFqcn(): string
    {
        return Annonce::class;
    }


    public function configureFields(string $pageName): iterable
    {

        $departementIds=[];

        $option = $this->optionsRepository->findOneBy([
            'name' => 'zones_annonces'
        ]);

        if($option){
             $data =unserialize($option->getValue());
             $data['departements'];
             $departementIds = $data['departements'];
        }



    $fields = [
        IdField::new('id')->hideOnForm(),

        TextField::new('title', 'Titre'),

        ChoiceField::new('type', 'Type de bien')
        ->setChoices([
        'Maison' => TypeBien::MAISON,
        'Appartement' => TypeBien::APPARTEMENT,
        ])
         ->setRequired(true),

        AssociationField::new('ville')
        ->autocomplete()
        ->setCrudController(VillesCrudController::class)
        ->setQueryBuilder(
            function (QueryBuilder $queryBuilder) use ($departementIds): QueryBuilder {
                return $queryBuilder
                    ->andWhere('entity.departement IN (:departementIds)')
                    ->setParameter('departementIds', $departementIds);
            }
        ),

         TextareaField::new('descriptionCourte', 'Description courte')
        ->setFormTypeOption('attr', [
            'rows' => 5,
        ]),

        TextEditorField::new('description', 'Description'),

        TextField::new('loyer', 'Loyer'),

        TextField::new('surface', 'Surface'),

        IntegerField::new('nombreChambres', 'Nombre de chambres'),


        ChoiceField::new('dpe', 'DPE')
        ->setChoices([
            'A' => 'A',
            'B' => 'B',
            'C' => 'C',
            'D' => 'D',
            'E' => 'E',
            'F' => 'F',
            'G' => 'G',
        ]),

        CollectionField::new('annonceImages', 'Image')
            ->setEntryType(ImageChoiceType::class)
            ->renderExpanded()
         ];

            if ($pageName === Crud::PAGE_EDIT) {
                $fields[] = HiddenField::new('edit')
                    ->setFormTypeOption('mapped', false)
                    ->setFormTypeOption('data', true)
                    ->setFormTypeOption('attr', [
                        'data-controller' => 'admin--image-edit',
                    ]);
            }

      return $fields;
    }

    public function updateEntity(EntityManagerInterface $entityManager, $entityInstance): void
    {
         foreach ($entityInstance->getAnnonceImages() as $position => $annonceImage) {
            $annonceImage->setPosition($position);
        }

        $entityInstance->setSlug(
             $this->parseUrl->encodeUrl($entityInstance->getTitle())
            );

         $entityManager->persist($entityInstance);

         parent::updateEntity($entityManager, $entityInstance);


        $this->buildAndFlushSeoMetaData($entityManager, $entityInstance, $this->postRepository);
    }

    public function persistEntity(EntityManagerInterface $entityManager, $entityInstance): void
    {
        foreach ($entityInstance->getAnnonceImages() as $position => $annonceImage) {
            $annonceImage->setPosition($position);
        }

        $entityInstance->setCreatedAt(new \DateTimeImmutable());

        $entityManager->persist($entityInstance);


         parent::persistEntity($entityManager, $entityInstance);

             $entityInstance->setSlug(
                $this->parseUrl->encodeUrl($entityInstance->getTitle())
             );

         $entityManager->flush();

         $this->buildAndFlushSeoMetaData($entityManager, $entityInstance, $this->postRepository);

    }

    public function configureActions(Actions $actions): Actions
    {
    return $actions
        ->add(Crud::PAGE_INDEX, Action::new('uploadMultiple', 'Upload vos images d\'annonce')
            ->linkToRoute('#')
            ->createAsGlobalAction()
            ->setCssClass('btn btn-success')
        );
    }

    public function configureAssets(Assets $assets): Assets
    {
      return Assets::new()
        ->addWebpackEncoreEntry('annonceCrud')
        ->addWebpackEncoreEntry('image-bulk-upload_css')
        ->addWebpackEncoreEntry('adminGallery')
        ->addWebpackEncoreEntry('admin')
        ->addWebpackEncoreEntry('adminAnnonce')
        ->addWebpackEncoreEntry('appAdm');
    }


    public function buildAndFlushSeoMetaData(
    EntityManagerInterface $entityManager,
    $entityInstance,
    PostRepository $postRepository
    ): void {
            $entityId = $entityInstance->getId();

            $post = $postRepository->findOneByEntity('Annonce', $entityId);

            if ($post === null) {
                $post = new Post();
                $post
                    ->setSlug($entityInstance->getTitle())
                    ->setEntityId($entityId)
                    ->setPostType('Annonce');
            }

            // Récupère l'entité existante ou en crée une si elle n'existe pas.
            $metaData = $post->getSeoMetadata();

            $this->metaData->loadAnnonce($entityInstance);
            $this->metaData->init();

            $metaData
                ->setTitle($this->metaData->getTitle())
                ->setDescription($this->metaData->getDescription())
                ->setOgTitle($this->metaData->getTitle())
                ->setOgDescription($this->metaData->getOgDescription())
                ->setOgImage($this->metaData->getImage())
                ->setSchemaJson($this->metaData->getSchema())
                ->setFollowGoogle(FollowGoogle::FOLLOW)
                ->setIndexGoogle(IndexGoogle::INDEX);

            $post->setSeoMetadata($metaData);

            $entityManager->persist($post);
            $entityManager->flush();
    }



}
