import dayjs from "dayjs";
import { readFileSync, writeFileSync } from "fs";
import { argv0 } from "process";

type Done = {
  key: string;
  dones: string[];
  routines?: Routine;
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

const path = "tmp/result.json"

const dones = JSON.parse(readFileSync(path).toString()) as Done[];

console.log(dones)

const add = (key: string) => {
  dones.push({
    key, dones: []
  })
  writeFileSync(path, JSON.stringify(dones))
}

const list = () => {
  dones.forEach(v => console.log(`# ${v.key}

  ${v.dones.map(v => dayjs(v).format("YYYY-MM-DD")).join(",")}`))
}

const done = (key: string) => {
  if(dones.filter(v => v.key === key).length > 0) {
    dones.filter(v => v.key === key)[0].dones.push(dayjs().toISOString())
  }
  writeFileSync(path, JSON.stringify(dones))
}

list()
done("a")