import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  Users,
  Monitor,
  ShoppingBag,
  UsersRound,
  Menu,
  Bell,
  MessageSquare,
  Grid,
  Settings,
  HelpCircle,
  LogOut,
  Search,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

interface Notification {
  id: number;
  userId: number;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export default function Header() {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: notifications } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
    enabled: !!user,
  });

  const unreadNotificationsCount = notifications?.filter(
    (notification) => !notification.isRead
  ).length;

  if (!user) return null;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo and Search */}
          <div className="flex items-center space-x-2 md:space-x-4 flex-1">
            <Link href="/">
              <a className="flex items-center">
                <svg
                  className="w-10 h-10 text-primary"
                  viewBox="0 0 36 36"
                  fill="currentColor"
                >
                  <path d="M18 2.9C9.8 2.9 3.2 9.5 3.2 17.7C3.2 25 8.3 31.2 15.2 32.5V22.1H11.6V17.7H15.2V14.4C15.2 10.8 17.3 8.8 20.6 8.8C22.2 8.8 23.8 9.1 23.8 9.1V12.6H22C20.3 12.6 19.7 13.8 19.7 15V17.7H23.6L23 22.1H19.7V32.5C26.6 31.2 31.7 25 31.7 17.7C31.7 9.5 25.1 2.9 18 2.9Z"></path>
                </svg>
                <span className="hidden md:block text-primary text-2xl font-bold ml-1">
                  SocialConnect
                </span>
              </a>
            </Link>
            <div className="relative w-full max-w-xs md:max-w-md">
              <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search SocialConnect"
                className="pl-10 bg-gray-100"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center justify-center flex-1">
            <Link href="/">
              <a className={`px-8 py-2 ${location === "/" ? "text-primary border-b-4 border-primary" : "text-gray-500 hover:text-gray-700"}`}>
                <Home className="w-6 h-6" />
              </a>
            </Link>
            <Link href="/friends">
              <a className={`px-8 py-2 ${location === "/friends" ? "text-primary border-b-4 border-primary" : "text-gray-500 hover:text-gray-700"}`}>
                <Users className="w-6 h-6" />
              </a>
            </Link>
            <Link href="/watch">
              <a className={`px-8 py-2 ${location === "/watch" ? "text-primary border-b-4 border-primary" : "text-gray-500 hover:text-gray-700"}`}>
                <Monitor className="w-6 h-6" />
              </a>
            </Link>
            <Link href="/marketplace">
              <a className={`px-8 py-2 ${location === "/marketplace" ? "text-primary border-b-4 border-primary" : "text-gray-500 hover:text-gray-700"}`}>
                <ShoppingBag className="w-6 h-6" />
              </a>
            </Link>
            <Link href="/groups">
              <a className={`px-8 py-2 ${location === "/groups" ? "text-primary border-b-4 border-primary" : "text-gray-500 hover:text-gray-700"}`}>
                <UsersRound className="w-6 h-6" />
              </a>
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-2 flex-1 justify-end">
            <Button size="icon" variant="ghost" className="rounded-full">
              <Grid className="h-5 w-5" />
            </Button>

            <Button size="icon" variant="ghost" className="rounded-full relative">
              <MessageSquare className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5">3</Badge>
            </Button>

            <Button size="icon" variant="ghost" className="rounded-full relative">
              <Bell className="h-5 w-5" />
              {unreadNotificationsCount && unreadNotificationsCount > 0 ? (
                <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5">{unreadNotificationsCount}</Badge>
              ) : null}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full h-10 w-10 p-0">
                  <Avatar>
                    <AvatarImage
                      src={
                        user.profilePicture ||
                        `https://api.dicebear.com/6.x/initials/svg?seed=${user.name}&backgroundColor=1877F2`
                      }
                      alt={user.name}
                    />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link href={`/profile/${user.id}`}>
                  <a className="flex items-center p-3 rounded-lg hover:bg-gray-100">
                    <Avatar className="mr-3 h-10 w-10">
                      <AvatarImage
                        src={
                          user.profilePicture ||
                          `https://api.dicebear.com/6.x/initials/svg?seed=${user.name}&backgroundColor=1877F2`
                        }
                        alt={user.name}
                      />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">View your profile</p>
                    </div>
                  </a>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-3 h-4 w-4" />
                  <span>Settings & Privacy</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <HelpCircle className="mr-3 h-4 w-4" />
                  <span>Help & Support</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
                  <LogOut className="mr-3 h-4 w-4" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden flex items-center justify-between border-t">
        <Link href="/">
          <a className={`flex-1 text-center py-2 ${location === "/" ? "text-primary border-b-2 border-primary" : "text-gray-500"}`}>
            <Home className="mx-auto w-6 h-6" />
          </a>
        </Link>
        <Link href="/friends">
          <a className={`flex-1 text-center py-2 ${location === "/friends" ? "text-primary border-b-2 border-primary" : "text-gray-500"}`}>
            <Users className="mx-auto w-6 h-6" />
          </a>
        </Link>
        <Link href="/watch">
          <a className={`flex-1 text-center py-2 ${location === "/watch" ? "text-primary border-b-2 border-primary" : "text-gray-500"}`}>
            <Monitor className="mx-auto w-6 h-6" />
          </a>
        </Link>
        <Link href="/notifications">
          <a className={`flex-1 text-center py-2 ${location === "/notifications" ? "text-primary border-b-2 border-primary" : "text-gray-500"}`}>
            <Bell className="mx-auto w-6 h-6" />
          </a>
        </Link>
        <Link href="/menu">
          <a className={`flex-1 text-center py-2 ${location === "/menu" ? "text-primary border-b-2 border-primary" : "text-gray-500"}`}>
            <Menu className="mx-auto w-6 h-6" />
          </a>
        </Link>
      </nav>
    </header>
  );
}
