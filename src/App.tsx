import { useState } from "react";
import "./App.css";
import dayjs from "dayjs";

type Done = {
  key: string;
  dones: dayjs.Dayjs[];
};

const App = () => {
  const [tasks, setTasks] = useState<Done[]>([
    { key: "one", dones: [dayjs()] },
    { key: "two", dones: [] },
  ]);

  return (
    <>
      <div>
        {tasks.map((v, i) => {
          return (
            <div key={i} className="">
              <h2 className="inline-block text-2xl mr-4">{v.key}</h2>
              {v.dones.map((date) => {
                return (
                  <p className="inline-block text-base">
                    {date.format("YYYY/MM/DD")}
                  </p>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default App;
