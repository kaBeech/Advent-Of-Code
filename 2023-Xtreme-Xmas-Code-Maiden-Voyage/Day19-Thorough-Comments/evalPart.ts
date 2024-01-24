import evalRuleByCategory from "./evalRuleByCategory.ts";
import evalWorkflow from "./evalWorkflow.ts";
import processDestination from "./processDestination.ts";
import { Part, Rule, Workflow } from "./types.ts";

export default (
  part: Part,
  workflow: Workflow,
  workflows: Workflow[],
  rule: Rule,
): boolean => {
  // If the part passes the rule's qualification, process the destination.
  if (evalRuleByCategory(part, rule)) {
    return processDestination(part, workflows, rule.destination);
  }
  // Otherwise, recursively evaluate the next rule in the workflow.
  return evalWorkflow(part, workflow, workflows);
};
