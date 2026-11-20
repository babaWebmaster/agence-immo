<?php

namespace App\Form\Admin;

use App\Entity\Region;
use App\Entity\Departement;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;

class ZonesTypes extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder->add('regions', EntityType::class, [
            'class' => Region::class,
            'choice_label' => 'name',
            'multiple' => true,
            'expanded' => true,
            'choice_attr' => function () {
                return [
                    'class' => 'zone-region-choice',
                     //'data-controller' => 'admin--zones',
                ];
            },
        ])
        ->add('departements', EntityType::class, [
        'class' => Departement::class,
        'choice_label' => 'name',
        'multiple' => true,
        'expanded' => true,
        ]);
    }
}