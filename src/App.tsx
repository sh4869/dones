import { useState } from "react";
import dayjs from "dayjs";
import { SignIn } from "./SignIn";
import { db } from "./firebase";
import { useCurrentUser } from "./hooks";
import {
  DocumentData,
  collection,
  doc,
  getDocs,
  writeBatch,
} from "firebase/firestore";

type Done = {
  key: string;
  dones: dayjs.Dayjs[];
  routines?: Routine;
};

const DoneToCollection = (d: Done) => {
  return {
    ...d,
    dones: d.dones?.map((v) => v.toJSON()) ?? [],
  };
};

const CollectionToDone = (d: DocumentData): Done => {
  return {
    key: d["key"],
    dones: (d["dones"] as string[]).map((v) => dayjs(v)),
  };
};

type Routine = DailyRoutine | WeekDayRoutine;

type DailyRoutine = {
  type: "daily";
  day: number;
};

type WeekDayRoutine = {
  type: "weekday";
  weekday: number[];
};

const Dones = ({
  done,
  onChange,
}: {
  done: Done;
  onChange: (done: Done) => void;
}) => {
  const days = new Array(7).fill(0).map((_, i) => dayjs().add(-i, "day"));
  const dates = days.map((v, i) => {
    const has = done.dones.filter((z) => z.isSame(v, "day"));
    if (has.length > 0) {
      return <span key={i}>{"✅️"}</span>;
    } else {
      return <span key={i}>{""}</span>;
    }
  });

  if (done.routines) {
  }

  const addDate = () => {
    onChange({
      ...done,
      dones: [...done.dones, dayjs()],
    });
  };

  const addDateEnabled =
    done.dones.filter((z) => z.isSame(dayjs(), "day")).length == 0;

  const buttonColor = addDateEnabled
    ? "bg-blue-500 hover:bg-blue-700"
    : "bg-gray-500";

  return (
    <div className="flex flex-row">
      <h2 className="inline-block text-xl mr-4 basis-1/4">{done.key}</h2>
      <div className="inline-block basis-1/2 flex flex-row justify-between">
        {dates}
      </div>
      <div className="inline-block basis-1/4">
        <button
          className={`${buttonColor} text-white font-bold px-2 mx-2 rounded`}
          onClick={addDate}
          disabled={!addDateEnabled}
        >
          やった
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const user = useCurrentUser();

  const [tasks, setTasks] = useState<Done[]>([
    { key: "家の掃除", dones: [dayjs().add(-1, "day")] },
    { key: "洗面の流し掃除", dones: [] },
  ]);

  const [text, setText] = useState("");

  const onChange = (done: Done, i: number) => {
    setTasks([...tasks.slice(0, i), done, ...tasks.slice(i + 1)]);
  };

  const addTask = () => {
    if (text != "") {
      setTasks([...tasks, { key: text, dones: [] }]);
      setText("");
    }
  };

  const addButtonColor =
    text !== "" ? "bg-green-500 hover:bg-blue-700" : "bg-gray-500";

  if (user == null) {
    return <SignIn />;
  }

  const save = async () => {
    try {
      const c = collection(db, "users", user.uid, "tasks");
      const batch = writeBatch(db);
      tasks.forEach((v) => batch.set(doc(c, v.key), DoneToCollection(v)));
      await batch.commit();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const load = async () => {
    try {
      const c = collection(db, "users", user.uid, "tasks");
      const docs = await getDocs(c);
      console.log(docs.docs.map((v) => v.data()));
      setTasks(docs.docs.map((v) => CollectionToDone(v.data())));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="container">
        <div className="flex flex-row" id="header">
          <p className="basis-1/4">Name</p>
          <p className="basis-1/2">
            <div className="flex flex-row  justify-between">
              {new Array(7)
                .fill(0)
                .map((_, i) => dayjs().add(-i, "day"))
                .map((v) => (
                  <span>{v.format("MM/DD")}</span>
                ))}
            </div>
          </p>
          <p className="basis-1/4 text-center">操作</p>
        </div>

        <hr></hr>
        <div>
          {tasks.map((v, i) => {
            return (
              <div key={i} className="">
                <Dones done={v} onChange={(v) => onChange(v, i)} />
              </div>
            );
          })}
        </div>

        <div className="flex flex-row justify-between">
          <div className="basis-1/4">
            <input value={text} onChange={(e) => setText(e.target.value)} />
            <button
              className={`${addButtonColor} text-white font-bold px-2 mx-2 rounded`}
              onClick={addTask}
            >
              +
            </button>
          </div>
          <div className="basis-1/2"></div>
          <div className="basis-1/8">
            <button
              className="bg-green-500 text-white font-bold px-2 mx-2 rounded"
              onClick={save}
            >
              save
            </button>
          </div>
          <div className="basis-1/8">
            <button
              className="bg-green-500 text-white font-bold px-2 mx-2 rounded"
              onClick={load}
            >
              load
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
