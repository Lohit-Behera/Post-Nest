import { ModeToggle } from "./mode-toggle";
import { useNavigate, NavLink, Link } from "react-router-dom";
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
import { fetchLogout, fetchSendVerifyEmail } from "@/features/UserSlice";

function Header() {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const userInfo = useSelector((state: any) => state.user.userInfo);
  const userDetails = useSelector((state: any) => state.user.userDetails);

  const handleLogout = () => {
    dispatch(fetchLogout());
    navigate("/sign-in");
  };
  return (
    <>
      <header className="bg-background backdrop:blur-lg p-2 hidden md:flex justify-between space-x-2">
        <nav className="w-full flex justify-between">
          <Avatar>
            <AvatarImage src={Logo} />
            <AvatarFallback>L</AvatarFallback>
          </Avatar>
          <div className="flex my-auto space-x-2">
            <NavLink to="/">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className="font-semibold"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Button>
              )}
            </NavLink>
            <Button
              variant="ghost"
              className="font-semibold"
              onClick={() => dispatch(fetchSendVerifyEmail())}
            >
              <Rss className="mr-2 h-4 w-4" />
              Feed
            </Button>
            <Button variant="ghost" className="font-semibold">
              <ContactRound className="mr-2 h-4 w-4" />
              Support
            </Button>
            {userInfo && (
              <>
                <Button
                  variant="ghost"
                  className="font-semibold"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
                <Link to={`/profile/${userInfo._id}`}>
                  <Avatar>
                    <AvatarImage
                      src={userDetails.data?.avatar}
                      className="object-cover"
                    />
                    <AvatarFallback>L</AvatarFallback>
                  </Avatar>
                </Link>
              </>
            )}
            {!userInfo && (
              <NavLink to="/sign-in">
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className="font-semibold"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                )}
              </NavLink>
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
        <div className="flex my-auto space-x-2">
          {userInfo && (
            <>
              <Avatar>
                <AvatarImage
                  src={userDetails.data?.avatar}
                  className="object-cover"
                />
                <AvatarFallback>L</AvatarFallback>
              </Avatar>
            </>
          )}
          <ModeToggle />
        </div>
      </header>
    </>
  );
}

export default Header;
