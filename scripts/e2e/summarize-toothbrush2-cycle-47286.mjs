#!/usr/bin/env node

import fs from "node:fs";

const DEFAULTS = {
  javaStderr: "reports/evidence/java-toothbrush2-unify-47286-20260824-v3.stderr",
  javaBudgetStderr: "reports/evidence/java-toothbrush2-budget-forward-47286-20260824-v3.stderr",
  tsTrace: "reports/evidence/ts-toothbrush2-unify-47286-20260824-v3.jsonl",
  javaCycle: 47285,
  tsCycle: 47286,
};

function parseArgs(argv) {
  const options = { ...DEFAULTS };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--java-stderr") options.javaStderr = argv[++i];
    else if (arg === "--java-budget-stderr") options.javaBudgetStderr = argv[++i];
    else if (arg === "--ts-trace") options.tsTrace = argv[++i];
    else if (arg === "--java-cycle") options.javaCycle = Number(argv[++i]);
    else if (arg === "--ts-cycle") options.tsCycle = Number(argv[++i]);
    else if (arg === "--help") {
      console.log("Usage: node scripts/e2e/summarize-toothbrush2-cycle-47286.mjs [--java-stderr path] [--java-budget-stderr path] [--ts-trace path] [--java-cycle n] [--ts-cycle n]");
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return options;
}

function readText(path) {
  return fs.readFileSync(path, "utf8");
}

function readJsonLines(path) {
  return readText(path)
    .split(/\r?\n/)
    .filter((line) => line.trim().startsWith("{"))
    .flatMap((line) => {
      try {
        return [JSON.parse(line)];
      } catch {
        return [];
      }
    });
}

function parseBudgetPayload(payload) {
  const taskAnalyticMarker = " taskAnalytic=";
  const taskAnalyticIndex = payload.indexOf(taskAnalyticMarker);
  const taskPayload = taskAnalyticIndex >= 0 ? payload.slice(0, taskAnalyticIndex).trim() : payload;
  const taskTruth = taskPayload.match(/\s+(%[^\s]+%)$/);
  const beliefStart = payload.indexOf(" belief=", Math.max(taskAnalyticIndex, 0));
  const beliefAnalyticStart = beliefStart >= 0 ? payload.indexOf(" beliefAnalytic=", beliefStart) : -1;
  const beliefPayload = beliefStart >= 0
    ? payload.slice(beliefStart + " belief=".length, beliefAnalyticStart >= 0 ? beliefAnalyticStart : payload.length).trim()
    : null;
  const beliefTruth = beliefPayload?.match(/\s+(%[^\s]+%)$/);
  return {
    task: taskTruth ? taskPayload.slice(0, taskTruth.index).trim() : taskPayload,
    taskTruth: taskTruth?.[1] ?? null,
    belief: beliefPayload && beliefPayload !== "null"
      ? beliefTruth ? beliefPayload.slice(0, beliefTruth.index).trim() : beliefPayload
      : null,
    beliefTruth: beliefTruth?.[1] ?? null,
  };
}

function parseJava(unifyStderr, budgetStderr, cycle) {
  const lines = unifyStderr.split(/\r?\n/);
  const independent = [];
  const query = [];
  const budgets = [];
  let currentBudgetStack = [];
  let activeBudget = null;

  for (const line of lines) {
    let match = line.match(/^JAVA_INDEPENDENT\s+time=(\d+)\s+figure=(\d+)\s+left=(.*?)\s+right=(.*?)\s+unified=(\w+)\s+asym=(.*?)\s+sym=(.*)$/);
    if (match && Number(match[1]) === cycle) {
      independent.push({
        time: Number(match[1]),
        figure: Number(match[2]),
        left: match[3],
        right: match[4],
        result: match[5] === "true",
        after: { asym: match[6], sym: match[7] },
      });
      continue;
    }

    match = line.match(/^JAVA_UNIFY\s+time=(\d+)\s+figure=(\d+)\s+t1=(.*?)\s+t1Class=(.*?)\s+t1Vars=(.*?)\s+t2=(.*?)\s+t2Class=(.*?)\s+t2Vars=(.*?)\s+queryUnified=(\w+)$/);
    if (match && Number(match[1]) === cycle) {
      query.push({
        time: Number(match[1]),
        figure: Number(match[2]),
        t1: match[3],
        t1Class: match[4],
        t1Vars: match[5],
        t2: match[6],
        t2Class: match[7],
        t2Vars: match[8],
        result: match[9] === "true",
      });
      continue;
    }

    match = line.match(/^JAVA_BUDGET\s+method=(\S+)\s+time=(\d+)\s+truth=(\S+)\s+f=(\S+)\s+c=(\S+)\s+e=(\S+)\s+analytic=(\S+)\s+task=(.*)$/);
    if (match && Number(match[2]) === cycle) {
      const beliefMarker = " belief=";
      const beliefIndex = match[8].indexOf(beliefMarker);
      const taskAndTruth = beliefIndex >= 0 ? match[8].slice(0, beliefIndex) : match[8];
      const beliefAndTruth = beliefIndex >= 0 ? match[8].slice(beliefIndex + beliefMarker.length) : null;
      const taskTruth = taskAndTruth.match(/\s+(%[^\s]+%)$/);
      const beliefTruth = beliefAndTruth?.match(/\s+(%[^\s]+%)$/);
      activeBudget = {
        method: match[1],
        time: Number(match[2]),
        reducedOutputTruth: match[3],
        premiseFrequency: Number(match[4]),
        premiseConfidence: Number(match[5]),
        premiseExpectation: Number(match[6]),
        analytic: match[7] === "true",
        task: taskTruth ? taskAndTruth.slice(0, taskTruth.index).trim() : taskAndTruth,
        taskTruth: taskTruth?.[1] ?? null,
        belief: beliefTruth ? beliefAndTruth.slice(0, beliefTruth.index).trim() : beliefAndTruth,
        beliefTruth: beliefTruth?.[1] ?? null,
      };
      currentBudgetStack = [];
      continue;
    }

    if (activeBudget && line.startsWith("\tat ")) {
      currentBudgetStack.push(line.slice(3));
      continue;
    }

    if (activeBudget && line.trim() === "") {
      activeBudget.branch = currentBudgetStack.find((frame) =>
        /LocalRules\.(matchAsymSym|inferToAsym)|SyllogisticRules\.analogy/.test(frame),
      ) ?? null;
      budgets.push(activeBudget);
      activeBudget = null;
      currentBudgetStack = [];
    }
  }
  if (activeBudget) {
    activeBudget.branch = currentBudgetStack.find((frame) =>
      /LocalRules\.(matchAsymSym|inferToAsym)|SyllogisticRules\.analogy/.test(frame),
    ) ?? null;
    budgets.push(activeBudget);
  }

  const budgetLines = budgetStderr.split(/\r?\n/);
  let budget = null;
  for (const line of budgetLines) {
    const match = line.match(/^JAVA_BUDGET\s+method=(\S+)\s+time=(\d+)\s+truth=(\S+)\s+f=(\S+)\s+c=(\S+)\s+e=(\S+)\s+analytic=(\S+)\s+task=(.*)$/);
    if (!match || Number(match[2]) !== cycle) continue;
    const payload = parseBudgetPayload(match[8]);
    budget = {
      method: match[1],
      time: Number(match[2]),
      reducedOutputTruth: match[3],
      premiseFrequency: Number(match[4]),
      premiseConfidence: Number(match[5]),
      premiseExpectation: Number(match[6]),
      analytic: match[7] === "true",
      task: payload.task,
      taskTruth: payload.taskTruth,
      belief: payload.belief,
      beliefTruth: payload.beliefTruth,
      branch: null,
    };
    break;
  }
  return { independent, query, budget };
}

function stackBranch(stack) {
  const frame = String(stack ?? "").split(/\r?\n/).find((line) =>
    /LocalRules\.(matchAsymSym|inferToAsym)|SyllogisticRules\.analogy/.test(line),
  );
  return frame?.match(/(LocalRules\.(?:matchAsymSym|inferToAsym)|SyllogisticRules\.analogy)/)?.[1] ?? null;
}

function parseTypeScript(trace, cycle) {
  const events = readJsonLines(trace).filter((event) => event.cycle === cycle);
  const unifications = events.filter((event) => event.event === "TargetVariablesUnify");
  const independent = unifications.find((event) => event.before?.type === "$");
  const query = unifications.find((event) => event.before?.type === "?");
  const budget = events.find((event) => event.event === "TargetBudgetMethod");
  const budgetInference = events.find((event) => event.event === "TargetBudgetInference");
  const randomNextInt2 = events
    .filter((event) => event.event === "TargetRandomNextInt" && event.bound === 2)
    .map((event) => event.value);

  return {
    eventCounts: Object.fromEntries(
      [...new Set(events.map((event) => event.event))].map((name) => [
        name,
        events.filter((event) => event.event === name).length,
      ]),
    ),
    independent: independent ? {
      before: {
        first: independent.before.first.text,
        second: independent.before.second.text,
      },
      result: independent.result,
      after: independent.after_compound.map((term) => term.text),
    } : null,
    query: query ? {
      before: { first: query.before.first.text, second: query.before.second.text },
      result: query.result,
      after: query.after_compound.map((term) => term.text),
    } : null,
    budget: budget ? {
      method: budget.method,
      reducedOutputTruth: budget.truth_string,
      expectation: budget.truth_expectation,
      branch: stackBranch(budget.stack),
    } : null,
    budgetInference: budgetInference ? {
      quality: budgetInference.qual,
      resultQuality: budgetInference.result_quality,
      task: budgetInference.current_task?.term ?? null,
    } : null,
    randomNextInt2,
  };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const java = parseJava(readText(options.javaStderr), readText(options.javaBudgetStderr), options.javaCycle);
  const typescript = parseTypeScript(options.tsTrace, options.tsCycle);
  const javaIndependent = java.independent[0];
  const tsIndependent = typescript.independent;
  const firstObservedDifference = javaIndependent && tsIndependent && javaIndependent.after.sym !== tsIndependent.after[1]
    ? "independent_unification.after.sym"
    : null;

  console.log(JSON.stringify({
    formatVersion: 1,
    observation: { javaCycle: options.javaCycle, typescriptCycle: options.tsCycle },
    sources: { javaStderr: options.javaStderr, javaBudgetStderr: options.javaBudgetStderr, tsTrace: options.tsTrace },
    engines: {
      java: {
        unification: {
          independent: javaIndependent ? {
            before: { left: javaIndependent.left, right: javaIndependent.right },
            result: javaIndependent.result,
            after: javaIndependent.after,
          } : null,
          query: java.query[0] ? {
            before: { first: java.query[0].t1, second: java.query[0].t2 },
            result: java.query[0].result,
          } : null,
          observations: { independent: java.independent.length, query: java.query.length },
        },
        branch: java.budget?.branch ?? "LocalRules.matchAsymSym/inferToAsym (from diagnostic stack)",
        inferToAsym: java.budget ? {
          premise: {
            frequency: java.budget.premiseFrequency,
            confidence: java.budget.premiseConfidence,
            expectation: java.budget.premiseExpectation,
          },
          reducedOutputTruth: java.budget.reducedOutputTruth,
          taskTruth: java.budget.taskTruth,
          beliefTruth: java.budget.beliefTruth,
          budgetMethod: java.budget.method,
          budgetInput: {
            task: java.budget.task,
            belief: java.budget.belief,
            premiseTruth: java.budget.reducedOutputTruth,
          },
        } : null,
      },
      typescript: {
        unification: {
          independent: tsIndependent ? {
            before: tsIndependent.before,
            result: tsIndependent.result,
            after: tsIndependent.after,
          } : null,
          query: typescript.query,
        },
        branch: typescript.budget?.branch ?? null,
        inferToAsym: null,
        budget: typescript.budget,
        budgetInference: typescript.budgetInference,
        randomNextInt2: typescript.randomNextInt2,
        eventCounts: typescript.eventCounts,
      },
    },
    firstObservedDifference,
    interpretation: firstObservedDifference
      ? "The structured cycle-47286 comparison diverges after independent unification; this is not yet proof of the globally earliest divergence."
      : "No difference was found in the selected structured fields.",
  }, null, 2));
}

main();
