import evalRule from "./evalRule.ts";
import evalWorkflow from "./evalWorkflow.ts";
import processDestination from "./processDestination.ts";
import { Part, Rule, Workflow } from "./types.ts";

export default (
  part: Part,
  workflow: Workflow,
  workflows: Workflow[],
  rule: Rule,
): boolean => {
  if (evalRule(part, rule)) {
    return processDestination(part, workflows, rule.destination);
  }
  return evalWorkflow(part, workflow, workflows);
};
