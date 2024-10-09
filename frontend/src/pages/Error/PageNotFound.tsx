import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageNotFoundImage from "../../assets/PageNotFound.svg";

function PageNotFound() {
  const navigate = useNavigate();
  return (
    <div className="bg-muted mt-10 w-[98%] md:w-[90%] min-h-[80vh] mx-auto border-2 rounded-lg ">
      <div className="flex-grow md:flex min-h-[75vh] justify-between p-2 space-x-0 md:space-x-2">
        <div className="w-full md:w-1/2 my-auto">
          <img
            src={PageNotFoundImage}
            className="drop-shadow-[0_35px_35px_rgba(0,0,0,0.35)] dark:drop-shadow-[0_35px_35px_rgba(200,200,200,0.25)]"
          />
        </div>
        <div className="w-full md:w-1/2 h-full my-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.35)] dark:drop-shadow-xl">
          <h1 className="my-2 font-bold text-9xl text-center">404</h1>
          <h1 className="my-2 font-bold text-2xl">
            Looks like you've found the doorway to the great nothing
          </h1>
          <p className="my-2">
            Sorry about that! Please visit our hompage to get where you need to
            go or contact us if you think this is a mistake.
          </p>
          <div className="flex justify-between">
            <Button onClick={() => navigate("/")}>Take me there!</Button>
            <Button onClick={() => navigate("/contact")}>Contact Us</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageNotFound;
