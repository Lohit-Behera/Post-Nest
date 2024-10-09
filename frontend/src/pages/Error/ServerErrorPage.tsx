import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import ServerError from "../../assets/Server Error.svg";
import { reSignIn } from "@/features/UserSlice";

function ServerErrorPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  return (
    <div className="bg-muted mt-10 w-[98%] md:w-[90%] min-h-[80vh] mx-auto border-2 rounded-lg ">
      <div className="flex-grow md:flex min-h-[75vh] justify-between p-2 space-x-0 md:space-x-2">
        <div className="w-full md:w-1/2 my-auto">
          <img
            src={ServerError}
            className="drop-shadow-[0_35px_35px_rgba(0,0,0,0.35)] dark:drop-shadow-[0_35px_35px_rgba(200,200,200,0.25)]"
            alt="Server Error"
          />
        </div>
        <div className="w-full md:w-1/2 h-full my-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.35)] dark:drop-shadow-xl">
          <h1 className="my-2 font-bold text-9xl text-center">500</h1>
          <h1 className="my-2 font-bold text-2xl">
            Looks like There is an Internal Server Error.
          </h1>
          <p className="my-2">
            Sorry about that! Please try go to homepage or reload the page or
            re-sign in if the problem persists contact us.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button size="sm" onClick={() => navigate("/")}>
              Home
            </Button>
            <Button size="sm" onClick={() => window.location.reload()}>
              Reload
            </Button>
            <Button
              size="sm"
              onClick={() => {
                dispatch(reSignIn());
                window.location.reload();
              }}
            >
              Re-Sign in
            </Button>
            <Button size="sm" onClick={() => navigate("/contact")}>
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServerErrorPage;
