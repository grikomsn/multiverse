#!/usr/bin/env node

// @ts-check

import Lockfile from "@yarnpkg/lockfile";
import * as fs from "fs/promises";
import * as path from "path";

async function build() {
  const src = path.resolve(path.join(process.cwd(), "/../../yarn.lock"));
  const file = await fs.readFile(src, "utf-8");
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

  await fs.mkdir(path.join(process.cwd(), "/dist")).catch(() => {});

  const traceDest = path.join(process.cwd(), "/dist/trace.json");
  await fs.writeFile(traceDest, JSON.stringify(trace), "utf-8");

  const position = { x: 0, y: 0 };
  const elements = [];

  Object.entries(trace).forEach(([k1, v1]) => {
    elements.push({
      id: k1,
      data: { label: k1 },
      position,
    });

    if (v1.dependencies) {
      Object.keys(v1.dependencies).forEach((k2) => {
        // elements.push({
        //   id: `${k1}-to-${k2}`,
        //   source: k1,
        //   target: k2,
        //   type: "smoothstep",
        // });
        elements.push({
          id: `${k1}-has-${k2}`,
          data: { label: k2 },
          position,
        });
        elements.push({
          id: `${k1}-to-${k2}`,
          source: k1,
          target: `${k1}-has-${k2}`,
          type: "smoothstep",
        });
      });
    }
  });

  const traceFlowDest = path.join(process.cwd(), "/dist/trace-flow.json");
  await fs.writeFile(traceFlowDest, JSON.stringify(elements), "utf-8");
}

build();
