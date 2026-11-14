import { useEffect, useState } from "react";
import Note from "./assets/Note.png";
import { StepBack } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { saveLongNote, saveNote } from "./api";
import { useAuth } from "./context/Context";
import { Bounce, toast, ToastContainer } from "react-toastify";

export default function SaveNote() {
  const { user } = useAuth();

  const navigate = useNavigate();

  const [note, setNote] = useState("Short");
  const [shortNoteData, setShortNoteData] = useState({
    title: "",
    detail: "",
  });

  const [longNoteData, setLongNoteData] = useState({
    title: "",
    detail: "",
  });

  useEffect(() => {
    if (!user) return navigate("/auth");
  }, [user]);

  function handleShortNote(e) {
    const { name, value } = e.target;

    setShortNoteData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleLongNote(e) {
    const { name, value } = e.target;

    setLongNoteData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function shortNote() {
    const res = await saveNote(shortNoteData.title, shortNoteData.detail, user);
    if (res.message.startsWith("Data too long for column")) {
      toast.error("Title cannot be that long", {
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
    if (res.message === "Inserted Successfully") {
      toast.success("Note Inserted Successfully", {
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
      setShortNoteData({ title: "", detail: "" });
    }
  }

  async function longNote() {
    const res = await saveLongNote(
      longNoteData.title,
      longNoteData.detail,
      user,
    );

    if (res.message.startsWith("Data too long for column")) {
      toast.error("Title cannot be that long", {
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
    if (res.message === "Inserted Successfully") {
      toast.success("Note Inserted Successfully", {
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
      setLongNoteData({ title: "", detail: "" });
    }
  }

  return (
    <>
      <div
        style={{ backgroundImage: `url(${Note})` }}
        className="h-screen overflow-hidden bg-no-repeat bg-center bg-cover flex flex-wrap items-center justify-center font-mono"
      >
        <ToastContainer
          position="bottom-left"
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
        <div className="relative p-10 rounded-2xl bg-white/20 backdrop-blur-2xl shadow-2xl h-130 flex flex-wrap items-center justify-center flex-col">
          <Link to="/">
            <StepBack className="absolute top-8 left-8" />
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-5 bg-white/40 rounded-2xl p-4 font-bold">
            <button
              className={`${note === "Short" ? "bg-gray-700 text-white p-3 " : " "} rounded-sm cursor-pointer p-3`}
              value={"Short"}
              onClick={(e) => {
                setNote(e.target.value);
              }}
            >
              Short
            </button>
            <button
              className={`${note === "Detailed" ? "bg-gray-700 text-white p-3 " : " "} rounded-sm cursor-pointer p-3`}
              value={"Detailed"}
              onClick={(e) => {
                setNote(e.target.value);
              }}
            >
              Detailed
            </button>
          </div>
          {note === "Short" ? (
            <div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  shortNote();
                }}
                className="flex flex-wrap items-center justify-center gap-5 flex-col mt-10"
              >
                <input
                  type="text"
                  name="title"
                  value={shortNoteData.title}
                  placeholder="Title of the note.."
                  className="border border-black p-2 rounded-sm w-100 outline-none"
                  onChange={handleShortNote}
                  required
                />
                <input
                  type="text"
                  name="detail"
                  value={shortNoteData.detail}
                  placeholder="Details about the note.."
                  className="border border-black p-2 rounded-sm w-100 outline-none"
                  onChange={handleShortNote}
                  required
                />
                <button className="p-2 rounded-sm w-30 hover:bg-amber-500 bg-lime-700 font-bold text-lg">
                  Save
                </button>
              </form>
            </div>
          ) : (
            <div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  longNote();
                }}
                className="flex flex-wrap items-center justify-center gap-5 flex-col mt-10"
              >
                <input
                  type="text"
                  name="title"
                  value={longNoteData.title}
                  placeholder="Title of the note.."
                  className="border border-black p-2 rounded-sm w-100 outline-none"
                  onChange={handleLongNote}
                  required
                />
                <textarea
                  name="detail"
                  value={longNoteData.detail}
                  cols={30}
                  rows={4}
                  onChange={handleLongNote}
                  className="border border-black p-2 rounded-sm w-100 outline-none"
                  placeholder="Enter detailed description for the note.."
                  required
                ></textarea>
                <button className="p-2 rounded-sm w-30 hover:bg-amber-500 bg-lime-700 font-bold text-lg">
                  Save
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
