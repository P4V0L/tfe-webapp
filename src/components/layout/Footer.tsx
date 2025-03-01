import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SiFacebook, SiInstagram, SiX } from "@icons-pack/react-simple-icons"

export function Footer() {
    return (
        <footer className="bg-primary text-white mt-10">
            <div className="container mx-auto px-4 py-12">
                {/* Use a 1-column layout for mobile and a 3-column layout for md and above */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Column 1 */}
                    <div className="flex flex-col items-center text-center justify-center">
                        <h3 className="text-3xl font-serif font-bold mb-2">CONCHI GIMENO</h3>
                        <p className="mb-4 text-secondary-foreground">Tu tienda de siempre, ahora sin moverte de casa.</p>
                    </div>

                    {/* Column 2 */}
                    <div className="flex flex-col items-center text-center justify-center">
                        <h2 className="font-serif text-xl font-bold mb-4">Síguenos</h2>
                        <ul className="flex items-center justify-center space-x-5">
                            <li>
                                <Link href="#" className="text-secondary-foreground hover:text-accent">
                                    <SiFacebook className="h-8 w-8"/>
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-secondary-foreground  hover:text-accent">
                                    <SiInstagram className="h-8 w-8"/>
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-secondary-foreground  hover:text-accent">
                                    <SiX className="h-8 w-8"/>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3 */}
                    <div className="flex flex-col items-center text-center justify-center">
                        <h4 className="font-serif font-bold text-xl mb-4">Boletín Conchi Gimeno</h4>
                        <p className="mb-4 text-secondary-foreground">Suscríbete a nuestro boletín para recibir ofertas exclusivas</p>
                        <form className="flex flex-col sm:flex-row gap-2 justify-center">
                            <Input
                                type="email"
                                placeholder="Email"
                                className="bg-white text-primary"
                            />
                            <Button variant="destructive">Suscribirme</Button>
                        </form>
                    </div>
                </div>
            </div>
        </footer>
    )
}