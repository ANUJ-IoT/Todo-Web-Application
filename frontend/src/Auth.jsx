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

  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [pass, setPass] = useState("");

  // This is for the login validation
  async function loginValidate() {
    const res = await login({ name, pass });

    if (
      res.message === "Invalid Credentials." ||
      res.message === "User Not Found."
    ) {
      toast.error("Invalid Credentials.", {
        position: "bottom-right",
        autoClose: 5000,
        theme: "dark",
        transition: Bounce,
      });
    }

    if (res.message === "Valid Credentials") {
      setUser(name);
      setName("");
      setPass("");
      setLoginSuccess(true);

      setTimeout(() => {
        setLoginSuccess(false);
        navigate(`/${name}`);
      }, 1000);
    }
  }
  // This is for the registration
  async function signupValidate() {
    const res = await register({ name, pass });

    if (res.message === "User Name already exits.") {
      toast.error("THE NAME IS ALREADY TAKEN!", {
        position: "bottom-right",
        autoClose: 5000,
        theme: "dark",
        transition: Bounce,
      });
    }

    if (res.message === "Registration Successfull.") {
      setUser(name);
      setName("");
      setPass("");
      setSignUpSuccess(true);

      setTimeout(() => {
        setSignUpSuccess(false);
        navigate(`/${name}`);
      }, 1000);
    }
  }

  const isSignup = action === "signup";
  const isSuccess = isSignup ? signUpSuccess : loginSuccess;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-orange-300 font-mono">
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        closeOnClick={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />

      {/* Main Authentication Container */}

      <div
        className="w-full max-w-7xl min-h-200 flex flex-col md:flex-row rounded-2xl overflow-hidden bg-cover bg-center shadow-2xl"
        style={{ backgroundImage: `url(${background})` }}
      >
        {/* LEFT PANEL */}

        <section className="w-full md:w-5/12 p-7 md:p-10 flex flex-col">
          {/* Back Button */}

          <div className="flex justify-start">
            <Link
              to="/"
              className="p-2 rounded-full hover:bg-white/40 transition-colors"
            >
              <StepBack className="size-7" />
            </Link>
          </div>

          {/* Welcome Section */}

          <div className="flex flex-col gap-8 mt-12 md:mt-60">
            <div>
              <p className="text-5xl md:text-6xl font-dynapuff">Welcome.</p>

              <p className="mt-3 text-sm text-gray-800">
                {isSignup
                  ? "Create an account to get started."
                  : "Welcome back! Login to continue."}
              </p>
            </div>

            {/* Action Selector */}

            <header className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setAction("signup")}
                className={`flex-1 p-3 rounded-xl cursor-pointer font-bold text-lg transition-all duration-200 ${
                  isSignup
                    ? "bg-gray-900 text-white shadow-md"
                    : "bg-white/40 text-gray-800 hover:bg-white/70"
                }`}
              >
                Sign Up
              </button>

              <button
                type="button"
                onClick={() => setAction("login")}
                className={`flex-1 p-3 rounded-xl cursor-pointer font-bold text-lg transition-all duration-200 ${
                  !isSignup
                    ? "bg-gray-900 text-white shadow-md"
                    : "bg-white/40 text-gray-800 hover:bg-white/70"
                }`}
              >
                Login
              </button>
            </header>
          </div>
        </section>

        {/* RIGHT PANEL */}

        <section className="flex-1 flex flex-col items-center justify-center p-7 md:p-12 gap-8 bg-white/10 backdrop-blur-[2px]">
          {/* User Icon */}

          <div className="p-5 rounded-3xl bg-amber-500 shadow-lg">
            <User className="size-14 md:size-16 text-gray-900" />
          </div>

          {/* Authentication Form */}

          <form
            className="w-full max-w-sm flex flex-col gap-5"
            onSubmit={(e) => {
              e.preventDefault();

              if (isSignup) {
                signupValidate();
              } else {
                loginValidate();
              }
            }}
          >
            {/* Username */}

            <label className="flex flex-col gap-2 font-bold text-lg">
              User Name
              <input
                type="text"
                className="w-full min-w-0 border border-black/50 outline-none rounded-xl p-3 bg-white/60 focus:bg-white focus:ring-2 focus:ring-amber-500 transition-all"
                placeholder="Enter your name"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            {/* Password */}

            <label className="flex flex-col gap-2 font-bold text-lg">
              Password
              <input
                type="password"
                className="w-full min-w-0 border border-black/50 outline-none rounded-xl p-3 bg-white/60 focus:bg-white focus:ring-2 focus:ring-amber-500 transition-all"
                placeholder="Enter your password"
                value={pass}
                required
                onChange={(e) => setPass(e.target.value)}
              />
            </label>

            {/* Submit Button */}

            <button
              type="submit"
              className={`w-full mt-5 p-3 rounded-xl text-xl font-extrabold cursor-pointer transition-all duration-300 ${
                isSuccess
                  ? "bg-green-500 scale-105"
                  : "bg-amber-500 hover:bg-amber-400 hover:shadow-lg"
              }`}
            >
              {isSuccess ? "✓ Done!" : isSignup ? "Sign Up" : "Login"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
