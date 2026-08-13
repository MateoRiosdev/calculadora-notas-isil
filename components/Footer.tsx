export default function Footer() {
  return (
    <footer className="bg-footer-bg mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="border-t border-gray-500 pt-4 text-center">
          <p className="text-gray-400 text-sm">
            © 2026 Creado por{' '}
            <a 
              href="https://github.com/MateoRiosdev" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-bold hover:text-white transition-colors"
            >
              MateoRiosdev
            </a>
            . Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
