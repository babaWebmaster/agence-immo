<?php

namespace App\Controller\Front;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Form\FormInterface;
use App\Service\Annonce\AnnonceService;
use App\Repository\AnnonceRepository;
use App\Service\ImageHtmlBuilder;
use App\Service\JsonDataReader;
use App\Repository\ImageRepository;
use App\Repository\AnnonceImageRepository;
use App\Entity\Annonce;
use App\Entity\Image;
use App\Entity\Villes;
use App\Service\Url\ParseUrl;
use App\DTO\ContactDTO;
use App\Form\Front\AnnonceContact;
use App\Controller\Traits\SeoAwareControllerTrait;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;


final class AnnonceController extends AbstractController
{
    use SeoAwareControllerTrait;

     public function __construct(private ImageHtmlBuilder $imageHtmlBuilder, private ImageRepository $repository, private JsonDataReader $jsonDataReader, private AnnonceRepository $annonceRepository, private AnnonceService $annonceService , private AnnonceImageRepository $annonceImageRepository, #[Autowire('%app.assets_base_url%')] private string $assetsBaseUrl){

    }


    #[Route('/annonce/{slug}-{id}',
        name: 'app_annonce',
        requirements: [
        'slug' => '[a-z0-9-]+','id' => '\d+'],
        methods: ['GET'],
        defaults: [
        'sitemap' => true,
        'sitemap_entity' => Annonce::class,
        'sitemap_repository' => 'findAllForSitemap',
    ])]
    public function index(string $slug, int $id, ParseUrl $parseUrl,  Request $request, EntityManagerInterface $entityManager): Response
    {
       $images=null;


        $annonce= $this->annonceRepository->getAnnonceById($id);

        if($annonce){

            $slugAttendu = $parseUrl->encodeUrl($annonce['title']);

            if($slugAttendu != $slug){
                return $this->redirectToRoute(
                    'app_annonce',
                    [
                        'id' => $annonce['id'],
                        'slug' => $slugAttendu,
                    ],
                     Response::HTTP_MOVED_PERMANENTLY
                 );
            }

            $images = $this->annonceImageRepository->findByAnnonceIds([$annonce['id']]);
        }



        if($images){
            foreach(array_column($images,'imageId') as $key => $value){

                $this->imageHtmlBuilder->initImage($value);
                $sizes = '(max-width: 768px) 60vw, 1200px';
                if($key===0){
                    $thumbnail=$this->imageHtmlBuilder->buildHtmlPicture(['fetchpriority' => 'high', 'class'=>'hero__img hero__img__fallback'],'eager',$sizes,['class' => 'hero__picture'],0,400);
                }
                $images[$key]['alt']= $this->imageHtmlBuilder->getImage()->getAltText();


                $images[$key]['avif']=$this->imageHtmlBuilder->getImageUrlByFormat('large_avif').'--'.$this->imageHtmlBuilder->getImageUrlByFormat('xLarge_avif');

                $images[$key]['webp']=$this->imageHtmlBuilder->getImageUrlByFormat('large_webp').'--'.$this->imageHtmlBuilder->getImageUrlByFormat('xLarge_webp');
            }
        }

       $meta = $this->getSeoPostFromCriteria( $entityManager,[
            'postType' => 'Annonce',
            'entityId' => $id
        ]);

        $seoMetadata = $meta->getSeoMetadata();
        $ogImage = $seoMetadata->getOgImage();

        $formats = $ogImage->getFormats();

        $imageFilename = $formats['large_webp'] ?? $formats['thumbnail'] ?? null;

        if ($imageFilename !== null) {
            $imageUrl = rtrim($this->assetsBaseUrl, '/')
                . '/uploads/images/'
                . ltrim($imageFilename, '/');

            $schema = json_decode($seoMetadata->getSchemaJson(), true);

            if (json_last_error() === JSON_ERROR_NONE && isset($schema['@graph'][1])) {
                $schema['@graph'][1]['image'] = [$imageUrl];

                $seoMetadata->setSchemaJson(json_encode(
                    $schema,
                    JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
                ));
            }
        }


        return $this->render('front/annonce/index.html.twig', [
            'slug' => $slug,
            'id' => $id,
            'data_footer'=>$this->jsonDataReader->getData('front/_footer.json'),
            'images'=> $images,
            'annonce'=> $annonce,
            'thumbnail'=>$thumbnail,
            'form' => $this->buildForm($request),
            'returnSearch' => $retourUrl = $request->getSession()->get('annonces_recherche_url'),
            'ogImageUrl' => $imageUrl ?? null,
            'seoMetadata' => $seoMetadata
        ]);
    }


    public function buildForm(Request $request, /*callable $callBack*/):  FormInterface{

        $contact = new ContactDTO();

        $form = $this->createForm(AnnonceContact::class, $contact);

        $form->handleRequest($request);

        if($form->isSubmitted() && $form->isValid()){
             // $callback($contact);
        }

        return $form;

    }


    public function validateForm($form){

        return $form->isSubmitted() && $form->isValid();
    }


}