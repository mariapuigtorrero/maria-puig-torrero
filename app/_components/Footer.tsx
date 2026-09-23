import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="grid-13 footer">
      <p className="footer-copyright">© 2026 María Puig</p>
      <div className="footer-info">
        <Link href="/legal-notice" className="footer-legal">
          Legal Notice
        </Link>
        <a
          href="https://www.instagram.com/donthillhere/"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-credit"
        >
          Site by Elvis Fabricio
        </a>
      </div>
    </footer>
  )
}