import { useState } from "react";
import "./App.css";
import dayjs from "dayjs";

type Done = {
  key: string;
  dones: dayjs.Dayjs[];
};

const App = () => {
  const [tasks, setTasks] = useState<{ [key: string]: any }[]>([
    { key: "one", dones: [dayjs()] },
    { key: "two" },
  ]);

  return (
    <>
      <div>
        {tasks.map((v, i) => {
          return <p key={i}>{v["key"]}</p>;
        })}
      </div>
    </>
  );
};

export default App;
