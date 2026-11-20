<?php

namespace App\Controller\Admin;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Form\Admin\ZonesTypes;
use Symfony\Component\HttpFoundation\Request;
use App\Repository\RegionRepository;
use App\Repository\DepartementRepository;
use App\Repository\OptionsRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Options;
use Symfony\Component\Form\FormInterface;

class ZonesAnnoncesController extends AbstractController
{
    #[Route('/admin-baba-5487894613734/back-office/zones', name: 'app_admin_zones')]
    public function zones(
        Request $request,
        RegionRepository $regionRepository,
        EntityManagerInterface $entityManager,
        OptionsRepository $optionsRepository,
        DepartementRepository $departementRepository
    ): Response {
        $data=[];
        $regions = $regionRepository->findAll();
        $option = $optionsRepository->findOneBy([
                'name' => 'zones_annonces'
            ]);

        if($option){
           $createFormData = [];
           $data = unserialize($option->getValue());

         foreach($data['departements'] as  $value){



            $createFormData['departements'][]=$departementRepository->find($value);

         }

         foreach($data['regions'] as $value){
            $createFormData['regions'][]=$regionRepository->find($value);

         }

         $data = $createFormData;
        }


        $form = $this->createFormZones($request, $entityManager, $optionsRepository, $data);


        return $this->render('admin/zones.html.twig', [
            'form' => $form->createView(),
            'regions' => $regions,
        ]);
    }


    private function serializeData($form):string
        {
        $departements = [];
        $regions = [];
        $data = [];

           foreach($form->getData()['regions'] as $region){
               array_push($regions, $region->getId());
            }

            foreach($form->getData()['departements'] as $departement){
               array_push($departements, $departement->getId());
            }

            $data['departements']= $departements;
            $data['regions']= $regions;

            return serialize($data);

    }


    private function createFormZones(
    $request,
    $entityManager,
    $optionsRepository,
    array $data= []
    ): FormInterface {
        $form = $this->createForm(ZonesTypes::class, $data);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $valueForm = $this->serializeData($form);

            $option = $optionsRepository->findOneBy([
                'name' => 'zones_annonces'
            ]);

            if (!$option) {
                $option = new Options();
                $option->setName('zones_annonces');

                $entityManager->persist($option);
            }

            $option->setValue($valueForm);

            $entityManager->flush();
        }

        return $form;
    }

}