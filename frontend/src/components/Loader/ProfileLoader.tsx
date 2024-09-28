import { Separator } from "@radix-ui/react-dropdown-menu";
import { Skeleton } from "../ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PostLoader from "./PostLoader";

function ProfileLoader() {
  return (
    <div>
      <div className="h-52 bg-secondary relative z-10">
        <Skeleton className="w-24 h-24 absolute -bottom-10 left-10 bg-secondary-foreground rounded-full" />
      </div>
      <div className="flex flex-col md:flex-row mt-8 w-full h-full space-x-0 md:space-x-4 space-y-4 md:space-y-0">
        <div className="w-full md:w-[30%]">
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="w-40 h-4" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="w-full h-3" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Skeleton className="w-full h-4" />
              <Separator className="mt-2" />
              <Skeleton className="w-24 h-3" />
            </CardContent>
            <CardFooter>
              <div className="border-2 rounded-lg p-2 w-full space-y-2">
                <div className="flex justify-between">
                  <div className="flex flex-col justify-center items-center space-y-2 w-1/2">
                    <Skeleton className="w-10 h-4" />
                    <Skeleton className="w-20 h-4" />
                  </div>
                  <div className="flex flex-col justify-center items-center space-y-2 w-1/2">
                    <Skeleton className="w-10 h-4" />
                    <Skeleton className="w-20 h-4" />
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <div className="flex flex-col justify-center items-center space-y-2 w-1/2">
                    <Skeleton className="w-10 h-4" />
                    <Skeleton className="w-20 h-4" />
                  </div>
                  <div className="flex flex-col justify-center items-center space-y-2 w-1/2">
                    <Skeleton className="w-10 h-4" />
                    <Skeleton className="w-20 h-4" />
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
        <div className="w-full md:w-[68%]">
          <PostLoader />
        </div>
      </div>
    </div>
  );
}

export default ProfileLoader;
