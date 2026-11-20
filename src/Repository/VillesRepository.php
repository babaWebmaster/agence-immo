<?php

namespace App\Repository;

use App\Entity\Villes;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\QueryBuilder;

/**
 * @extends ServiceEntityRepository<Villes>
 */
class VillesRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Villes::class);
    }

    
    public function filterByZones(
        QueryBuilder $queryBuilder,
        array $departementIds
        ): QueryBuilder {
            return $queryBuilder
            ->leftJoin('entity.departement', 'd')
            ->andWhere('d.id IN (:departementIds)')
            ->setParameter('departementIds', $departementIds);
    }

    public function getNamesAutocomplete(string $value, array $zones): array
    {
        return $this->createQueryBuilder('v')
            ->select('DISTINCT v.name, v.postalCode, v.id')
            ->where('v.name LIKE :value')
            ->andWhere('v.departement IN (:zones)')
            ->andWhere('v.lieuDit = :lieuDit')
            ->setParameter('value', $value . '%')
            ->setParameter('zones', $zones)
            ->setParameter('lieuDit', '')
            ->getQuery()
            ->getArrayResult();
    }

    public function getIdByName(array $villes){
        return $this->createQueryBuilder('v')
            ->select('DISTINCT  v.id, v.name, v.postalCode')
            ->where('v.name IN (:villes)')            
            ->andWhere('v.lieuDit = :lieuDit')
            ->setParameter('villes', $villes)           
            ->setParameter('lieuDit', '')
            ->getQuery()
            ->getArrayResult();
    }

     public function getIdById(array $villes){
        return $this->createQueryBuilder('v')
            ->select('DISTINCT   v.name')
            ->where('v.id IN (:villes)')            
            ->andWhere('v.lieuDit = :lieuDit')
            ->setParameter('villes', $villes)           
            ->setParameter('lieuDit', '')
            ->getQuery()
            ->getArrayResult();
    }
  
}
