<?php

namespace App\Enum;

enum ImageSuffix: string
{
    case WEBP = '_webp';
    case AVIF = '_avif';
    case JPG  = '_jpg';
    case PNG  = '_png';
    case NONE = '';
}
?>