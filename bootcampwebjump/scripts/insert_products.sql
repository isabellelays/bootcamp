SET @entity_type_id = (SELECT entity_type_id FROM eav_entity_type WHERE entity_type_code = 'catalog_product');
SET @attr_set_id = 4;

-- ============================================================
-- PRODUTO 1: Camiseta Dev
-- ============================================================
INSERT INTO catalog_product_entity (attribute_set_id, type_id, sku, has_options, required_options, created_at, updated_at)
VALUES (@attr_set_id, 'simple', 'BOOT-CAMISETA-001', 0, 0, NOW(), NOW());
SET @p1 = LAST_INSERT_ID();

INSERT INTO catalog_product_entity_varchar (attribute_id, store_id, entity_id, value) VALUES
(73, 0, @p1, 'Camiseta Dev — Sua Stack Estampada'),
(121, 0, @p1, 'camiseta-dev-sua-stack-estampada');

INSERT INTO catalog_product_entity_text (attribute_id, store_id, entity_id, value) VALUES
(75, 0, @p1, 'Camiseta 100% algodão com estampa da sua stack favorita. Disponível em diversos tamanhos. Perfeita para coding sessions, meetups e hackathons. Stack: React · Node · PHP. Material: Algodão.'),
(76, 0, @p1, 'Camiseta 100% algodão com estampa da sua stack favorita.');

INSERT INTO catalog_product_entity_decimal (attribute_id, store_id, entity_id, value) VALUES
(77, 0, @p1, 89.90),
(82, 0, @p1, 0.5);

INSERT INTO catalog_product_entity_int (attribute_id, store_id, entity_id, value) VALUES
(97, 0, @p1, 1),
(99, 0, @p1, 4),
(136, 0, @p1, 2);

-- Estoque
INSERT INTO cataloginventory_stock_item (product_id, stock_id, qty, is_in_stock, manage_stock, use_config_manage_stock)
VALUES (@p1, 1, 100, 1, 1, 0)
ON DUPLICATE KEY UPDATE qty=100, is_in_stock=1;

INSERT INTO cataloginventory_stock_status (product_id, website_id, stock_id, qty, stock_status)
VALUES (@p1, 0, 1, 100, 1)
ON DUPLICATE KEY UPDATE qty=100, stock_status=1;

-- ============================================================
-- PRODUTO 2: Livro Arquitetura Limpa
-- ============================================================
INSERT INTO catalog_product_entity (attribute_set_id, type_id, sku, has_options, required_options, created_at, updated_at)
VALUES (@attr_set_id, 'simple', 'BOOT-LIVRO-001', 0, 0, NOW(), NOW());
SET @p2 = LAST_INSERT_ID();

INSERT INTO catalog_product_entity_varchar (attribute_id, store_id, entity_id, value) VALUES
(73, 0, @p2, 'Arquitetura Limpa — Guia Definitivo'),
(121, 0, @p2, 'arquitetura-limpa-guia-definitivo');

INSERT INTO catalog_product_entity_text (attribute_id, store_id, entity_id, value) VALUES
(75, 0, @p2, 'O clássico de Robert C. Martin. Princípios fundamentais para estruturar software sustentável e desacoplado. Stack: Clean Architecture · SOLID. Material: Papel.'),
(76, 0, @p2, 'O clássico de Robert C. Martin sobre Arquitetura Limpa e SOLID.');

INSERT INTO catalog_product_entity_decimal (attribute_id, store_id, entity_id, value) VALUES
(77, 0, @p2, 129.00),
(82, 0, @p2, 0.4);

INSERT INTO catalog_product_entity_int (attribute_id, store_id, entity_id, value) VALUES
(97, 0, @p2, 1),
(99, 0, @p2, 4),
(136, 0, @p2, 2);

INSERT INTO cataloginventory_stock_item (product_id, stock_id, qty, is_in_stock, manage_stock, use_config_manage_stock)
VALUES (@p2, 1, 50, 1, 1, 0)
ON DUPLICATE KEY UPDATE qty=50, is_in_stock=1;

INSERT INTO cataloginventory_stock_status (product_id, website_id, stock_id, qty, stock_status)
VALUES (@p2, 0, 1, 50, 1)
ON DUPLICATE KEY UPDATE qty=50, stock_status=1;

-- ============================================================
-- PRODUTO 3: Livro SOLID na Prática
-- ============================================================
INSERT INTO catalog_product_entity (attribute_set_id, type_id, sku, has_options, required_options, created_at, updated_at)
VALUES (@attr_set_id, 'simple', 'BOOT-LIVRO-002', 0, 0, NOW(), NOW());
SET @p3 = LAST_INSERT_ID();

INSERT INTO catalog_product_entity_varchar (attribute_id, store_id, entity_id, value) VALUES
(73, 0, @p3, 'SOLID na Prática'),
(121, 0, @p3, 'solid-na-pratica');

INSERT INTO catalog_product_entity_text (attribute_id, store_id, entity_id, value) VALUES
(75, 0, @p3, 'Aplicação prática dos 5 princípios SOLID com exemplos reais em múltiplas linguagens. Edição de bolso. Stack: OOP · Design Patterns. Material: Papel.'),
(76, 0, @p3, 'Aplicação prática dos 5 princípios SOLID com exemplos reais.');

