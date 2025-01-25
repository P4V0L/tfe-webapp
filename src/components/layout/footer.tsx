import { Facebook, Instagram, Twitter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-serif text-lg mb-4">CONCHI GIMENO</h3>
            <div className="flex gap-4">
              <Facebook className="h-5 w-5" />
              <Instagram className="h-5 w-5" />
              <Twitter className="h-5 w-5" />
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Información</h4>
            <ul className="space-y-2">
              <li>Sobre nosotros</li>
              <li>Términos y condiciones</li>
              <li>Política de privacidad</li>
              <li>Contacto</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Servicio al cliente</h4>
            <ul className="space-y-2">
              <li>Envíos</li>
              <li>Devoluciones</li>
              <li>Preguntas frecuentes</li>
              <li>Ayuda</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Boletín</h4>
            <p className="text-sm mb-4">Suscríbete a nuestro boletín</p>
            <div className="flex gap-2">
              <Input placeholder="Email address" />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

