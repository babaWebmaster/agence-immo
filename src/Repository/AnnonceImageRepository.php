<?php

namespace App\Repository;

use App\Entity\AnnonceImage;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<AnnonceImage>
 */
class AnnonceImageRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, AnnonceImage::class);
    }


    public function findByAnnonceIds(array $annonceIds): array
    {
        return $this->createQueryBuilder('ai')
            ->select('IDENTITY(ai.image) AS imageId')
            ->addSelect('IDENTITY(ai.annonce) AS annonceId')
            ->addSelect('ai.position AS position')       
            ->andWhere('ai.annonce IN (:annonceIds)')
            ->setParameter('annonceIds', $annonceIds)
            ->orderBy('ai.position', 'ASC')
            ->getQuery()
            ->getResult();
    }

    //    /**
    //     * @return AnnonceImage[] Returns an array of AnnonceImage objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('a')
    //            ->andWhere('a.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('a.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?AnnonceImage
    //    {
    //        return $this->createQueryBuilder('a')
    //            ->andWhere('a.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
