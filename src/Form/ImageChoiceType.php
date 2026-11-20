<?php

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use App\Repository\ImageRepository;
use App\Entity\Image;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use App\Service\ImageHtmlBuilder;
use App\Entity\AnnonceImage;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\ChoiceList\ChoiceList;

class ImageChoiceType extends AbstractType
{
    public function __construct(
        private ImageRepository $imageRepository,
        private ImageHtmlBuilder $imageHtmlBuilder
    ) {}

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $images = $this->imageRepository->findAll();

        $builder->add('image', EntityType::class, [
         'class' => Image::class,         
        'choices' => $images,
        'choice_label' => \Closure::fromCallable([$this, 'getNameImage']),
        'choice_attr' => ChoiceList::attr(
         $this,
         \Closure::fromCallable([$this, 'getUrlImage'])
        ),      
        'attr' => ['data-controller' => 'admin--image-choice',]              
        
        ]);
    }

    private function getUrlImage(Image $image){
        $this->imageHtmlBuilder->initImage($image->getId());

        return [              
            'data-thumbnail' =>                     $this->imageHtmlBuilder->getImageUrlByFormat('small_jpg')];
    }

    private function getNameImage(Image $image){
        return $image->getOriginalName();
    }

   
    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => AnnonceImage::class,
        ]);
    }
    
}