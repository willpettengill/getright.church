export function Footer() {
  return (
    <footer className="border-t border-neutral-muted bg-bg-secondary mt-16 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-mono font-bold text-accent-primary mb-3">Explore</h4>
            <ul className="space-y-2 text-sm font-mono text-text-secondary">
              <li>
                <a href="/politicians" className="hover:text-accent-primary transition-colors">
                  Politicians
                </a>
              </li>
              <li>
                <a href="/geographies" className="hover:text-accent-primary transition-colors">
                  Geography
                </a>
              </li>
              <li>
                <a href="/the-talk" className="hover:text-accent-primary transition-colors">
                  The Talk
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono font-bold text-accent-primary mb-3">About</h4>
            <ul className="space-y-2 text-sm font-mono text-text-secondary">
              <li>
                <a href="#" className="hover:text-accent-primary transition-colors">
                  Mission
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent-primary transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent-primary transition-colors">
                  Privacy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono font-bold text-accent-primary mb-3">Resources</h4>
            <ul className="space-y-2 text-sm font-mono text-text-secondary">
              <li>
                <a href="#" className="hover:text-accent-primary transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent-primary transition-colors">
                  Docs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent-primary transition-colors">
                  API
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono font-bold text-accent-primary mb-3">Legal</h4>
            <ul className="space-y-2 text-sm font-mono text-text-secondary">
              <li>
                <a href="#" className="hover:text-accent-primary transition-colors">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent-primary transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent-primary transition-colors">
                  Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-muted pt-8 text-center">
          <p className="text-text-tertiary text-xs font-mono">
            © 2024 get-right.church. All rights reserved. Built with intention.
          </p>
        </div>
      </div>
    </footer>
  )
}
