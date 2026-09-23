import Link from 'next/link'

export default function Header() {
  return (
    <header className="grid-13 header">
      <Link href="/" className="header-name-wrap">
        <span className="header-name">María Puig Torrero</span>
        <span className="header-subtitle">Photography | Creative and Art Direction</span>
      </Link>
      <nav className="header-nav">
        <Link href="/work" className="header-work">
          Work
        </Link>
        <Link href="/about" className="header-about">
          About
        </Link>
      </nav>
      <div className="header-social">
        <a
          href="https://www.instagram.com/mpuigtorrero/"
          target="_blank"
          rel="noopener noreferrer"
          className="header-instagram"
        >
          Instagram
        </a>
        <a
          href="https://www.linkedin.com/in/mar%C3%ADa-puig-torrero-396292175/"
          target="_blank"
          rel="noopener noreferrer"
          className="header-linkedin"
        >
          LinkedIn
        </a>
      </div>
    </header>
  )
}
