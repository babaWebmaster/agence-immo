<?php

namespace App\Service;

use App\Entity\Image;
use App\Repository\ImageRepository;
use Symfony\Component\Asset\Packages;
use App\Enum\ImageSuffix;

class ImageHtmlBuilder
{
    private string $uploadDirBaseUrl;
    private Packages $assetPackages;
    private array $baseFormats = [
        'thumbnail' => 150,
        'small'     => 400,
        'medium'    => 800,
        'large'     => 1200,
        'xLarge'    => 1920,
      //  'original'  => null, // Traité séparément ou dynamic si besoin
    ];
    private array $extensions = [];
    private array $sources = [];
    private array $srcSets = [];
    private array $htmlSource = [];
    private ?Image $image = null;

    public function __construct(Packages $assetPackages, private ImageRepository $imageRepository)
    {
        $this->uploadDirBaseUrl = '/uploads/images/'; // Votre chemin de base pour les images
        $this->assetPackages = $assetPackages;
        $this->extensions = array_map(fn($case) => $case->value, ImageSuffix::cases());
        array_splice($this->extensions,-1);
    }

    /**
     * Génère la balise <picture> ou <img> avec srcset/sizes pour une image donnée.
     *
     * @param Image  $image      L'entité Image.
     * @param string $altText    Le texte alternatif pour l'image.
     * @param array  $attributes Un tableau associatif d'attributs HTML (e.g., ['class' => 'my-class', 'data-id' => '123']).
     */
    public function initImage(int $imageId): bool
    {


            $this->image = $this->imageRepository->find($imageId);
            $this->sources = [];
            $this->srcSets = [];
            $this->htmlSource = [];


            return $this->image !== null;
    }

    private function buildAttributes(array $attributes): string
    {
        //valeur par default
        $extraAttributes='';

        if(empty($attributes)){
            return $extraAttributes;
        }

        foreach ($attributes as $attrName => $attrValue) {
            // Évitez de dupliquer ou d'écraser des attributs clés comme src, srcset, sizes, alt
            if (!in_array($attrName, ['src', 'srcset', 'sizes', 'alt', 'loading'])) {
                $extraAttributes .= sprintf(' %s="%s"', htmlspecialchars($attrName), htmlspecialchars($attrValue));
            }
        }

        return $extraAttributes;
    }

    public function getImageUrlByFormat($srcFormat): string
    {

              if (!$this->image) {
                   return '';
                }

            [$size, $extension] = explode('_', $srcFormat, 2);

            $key = $size . '_' . $extension;

            if (isset($this->image->getFormats()[$key])) {
                return $this->assetPackages->getUrl(
                    $this->image->getFormats()[$key],
                    'uploads_images'
                );
            }

            foreach ($this->baseFormats as $format => $width) {
                $key = $format . '_' . $extension;

                if (isset($this->image->getFormats()[$key])) {
                    return $this->assetPackages->getUrl(
                        $this->image->getFormats()[$key],
                        'uploads_images'
                    );
                }
            }

            foreach ($this->baseFormats as $format => $width) {
                $key = $format . '_jpg';

                if (isset($this->image->getFormats()[$key])) {
                    return $this->assetPackages->getUrl(
                        $this->image->getFormats()[$key],
                        'uploads_images'
                    );
                }
            }

             return '';
        }


    public function buildSources(int $minWidth = 0, int $maxWidth = PHP_INT_MAX):array{

        if (!empty($this->sources)) {
             return $this->sources;
        }
        if (!$this->image) {
            return $this->sources = [];
            }

        $imageFormats = $this->image->getFormats();
        $imageWidthOriginal = $this->image->getWidth();
       // $this->baseFormats['original'] = $imageWidthOriginal;

        foreach($this->extensions as $key => $extension){
            foreach($this->baseFormats as $format => $width){

                  if ($width < $minWidth || $width > $maxWidth) {
                     continue;
                }

                $imageFormat= $format.$extension;

               if (isset($imageFormats[$imageFormat])) {
                $this->sources[ltrim($extension,'_')][] = $this->assetPackages->getUrl($imageFormats[$imageFormat], 'uploads_images') . ' ' . $width . 'w';
                 }
            }
        }
       return $this->sources;
    }

    public function buildSrcSets(): array{

                if (!empty($this->srcSets)) {
                 return $this->srcSets;
            }

            if (!empty($this->getSources()) && (isset($this->getSources()['avif']) || isset($this->getSources()['webp']))) {
                foreach($this->getSources() as $key => $urls){

                    $this->srcSets[$key]=implode(',',$this->getSources()[$key]);
                }
            };
        return $this->srcSets;
    }

    public function buildHtmlSource($sizes): array{
        $htmlSource=[];

        if(!empty($this->srcSets)){
            foreach(['avif', 'webp'] as $format){

                $htmlSource[$format]= sprintf(
                    '<source srcset="%s" type="image/%s" sizes="%s">',
                    htmlspecialchars($this->srcSets[$format], ENT_QUOTES),
                    $format,
                    $this->buildSizes($sizes)
                  );
            }
        }
                $this->htmlSource = $htmlSource;

                return $htmlSource;
    }

