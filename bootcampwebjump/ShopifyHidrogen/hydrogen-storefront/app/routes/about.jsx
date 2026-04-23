import {useLoaderData} from 'react-router';

const AEM_GRAPHQL_URL =
  'http://127.0.0.1:4502/content/cq:graphql/bootcampisabelle/endpoint.json';

const AEM_AUTH = btoa('admin:admin');

const MOCK_PRODUCTS = [
  {
    titulo: 'Produto Demo AEM',
    descricao: {plaintext: 'AEM não está acessível neste ambiente. Dados mock.'},
    price: '0.00',
    categoria: 'Demo',
    stackTecnologico: 'AEM + Hydrogen',
    destaque: true,
    linkExterno: null,
  },
];

export async function loader() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    let response;
    try {
      response = await fetch(AEM_GRAPHQL_URL, {
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
                descricao { plaintext }
                price
                categoria
                stackTecnologico
                destaque
                linkExterno
              }
            }
          }`,
        }),
      });
    } catch {
      clearTimeout(timeoutId);
      return {products: MOCK_PRODUCTS, source: 'mock', error: null};
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
      products: data.data?.produtoList?.items || [],
      source: 'aem-live',
      error: null,
    };
  } catch (error) {
    return {products: MOCK_PRODUCTS, source: 'mock', error: error.message};
  }
}

export default function About() {
  const {products, source, error} = useLoaderData();

  return (
    <div style={{padding: '2rem'}}>
      <section>
        <h1>Sobre o Bootcamp 2026</h1>
        <p>Conteúdo gerenciado via AEM ({source})</p>
      </section>

      {error && (
        <pre style={{color: 'red', whiteSpace: 'pre-wrap'}}>
          {error}
        </pre>
      )}

      {products.length > 0 && (
        <section style={{marginTop: '2rem'}}>
          <h2>Produtos em destaque via AEM</h2>
          <div style={{display: 'grid', gap: '1rem'}}>
            {products.map((product, index) => (
              <div
                key={index}
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '1rem',
                }}
              >
                <h3>{product.titulo}</h3>
                <p>{product.descricao?.plaintext}</p>
                <p>R$ {product.price}</p>
                <p>{product.categoria}</p>
                <p>{product.stackTecnologico}</p>
                {product.destaque && <strong>Destaque</strong>}
                {product.linkExterno && (
                  <p>
                    <a
                      href={product.linkExterno}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Ver projeto
                    </a>
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}