INSERT INTO catalog_product_entity_decimal (attribute_id, store_id, entity_id, value) VALUES
(77, 0, @p3, 94.90),
(82, 0, @p3, 0.3);

INSERT INTO catalog_product_entity_int (attribute_id, store_id, entity_id, value) VALUES
(97, 0, @p3, 1),
(99, 0, @p3, 4),
(136, 0, @p3, 2);

INSERT INTO cataloginventory_stock_item (product_id, stock_id, qty, is_in_stock, manage_stock, use_config_manage_stock)
VALUES (@p3, 1, 50, 1, 1, 0)
ON DUPLICATE KEY UPDATE qty=50, is_in_stock=1;

INSERT INTO cataloginventory_stock_status (product_id, website_id, stock_id, qty, stock_status)
VALUES (@p3, 0, 1, 50, 1)
ON DUPLICATE KEY UPDATE qty=50, stock_status=1;

-- ============================================================
-- PRODUTO 4: Pack Adesivos Dev
-- ============================================================
INSERT INTO catalog_product_entity (attribute_set_id, type_id, sku, has_options, required_options, created_at, updated_at)
VALUES (@attr_set_id, 'simple', 'BOOT-ADESIVO-001', 0, 0, NOW(), NOW());
SET @p4 = LAST_INSERT_ID();

INSERT INTO catalog_product_entity_varchar (attribute_id, store_id, entity_id, value) VALUES
(73, 0, @p4, 'Pack Adesivos Dev (12 un)'),
(121, 0, @p4, 'pack-adesivos-dev-12-un');

INSERT INTO catalog_product_entity_text (attribute_id, store_id, entity_id, value) VALUES
(75, 0, @p4, 'Kit com 12 adesivos vinílicos de linguagens e frameworks: React, Vue, Node, Python, Docker, Git, Linux e mais. Resistentes à água. Stack: Multi-stack. Material: Vinil.'),
(76, 0, @p4, 'Kit com 12 adesivos vinílicos de linguagens e frameworks. Resistentes à água.');

INSERT INTO catalog_product_entity_decimal (attribute_id, store_id, entity_id, value) VALUES
(77, 0, @p4, 24.90),
(82, 0, @p4, 0.1);

INSERT INTO catalog_product_entity_int (attribute_id, store_id, entity_id, value) VALUES
(97, 0, @p4, 1),
(99, 0, @p4, 4),
(136, 0, @p4, 2);

INSERT INTO cataloginventory_stock_item (product_id, stock_id, qty, is_in_stock, manage_stock, use_config_manage_stock)
VALUES (@p4, 1, 200, 1, 1, 0)
ON DUPLICATE KEY UPDATE qty=200, is_in_stock=1;

INSERT INTO cataloginventory_stock_status (product_id, website_id, stock_id, qty, stock_status)
VALUES (@p4, 0, 1, 200, 1)
ON DUPLICATE KEY UPDATE qty=200, stock_status=1;

-- ============================================================
-- PRODUTO 5: Caneca "while(alive) coffee++"
-- ============================================================
INSERT INTO catalog_product_entity (attribute_set_id, type_id, sku, has_options, required_options, created_at, updated_at)
VALUES (@attr_set_id, 'simple', 'BOOT-CANECA-001', 0, 0, NOW(), NOW());
SET @p5 = LAST_INSERT_ID();

INSERT INTO catalog_product_entity_varchar (attribute_id, store_id, entity_id, value) VALUES
(73, 0, @p5, 'Caneca "while(alive) coffee++"'),
(121, 0, @p5, 'caneca-while-alive-coffee');

INSERT INTO catalog_product_entity_text (attribute_id, store_id, entity_id, value) VALUES
(75, 0, @p5, 'Caneca de cerâmica 330ml com estampa temática. Porque todo dev sabe que produtividade é diretamente proporcional ao café. Stack: Coffee-driven Development. Material: Cerâmica.'),
(76, 0, @p5, 'Caneca de cerâmica 330ml com estampa temática para devs.');

INSERT INTO catalog_product_entity_decimal (attribute_id, store_id, entity_id, value) VALUES
(77, 0, @p5, 49.90),
(82, 0, @p5, 0.35);

INSERT INTO catalog_product_entity_int (attribute_id, store_id, entity_id, value) VALUES
(97, 0, @p5, 1),
(99, 0, @p5, 4),
(136, 0, @p5, 2);

INSERT INTO cataloginventory_stock_item (product_id, stock_id, qty, is_in_stock, manage_stock, use_config_manage_stock)
VALUES (@p5, 1, 80, 1, 1, 0)
ON DUPLICATE KEY UPDATE qty=80, is_in_stock=1;

INSERT INTO cataloginventory_stock_status (product_id, website_id, stock_id, qty, stock_status)
VALUES (@p5, 0, 1, 80, 1)
ON DUPLICATE KEY UPDATE qty=80, stock_status=1;

SELECT 'Produtos inseridos com sucesso!' AS resultado;
