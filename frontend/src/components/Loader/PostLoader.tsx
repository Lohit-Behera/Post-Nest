import { Skeleton } from "../ui/skeleton";

function PostLoader() {
  return (
    <div className="w-[98%] md:w-[95%] mx-auto my-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="p-2 md:p-4 rounded-lg border-2 ">
            <div className="flex justify-between">
              <div className="flex space-x-2">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex flex-col space-y-1 mt-2 md:mt-0.5 lg:mt-1">
                  <Skeleton className="w-24 h-4 " />
                  <Skeleton className="w-24 h-3 " />
                </div>
              </div>
              <Skeleton className="w-10 h-9" />
            </div>
            <Skeleton className="w-full h-52 mt-2" />
            <Skeleton className="w-full h-5 mt-4" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostLoader;
