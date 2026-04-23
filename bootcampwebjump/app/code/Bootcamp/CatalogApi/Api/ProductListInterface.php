<?php

namespace Bootcamp\CatalogApi\Api;

interface ProductListInterface
{
    /**
     * Retorna lista de produtos com atributos customizados do bootcamp
     *
     * @return array
     */
    public function getList();
}
