export function Footer() {
  return (
    <footer className="site-footer">
      <style>{`
        .site-footer {
          border-top: 1px solid var(--border);
          background: var(--bg-secondary);
          margin-top: 5rem;
        }
        .footer-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 3rem 1.25rem 2rem;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 2.5rem;
          margin-bottom: 3rem;
        }
        .footer-brand-name {
          font-family: var(--font-display), "Bebas Neue", sans-serif;
          font-size: 1.375rem;
          letter-spacing: 0.06em;
          color: var(--accent-light);
          margin-bottom: 0.625rem;
          display: block;
        }
        .footer-brand-desc {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
          letter-spacing: 0.04em;
          line-height: 1.7;
          max-width: 200px;
          margin: 0;
        }
        .footer-col-heading {
          font-size: var(--text-xs);
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-tertiary);
          margin-bottom: 0.875rem;
        }
        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .footer-link {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          letter-spacing: 0.02em;
          transition: color 0.15s ease;
        }
        .footer-link:hover {
          color: var(--accent-light);
        }
        .footer-bottom {
          border-top: 1px solid var(--border);
          padding-top: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .footer-copyright {
          font-size: var(--text-xs);
          color: var(--text-faint, #333);
          letter-spacing: 0.06em;
          margin: 0;
        }
        .footer-live {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .footer-live-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--accent-primary);
          display: inline-block;
        }
        .footer-live-label {
          font-size: var(--text-xs);
          color: var(--text-faint, #333);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
      `}</style>
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <span className="footer-brand-name">GET-RIGHT.CHURCH</span>
            <p className="footer-brand-desc">
              Political accountability through community intelligence.
            </p>
          </div>

          {[
            {
              heading: 'Explore',
              links: [
                { label: 'Politicians', href: '/politicians' },
                { label: 'Geography', href: '/geographies' },
                { label: 'The Talk', href: '/the-talk' },
                { label: 'Blunch', href: '/blunch' },
              ],
            },
            {
              heading: 'Platform',
              links: [
                { label: 'About', href: '#' },
                { label: 'Mission', href: '#' },
                { label: 'Contact', href: '#' },
              ],
            },
            {
              heading: 'Legal',
              links: [
                { label: 'Terms', href: '#' },
                { label: 'Privacy', href: '#' },
                { label: 'Cookies', href: '#' },
              ],
            },
          ].map((col) => (
            <div key={col.heading}>
              <p className="footer-col-heading">{col.heading}</p>
              <ul className="footer-links">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="footer-link">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2024 GET-RIGHT.CHURCH — BUILT WITH INTENTION.
          </p>
          <div className="footer-live">
            <span className="footer-live-dot animate-pulse-dot" />
            <span className="footer-live-label">LIVE</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
