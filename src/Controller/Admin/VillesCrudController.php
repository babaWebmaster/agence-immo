<?php

namespace App\Controller\Admin;

use App\Entity\Villes;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;


class VillesCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Villes::class;
    }

    
    public function configureFields(string $pageName): iterable
    {
        return [
             TextField::new('name'),
            TextField::new('postalCode'),
            TextField::new('label'),
        ];
    }

      public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setSearchFields([
                'name',
                'postalCode'               
            ]);
    }
    
}
