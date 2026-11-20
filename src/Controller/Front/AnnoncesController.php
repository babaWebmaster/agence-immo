<?php

namespace App\Controller\Front;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Service\ImageHtmlBuilder;
use App\Service\JsonDataReader;
use App\Repository\ImageRepository;
use App\Repository\AnnonceRepository;
use App\Form\Front\AnnonceSearchType;
use App\Repository\VillesRepository;
use App\Repository\AnnonceImageRepository;
use App\Repository\OptionsRepository;
use App\Service\Pagination\Pagination;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

final class AnnoncesController extends AbstractController
{
    public function __construct(private ImageHtmlBuilder $imageHtmlBuilder, private ImageRepository $repository, private JsonDataReader $jsonDataReader, private AnnonceRepository $annonceRepository, private AnnonceImageRepository $annoncesImageRepository){

    }



#[Route('/annonces',
                name: 'app_annonces',
                 defaults: [
                'sitemap' => true,
    ])]
    public function index(CsrfTokenManagerInterface $csrfTokenManager): Response
    {

        $form = $this->createForm(AnnonceSearchType::class);

        return $this->render('front/annonces/index.html.twig', [
            'data_footer' => $this->jsonDataReader->getData('front/_footer.json'),
            'form_search_annonce'=> $form,
            'image_hero'=> $this-> getImageHero(),
            'autocompleteToken'=> $this->getTokenAutocomplete($csrfTokenManager),

        ]);
    }



    #[Route('/annonces/{filters}', name: 'app_annonces_filters', requirements: ['filters' => '.+'], methods: ['GET'])]
    public function filtersAnnonces(string $filters, CsrfTokenManagerInterface $csrfTokenManager, VillesRepository $villesRepository,Request $request): Response
    {
        $limit = 2;
        $referer = $request->headers->get('referer');

        $classHero = preg_match('~/annonce/[^/]+~', parse_url($referer, PHP_URL_PATH) ?? '')?'hero--close-mobile':'';

        $formData= $this->parseSearchFilters($filters);

        $total = $this->annonceRepository->countAnnonceByNameVille(
            $formData['type'],
            $formData['loyerMin'],
            $formData['loyerMax'],
            $formData['villes'],
            $formData['chambres']
        );

        $pagination = new Pagination(
                    $total,
                    $limit,
                    $formData['page']
                );


        $resultat = $this->annonceRepository->searchFormAnnonceByNameVille(
             $formData['type'],
            $formData['loyerMin'],
            $formData['loyerMax'],
            $formData['villes'],
            $formData['chambres'],
            $limit,
            $pagination->getOffset()
        );

        $data = $this->getPictureAnnonces(
        $resultat, $this->getImagesByIdAnnonces($resultat),
        1);



        $form = $this->createForm(AnnonceSearchType::class);



        return $this->render('front/annonces/index.html.twig', [
            'data_footer' => $this->jsonDataReader->getData('front/_footer.json'),
            'form_search_annonce'=> $form,
            'autocompleteToken'=> $this->getTokenAutocomplete($csrfTokenManager),
            'image_hero'=> $this-> getImageHero(),
            'data_form_url'=> $this->buildDataFormQuery($formData, $villesRepository),
            'page' => $formData['page'],
            'classHero' => $classHero,
            'annonces' => $this->renderView('front/annonces/_annonces.html.twig', [
            'annonces'=>$data,
            'currentPage' => $formData['page'],
            'maxPage' => $pagination->getTotalPages(),
            'pagination' => $pagination->getPages()]),
        ]);

    }




    #[Route('/autocomplete-ville', name: 'app_autocomplete_ville', methods: ['POST'])]
    public function autocompleteVille(Request $request, VillesRepository $villes, OptionsRepository $optionsRepository): JsonResponse
    {
        $token = $request->request->get('_token');

            if (!$this->isCsrfTokenValid('autocomplete-ville', $token)) {
                return new JsonResponse(['error' => 'Token CSRF invalide'], 403);
            }

         $value = trim((string) $request->request->get('value'));

         $resultat = $villes->getNamesAutocomplete($value,$this->getZones($optionsRepository));

         if(!is_array($resultat)){
            $resultat =[];
         }

          return new JsonResponse($resultat);
    }

    #[Route('/recherche-annonces', name: 'app_search_annonce', methods: ['POST'])]
    public function searchAnnonce(Request $request, VillesRepository $villesRepository): Response
    {
    $jsonData =[];
    $limit = 2;

    $formData = $this->filterDataFormSearchAnnonce($request);

    unset($formData['villeRecherche']);

    $total = $this->annonceRepository->countAnnonceForm(
    $formData['type'],
    $formData['loyerMin'],
    $formData['loyerMax'],
    $formData['villes'],
    $formData['chambres']
    );



    $pagination = new Pagination(
                    $total,
                    $limit,
                    $formData['page']
                );



    $resultat = $this->annonceRepository->searchAnnonceForm(
                $formData['type'],
                $formData['loyerMin'],
                $formData['loyerMax'],
                $formData['villes'],
                $formData['chambres'],
                $limit,
                $pagination->getOffset()
            );

        $data = $this->getPictureAnnonces(
        $resultat, $this->getImagesByIdAnnonces($resultat),
        1);

        /*$data = $this->getUrlImgByFormatAnnonces($resultat, $this->getImagesByIdAnnonces($resultat),
                ['xLarge_avif','large_avif'], 1);*/

        $formDataMap = $this->sortArrayFormData($formData);

        $jsonData['url'] = $this->buildDataUrlAnnonce($formDataMap, $villesRepository);

        $request->getSession()->set('annonces_recherche_url', $jsonData['url']);

        $jsonData['total'] = $total;
        $jsonData['annonces'] = $this->renderView('front/annonces/_annonces.html.twig', [
            'annonces'=>$data,
            'currentPage' => $formData['page'],
            'maxPage' => $pagination->getTotalPages(),
            'pagination' => $pagination->getPages(),

            ]);


     return new JsonResponse($jsonData);
    }



    #[Route('/compte-annonces', name: 'app_compte_annonce', methods: ['POST'])]
    public function countAnnonce(Request $request): JsonResponse
    {

       $formData = $this->filterDataFormSearchAnnonce($request);

        $resultat = $this->annonceRepository->countAnnonceForm(
                $formData['type'],
                $formData['loyerMin'],
                $formData['loyerMax'],
                $formData['villes'],
                $formData['chambres']
            );

            $data['total']= $resultat;

         return new JsonResponse($data);
    }






  public function getTokenAutocomplete($csrfTokenManager): string{
        return $csrfTokenManager
             ->getToken('autocomplete-ville')
            ->getValue();
    }


     public function getZones(OptionsRepository $optionsRepository): array
    {
        $zones = $optionsRepository->findValueByName('zones_annonces');

        if (!$zones) {
            return [];
        }

        $zones = unserialize($zones, ['allowed_classes' => false]);

        if (!is_array($zones)) {
            return [];
        }

        return isset($zones['departements']) && is_array($zones['departements'])
            ? $zones['departements']
            : [];
    }



  public function filterDataFormSearchAnnonce(Request $request): array{

       $formData = $request->request->all()['annonce_search'];

       $formData['type'] = $formData['type']??[];

       $formData['villes'] = $formData['villes'] ?? [];

       $formData['loyerMin'] = $formData['loyerMin'] !== ''
        ? (int) $formData['loyerMin']
        : null;

       $formData['loyerMax'] = $formData['loyerMax'] !== ''
        ? (int) $formData['loyerMax']
        : null;

        $formData['chambres'] = $formData['chambres'] ?? ''
        ? (int) $formData['chambres']
        : null;

        $formData['page'] = (int) ($formData['page'] ?? 1);

        return $formData;

    }



    public function parseSearchFilters(string $filters): array
    {
    $formData = [
        'type' => [],
        'chambres' => null,
         'loyerMin' => null,
        'loyerMax' => null,
         'villes' => [],
        'page' => 1,
    ];

    $filtersExplode = explode('/', trim($filters, '/'));

    $arrayFilter = array_map(
        fn($filter) => explode(':', $filter, 2),
        $filtersExplode
    );

    $filtersArray = array_column($arrayFilter, 1, 0);

        foreach ($filtersArray as $key => $value) {
            switch ($key) {

                case 'type':
                    if ($value !== '') {
                        $formData['type'] = explode('-', $value);
                    }
                    break;

                case 'villes':
                    if ($value !== '') {
                        $formData['villes'] = explode('-', strtoupper($value));
                    }
                    break;

                case 'loyer':
                    if ($value !== '') {
                        [$loyerMin, $loyerMax] = explode('-', $value);

                        $formData['loyerMin'] = $loyerMin !== ''
                            ? (int) $loyerMin
                            : null;

                        $formData['loyerMax'] = $loyerMax !== ''
                            ? (int) $loyerMax
                            : null;
                    }
                    break;

                case 'chambres':
                    if ($value !== '') {
                        $formData['chambres'] = (int) $value;
                    }
                    break;

                case 'page':
                    if ($value !== '') {
                        $formData['page'] = (int) $value;
                    }
                    break;
            }
        }

        return $formData;
    }


    public function getImagesByIdAnnonces($resultat):array{

        $imagesByAnnonce = [];

         if (!empty($resultat)) {
            $idsAnnonce = array_map(
                fn($resultat) => $resultat[0]['id'] /*$resultat[0]->getId()*/,
                $resultat
            );
            }
         else{
            return [];
         }

        $annonceImages= $this->annoncesImageRepository->findByAnnonceIds($idsAnnonce);

        foreach ($annonceImages as $image) {

             $imagesByAnnonce[$image['annonceId']][] = $image;
        }

        return $imagesByAnnonce;

    }

    public function getPictureAnnonces($resultat, $imagesByAnnonce, ?int $max = null): array
    {
        $data = [];

        foreach ($resultat as $annonce) {

            $images = $imagesByAnnonce[$annonce[0]['id']] ?? [];
            $picture = [];

            $count = $max ?? count($images);

            for ($i = 0; $i < $count && $i < count($images); $i++) {

                $sizes = '(max-width: 768px) 80vw, 1200px';

                $this->imageHtmlBuilder->initImage($images[$i]['imageId']);

                $picture[] = $this->imageHtmlBuilder->buildHtmlPicture(
                    ['decoding' => 'async', 'class' => 'annonces__img'],
                    'eager',
                    $sizes,
                    ['class' => 'annonces__picture']
                );
            }

            $data[] = [
                'annonce' => $annonce,
                'images' => $images,
                'picture' => $picture,
            ];
        }

        return $data;
    }


    public function getUrlImgByFormatAnnonces($resultat, $imagesByAnnonce, array $formatImg ,?int $max = null): array
    {
        $data = [];

        foreach ($resultat as $annonce) {

            $images = $imagesByAnnonce[$annonce[0]['id']] ?? [];
            $picture = [];

            $count = $max ?? count($images);

            for ($i = 0; $i < $count && $i < count($images); $i++) {


                $this->imageHtmlBuilder->initImage($images[$i]['imageId']);

                foreach($formatImg as $key => $value){
                   $picture[$value] = $this->imageHtmlBuilder->getImageUrlByFormat($value);
                }
                $picture['alt']= $this->imageHtmlBuilder->getImage()->getAltText();
            }

            $data[] = [
                'annonce' => $annonce,
                'images' => $images,
                'picture' => $picture,
            ];
        }

        return $data;
    }

    public function getImageHero(){



        $sizes = '(max-width: 768px) 60vw, 1200px';
         $this->imageHtmlBuilder->initImage(53);

         return $this->imageHtmlBuilder->buildHtmlPicture(['fetchpriority' => 'high', 'class'=>'hero__img'],'eager',$sizes,['class' => 'hero__picture'],800);

    }


    public function buildDataUrlAnnonce(
    $formData,
    VillesRepository $villesRepository
        ): string {
        $formData['villes'] = $villesRepository->getIdById($formData['villes']);

        $villes = [];

        foreach ($formData['villes'] as $ville) {
            $villes[] = $ville['name'];
        }

        $formData['villes'] = $villes;

        return $this->buildDataUrl($formData);
    }

    public function buildDataFormQuery(
    $formData,
    VillesRepository $villesRepository
    ): string {
        $formData['villes'] = $villesRepository->getIdByName($formData['villes']);

        $villes = [];

        foreach ($formData['villes'] as $ville) {
            $villes[] =
                $ville['id']
                . '--'
                . $ville['name']
                . '--'
                . $ville['postalCode'];
        }

        $formData['villes'] = $villes;

        return $this->buildDataUrl($formData);
    }


    private function buildDataUrl(array $formData): string
    {
        $dataUrl = '';

        foreach ($formData as $key => $value) {

            if ($key !== 'loyerMin' && $key !== 'loyerMax') {
                $dataUrl .= $key . ':';
            }

            if ($key === 'type') {
                $dataUrl .= implode('-', $value);
            }

            if ($key === 'villes') {
                $dataUrl .= implode('-', $value);
            }

            if (
                $key !== 'villes'
                && $key !== 'type'
                && $key !== 'loyerMin'
                && $key !== 'loyerMax'
            ) {
                $dataUrl .= $value;
            }

            if ($key === 'loyerMax') {
                $dataUrl .= 'loyer:';

                if (empty($formData['loyerMin'])) {
                    $dataUrl .= '0-';
                } else {
                    $dataUrl .= $formData['loyerMin'] . '-';
                }

                $dataUrl .= $formData['loyerMax'] . '/';
            }

            if ($key !== 'loyerMin' && $key !== 'loyerMax') {
                $dataUrl .= '/';
            }
        }

        return $dataUrl;
    }

    private function sortArrayFormData(array $formData):array{
        $sortArray = [
        'type' => [],
        'chambres' => null,
         'loyerMin' => null,
        'loyerMax' => null,
         'villes' => [],
        'page' => 1,
        ];

        foreach($sortArray as $key => $value){

            $sortArray[$key] = $formData[$key];
        }

        return $sortArray;
    }



}
