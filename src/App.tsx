import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { SignIn } from "./SignIn";
import { db } from "./firebase";
import { useCurrentUser } from "./hooks";
import {
  DocumentData,
  collection,
  deleteDoc,
  doc,
  getDocs,
  writeBatch,
} from "firebase/firestore";

class Task {
  public key: string;
  public dones: dayjs.Dayjs[] = [];
  public routine?: Routine;

  constructor(key: string, dones: dayjs.Dayjs[]) {
    this.key = key;
    this.dones = dones;
  }

  toJSON() {
    return {
      key: this.key,
      dones: this.dones?.map((v) => v.toJSON()) ?? [],
    };
  }

  addDone(day: dayjs.Dayjs) {
    this.dones.push(day);
  }

  static fromJSON(d: DocumentData): Task {
    return new Task(
      d["key"],
      ((d["dones"] as string[]) || []).map((v) => dayjs(v))
    );
  }
}

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
  onDelete,
}: {
  done: Task;
  onChange: (done: Task) => void;
  onDelete: () => void;
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

  const addDate = () => {
    done.addDone(dayjs());
    onChange(done);
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
        <button
          onClick={onDelete}
          className={`bg-red-600 text-white font-bold px-2 mx-2 rounded`}
        >
          削除
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const user = useCurrentUser();

  const [tasks, setTasks] = useState<Task[]>([]);

  const [text, setText] = useState("");

  useEffect(() => {
    (async () => {
      if (user) {
        const c = collection(db, "users", user.uid, "tasks");
        const docs = await getDocs(c);
        setTasks(docs.docs.map((v) => Task.fromJSON(v.data())));
      }
    })();
  }, [user]);

  const onChange = (done: Task, i: number) => {
    setTasks([...tasks.slice(0, i), done, ...tasks.slice(i + 1)]);
  };

  const onDelete = async (i: number) => {
    await deleteTask(tasks[i]);
    setTasks([...tasks.slice(0, i), ...tasks.slice(i + 1)]);
  };

  const addTask = () => {
    if (text != "") {
      setTasks([...tasks, new Task(text, [])]);
      setText("");
    }
  };

  const addButtonColor =
    text !== "" ? "bg-green-500 hover:bg-blue-700" : "bg-gray-500";

  if (user == null) {
    return <SignIn />;
  }

  const deleteTask = async (task: Task) => {
    try {
      const c = collection(db, "users", user.uid, "tasks");
      await deleteDoc(doc(c, task.key));
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const save = async () => {
    try {
      const c = collection(db, "users", user.uid, "tasks");
      const batch = writeBatch(db);
      tasks.forEach((v) => batch.set(doc(c, v.key), v.toJSON()));
      await batch.commit();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const load = async () => {
    try {
      const c = collection(db, "users", user.uid, "tasks");
      const docs = await getDocs(c);
      setTasks(docs.docs.map((v) => Task.fromJSON(v.data())));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="container">
        <div className="flex flex-row" id="header">
          <p className="basis-1/4">Name</p>
          <div className="basis-1/2">
            <div className="flex flex-row  justify-between">
              {new Array(7)
                .fill(0)
                .map((_, i) => dayjs().add(-i, "day"))
                .map((v) => (
                  <span key={v.toString()}>{v.format("M/DD")}</span>
                ))}
            </div>
          </div>
          <p className="basis-1/4 text-center">操作</p>
        </div>

        <hr></hr>
        <div>
          {tasks.map((v, i) => {
            return (
              <div key={i} className="">
                <Dones
                  done={v}
                  onChange={(v) => onChange(v, i)}
                  onDelete={() => onDelete(i)}
                />
              </div>
            );
          })}
        </div>

        <div className="flex flex-row justify-between">
          <div className="basis-1/4">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="text-black"
            />
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
