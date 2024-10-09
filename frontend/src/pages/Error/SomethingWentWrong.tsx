import { useNavigate } from "react-router-dom";
import SomethingWentWrongImage from "../../assets/Somthing Went Wrong.svg";
import { Button } from "@/components/ui/button";

function SomethingWentWrong() {
  const navigate = useNavigate();
  return (
    <div className="bg-muted mt-10 w-[98%] md:w-[90%] min-h-[80vh] mx-auto border-2 rounded-lg ">
      <div className="flex-grow md:flex min-h-[75vh] justify-between p-2 space-x-0 md:space-x-2">
        <div className="w-full md:w-[30%] lg:w-[30%] my-auto">
          <img
            src={SomethingWentWrongImage}
            className="drop-shadow-[0_35px_35px_rgba(0,0,0,0.35)] dark:drop-shadow-[0_35px_35px_rgba(200,200,200,0.25)]"
          />
        </div>
        <div className="w-full md:w-1/2 h-full my-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.35)] dark:drop-shadow-xl">
          <h1 className="my-2 font-bold text-2xl">
            Looks like Something went wrong.
          </h1>
          <p className="my-2">
            Sorry about that! Please try reload the page if the problem persists
            contact us.
          </p>
          <div className="flex justify-between">
            <Button onClick={() => window.location.reload()}>Reload</Button>
            <Button onClick={() => navigate("/contact")}>Contact Us</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SomethingWentWrong;
