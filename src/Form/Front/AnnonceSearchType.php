<?php

namespace App\Form\Front;

use App\Enum\TypeBien;
use App\Entity\Villes;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use App\Repository\AnnonceRepository;


class AnnonceSearchType extends AbstractType
{

    public function __construct(private AnnonceRepository $annonceRepository){        
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {

        $maxLoyer = intval($this->annonceRepository->findMaxLoyer());

        $builder

            ->add('type', ChoiceType::class, [
                'label' => 'Type de bien',
                'label_attr' => [
                'class' => 'hero__label-type-bien hero__label--desktop',
                ],                
                'choices' => [
                    'Maison' => TypeBien::MAISON,
                    'Appartement' => TypeBien::APPARTEMENT,
                ],
                'expanded' => true,
                'multiple' => true,
                'choice_value' => 'value',
                'attr'=>[
                    'class'=> 'hero__input-type-bien'
                ]
            ])

            ->add('chambres', ChoiceType::class, [
                'label' => 'Nombre de chambres',
                 'label_attr' => [
                'class' => 'hero__label-chambres hero__label--desktop',
                ],
                'choices' => [
                    '1' => 1,
                    '2' => 2,
                    '3' => 3,
                    '4 et +' => 4,
                    
                ],
                'expanded' => true,
                'multiple' => false,
                'required' => false,
                'placeholder' => false,                
                'attr'=>[
                    'class'=> 'hero__input-chambres'
                ]
            ])
            ->add('villes', ChoiceType::class, [
            'label' => 'Villes',
            'choices' => [],
            'multiple' => true,
            'required' => false,            
                'attr'=>[
                    'class'=> 'hero__select-villes'
                ]
        ])

            ->add('villeRecherche', TextType::class, [
                'label' => 'Rechercher une ville',
                'label_attr' => [
                'class' => 'hero__label-ville hero__label--desktop',
                ],
                'required' => false,
                'mapped' => false,
                'attr' => [
                    'autocomplete' => 'off',
                    'class'=>'hero__input-autocomplete',
                    'role'=>'combobox',
                    'aria-autocomplete'=> 'list',
                    'aria-controls' => 'autocomplete-ville-list',
                    'aria-expanded' => 'false'
                ],
            ])
            ->add('loyerMin', TextType::class, [
            'label' => 'min',
              'label_attr' => [
                'class' => 'hero__label-loyer-min',
                ],
            'required' => false,
            'attr' => [
                'placeholder' => '0 €',
                'class' => 'hero__input-loyer-min',
                'inputmode' => 'numeric',
                'data-min' => '0',
            ],
             ])

            ->add('loyerMax', TextType::class, [
            'label' => 'max',
              'label_attr' => [
                'class' => 'hero__label-loyer-max',
                ],
            'required' => false,
            'attr' => [
                'placeholder' => $maxLoyer.' €',
                'class' => 'hero__input-loyer-max',
                'inputmode' => 'numeric',
                'data-max' => $maxLoyer,
            ],
            ]);
           
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'method' => 'POST',
            'csrf_protection' => true,
            'attr'=>[
                'class' => 'hero__form-search hero__form-search--opacity-null']
        ]);
    }
}