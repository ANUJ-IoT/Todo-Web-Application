import { useEffect, useState } from "react";
import { User, Plus, LogOut, Trash } from "lucide-react";

import { RingChart } from "@/components/charts/ring-chart";
import { Ring } from "@/components/charts/ring";
import { RingCenter } from "@/components/charts/ring-center";
import {
  Legend,
  LegendItem,
  LegendLabel,
  LegendMarker,
  LegendValue,
  LegendProgress,
} from "@/components/charts/legend";

import { ToastContainer, toast, Bounce } from "react-toastify";

import CalenderWithPresets from "@/components/Calender/CalenderWithPresets";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/Context";
import { deleteNote, getHistory, getNotes } from "./api";

function Todo() {
  const Navigate = useNavigate();
  const { user, setUser, day, date } = useAuth();

  const [noteState, setNoteState] = useState("All");

  const [all, setAll] = useState([]);
  const [short, setShort] = useState([]);
  const [long, setLong] = useState([]);
  const [history, setHistory] = useState([]);
  const displayNotes =
    noteState === "All"
      ? all
      : noteState === "Short"
        ? short
        : noteState === "Long"
          ? long
          : history;
  const [menu, setMenu] = useState(false);
  const [state, setState] = useState({
    initiated: 0,
    finished: 0,
    overdue: 0,
    ongoing: 0,
    failed: 0,
  });
  const chartData = [
    {
      label: "Finished",
      value: state.finished,
      maxValue: state.initiated,
      color: "#3dfc03",
    },
    {
      label: "Failed",
      value: state.failed,
      maxValue: state.initiated,
      color: "#00b4d8",
    },
    {
      label: "OverDue",
      value: state.overdue,
      maxValue: state.initiated,
      color: "#ffd500",
    },
    {
      label: "OnGoing",
      value: state.ongoing,
      maxValue: state.initiated,
      color: "#fc3103",
    },
    {
      label: "Initiated",
      value: state.initiated,
      maxValue: state.initiated,
      color: "#00b4d8",
    },
  ];

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      const all_res = await getNotes(user);
      setAll(all_res.result || []);
      setShort(() => all_res.result.filter((i) => i.cat === "short" || []));
      setLong(() => all_res.result.filter((i) => i.cat === "long"));

      const his_res = await getHistory(user);
      setHistory(his_res.result || []);
      setState((prev) => ({
        ...prev,
        initiated: his_res.result.length,
        ongoing: all.length,
      }));
    }
    fetchData();
  }, [user, all.length]);

  async function remove(id) {
    const res = await deleteNote(id);
    setAll((prev) => prev.filter((n) => n.noteId !== id));
    if (res.message === "Deleted Successfully") {
      toast.success("The Note has been deleted.", {
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
    setState((prev) => ({
      ...prev,
      finished: prev.finished + 1,
      ongoing: all.length - 1,
    }));
  }

  const logoutClean = () => {
    setUser("");
    setAll([]);
    setLong([]);
    setShort([]);
    setHistory([]);
  };

  return (
    <>
      <div className="bg-linear-to-r from-lime-300 via-emerald-200 to-cyan-300 font-mono p-5 h-fit">
        <div className="bg-linear-to-r from-cyan-300 via-emerald-200 to-lime-300 h-fit p-4 rounded-2xl shadow-2xl ">
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
          {/* 
          // *HEADER SECTION 
        */}
          <div className="flex justify-center">
            <div className="relative bg-white/20 backdrop-blur-2xl border-white/20 shadow-lg rounded-4xl w-200 flex flex-wrap items-center justify-between px-10">
              {!user ? (
                <>
                  <User size={50} />
                  <Link to="/auth">
                    <p className="text-3xl font-bold text-mist-900 p-3 w-30 text-center rounded-2xl cursor-pointer bg-white/10 backdrop-blur-2xl">
                      Guest
                    </p>
                  </Link>
                </>
              ) : (
                <>
                  <User size={50} />
                  <p
                    className="text-3xl font-bold text-mist-900 p-3 w-auto text-center rounded-sm cursor-pointer bg-white/10 backdrop-blur-2xl"
                    onClick={() => setMenu(!menu)}
                  >
                    {user}
                  </p>
                  {menu && (
                    <div className="absolute -bottom-12 border p-2 rounded-sm bg-white/40 backdrop-blur-2xl shadow-2xl right-10 text-2xl">
                      <div>
                        <button
                          onClick={logoutClean}
                          className="px-2 cursor-pointer flex flex-wrap items-center justify-around gap-10 hover:bg-red-500 rounded-sm"
                        >
                          <p>Logout</p>
                          <LogOut />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* 
        // *THIS IS THE MAIN BODY 
        */}
          <div className="flex flex-wrap items-center justify-around mt-20 flex-1 overflow-y-auto">
            {/* 
            // *THIS IS THE CALENDER FORM SHADCN/UI 
          */}
            <div>
              <div className="font-dynapuff text-3xl my-4">
                <p>{day}</p>
                <p>{date}</p>
              </div>
              <div className="w-fit rounded-2xl">
                <CalenderWithPresets />
              </div>
            </div>

            {/* 
            // *THIS IS THE NOTES BODY
          */}
            <div className="bg-white/15 backdrop-blur-xl border border-white/20 min-w-180 rounded-2xl h-180 max-h-300 shadow-2xl relative">
              <div className="p-5">
                <div className="flex flex-wrap items-center justify-between">
                  <div className="flex flex-wrap items-center gap-2 mb-3 w-fit bg-white/20 rounded-2xl">
                    <button
                      className={`${noteState === "All" ? "bg-gray-700 text-white p-3 " : " "} p-3 rounded-2xl cursor-pointer`}
                      value={"All"}
                      onClick={(e) => setNoteState(e.target.value)}
                    >
                      All
                    </button>
                    <button
                      className={`${noteState === "Short" ? "bg-gray-700 text-white p-3 " : " "} p-3 rounded-2xl cursor-pointer`}
                      value={"Short"}
                      onClick={(e) => setNoteState(e.target.value)}
                    >
                      Short
                    </button>
                    <button
                      className={`${noteState === "Long" ? "bg-gray-700 text-white p-3 " : " "} p-3 rounded-2xl cursor-pointer`}
                      value={"Long"}
                      onClick={(e) => setNoteState(e.target.value)}
                    >
                      Long
                    </button>
                  </div>
                  <div className="mb-3">
                    <button
                      className={`${noteState === "History" ? "bg-gray-700 text-white p-3 " : " "} p-3 rounded-2xl cursor-pointer`}
                      value={"History"}
                      onClick={(e) => setNoteState(e.target.value)}
                    >
                      History
                    </button>
                  </div>
                </div>
                <hr className="border-black" />
                {/* 
                  // *THIS WOULD BE THE NOTES
                */}
                <div className="overflow-y-auto mt-5 max-h-150">
                  {all.length === 0 ? (
                    <div className="flex flex-wrap p-4 items-center justify-between mb-5 border rounded-2xl bg-yellow-300 border-yellow-300/70 hover:shadow-lg">
                      <div className="">
                        <p className="text-2xl w-fit font-bold px-2 rounded-sm text-grey-900">
                          NO NOTES FOUND!
                        </p>
                        <p className="px-2 text-slate-700 rounded-sm mt-3">
                          ADD NOTES TO VIEW AND ANALYZE THROUGH THE CHART FOR
                          THE PROGRESS.
                        </p>
                        <p className="w-fit px-2  rounded-sm mt-2">{date}</p>
                      </div>
                      <button className="p-4 cursor-pointer hover:bg-red-500 rounded-2xl">
                        <Trash className="text-red-700" />
                      </button>
                    </div>
                  ) : (
                    displayNotes.map((item) => (
                      <div
                        key={item.noteId}
                        className="flex flex-wrap p-4 items-center justify-between mb-5 border rounded-2xl bg-yellow-300 border-yellow-300/70 hover:shadow-lg"
                      >
                        <div>
                          <p className="text-2xl font-bold">{item.title}</p>
                          <p className="max-w-170 truncate">{item.detail}</p>
                          <p>{item.date}</p>
                        </div>
                        {displayNotes === history ? null : (
                          <button className="rounded-2xl hover:bg-red-500 cursor-pointer p-4">
                            <Trash
                              className=""
                              onClick={() => remove(item.noteId)}
                            />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
              {user && (
                <button
                  onClick={() => {
                    Navigate("/note");
                  }}
                >
                  <Plus className="absolute p-3 border bg-amber-600 size-14 rounded-4xl bottom-5 right-6 cursor-pointer animate-bounce" />
                </button>
              )}
            </div>
            {/* 
          // *THIS IS THE CHART COMPONENT IMPORTED FROM BKLIT UI 
        */}
            <div className="bg-coolor w-fit rounded-2xl text-white">
              {user === "" ? (
                <Link to="/auth">
                  <button className="p-5 cursor-pointer">
                    LOGIN TO ACCESSS THE CHART
                  </button>
                </Link>
              ) : (
                <>
                  <RingChart data={chartData} size={350}>
                    {chartData.map((item, index) => (
                      <Ring key={item.label} index={index} />
                    ))}
                    <RingCenter
                      defaultLabel="Total Tasks"
                      valueClassName="text-4xl font-bold text-white"
                      labelClassName="text-sm text-muted-foreground text-white"
                    />
                  </RingChart>
                  <div className="p-5">
                    <Legend items={chartData}>
                      <LegendItem>
                        <div className="flex items-center justify-between gap-5">
                          <div className="flex gap-2 items-center">
                            <LegendMarker />
                            <LegendLabel />
                          </div>
                          <LegendValue />
                        </div>
                        <LegendProgress />
                      </LegendItem>
                    </Legend>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Todo;
