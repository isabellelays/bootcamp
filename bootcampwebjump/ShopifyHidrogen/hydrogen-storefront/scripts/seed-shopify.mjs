#!/usr/bin/env node
/**
 * seed-shopify.mjs
 *
 * Popula uma dev store Shopify com produtos do Bootcamp 2026, metafields
 * customizados (tech_stack, highlight_badge) e a colecao "destaques".
 *
 * Pre-requisitos:
 *   - Node 18+ (fetch nativo)
 *   - Arquivo .env na raiz do projeto Hydrogen com:
 *       PUBLIC_STORE_DOMAIN=sua-loja.myshopify.com
 *       SHOPIFY_ADMIN_TOKEN=shpat_xxxxxxxxxxxxx
 *
 * Rodar (na raiz do projeto bootcamp-hydrogen):
 *   node scripts/seed-shopify.mjs
 *
 * Observacoes:
 *   - O script nao sobrescreve produtos existentes. Se voce rodar duas
 *     vezes, o Shopify adicionara sufixo (-1, -2) no handle.
 *   - As imagens vem de picsum.photos (placeholders deterministicos).
 */

import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// ---------- .env loader (sem deps) ----------
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '..', '.env');
if (existsSync(envPath)) {
  const content = readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i === -1) continue;
    const k = t.slice(0, i).trim();
    const v = t.slice(i + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[k]) process.env[k] = v;
  }
}

const STORE_DOMAIN = process.env.PUBLIC_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN;
const ADMIN_TOKEN  = process.env.SHOPIFY_ADMIN_TOKEN;
const API_VERSION  = '2024-10';

if (!STORE_DOMAIN || !ADMIN_TOKEN) {
  console.error('\nErro: variaveis de ambiente ausentes.');
  console.error('   Adicione ao .env:');
  console.error('     PUBLIC_STORE_DOMAIN=sua-loja.myshopify.com');
  console.error('     SHOPIFY_ADMIN_TOKEN=shpat_xxxxxxxxxxxxx\n');
  process.exit(1);
}

const endpoint = `https://${STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`;

async function gql(query, variables = {}) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ADMIN_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) {
    throw new Error(`GraphQL errors:\n${JSON.stringify(json.errors, null, 2)}`);
  }
  return json.data;
}

function checkUserErrors(data, field) {
  const errs = data?.[field]?.userErrors ?? [];
  if (errs.length) {
    throw new Error(`${field} userErrors:\n${JSON.stringify(errs, null, 2)}`);
  }
}

// ---------- Produtos do bootcamp ----------
const products = [
  {
    title: 'Camiseta Bootcamp 2026',
    handle: 'camiseta-bootcamp-2026',
    descriptionHtml:
      '<p><strong>Camiseta premium 100% algodao</strong> com design exclusivo do Bootcamp 2026. Ideal para desenvolvedores que querem vestir a camisa do codigo.</p>' +
      '<ul><li>Tecido premium</li><li>Estampa resistente</li><li>Modelagem unissex</li></ul>',
    productType: 'Vestuario',
    vendor: 'Bootcamp Store',
    tags: ['bootcamp', 'camiseta', 'destaque', 'react'],
    price: '89.90',
    compareAtPrice: '119.90',
    techStack: 'React + Remix',
    highlightBadge: 'Mais Vendido',
    imageUrl: 'https://picsum.photos/seed/camiseta-bootcamp/800/800',
  },
  {
    title: 'Caneca Dev Mode',
    handle: 'caneca-dev-mode',
    descriptionHtml:
      '<p>Caneca de ceramica 300ml com a estampa classica <em>"It works on my machine"</em>. O combustivel perfeito para suas madrugadas de codigo.</p>',
    productType: 'Acessorios',
    vendor: 'Bootcamp Store',
    tags: ['bootcamp', 'caneca', 'destaque', 'javascript'],
    price: '49.90',
    techStack: 'JavaScript',
    highlightBadge: 'Novo',
    imageUrl: 'https://picsum.photos/seed/caneca-dev/800/800',
  },
  {
    title: 'Kit Adesivos Stack',
    handle: 'kit-adesivos-stack',
    descriptionHtml:
      '<p>Kit com 20 adesivos vinil das principais tecnologias: React, Node, Python, Docker, Kubernetes, GraphQL e muito mais. Perfeito para personalizar seu notebook.</p>',
    productType: 'Acessorios',
    vendor: 'Bootcamp Store',
    tags: ['bootcamp', 'adesivos', 'destaque', 'multi-stack'],
    price: '29.90',
    compareAtPrice: '39.90',
    techStack: 'Multi-stack',
    highlightBadge: 'Promocao',
    imageUrl: 'https://picsum.photos/seed/adesivos-stack/800/800',
  },
  {
    title: 'Livro Clean Code Patterns',
    handle: 'livro-clean-code-patterns',
    descriptionHtml:
      '<p>Guia definitivo para escrever codigo limpo, legivel e sustentavel. Aborda padroes de projeto, boas praticas e refatoracao com exemplos modernos.</p>',
    productType: 'Livros',
    vendor: 'Bootcamp Store',
    tags: ['bootcamp', 'livro', 'destaque', 'best-practices'],
    price: '119.90',
    techStack: 'Best Practices',
    highlightBadge: 'Imperdivel',
    imageUrl: 'https://picsum.photos/seed/livro-clean-code/800/800',
  },
  {
    title: 'Mochila Tech Pro',
    handle: 'mochila-tech-pro',
    descriptionHtml:
      '<p>Mochila com compartimento acolchoado para notebook 15", porta USB integrada, material impermeavel e capacidade de 25L. A mochila ideal para o dia a dia do dev.</p>',
    productType: 'Acessorios',
    vendor: 'Bootcamp Store',
    tags: ['bootcamp', 'mochila', 'destaque', 'hardware'],
    price: '249.90',
    compareAtPrice: '299.90',
    techStack: 'Hardware',
    highlightBadge: 'Premium',
    imageUrl: 'https://picsum.photos/seed/mochila-tech/800/800',
  },
];

