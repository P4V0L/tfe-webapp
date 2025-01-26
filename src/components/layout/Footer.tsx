import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {SiFacebook, SiInstagram, SiX} from "@icons-pack/react-simple-icons";

export function Footer() {
    return (
        <footer className="bg-primary text-white mt-16">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div>
                        <h3 className="text-xl font-serif font-bold mb-4">CONCHI GIMENO</h3>
                    </div>
                    <div>
                        <h4 className="font-serif font-bold mb-4">Síguenos</h4>
                        <ul className="space-x-5 flex flex-row justify-center md:justify-start gap-2">
                            <li>
                                <Link href="#" className="hover:text-accent">
                                    <SiFacebook />
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-accent">
                                    <SiInstagram />
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-accent">
                                    <SiX />
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-serif font-bold mb-4">Boletín Conchi Gimeno</h4>
                        <p className="mb-4">Suscríbete a nuestro boletín para recibir ofertas</p>
                        <form className="flex gap-2 justify-center md:justify-start">
                            <Input type="email" placeholder="Email address" className="bg-white text-primary" />
                            <Button variant="destructive">Subscribe</Button>
                        </form>
                    </div>
                </div>
            </div>
        </footer>
    )
}

