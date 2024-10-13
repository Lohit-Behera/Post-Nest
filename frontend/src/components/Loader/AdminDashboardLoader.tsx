import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";

function AdminDashboardLoader() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 min-h-[93vh] w-full">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <div className="flex flex-col justify-start space-y-4 p-4 rounded-lg border-2">
          <div className="flex justify-between space-x-2">
            <Skeleton className="w-20 h-5 my-auto" />
            <Skeleton className="w-6 h-6" />
          </div>
          <Skeleton className="w-[70%] h-5" />
          <Skeleton className="w-full h-6" />
        </div>
        <div className="flex flex-col justify-start space-y-4 p-4 rounded-lg border-2">
          <div className="flex justify-between space-x-2">
            <Skeleton className="w-20 h-5 my-auto" />
            <Skeleton className="w-6 h-6" />
          </div>
          <Skeleton className="w-[60%] h-5" />
          <Skeleton className="w-full h-6" />
        </div>
        <div className="flex flex-col justify-start space-y-4 p-4 rounded-lg border-2">
          <div className="flex justify-between space-x-2">
            <Skeleton className="w-20 h-5 my-auto" />
            <Skeleton className="w-6 h-6" />
          </div>
          <Skeleton className="w-[50%] h-5" />
        </div>
        <div className="flex flex-col justify-start space-y-4 p-4 rounded-lg border-2">
          <div className="flex justify-between space-x-2">
            <Skeleton className="w-20 h-5 my-auto" />
            <Skeleton className="w-6 h-6" />
          </div>
          <Skeleton className="w-[80%] h-5" />
        </div>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <div className="flex flex-col space-y-2 p-4 rounded-lg border-2">
          <div className="flex justify-between mb-2">
            <Skeleton className="w-28 h-5 my-auto" />
            <Skeleton className="w-24 h-8" />
          </div>
          <div className="flex justify-between space-x-8">
            <Skeleton className="w-20 h-4 my-auto" />
            <Skeleton className="w-20 h-4" />
          </div>
          <Separator />
          <div className="flex justify-between space-x-8">
            <Skeleton className="w-[30%] h-4 my-auto" />
            <Skeleton className="w-[70%] h-4" />
          </div>
          <Separator />
          <div className="flex justify-between space-x-8">
            <Skeleton className="w-[20%] h-4 my-auto" />
            <Skeleton className="w-[60%] h-4" />
          </div>
          <Separator />
          <div className="flex justify-between space-x-8">
            <Skeleton className="w-[25%] h-4 my-auto" />
            <Skeleton className="w-[50%] h-4" />
          </div>
          <Separator />
          <div className="flex justify-between space-x-8">
            <Skeleton className="w-[35%] h-4 my-auto" />
            <Skeleton className="w-[65%] h-4" />
          </div>
          <Separator />
          <div className="flex justify-between space-x-8">
            <Skeleton className="w-[20%] h-4 my-auto" />
            <Skeleton className="w-[65%] h-4" />
          </div>

          <Separator />
          <div className="flex justify-between space-x-8">
            <Skeleton className="w-[30%] h-4 my-auto" />
            <Skeleton className="w-[70%] h-4" />
          </div>
          <Separator />
          <div className="flex justify-between space-x-8">
            <Skeleton className="w-[20%] h-4 my-auto" />
            <Skeleton className="w-[50%] h-4" />
          </div>
          <Separator />
          <div className="flex justify-between space-x-8">
            <Skeleton className="w-[15%] h-4 my-auto" />
            <Skeleton className="w-[65%] h-4" />
          </div>
          <Separator />
          <div className="flex justify-between space-x-8">
            <Skeleton className="w-[25%] h-4 my-auto" />
            <Skeleton className="w-[55%] h-4" />
          </div>
          <Separator />
          <div className="flex justify-between space-x-8">
            <Skeleton className="w-[30%] h-4 my-auto" />
            <Skeleton className="w-[70%] h-4" />
          </div>
        </div>
        <div className="flex flex-col space-y-2 p-4 rounded-lg border-2">
          <Skeleton className="w-28 h-4 my-auto mb-2" />
          {Array.from({ length: 9 }).map((_, index) => (
            <div className="flex space-x-2" key={index}>
              <Skeleton className="h-9 w-9 rounded-full my-auto" />
              <div className="flex flex-col space-y-2">
                <Skeleton className="w-28 h-3" />
                <Skeleton className="w-20 h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardLoader;
