import Todo from "./Todo";
import { Route, Routes } from "react-router-dom";
import Auth from "./Auth";
import SaveNote from "./SaveNote";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Todo />} />
        <Route path="/:name" element={<Todo />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/note" element={<SaveNote />} />
      </Routes>
    </>
  );
}
