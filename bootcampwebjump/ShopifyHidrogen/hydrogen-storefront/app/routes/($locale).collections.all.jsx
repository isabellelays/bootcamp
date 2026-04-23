import {useLoaderData, Link} from 'react-router';
import {getPaginationVariables} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {ProductItem} from '~/components/ProductItem';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: `Loja DevWorld | Catálogo Shopify`}];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context, request}) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  const [{products}] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: {...paginationVariables},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);
  return {products};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {Route.LoaderArgs}
 */
function loadDeferredData({context}) {
  return {};
}

export default function Collection() {
  /** @type {LoaderReturnData} */
  const {products} = useLoaderData();

  return (
    <div style={{fontFamily: "'Segoe UI', system-ui, sans-serif", background: '#f8f9fb', minHeight: '100vh'}}>

      {/* Header da página */}
      <div style={{
        background: 'linear-gradient(135deg, #96bf48 0%, #5e8e3e 100%)',
        color: '#fff',
        padding: '3rem 2rem 2.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{position:'absolute',top:-60,right:-60,width:240,height:240,borderRadius:'50%',background:'rgba(255,255,255,0.07)',pointerEvents:'none'}} />
        <div style={{maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1}}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 999,
            padding: '0.3rem 0.9rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
            marginBottom: '1rem',
            backdropFilter: 'blur(4px)',
          }}>
            🛍 Shopify Storefront API
          </div>
          <h1 style={{margin: '0 0 0.5rem', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.02em'}}>
            Catálogo de Produtos
          </h1>
          <p style={{margin: 0, opacity: 0.85, fontSize: '1rem', maxWidth: 520}}>
            Dados consumidos em tempo real via <strong>Shopify Storefront GraphQL API</strong> pelo Hydrogen
          </p>

          {/* Badge técnico */}
          <div style={{
            marginTop: '1.5rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: 10,
            padding: '0.6rem 1rem',
            fontSize: '0.78rem',
            fontFamily: 'monospace',
            backdropFilter: 'blur(4px)',
          }}>
            <span style={{opacity:0.7}}>query</span>
            <span style={{color:'#d4f5a0', fontWeight:700}}>Catalog</span>
            <span style={{opacity:0.5}}>·</span>
            <span style={{opacity:0.7}}>@inContext</span>
            <span style={{opacity:0.5}}>·</span>
            <span style={{color:'#d4f5a0'}}>products(first: 8)</span>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div style={{maxWidth: 1200, margin: '0 auto', padding: '2.5rem 1.5rem'}}>

        {/* Info de integração */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          background: '#fff',
          border: '1px solid #e5f0d8',
          borderLeft: '4px solid #96bf48',
          borderRadius: 10,
          padding: '1rem 1.25rem',
          marginBottom: '2rem',
          fontSize: '0.85rem',
          color: '#444',
        }}>
          <span style={{fontSize: '1.4rem'}}>✅</span>
          <div>
            <strong style={{color:'#5e8e3e'}}>Integração Shopify Storefront API ativa</strong>
            <br/>
            Hydrogen faz queries GraphQL direto na Shopify — sem backend intermediário. Os produtos abaixo são reais da sua loja conectada.
          </div>
          <Link to="/catalogo-bootcamp" style={{
            marginLeft: 'auto',
            whiteSpace: 'nowrap',
            background: '#f0f7e6',
            color: '#5e8e3e',
            border: '1px solid #c8e6a0',
            borderRadius: 999,
            padding: '0.5rem 1rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            textDecoration: 'none',
          }}>
            Ver catálogo Magento →
          </Link>
        </div>

        <div className="collection">
          <PaginatedResourceSection
            connection={products}
            resourcesClassName="products-grid"
          >
            {({node: product, index}) => (
              <ProductItem
                key={product.id}
                product={product}
                loading={index < 8 ? 'eager' : undefined}
              />
            )}
          </PaginatedResourceSection>
        </div>
      </div>
    </div>
  );
}

const COLLECTION_ITEM_FRAGMENT = `#graphql
  fragment MoneyCollectionItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment CollectionItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyCollectionItem
      }
      maxVariantPrice {
        ...MoneyCollectionItem
      }
    }
  }
`;

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/product
const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...CollectionItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${COLLECTION_ITEM_FRAGMENT}
`;

/** @typedef {import('./+types/collections.all').Route} Route */
/** @typedef {import('storefrontapi.generated').CollectionItemFragment} CollectionItemFragment */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
