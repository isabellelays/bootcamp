import {useLoaderData, Link} from 'react-router';

const AEM_GRAPHQL_URL =
  'http://127.0.0.1:4502/content/cq:graphql/bootcampisabelle/endpoint.json';
const AEM_AUTH = btoa('admin:admin');

const MOCK_BANNERS = [
  {
    titulo: 'Banner Demo',
    subtitulo: {plaintext: 'AEM não está acessível. Exibindo dados mock.'},
    cta: 'Ver Catálogo',
    ctaLink: '/catalogo-bootcamp',
    imageUrl: null,
    ativo: true,
  },
];

export async function loader() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch(AEM_GRAPHQL_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${AEM_AUTH}`,
      },
      body: JSON.stringify({
        query: `{
          bannerList {
            items {
              titulo
              subtitulo { plaintext }
              cta
              ctaLink
              imageUrl
              ativo
            }
          }
        }`,
      }),
    });

    clearTimeout(timeoutId);
    const raw = await response.text();

    if (!response.ok) {
      return {
        banners: MOCK_BANNERS,
        source: 'mock',
        error: `HTTP ${response.status}: ${raw}`,
      };
    }

    const data = JSON.parse(raw);
    const all = data?.data?.bannerList?.items ?? [];
    const active = all
      .filter((b) => b.ativo)
      .map((b) => ({
        ...b,
        ctaLink:
          b.ctaLink === '/collections/all' ? '/catalogo-bootcamp' : b.ctaLink,
      }));

    return {
      banners: active,
      source: 'aem-live',
      error: null,
    };
  } catch (err) {
    clearTimeout(timeoutId);
    return {
      banners: MOCK_BANNERS,
      source: 'mock',
      error: err.message,
    };
  }
}

const palettes = [
  {bg: '#0f172a', grad: 'linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%)', accent: '#38bdf8'},
  {bg: '#4c1d95', grad: 'linear-gradient(135deg,#4c1d95 0%,#7c3aed 100%)', accent: '#fbbf24'},
  {bg: '#7f1d1d', grad: 'linear-gradient(135deg,#7f1d1d 0%,#ea580c 100%)', accent: '#fde68a'},
  {bg: '#064e3b', grad: 'linear-gradient(135deg,#064e3b 0%,#0f766e 100%)', accent: '#6ee7b7'},
];

const styles = {
  page: {
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    background: '#f8f9fb',
    minHeight: '100vh',
  },
  hero: {
    background: 'linear-gradient(135deg,#0f172a 0%,#1e3a5f 60%,#0ea5e9 100%)',
    color: '#fff',
    padding: '5rem 2rem 4rem',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  heroBadge: {
    display: 'inline-block',
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: 999,
    padding: '0.35rem 1rem',
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: '1.5rem',
    backdropFilter: 'blur(6px)',
  },
  heroTitle: {
    fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
    fontWeight: 900,
    margin: '0 0 1rem',
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
  },
  heroSub: {
    fontSize: '1.15rem',
    opacity: 0.75,
    margin: '0 auto 2rem',
    maxWidth: 520,
    lineHeight: 1.6,
  },
  heroBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: '#38bdf8',
    color: '#0f172a',
    padding: '0.9rem 2rem',
    borderRadius: 999,
    fontWeight: 800,
    fontSize: '1rem',
    textDecoration: 'none',
    boxShadow: '0 4px 24px rgba(56,189,248,0.4)',
    transition: 'transform 0.15s',
  },
  grid: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '3rem 1.5rem 4rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.5rem',
  },
  card: (grad) => ({
    background: grad,
    borderRadius: 20,
    padding: '2.5rem 2rem',
    minHeight: 260,
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
  }),
  cardDeco: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.07)',
    pointerEvents: 'none',
  },
  cardDeco2: {
    position: 'absolute',
    bottom: -60,
    right: 20,
    width: 220,
    height: 220,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.04)',
    pointerEvents: 'none',
  },
  cardTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    background: 'rgba(255,255,255,0.15)',
    borderRadius: 999,
    padding: '0.25rem 0.75rem',
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    width: 'fit-content',
    backdropFilter: 'blur(4px)',
  },
  cardTitle: {
    fontSize: '1.6rem',
    fontWeight: 800,
    margin: 0,
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
  },
  cardSub: {
    margin: 0,
    fontSize: '0.95rem',
    lineHeight: 1.5,
    opacity: 0.85,
  },
  cardBtn: (accent, bg) => ({
    alignSelf: 'flex-start',
    marginTop: '0.5rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    background: accent,
    color: bg,
    padding: '0.65rem 1.25rem',
    borderRadius: 999,
    fontWeight: 700,
    fontSize: '0.88rem',
    textDecoration: 'none',
    boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
  }),
};

export default function Banners() {
  const {banners, source} = useLoaderData();

  const [hero, ...rest] = banners;
  const heroSubtitle = hero?.subtitulo?.plaintext?.trim() ?? '';

  return (
    <div style={styles.page}>
      {/* ── HERO ── */}
      {hero && (
        <section style={styles.hero}>
          {/* círculos decorativos */}
          <div style={{position:'absolute',top:-80,left:-80,width:300,height:300,borderRadius:'50%',background:'rgba(255,255,255,0.04)',pointerEvents:'none'}} />
          <div style={{position:'absolute',bottom:-100,right:-60,width:400,height:400,borderRadius:'50%',background:'rgba(255,255,255,0.03)',pointerEvents:'none'}} />

          <div style={{position:'relative', zIndex:1}}>
            <span style={styles.heroBadge}>✦ AEM · Editorial</span>
            <h1 style={styles.heroTitle}>{hero.titulo}</h1>
            {heroSubtitle && <p style={styles.heroSub}>{heroSubtitle}</p>}
            {hero.cta && hero.ctaLink && (
              <Link to={hero.ctaLink} style={styles.heroBtn}>
                {hero.cta} →
              </Link>
            )}
          </div>
        </section>
      )}

      {/* ── GRID DE BANNERS ── */}
      {rest.length > 0 && (
        <div style={styles.grid}>
          {rest.map((banner, i) => {
            const palette = palettes[(i + 1) % palettes.length];
            const subtitle = banner.subtitulo?.plaintext?.trim() ?? '';
            return (
              <article key={banner.titulo + i} style={styles.card(palette.grad)}>
                <div style={styles.cardDeco} />
                <div style={styles.cardDeco2} />
                <div style={{position:'relative', zIndex:1, display:'flex', flexDirection:'column', gap:'0.75rem'}}>
                  <span style={styles.cardTag}>✦ Destaque</span>
                  <h2 style={styles.cardTitle}>{banner.titulo}</h2>
                  {subtitle && <p style={styles.cardSub}>{subtitle}</p>}
                  {banner.cta && banner.ctaLink && (
                    <Link to={banner.ctaLink} style={styles.cardBtn(palette.accent, palette.bg)}>
                      {banner.cta} →
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {banners.length === 0 && (
        <p style={{textAlign:'center', padding:'4rem', color:'#666'}}>
          Nenhum banner ativo no momento.
        </p>
      )}
    </div>
  );
}