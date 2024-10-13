import { ModeToggle } from "./mode-toggle";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import Logo from "../assets/Logo.svg";
import {
  Home,
  LogIn,
  LogOut,
  PanelLeft,
  Rss,
  SquarePlus,
  UserCog2,
} from "lucide-react";
import { fetchLogout } from "@/features/UserSlice";
import SearchUserAndPosts from "@/components/SearchUserAndPosts";

function Header() {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const userInfo = useSelector((state: any) => state.user.userInfo);
  const userDetails = useSelector((state: any) => state.user.userDetails);
  const userDetailsData = userDetails.data || {};

  const handleLogout = async () => {
    await dispatch(fetchLogout());
    window.location.reload();
  };
  return (
    <header className="z-20 w-full sticky top-0 p-2 backdrop-blur bg-background/50 shadow  ">
      <nav className="hidden md:flex justify-between space-x-2">
        <div className="w-full flex justify-between">
          <Avatar>
            <AvatarImage src={Logo} />
            <AvatarFallback>L</AvatarFallback>
          </Avatar>
          <div className="flex my-auto space-x-2">
            {userInfo && (
              <>
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
                <NavLink to="/feed">
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className="font-semibold"
                    >
                      <Rss className="mr-2 h-4 w-4" />
                      Feed
                    </Button>
                  )}
                </NavLink>
                <SearchUserAndPosts />
                <NavLink to="/create-post">
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className="font-semibold"
                    >
                      <SquarePlus className="mr-2 h-4 w-4" />
                      Create Post
                    </Button>
                  )}
                </NavLink>
                {userDetails?.data?.isAdmin && (
                  <NavLink to="/admin">
                    {({ isActive }) => (
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className="font-semibold"
                      >
                        <UserCog2 className="mr-2 h-4 w-4" />
                        Admin
                      </Button>
                    )}
                  </NavLink>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Avatar>
                      <AvatarImage
                        src={userDetailsData.avatar}
                        className="object-cover"
                      />
                      <AvatarFallback>L</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() =>
                        navigate(`/profile/${userDetailsData._id}`)
                      }
                    >
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        navigate(`/update-profile/${userDetailsData._id}`)
                      }
                    >
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem>Support</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                    Sign In
                  </Button>
                )}
              </NavLink>
            )}
          </div>
        </div>
        <ModeToggle />
      </nav>
      <nav className=" flex md:hidden justify-between">
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
                  {userInfo && (
                    <>
                      <SheetClose asChild>
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
                      </SheetClose>
                      <SheetClose asChild>
                        <NavLink to="/feed">
                          {({ isActive }) => (
                            <Button
                              variant={isActive ? "default" : "ghost"}
                              className="font-semibold"
                            >
                              <Rss className="mr-2 h-4 w-4" />
                              Feed
                            </Button>
                          )}
                        </NavLink>
                      </SheetClose>
                      <SheetClose asChild>
                        <SearchUserAndPosts />
                      </SheetClose>
                      <SheetClose asChild>
                        <NavLink to="/create-post">
                          {({ isActive }) => (
                            <Button
                              variant={isActive ? "default" : "ghost"}
                              className="font-semibold"
                            >
                              <SquarePlus className="mr-2 h-4 w-4" />
                              Create Post
                            </Button>
                          )}
                        </NavLink>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button
                          variant="ghost"
                          className="font-semibold"
                          onClick={handleLogout}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </Button>
                      </SheetClose>
                    </>
                  )}
                  {!userInfo && (
                    <SheetClose asChild>
                      <NavLink to="/sign-in">
                        {({ isActive }) => (
                          <Button
                            variant={isActive ? "default" : "ghost"}
                            className="font-semibold"
                          >
                            <LogIn className="mr-2 h-4 w-4" />
                            Sign In
                          </Button>
                        )}
                      </NavLink>
                    </SheetClose>
                  )}
                </div>
              </SheetFooter>
            </SheetHeader>
          </SheetContent>
        </Sheet>
        <div className="flex my-auto space-x-2">
          {userInfo && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full"
                  >
                    <Avatar>
                      <AvatarImage
                        src={userDetailsData.avatar}
                        className="object-cover"
                      />
                      <AvatarFallback>L</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Support</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
}

export default Header;
