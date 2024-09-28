import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
function PostDetailsLoader() {
  return (
    <div className="w-full md:w-[90%] mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex space-x-1">
            <Skeleton className="w-14 h-14 rounded-full" />
            <div className="flex flex-col mt-1 space-y-2">
              <Skeleton className="w-32 h-4" />
              <Skeleton className="w-32 h-3" />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-[70%] h-7" />
          <Skeleton className="w-fill h-[60vh] mt-4" />
        </CardContent>
        <div className="flex flex-col justify-start space-y-4 p-2 md:p-4">
          <Skeleton className="w-[50%] h-7" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-[50%] h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-[50%] h-4" />
          <Skeleton className="w-[80%] h-4" />
          <Skeleton className="w-[70%] h-7" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-[50%] h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-[50%] h-4" />
          <Skeleton className="w-[80%] h-4" />
          <Skeleton className="w-[30%] h-7" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-[50%] h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-[50%] h-4" />
          <Skeleton className="w-[80%] h-4" />
        </div>
      </Card>
    </div>
  );
}

export default PostDetailsLoader;
