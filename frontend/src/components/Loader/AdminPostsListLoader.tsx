import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";

function AdminPostsListLoader() {
  return (
    <div className="min-h-[85vh] w-[98%] md:w-[95%] mx-auto flex justify-center items-center my-6">
      <div className="flex flex-col space-y-4 w-full">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="flex flex-col space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <Skeleton className="w-24 h-5 my-auto" />
              <Skeleton className="w-28 h-5 my-auto" />
              <Skeleton className="w-32 h-5 mx-auto my-auto hidden md:block" />
              <Skeleton className="w-24 h-5 mx-auto my-auto hidden lg:block" />
              <Skeleton className="w-8 h-8 mx-auto hidden lg:block" />
            </div>
            <Separator />
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPostsListLoader;
