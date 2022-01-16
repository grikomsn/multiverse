#!/usr/bin/env node

// @ts-check

import Lockfile from "@yarnpkg/lockfile";
import * as fs from "fs";
import * as path from "path";

const src = path.join(process.cwd(), "/yarn.lock");
const file = fs.readFileSync(src, "utf-8");
const data = Lockfile.parse(file).object;

const trace = {};
Object.keys(data).forEach((k) => {
  delete data[k].resolved;
  delete data[k].integrity;

  const captured = k.split(", ").map((match) => {
    return /(@?[/a-zA-Z0-9_-]+)@([<>=~0-9a-zA-Z^\-.*\s|]+)/.exec(match);
  });

  const name = captured[0][1];

  trace[name] = {
    matches: captured.map((c) => c[2]),
    ...data[k],
  };
});

const dest = path.join(process.cwd(), "/trace-lockfile.json");
const json = JSON.stringify({ timestamp: new Date().toISOString(), trace }, null, 2);
fs.writeFileSync(dest, json, "utf-8");

console.log(`Trace result saved to to ./trace-lockfile.json 🥳`);
