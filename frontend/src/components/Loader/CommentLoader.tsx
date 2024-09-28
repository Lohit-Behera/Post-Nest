import { Skeleton } from "../ui/skeleton";

function CommentLoader() {
  return (
    <div className="mb-6 px-6 ">
      <Skeleton className="w-20 h-5 mx-auto mb-4" />
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col space-y-3 bg-background w-full rounded-lg p-4 border-2"
          >
            <div className="flex space-x-2">
              <Skeleton className="w-12 h-12 rounded-full" />
              <Skeleton className="w-24 h-4 mt-4" />
            </div>
            <Skeleton className="w-full h-5" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentLoader;
