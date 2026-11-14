import { StepBack, User } from "lucide-react";
import background from "./assets/background.png";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, register } from "./api";
import { useAuth } from "./context/Context";
import { ToastContainer, toast, Bounce } from "react-toastify";

export default function Auth() {
  const [action, setAction] = useState("signup");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [pass, setPass] = useState("");

  async function loginValidate() {
    const res = await login({ name, pass });
    if (res.message === "Invalid Credentials.") {
      toast.error("Invalid Credentials.", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
    if (res.message === "Login Successful") {
      setUser(name);
      setName("");
      setPass("");
      setLoginSuccess(true);
      setTimeout(() => {
        // navigate or close modal after animation
        setLoginSuccess(false);
        navigate(`/${name}`);
      }, 1000);
    }
  }

  async function signupValidate() {
    const res = await register({ name, pass });
    if (res.message === "NAME TAKEN") {
      toast.error("THE NAME IS ALREADY TAKEN!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
    if (res.message === "Registration Successful") {
      setUser(name);
      setName("");
      setPass("");
      setSignUpSuccess(true);
      setTimeout(() => {
        // navigate or close modal after animation
        setSignUpSuccess(false);
        navigate(`/${name}`);
      }, 1000);
    }
  }
  return (
    <>
      <div className="bg-orange-300 h-screen overflow-hidden flex items-center justify-center font-mono">
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce}
        />
        <div className="realtive shadow-2xl rounded-2xl w-auto mx-auto flex flex-col md:flex-row h-200">
          <div className="absolute left-50 top-40">
            <Link to="/">
              <StepBack className="size-8" />
            </Link>
          </div>
          <div
            className="h-auto w-200 rounded-l-2xl flex flex-wrap items-center justify-center gap-30 flex-col bg-no-repeat bg-cover bg-center"
            style={{ backgroundImage: `url(${background})` }}
          >
            <header>
              <button
                className={`${action === "signup" ? "bg-gray-300" : "backdrop-blur-2xl  bg-white/30"} p-3 rounded-2xl mr-10 cursor-pointer  font-bold text-2xl`}
                value={"signup"}
                onClick={(e) => setAction(e.target.value)}
              >
                Sign Up
              </button>
              <button
                className={`${action === "login" ? "bg-gray-300" : "backdrop-blur-2xl  bg-white/30"} p-3 rounded-2xl cursor-pointer  font-bold text-2xl`}
                value={"login"}
                onClick={(e) => setAction(e.target.value)}
              >
                Login
              </button>
            </header>
            <p className="text-5xl font-dynapuff">Welcome.</p>
          </div>

          {action === "signup" ? (
            <div className="bg-linear-to-r from-orange-100 via-amber-200 to-orange-300 rounded-r-2xl h-full flex flex-wrap items-center justify-center flex-col gap-10 w-200">
              <div className="p-5 rounded-4xl bg-amber-600">
                <User className="size-16" />
              </div>
              <div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    signupValidate();
                  }}
                >
                  <input
                    type="text"
                    className="border border-black outline-none rounded-sm p-2 w-70 mb-5"
                    placeholder="Name"
                    value={name}
                    required
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />{" "}
                  <br />
                  <input
                    type="password"
                    className="border border-black outline-none rounded-sm p-2 w-70"
                    placeholder="Password"
                    value={pass}
                    required
                    onChange={(e) => {
                      setPass(e.target.value);
                    }}
                  />
                  <br />
                  <button
                    className={`ml-20 mt-10 p-3 rounded-2xl w-30 cursor-pointer transition-all duration-300 ${
                      signUpSuccess
                        ? "bg-green-500 scale-110"
                        : "bg-amber-500 scale-100"
                    }`}
                  >
                    {signUpSuccess ? "✓ Done!" : "Sign Up"}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="bg-linear-to-r from-orange-100 via-amber-200 to-orange-300 rounded-r-2xl h-full  flex items-center justify-center flex-col px-10 gap-10 w-200">
              <div className="p-5 rounded-4xl bg-amber-600">
                <User className="size-16" />
              </div>
              <div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    loginValidate();
                  }}
                >
                  <input
                    type="text"
                    className="border border-black outline-none rounded-sm p-2 w-70 mb-5"
                    placeholder="Name"
                    value={name}
                    required
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />{" "}
                  <br />
                  <input
                    type="password"
                    className="border border-black outline-none rounded-sm p-2 w-70"
                    placeholder="Password"
                    value={pass}
                    required
                    onChange={(e) => {
                      setPass(e.target.value);
                    }}
                  />{" "}
                  <br />
                  <button
                    className={`ml-20 mt-10 p-3 rounded-2xl w-30 cursor-pointer transition-all duration-300 ${
                      loginSuccess ? "bg-green-500 scale-110" : "bg-amber-500"
                    }`}
                  >
                    {loginSuccess ? "✓ Done!" : "Login"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
