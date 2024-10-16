import { fetchGetAllSupportTickets } from "@/features/AdminSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { Trash2 } from "lucide-react";
import Paginator from "@/components/paginator";
import GlobalLoader from "@/components/Loader/GlobalLoader/GlobalLoader";
import ServerErrorPage from "./Error/ServerErrorPage";

type SupportTicket = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  status: string;
};

function AdminSupportListPage() {
  const dispatch = useDispatch<any>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const getAllSupportTickets = useSelector(
    (state: any) => state.admin.getAllSupportTickets
  );
  const getAllSupportTicketsData = getAllSupportTickets.data || {};
  const allSupportTickets = getAllSupportTicketsData.docs || [];
  const getAllSupportTicketsStatus = useSelector(
    (state: any) => state.admin.getAllSupportTicketsStatus
  );

  const [incorrectPage, setIncorrectPage] = useState(false);

  useEffect(() => {
    if (allSupportTickets.length === 0) {
      dispatch(fetchGetAllSupportTickets("1"));
      setIncorrectPage(false);
    } else if (
      parseInt(searchParams.get("page") || "1") >
      getAllSupportTicketsData.totalPages
    ) {
      setIncorrectPage(true);
    } else if (searchParams.get("page")) {
      dispatch(fetchGetAllSupportTickets(searchParams.get("page") || "1"));
      setIncorrectPage(false);
    }
  }, [searchParams.get("page"), allSupportTickets.length, dispatch]);
  return (
    <>
      {getAllSupportTicketsStatus === "loading" ? (
        <GlobalLoader fullHight />
      ) : getAllSupportTicketsStatus === "failed" ? (
        <ServerErrorPage />
      ) : getAllSupportTicketsStatus === "succeeded" ? (
        <div className="min-h-[85vh] w-[98%] md:w-[95%] mx-auto flex justify-center items-center my-6">
          {incorrectPage ? (
            <div className="flex flex-col justify-center items-center gap-4 p-4 rounded-lg">
              <h1 className="text-xl font-bold">Incorrect Page</h1>
              <p className="text-lg">
                Please select a valid page or click below to go back page 1
              </p>
              <Button variant="outline" onClick={() => navigate("?page=1")}>
                1
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 w-full">
              <Table>
                <TableCaption className="text-end text-xs md:text-sm">
                  Showing {allSupportTickets.length} of{" "}
                  {getAllSupportTicketsData.totalDocs} Support Tickets
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Subject
                    </TableHead>
                    <TableHead className="text-center hidden md:table-cell">
                      Status
                    </TableHead>
                    <TableHead className="text-center">Edit</TableHead>
                    <TableHead className="text-center hidden md:table-cell">
                      Delete
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allSupportTickets.map((supportTicket: SupportTicket) => (
                    <TableRow key={supportTicket._id}>
                      <TableCell className="flex flex-col space-y-0.5 text-xs md:text-sm">
                        <p>{supportTicket.name}</p>
                        <p className="text-muted-foreground">
                          {supportTicket.email}
                        </p>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {supportTicket.subject}
                      </TableCell>
                      <TableCell className="text-center hidden md:table-cell">
                        <Badge
                          className={`hover:cursor-default text-black  ${
                            supportTicket.status === "Pending"
                              ? "bg-muted-foreground hover:bg-muted-foreground/70"
                              : supportTicket.status === "In Progress"
                              ? "bg-blue-500 hover:bg-blue-500/70"
                              : "bg-green-500 hover:bg-green-500/70"
                          }`}
                        >
                          {supportTicket.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center ">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            navigate(`/admin/support/${supportTicket._id}`)
                          }
                        >
                          <Pencil2Icon className="h-6 w-6" />
                        </Button>
                      </TableCell>
                      <TableCell className="text-center hidden md:table-cell">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon">
                              <Trash2 />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Support Ticket
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction>Confirm</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="fixed bottom-14 w-full">
                {getAllSupportTicketsData.totalPages > 1 && (
                  <Paginator
                    currentPage={getAllSupportTicketsData.page}
                    totalPages={getAllSupportTicketsData.totalPages}
                    showPreviousNext
                  />
                )}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </>
  );
}

export default AdminSupportListPage;