    public function buildHtmlPicture($attributes=[], $loading='lazy', $sizes='', $attributesPicture=[], int $minWidth= 0, int $maxWidth = PHP_INT_MAX): string{

        $this->buildSources($minWidth, $maxWidth);
        $this->buildSrcSets();
        $this->buildHtmlSource($sizes);
        $attributesPicture = $this->buildAttributes($attributesPicture);
        $htmlPicture ='';
        if(is_array($this->htmlSource)){
             $htmlPicture.= '<picture '.$attributesPicture.'>';

            foreach($this->htmlSource as $source){
                 $htmlPicture.= $source;
            }

            $htmlPicture.= $this->htmlImg($attributes, $loading, $sizes);

            $htmlPicture.= '</picture>';
        }


        return $htmlPicture;
    }

    public function htmlImg($attributes = [], $loading = 'lazy', $sizes = '', $formatSrc = '', $extension = 'jpg', $srcset = true): string
    {
        $src = !empty($formatSrc) ? $this->getImageUrlByFormat($formatSrc) : $this->buildFallbackImg();

        $srcsetStr = ($srcset && isset($this->srcSets[$extension]))
            ? ' srcset="' . $this->srcSets[$extension] . '"'
            : '';

        $sizesStr = !empty($sizes) ? sprintf('sizes="%s" ', $this->buildSizes($sizes)) : '';

        $alt = (!$this->image) ? '' : $this->image->getAltText();

        $img = '<img';
        $img .= $this->buildAttributes($attributes);
        $img .= ' alt="' . htmlspecialchars($alt, ENT_QUOTES) . '"';
        $img .= ' src="' . $src . '" ';
        $img .= $this->buildLoadingLazy($loading);
        $img .= $sizesStr;
        $img .= $srcsetStr;
        $img .= '>';

        return $img;
    }

    public function buildLoadingLazy($loading= 'lazy'): string{
        return 'loading= "'.$loading.'" ';
    }

    public function buildFallbackImg(): string{
          if (!$this->image) {
             return '';
             }

        $jpgFormats = array_filter(
            $this->image->getFormats(),
            fn($key) => str_ends_with($key, '_jpg'),
            ARRAY_FILTER_USE_KEY
        );

        $fallback = '';

        foreach ($this->baseFormats as $format => $width) {
         $key = $format . '_jpg';

            if (isset($jpgFormats[$key])) {
                $fallback =$this->assetPackages->getUrl($jpgFormats[$key], 'uploads_images');
                break;
            }
        }

        return $fallback;
    }

    public function buildSizes($sizes=''):string{
        return $sizes;
    }

    public function buildPreload($sizes='', $format= 'jpg'){
        $preload ='';
        $this->buildSources();
        $this->buildSrcSets();

        $srcSet = isset($this->getSrcSets()[$format]) ? $this->getSrcSets()[$format] : '';

        $format = $format === 'jpg' ? 'jpeg' : $format;

        $preload ='<link rel="preload" as="image" ';
        $preload.= 'imagesrcset="'.$srcSet.'" ';
        $preload.= 'imagesizes="'.$this->buildSizes($sizes).'" ';
        $preload.= 'fetchpriority="high" ';
        $preload.= 'type="image/'.$format.'"';
        $preload.= '>';

        return $preload;
    }


    public function htmlImage(array $attributes = [], string $loading = 'lazy', string $sizes = '', string $fetchPriority = '', string $extension = 'avif', int $minWidth = 0, int $maxWidth = PHP_INT_MAX): string
    {
        if (!$this->image) {
            return '';
        }

        // On initialise les sources et les srcset en appliquant le filtre de taille minimum
        $this->buildSources($minWidth, $maxWidth);
        $this->buildSrcSets();
        $srcSets = $this->getSrcSets();

        $activeSrcSet = $srcSets[$extension] ?? '';

        // Sélection automatique d'un fallback intelligent selon l'extension demandée
        $fallbackFormat = ($extension === 'avif' || $extension === 'webp') ? 'large_' . $extension : 'large_jpg';
        $src = $this->getImageUrlByFormat($fallbackFormat) ?? $this->buildFallbackImg();

        $alt = $this->image->getAltText() ?? '';

        $img = '<img';
        $img .= $this->buildAttributes($attributes);
        $img .= ' alt="' . htmlspecialchars($alt, ENT_QUOTES) . '"';
        $img .= ' src="' . $src . '"';

        if (!empty($activeSrcSet)) {
            $img .= ' srcset="' . htmlspecialchars($activeSrcSet, ENT_QUOTES) . '"';
        }

        if (!empty($sizes)) {
            $img .= ' sizes="' . htmlspecialchars($this->buildSizes($sizes), ENT_QUOTES) . '"';
        }

        if (!empty($fetchPriority)) {
            $img .= ' fetchpriority="' . htmlspecialchars($fetchPriority, ENT_QUOTES) . '"';
        }

        $img .= ' loading="' . htmlspecialchars($loading, ENT_QUOTES) . '"';
        $img .= '>';

         return $img;
    }

    public function getSources(): array
    {
        return $this->sources;
    }

    public function getSrcSets(): array
    {
        return $this->srcSets;
    }

    public function getBaseFormats():array{
        return $this->baseFormats;
    }

    public function removeLastBaseFormat(): void {
    array_pop($this->baseFormats);
    }

    public function getImage(): ?Image
    {
     return $this->image;
    }


}