import {useLoaderData} from 'react-router';

const MAGENTO_API_URL =
  'http://127.0.0.1/rest/V1/bootcamp/products';

const MOCK_PRODUCTS = [
  {
    sku: 'BOOT-CAMISETA-001',
    name: 'Camiseta Dev — Sua Stack Estampada',
    price: '89.90',
    type: 'simple',
    description:
      'Camiseta 100% algodão com estampa da sua stack favorita. Disponível em diversos tamanhos. Perfeita para coding sessions, meetups e hackathons.',
    bootcamp_highlight: true,
    tech_stack: 'React · Node · PHP',
    material: 'Algodão',
    image_url: '',
  },
  {
    sku: 'BOOT-LIVRO-001',
    name: 'Arquitetura Limpa — Guia Definitivo',
    price: '129.00',
    type: 'simple',
    description:
      'O clássico de Robert C. Martin. Princípios fundamentais para estruturar software sustentável e desacoplado.',
    bootcamp_highlight: true,
    tech_stack: 'Clean Architecture · SOLID',
    material: 'Papel',
    image_url: '',
  },
  {
    sku: 'BOOT-LIVRO-002',
    name: 'SOLID na Prática',
    price: '94.90',
    type: 'simple',
    description:
      'Aplicação prática dos 5 princípios SOLID com exemplos reais em múltiplas linguagens. Edição de bolso.',
    bootcamp_highlight: false,
    tech_stack: 'OOP · Design Patterns',
    material: 'Papel',
    image_url: '',
  },
  {
    sku: 'BOOT-ADESIVO-001',
    name: 'Pack Adesivos Dev (12 un)',
    price: '24.90',
    type: 'simple',
    description:
      'Kit com 12 adesivos vinílicos de linguagens e frameworks: React, Vue, Node, Python, Docker, Git, Linux e mais. Resistentes à água.',
    bootcamp_highlight: false,
    tech_stack: 'Multi-stack',
    material: 'Vinil',
    image_url: '',
  },
  {
    sku: 'BOOT-CANECA-001',
    name: 'Caneca "while(alive) coffee++"',
    price: '49.90',
    type: 'simple',
    description:
      'Caneca de cerâmica 330ml com estampa temática. Porque todo dev sabe que produtividade é diretamente proporcional ao café.',
    bootcamp_highlight: true,
    tech_stack: 'Coffee-driven Development',
    material: 'Cerâmica',
    image_url: '',
  },
];

export async function loader() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    let response;
    try {
      response = await fetch(MAGENTO_API_URL, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          Host: 'magento2.docker',
        },
      });
    } catch (err) {
      clearTimeout(timeoutId);
      return {
        products: MOCK_PRODUCTS,
        source: 'mock',
        error: `Erro ao conectar no Magento: ${err.message}`,
      };
    }

    clearTimeout(timeoutId);
    const raw = await response.text();

    if (!response.ok) {
      return {
        products: MOCK_PRODUCTS,
        source: 'mock',
        error: `HTTP ${response.status}: ${raw}`,
      };
    }

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return {
        products: MOCK_PRODUCTS,
        source: 'mock',
        error: `Resposta não é JSON: ${raw}`,
      };
    }

    return {
      products: Array.isArray(data) ? data : [],
      source: 'magento-live',
      error: null,
    };
  } catch (error) {
    return {
      products: MOCK_PRODUCTS,
      source: 'mock',
      error: error.message,
    };
  }
}

function formatBRL(priceStr) {
  const n = parseFloat(priceStr);
  if (Number.isNaN(n)) return priceStr;
  return n.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function categoryFromSku(sku = '') {
  const parts = sku.split('-');
  return parts[1]?.toUpperCase() ?? 'PRODUTO';
}

const CATEGORY_GRADIENTS = {
  CAMISETA: 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',
  LIVRO: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  ADESIVO: 'linear-gradient(135deg, #10b981 0%, #84cc16 100%)',
  CANECA: 'linear-gradient(135deg, #b45309 0%, #fbbf24 100%)',
  DEFAULT: 'linear-gradient(135deg, #475569 0%, #64748b 100%)',
};

export default function CatalogoBootcamp() {
  const {products, source, error} = useLoaderData();

  return (
    <div style={{padding: '2rem', maxWidth: 1200, margin: '0 auto'}}>
      <section>
        <h1 style={{marginBottom: '0.25rem'}}>Catálogo Bootcamp</h1>
        <p style={{color: '#666', marginTop: 0}}>
          Produtos gerenciados via Adobe Commerce (Magento) — endpoint{' '}
          <code>/V1/bootcamp/products</code>
        </p>
      </section>

      {source === 'mock' && (
        <div
          style={{
            marginTop: '1rem',
            padding: '0.85rem 1rem',
            background: '#fff8e1',
            border: '1px solid #ffe082',
            borderRadius: 8,
            fontSize: 13,
            color: '#8a6d00',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <strong>Modo demonstração:</strong> exibindo dados de
          fallback — ambiente Magento dev fora do ar.
        </div>
      )}

      {products.length === 0 ? (
        <p style={{marginTop: '2rem'}}>Nenhum produto encontrado.</p>
      ) : (
        <section style={{marginTop: '2rem'}}>
          <div
            style={{
              display: 'grid',
              gap: '1.25rem',
              gridTemplateColumns:
                'repeat(auto-fill, minmax(260px, 1fr))',
            }}
          >
            {products.map((p) => (
              <article
                key={p.sku}
                style={{
                  border: '1px solid #e2e2e2',
                  borderRadius: 12,
                  padding: '1rem',
                  background: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  position: 'relative',
                }}
              >
                {p.bootcamp_highlight && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      background: '#111',
                      color: '#fff',
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '4px 8px',
                      borderRadius: 999,
                      letterSpacing: 0.5,
                      textTransform: 'uppercase',
                    }}
                  >
                    Destaque
                  </span>
                )}

                <div
                  style={{
                    height: 160,
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: 2,
                    background: p.image_url
                      ? '#f5f5f5'
                      : CATEGORY_GRADIENTS[categoryFromSku(p.sku)] ??
                        CATEGORY_GRADIENTS.DEFAULT,
                    overflow: 'hidden',
                  }}
                >
                  {p.image_url ? (
                    <img
                      src={`/magento-media/catalog/product${p.image_url}`}
                      alt={p.name}
                      style={{
                        maxHeight: '100%',
                        maxWidth: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    categoryFromSku(p.sku)
                  )}
                </div>

                <h3 style={{margin: '0.25rem 0', fontSize: '1.05rem'}}>
                  {p.name}
                </h3>

                <div style={{fontSize: 14, color: '#555'}}>
                  SKU: <code>{p.sku}</code>
                </div>

                <div
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#111',
                  }}
                >
                  {formatBRL(p.price)}
                </div>

                {p.tech_stack && (
                  <div style={{fontSize: 13}}>
                    <strong>Stack:</strong> {p.tech_stack}
                  </div>
                )}

                {p.material && (
                  <div style={{fontSize: 13}}>
                    <strong>Material:</strong> {p.material}
                  </div>
                )}

                {p.description && (
                  <p
                    style={{
                      fontSize: 13,
                      color: '#555',
                      margin: 0,
                      lineHeight: 1.45,
                    }}
                    dangerouslySetInnerHTML={{
                      __html: p.description,
                    }}
                  />
                )}
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}