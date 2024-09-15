import { ModeToggle } from "./mode-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Logo from "../assets/Logo.svg"

function Header() {
  return (
    <header className="bg-background backdrop:blur-lg py-1 px-2 flex justify-between">
      <Avatar>
        <AvatarImage src={Logo} className="fill-none"/>
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <ModeToggle />
    </header>
  )
}

export default Header