import { ModeToggle } from "./mode-toggle";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import Logo from "../assets/Logo.svg";
import {
  ContactRound,
  Home,
  LogIn,
  LogOut,
  PanelLeft,
  Rss,
} from "lucide-react";
import { fetchLogout, fetchUserDetails } from "@/features/UserSlice";

function Header() {
  const dispatch = useDispatch<any>();

  const userInfo = useSelector((state: any) => state.user.userInfo);
  const details = () => {
    dispatch(fetchUserDetails());
  };
  return (
    <>
      <header className="bg-background backdrop:blur-lg p-2 hidden md:flex justify-between space-x-2">
        <nav className="w-full flex justify-between">
          <Avatar>
            <AvatarImage src={Logo} />
            <AvatarFallback>L</AvatarFallback>
          </Avatar>
          <div className="flex my-auto">
            <Button variant="ghost" className="font-semibold" onClick={details}>
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
            <Button variant="ghost" className="font-semibold">
              <Rss className="mr-2 h-4 w-4" />
              Feed
            </Button>
            <Button variant="ghost" className="font-semibold">
              <ContactRound className="mr-2 h-4 w-4" />
              Support
            </Button>
            {userInfo && (
              <Button
                variant="ghost"
                className="font-semibold"
                onClick={() => dispatch(fetchLogout())}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            )}
            {!userInfo && (
              <Button variant="ghost" className="font-semibold">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            )}
          </div>
        </nav>
        <ModeToggle />
      </header>
      <header className="bg-background backdrop:blur-lg py-1 px-2 flex md:hidden justify-between">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="my-auto">
              <PanelLeft />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[180px]">
            <SheetHeader>
              <SheetTitle className="mx-auto mb-4">
                <Avatar>
                  <AvatarImage src={Logo} />
                  <AvatarFallback>L</AvatarFallback>
                </Avatar>
              </SheetTitle>
              <SheetFooter>
                <div className="flex flex-col mx-auto space-y-3">
                  <Button variant="ghost" className="font-semibold">
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </Button>
                  <Button variant="ghost" className="font-semibold">
                    <Rss className="mr-2 h-4 w-4" />
                    Feed
                  </Button>
                  <Button variant="ghost" className="font-semibold">
                    <ContactRound className="mr-2 h-4 w-4" />
                    Support
                  </Button>
                  <Button variant="ghost" className="font-semibold">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                  <Button variant="ghost" className="font-semibold">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </div>
              </SheetFooter>
            </SheetHeader>
          </SheetContent>
        </Sheet>
        <ModeToggle />
      </header>
    </>
  );
}

export default Header;