// ---------- GraphQL mutations ----------
const PRODUCT_CREATE = `
  mutation productCreate($input: ProductInput!, $media: [CreateMediaInput!]) {
    productCreate(input: $input, media: $media) {
      product {
        id
        handle
        title
        variants(first: 1) { nodes { id } }
      }
      userErrors { field message }
    }
  }
`;

const VARIANTS_UPDATE = `
  mutation productVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
    productVariantsBulkUpdate(productId: $productId, variants: $variants) {
      productVariants { id price compareAtPrice }
      userErrors { field message }
    }
  }
`;

const COLLECTION_CREATE = `
  mutation collectionCreate($input: CollectionInput!) {
    collectionCreate(input: $input) {
      collection { id handle title }
      userErrors { field message }
    }
  }
`;

const COLLECTION_ADD_PRODUCTS = `
  mutation collectionAddProducts($id: ID!, $productIds: [ID!]!) {
    collectionAddProducts(id: $id, productIds: $productIds) {
      collection { id }
      userErrors { field message }
    }
  }
`;

const PUBLICATIONS_QUERY = `
  query { publications(first: 25) { nodes { id name } } }
`;

const PUBLISHABLE_PUBLISH = `
  mutation publishablePublish($id: ID!, $input: [PublicationInput!]!) {
    publishablePublish(id: $id, input: $input) {
      userErrors { field message }
    }
  }
`;

const PRODUCT_BY_HANDLE = `
  query productByHandle($handle: String!) {
    productByHandle(handle: $handle) { id title }
  }
`;

const PRODUCT_DELETE = `
  mutation productDelete($input: ProductDeleteInput!) {
    productDelete(input: $input) {
      deletedProductId
      userErrors { field message }
    }
  }
`;

const COLLECTION_BY_HANDLE = `
  query collectionByHandle($handle: String!) {
    collectionByHandle(handle: $handle) { id title }
  }
`;

const COLLECTION_DELETE = `
  mutation collectionDelete($input: CollectionDeleteInput!) {
    collectionDelete(input: $input) {
      deletedCollectionId
      userErrors { field message }
    }
  }
`;

