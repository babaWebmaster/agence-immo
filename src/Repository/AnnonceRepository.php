<?php

namespace App\Repository;

use App\Entity\Annonce;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\QueryBuilder;

/**
 * @extends ServiceEntityRepository<Annonce>
 */
class AnnonceRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Annonce::class);
    }


    public function findAllForSitemap(): array
    {
        return $this->createQueryBuilder('a')
        ->select('a.id', 'a.slug')
        ->getQuery()
        ->getArrayResult();
    }

     public function findLastThree(): array
    {
            $rows = $this->createQueryBuilder('a')
                ->select('a, v.name AS ville')
                ->leftJoin('a.ville', 'v')
                ->orderBy('a.createdAt', 'DESC')
                ->setMaxResults(3)
                ->getQuery()
                ->getArrayResult();

            $ids = array_column(array_column($rows, 0), 'id');

            if (!$ids) {
                return [];
            }

            $annonces = $this->createQueryBuilder('a')
                ->leftJoin('a.annonceImages', 'ai')
                ->addSelect('ai')
                ->where('a.id IN (:ids)')
                ->setParameter('ids', $ids)
                ->orderBy('a.createdAt', 'DESC')
                ->getQuery()
                ->getResult();

            foreach ($annonces as $key => $annonce) {
                $annonces[$key] = [
                    'annonce' => $annonce,
                    'ville' => $rows[$key]['ville'],
                ];
            }

        return $annonces;
    }
    public function countAnnonces(): int
    {
        return $this->createQueryBuilder('a')
            ->select('COUNT(a.id)')
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function findVillesWithAnnonces(): array
    {
        return $this->createQueryBuilder('a')
            ->select('DISTINCT v.name')
            ->join('a.ville', 'v')
            ->getQuery()
            ->getResult();
    }

    public function findMaxLoyer(): string{
        return $this->createQueryBuilder('a')
            ->select('MAX (a.loyer)')
            ->getQuery()
            ->getSingleScalarResult();
    }

    /*public function searchAnnonceForm(array $types, ?int $loyerMin, ?int $loyerMax, array $villes, ?int $chambres,?int $limit,?int $offset):array
    {
        $query = $this->createQueryBuilder('a')
        ->leftJoin('a.ville', 'v')
        ->addSelect('v.name');
        $query = $this->filterSearchFormAnnonceByIdVille($query, $types, $loyerMin, $loyerMax, $villes, $chambres);

         if ($limit !== null) {
            $query->setMaxResults($limit);
            }

        if ($offset !== null) {
            $query->setFirstResult($offset);
            }

        return $query
        ->getQuery()
        ->getResult();
    }*/


    public function searchAnnonceForm(
            array $types,
            ?int $loyerMin,
            ?int $loyerMax,
            array $villes,
            ?int $chambres,
            ?int $limit,
            ?int $offset
        ): array {
            $query = $this->createQueryBuilder('a')
                ->select('a, v.name AS ville')
                ->leftJoin('a.ville', 'v');

            $query = $this->filterSearchFormAnnonceByIdVille($query, $types, $loyerMin, $loyerMax, $villes, $chambres);

            if ($limit !== null) {
                $query->setMaxResults($limit);
            }

            if ($offset !== null) {
                $query->setFirstResult($offset);
            }

            return $query->getQuery()->getArrayResult();
    }

    public function countAnnonceForm(array $types, ?int $loyerMin, ?int $loyerMax, array $villes, ?int $chambres):int
    {
        $query = $this->createQueryBuilder('a')
        ->select('COUNT(a.id)');

        $query = $this->filterSearchFormAnnonceByIdVille($query, $types, $loyerMin, $loyerMax, $villes, $chambres);



        return $query
        ->getQuery()
        ->getSingleScalarResult();
    }

    public function countAnnonceByNameVille(array $types,?int $loyerMin,?int $loyerMax,array $villes,?int $chambres):int{
         $query = $this->createQueryBuilder('a')
                 ->select('COUNT(a.id)')
                 ->leftJoin('a.ville', 'v');
                 $query = $this->filterSearchFormAnnonceByNameVille(
                    $query,
                    $types,
                    $loyerMin,
                    $loyerMax,
                    $villes,
                    $chambres);

            return $query
            ->getQuery()
            ->getSingleScalarResult();
    }


    public function filterSearchFormAnnonceByIdVille(QueryBuilder $query, array $types, ?int $loyerMin, ?int $loyerMax, array $villes, ?int $chambres):QueryBuilder{

          if ($types) {
                $query
                    ->andWhere('a.type IN (:types)')
                    ->setParameter('types', $types);
            }

            if ($loyerMin !== null) {
             $query
            ->andWhere('a.loyer >= :loyerMin')
            ->setParameter('loyerMin', $loyerMin);
            }

            if ($loyerMax !== null) {
                $query
                    ->andWhere('a.loyer <= :loyerMax')
                    ->setParameter('loyerMax', $loyerMax);
            }

            if ($chambres !== null) {
                $query
                    ->andWhere('a.nombreChambres >= :chambres')
                    ->setParameter('chambres', $chambres);
            }

            if($villes){
                $query->andWhere('a.ville IN (:villes)')
                  ->setParameter('villes', $villes);
            }

       return $query;
    }

        public function filterSearchFormAnnonceByNameVille(QueryBuilder $query,
        array $types,
        ?int $loyerMin,
        ?int $loyerMax,
        array $villes,
        ?int $chambres,
        ?int $limit = null,
        ?int $offset = null):QueryBuilder{

                if ($types) {
                    $query
                        ->andWhere('a.type IN (:types)')
                        ->setParameter('types', $types);
                }

                if ($loyerMin !== null) {
                    $query
                        ->andWhere('a.loyer >= :loyerMin')
                        ->setParameter('loyerMin', $loyerMin);
                }

                if ($loyerMax !== null) {
                    $query
                        ->andWhere('a.loyer <= :loyerMax')
                        ->setParameter('loyerMax', $loyerMax);
                }

                if ($chambres !== null) {
                    $query
                        ->andWhere('a.nombreChambres >= :chambres')
                        ->setParameter('chambres', $chambres);
                }

                if ($villes) {
                    $query
                        ->andWhere('v.name IN (:villes)')
                        ->setParameter('villes', $villes);
                }
                 if ($limit !== null) {
                    $query->setMaxResults($limit);
                    }

                if ($offset !== null) {
                    $query->setFirstResult($offset);
                }


            return $query;

    }



   /* public function searchFormAnnonceByNameVille(array $types,
        ?int $loyerMin,
        ?int $loyerMax,
        array $villes,
        ?int $chambres,
        ?int $limit = null,
        ?int $offset = null): array
    {

                $query = $this->createQueryBuilder('a')
                    ->leftJoin('a.ville', 'v')
                    ->addSelect('a' ,'v.name');

                $query = $this->filterSearchFormAnnonceByNameVille($query,
                $types,
                $loyerMin,
                $loyerMax,
                $villes,
                $chambres,
                $limit,
                $offset);




                return $query->getQuery()->getResult();
    }*/


   public function searchFormAnnonceByNameVille(
        array $types,
        ?int $loyerMin,
        ?int $loyerMax,
        array $villes,
        ?int $chambres,
        ?int $limit = null,
        ?int $offset = null
        ): array {
            $query = $this->createQueryBuilder('a')
                ->select('a, v.name AS ville')
                ->leftJoin('a.ville', 'v');

            $query = $this->filterSearchFormAnnonceByNameVille(
                $query,
                $types,
                $loyerMin,
                $loyerMax,
                $villes,
                $chambres,
                $limit,
                $offset
            );

         return $query->getQuery()->getArrayResult();
    }



    public function getAnnonceById(int $id): ?array
    {
        return $this->createQueryBuilder('a')
            ->select('a.id, a.title, a.loyer, a.surface, a.dpe, a.description, a.type,a.descriptionCourte, a.nombreChambres, v.name AS ville')
            ->leftJoin('a.ville', 'v')
            ->andWhere('a.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult(\Doctrine\ORM\Query::HYDRATE_ARRAY);
    }


}
