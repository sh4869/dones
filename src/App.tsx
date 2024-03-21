import { useState } from "react";
import dayjs from "dayjs";

type Done = {
  key: string;
  dones: dayjs.Dayjs[];
};

const Dones = ({
  done,
  onChange,
}: {
  done: Done;
  onChange: (done: Done) => void;
}) => {
  const days = new Array(7).fill(0).map((_, i) => dayjs().add(-i, "day"));
  const dates = days.map((v) => {
    const has = done.dones.filter((z) => z.isSame(v, "day"));
    if (has.length > 0) {
      return <span>{" * "}</span>;
    } else {
      return <span>{" _ "}</span>;
    }
  });

  const addDate = () => {
    onChange({
      ...done,
      dones: [...done.dones, dayjs()],
    });
  };

  return (
    <div>
      <h2 className="inline-block text-xl mr-4">{done.key}</h2>
      <div className="inline-block">{dates}</div>
      <div className="inline-block">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 mx-2 rounded"
          onClick={addDate}
        >
          add
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const [tasks, setTasks] = useState<Done[]>([
    { key: "家の掃除", dones: [dayjs().add(-1, "day")] },
    { key: "洗面の流し掃除", dones: [] },
  ]);

  const onChange = (done: Done, i: number) => {
    setTasks([...tasks.slice(0, i), done, ...tasks.slice(i + 1)]);
  };

  return (
    <>
      <div>
        {tasks.map((v, i) => {
          return (
            <div key={i} className="">
              <Dones done={v} onChange={(v) => onChange(v, i)} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default App;