// ---------- Execucao ----------
async function main() {
  console.log(`\n>>> Seeding ${STORE_DOMAIN} (API ${API_VERSION})\n`);

  // Descobrir todas as publications (Online Store, Storefront API/Headless, etc)
  const pubs = await gql(PUBLICATIONS_QUERY);
  const allPublications = pubs.publications.nodes;
  console.log(`Publications encontradas: ${allPublications.length}`);
  for (const pub of allPublications) {
    console.log(`   - ${pub.name} (${pub.id})`);
  }
  console.log('');

  // Limpeza: apaga produtos existentes com os mesmos handles (idempotente)
  console.log(`>>> Verificando produtos existentes...`);
  for (const p of products) {
    const existing = await gql(PRODUCT_BY_HANDLE, { handle: p.handle });
    if (existing.productByHandle) {
      console.log(`   [${p.handle}] ja existe (${existing.productByHandle.id}) - deletando...`);
      const del = await gql(PRODUCT_DELETE, { input: { id: existing.productByHandle.id } });
      checkUserErrors(del, 'productDelete');
    }
  }
  // Limpeza: apaga colecao "destaques" existente se houver
  const existingCol = await gql(COLLECTION_BY_HANDLE, { handle: 'destaques' });
  if (existingCol.collectionByHandle) {
    console.log(`   colecao "destaques" ja existe (${existingCol.collectionByHandle.id}) - deletando...`);
    const delCol = await gql(COLLECTION_DELETE, { input: { id: existingCol.collectionByHandle.id } });
    checkUserErrors(delCol, 'collectionDelete');
  }
  console.log('');

  const createdProductIds = [];

  // Criar cada produto
  for (const p of products) {
    console.log(`[${p.handle}] criando "${p.title}"...`);

    const productInput = {
      title: p.title,
      handle: p.handle,
      descriptionHtml: p.descriptionHtml,
      productType: p.productType,
      vendor: p.vendor,
      tags: p.tags,
      metafields: [
        { namespace: 'custom', key: 'tech_stack',      value: p.techStack,      type: 'single_line_text_field' },
        { namespace: 'custom', key: 'highlight_badge', value: p.highlightBadge, type: 'single_line_text_field' },
      ],
    };
    const mediaInput = p.imageUrl
      ? [{ mediaContentType: 'IMAGE', originalSource: p.imageUrl, alt: p.title }]
      : [];

    const data = await gql(PRODUCT_CREATE, { input: productInput, media: mediaInput });
    checkUserErrors(data, 'productCreate');
    const productId = data.productCreate.product.id;
    const variantId = data.productCreate.product.variants.nodes[0].id;
    console.log(`   produto: ${productId}`);

    // Atualizar preco (e compareAtPrice se houver) + permitir venda sem estoque
    const variantUpdate = {
      id: variantId,
      price: p.price,
      ...(p.compareAtPrice ? { compareAtPrice: p.compareAtPrice } : {}),
      inventoryPolicy: 'CONTINUE',
    };
    const vData = await gql(VARIANTS_UPDATE, { productId, variants: [variantUpdate] });
    checkUserErrors(vData, 'productVariantsBulkUpdate');
    console.log(`   preco: R$ ${p.price}${p.compareAtPrice ? ` (de R$ ${p.compareAtPrice})` : ''}`);

    // Publicar em TODOS os canais (Online Store, Storefront API, etc)
    if (allPublications.length) {
      const pubData = await gql(PUBLISHABLE_PUBLISH, {
        id: productId,
        input: allPublications.map((pub) => ({ publicationId: pub.id })),
      });
      checkUserErrors(pubData, 'publishablePublish');
      console.log(`   publicado em ${allPublications.length} canais`);
    }

    createdProductIds.push(productId);
    console.log('');
  }

  // Criar colecao "destaques"
  console.log(`>>> Criando colecao "destaques"...`);
  const colData = await gql(COLLECTION_CREATE, {
    input: {
      title: 'Destaques',
      handle: 'destaques',
      descriptionHtml: '<p>Produtos em destaque do Bootcamp 2026.</p>',
    },
  });
  checkUserErrors(colData, 'collectionCreate');
  const collectionId = colData.collectionCreate.collection.id;
  console.log(`   colecao: ${collectionId}`);

  // Associar produtos a colecao
  const addData = await gql(COLLECTION_ADD_PRODUCTS, { id: collectionId, productIds: createdProductIds });
  checkUserErrors(addData, 'collectionAddProducts');
  console.log(`   ${createdProductIds.length} produtos adicionados`);

  // Publicar colecao em TODOS os canais
  if (allPublications.length) {
    const colPub = await gql(PUBLISHABLE_PUBLISH, {
      id: collectionId,
      input: allPublications.map((pub) => ({ publicationId: pub.id })),
    });
    checkUserErrors(colPub, 'publishablePublish');
    console.log(`   colecao publicada em ${allPublications.length} canais`);
  }

  console.log(`\n>>> Seed concluido!`);
  console.log(`    - ${createdProductIds.length} produtos criados`);
  console.log(`    - 1 colecao "destaques" com todos os produtos`);
  console.log(`    - Metafields custom.tech_stack e custom.highlight_badge em cada produto\n`);
  console.log(`    Admin: https://${STORE_DOMAIN}/admin/products\n`);
}

main().catch((err) => {
  console.error('\nErro:', err.message);
  process.exit(1);
});