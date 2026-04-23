import {useLoaderData, Link} from 'react-router';

const AEM_GRAPHQL_URL =
  'http://127.0.0.1:4502/content/cq:graphql/bootcampisabelle/endpoint.json';
const AEM_AUTH = btoa('admin:admin');

const MAGENTO_API_URL =
  'http://127.0.0.1/rest/V1/bootcamp/products';

const SHOPIFY_QUERY = `#graphql
  query DashboardShopify {
    products(first: 20) {
      nodes {
        id
        title
        handle
        featuredImage {
          url
          altText
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
    shop {
      name
    }
  }
`;

async function fetchShopify(storefront) {
  try {
    const data = await storefront.query(SHOPIFY_QUERY);
    return {
      status: 'live',
      shopName: data?.shop?.name ?? '',
      items: data?.products?.nodes ?? [],
      error: null,
    };
  } catch (err) {
    return {
      status: 'error',
      shopName: '',
      items: [],
      error: err.message,
    };
  }
}

async function fetchAem() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(AEM_GRAPHQL_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${AEM_AUTH}`,
      },
      body: JSON.stringify({
        query: `{
          produtoList {
            items {
              titulo
              categoria
              destaque
            }
          }
        }`,
      }),
    });

    clearTimeout(timeoutId);
    const raw = await response.text();

    if (!response.ok) {
      return {
        status: 'error',
        items: [],
        error: `HTTP ${response.status}`,
      };
    }

    const data = JSON.parse(raw);
    return {
      status: 'live',
      items: data?.data?.produtoList?.items ?? [],
      error: null,
    };
  } catch (err) {
    return {
      status: 'error',
      items: [],
      error: err.message,
    };
  }
}

async function fetchMagento() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(MAGENTO_API_URL, {
      signal: controller.signal,
      headers: {Accept: 'application/json', Host: 'magento2.docker'},
    });

    clearTimeout(timeoutId);
    const raw = await response.text();

    if (!response.ok) {
      return {
        status: 'error',
        items: [],
        error: `HTTP ${response.status}`,
      };
    }

    const data = JSON.parse(raw);
    return {
      status: 'live',
      items: Array.isArray(data) ? data : [],
      error: null,
    };
  } catch (err) {
    return {
      status: 'error',
      items: [],
      error: err.message,
    };
  }
}

export async function loader({context}) {
  const [shopify, aem, magento] = await Promise.all([
    fetchShopify(context.storefront),
    fetchAem(),
    fetchMagento(),
  ]);

  return {shopify, aem, magento};
}

function StatusBadge({status}) {
  const colors = {
    live: {bg: '#e7f7ec', fg: '#116329', label: 'LIVE'},
    error: {bg: '#ffe6e9', fg: '#b00020', label: 'OFFLINE'},
  };
  const c = colors[status] ?? colors.error;
  return (
    <span
      style={{
        display: 'inline-block',
        background: c.bg,
        color: c.fg,
        fontSize: 11,
        fontWeight: 700,
        padding: '3px 8px',
        borderRadius: 999,
        letterSpacing: 0.5,
      }}
    >
      {c.label}
    </span>
  );
}

function PlatformCard({title, accent, status, count, children}) {
  return (
    <article
      style={{
        border: '1px solid #e2e2e2',
        borderRadius: 12,
        background: '#fff',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <header
        style={{
          background: accent,
          color: '#fff',
          padding: '1rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h2 style={{margin: 0, fontSize: '1.1rem'}}>{title}</h2>
        <StatusBadge status={status} />
      </header>

      <div
        style={{
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          flex: 1,
        }}
      >
        <div
          style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            lineHeight: 1,
            color: '#111',
          }}
        >
          {count}
        </div>
        <div
          style={{
            fontSize: 12,
            color: '#666',
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          itens no endpoint
        </div>

        <hr style={{border: 'none', borderTop: '1px solid #eee', margin: '0.5rem 0'}} />

        {children}
      </div>
    </article>
  );
}

export default function Dashboard() {
  const {shopify, aem, magento} = useLoaderData();

  const shopifyHighlights = shopify.items.slice(0, 5);
  const aemHighlights = aem.items.slice(0, 5);
  const magentoHighlights = magento.items.slice(0, 5);

  return (
    <div style={{padding: '2rem', maxWidth: 1300, margin: '0 auto'}}>
      <header style={{marginBottom: '2rem'}}>
        <h1 style={{margin: '0 0 0.25rem'}}>Dashboard Integração</h1>
        <p style={{color: '#666', marginTop: 0}}>
          Consolidação em tempo real das 3 plataformas headless usadas
          pela loja dev.
        </p>
      </header>

      <section
        style={{
          display: 'grid',
          gap: '1.25rem',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(300px, 1fr))',
        }}
      >
        <PlatformCard
          title={`Shopify${shopify.shopName ? ` — ${shopify.shopName}` : ''}`}
          accent="#96bf48"
          status={shopify.status}
          count={shopify.items.length}
        >
          {shopify.error && (
            <pre style={{color: '#b00020', fontSize: 12}}>
              {shopify.error}
            </pre>
          )}
          <strong style={{fontSize: 13, color: '#555'}}>
            Últimos produtos
          </strong>
          <ul
            style={{
              margin: 0,
              padding: '0 0 0 1rem',
              fontSize: 13,
              lineHeight: 1.7,
            }}
          >
            {shopifyHighlights.map((p) => (
              <li key={p.id}>
                {p.title}{' '}
                <span style={{color: '#888'}}>
                  (
                  {p.priceRange?.minVariantPrice
                    ? `${p.priceRange.minVariantPrice.currencyCode} ${p.priceRange.minVariantPrice.amount}`
                    : '—'}
                  )
                </span>
              </li>
            ))}
            {shopifyHighlights.length === 0 && (
              <li style={{color: '#888'}}>Sem produtos.</li>
            )}
          </ul>
        </PlatformCard>

        <PlatformCard
          title="AEM — Content Fragments"
          accent="#fa0f00"
          status={aem.status}
          count={aem.items.length}
        >
          {aem.error && (
            <pre style={{color: '#b00020', fontSize: 12}}>
              {aem.error}
            </pre>
          )}
          <strong style={{fontSize: 13, color: '#555'}}>
            Fragments publicados
          </strong>
          <ul
            style={{
              margin: 0,
              padding: '0 0 0 1rem',
              fontSize: 13,
              lineHeight: 1.7,
            }}
          >
            {aemHighlights.map((f, i) => (
              <li key={i}>
                {f.titulo}{' '}
                <span style={{color: '#888'}}>
                  ({f.categoria}
                  {f.destaque ? ' · destaque' : ''})
                </span>
              </li>
            ))}
            {aemHighlights.length === 0 && (
              <li style={{color: '#888'}}>
                Sem fragments ou AEM offline.
              </li>
            )}
          </ul>
        </PlatformCard>

        <PlatformCard
          title="Adobe Commerce — Magento"
          accent="#eb6114"
          status={magento.status}
          count={magento.items.length}
        >
          {magento.error && (
            <pre style={{color: '#b00020', fontSize: 12}}>
              {magento.error}
            </pre>
          )}
          <strong style={{fontSize: 13, color: '#555'}}>
            Produtos BOOT-*
          </strong>
          <ul
            style={{
              margin: 0,
              padding: '0 0 0 1rem',
              fontSize: 13,
              lineHeight: 1.7,
            }}
          >
            {magentoHighlights.map((p) => (
              <li key={p.sku}>
                {p.name}{' '}
                <span style={{color: '#888'}}>
                  (R$ {parseFloat(p.price).toFixed(2)}
                  {p.bootcamp_highlight ? ' · destaque' : ''})
                </span>
              </li>
            ))}
            {magentoHighlights.length === 0 && (
              <li style={{color: '#888'}}>
                Sem produtos ou Magento offline.
              </li>
            )}
          </ul>
          <Link
            to="/catalogo-bootcamp"
            style={{
              display: 'inline-block',
              marginTop: '0.5rem',
              padding: '0.5rem 1rem',
              background: '#eb6114',
              color: '#fff',
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 13,
              textDecoration: 'none',
            }}
          >
            Ver catálogo completo →
          </Link>
        </PlatformCard>
      </section>

      <footer
        style={{
          marginTop: '2rem',
          padding: '1rem',
          background: '#f5f5f5',
          borderRadius: 8,
          fontSize: 12,
          color: '#666',
        }}
      >
        <strong>Arquitetura:</strong> Hydrogen (React Router) é o
        frontend único. Shopify é o catálogo + checkout. AEM gerencia
        conteúdo editorial (Content Fragments via GraphQL). Adobe
        Commerce expõe catálogo custom pelo endpoint{' '}
        <code>/V1/bootcamp/products</code> do módulo{' '}
        <code>Bootcamp_CatalogApi</code>.
      </footer>
    </div>
  );
}