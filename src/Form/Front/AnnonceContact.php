<?php

namespace App\Form\Front;

use App\DTO\ContactDTO;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\TelType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class AnnonceContact extends AbstractType
{
    private $days = ['mardi' => 'Mardi', 
                     'mercredi' => 'Mercredi',
                     'jeudi' => 'Jeudi',
                     'vendredi' => 'Vendredi',
                     'samedi' => 'Samedi'];
    private $hours = ['morning' => '9h - 12h00',
                       'afternoon' => '14h - 18h00'];


    public function buildForm(
        FormBuilderInterface $builder,
        array $options
    ): void {
        $builder
            ->add('nom', TextType::class, [
                'label' => 'Nom',
                'attr' => [
                    'autocomplete' => 'family-name',                    
                    'class' => 'form__nom',
                    'data-placeholder' => 'Votre nom',
                ],
            ])
            ->add('prenom', TextType::class, [
                'label' => 'Prénom',
                'attr' => [
                    'autocomplete' => 'given-name',                    
                    'class' => 'form__prenom',
                    'data-placeholder' => 'Votre prénom',
                ],
            ])
            ->add('email', EmailType::class, [
                'label' => 'Adresse e-mail',
                'attr' => [
                    'autocomplete' => 'email',                    
                    'class' => 'form__email',
                    'data-placeholder' => 'Votre email',
                ],
            ])
            ->add('telephone', TelType::class, [
                'label' => 'Téléphone',
                'attr' => [
                    'autocomplete' => 'tel',                    
                    'class' => 'form__telephone',
                    'data-placeholder' => '06 12 34 56 78',
                ],
            ])
            ->add('message', TextareaType::class, [
                'label' => 'Votre message',
                'attr' => [                    
                    'data-placeholder' => 'Bonjour...',
                    'rows' => 5,
                    'class' => 'form__message',
                ],
            ]);

                foreach ($this->days as $day => $label) {
                $builder->add($day, CheckboxType::class, [
                    'label' => $label,
                    'mapped' => false,
                    'required' => false,
                    'attr' => [
                        'class' => 'form__checkbox form__checkbox-day form__input-' .mb_strtolower($label, 'UTF-8'),
                    ]
                    
                ]);

                foreach ($this->hours as $hour => $hourLabel) {
                    $builder->add($day . '_' . $hour, CheckboxType::class, [
                        'label' => $hourLabel,
                        'mapped' => false,
                        'required' => false,
                        'attr' =>[
                            'class' => 'form__checkbox-hour form__checkbox'
                        ]
                    ]);
                }
            }

    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => ContactDTO::class,
        ]);
    }
}