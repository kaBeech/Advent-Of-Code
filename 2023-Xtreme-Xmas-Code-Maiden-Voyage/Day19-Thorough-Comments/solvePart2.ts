import evalWorkflow from "./evalWorkflow.ts";
import getNextPart from "./getNextPart.ts";
import parseInput from "./parseInput.ts";
import {
  AcceptablePartsRange,
  EndingFilter,
  EvaluationResult,
  Part,
  Rule,
  RuleInstance,
  Workflow,
} from "./types.ts";

const myFunction = (
  numberOfAcceptablePartCombinations: number,
  workflows: Workflow[],
  currentPart: Part,
  ruleStack: RuleInstance[],
) => {
  let nextStepValue = Infinity;

  while (
    nextStepValue > 0
  ) {
    // If a part is accepted, add it to the acceptedParts array.
    const result: EvaluationResult = evalWorkflow(
      currentPart,
      workflows.find((workflow) => workflow.name === `in`)!,
      workflows,
      ruleStack,
    );
    if (
      result.passes
    ) {
      numberOfAcceptablePartCombinations += result.value;
    }
    nextStepValue = result.value;
    ruleStack = result.ruleStack;

    currentPart = getNextPart(currentPart, result.category, result.value);
  }
  const result = { numberOfAcceptablePartCombinations, ruleStack };
  return result;
};

export default (async function (): Promise<number> {
  // Parse the input into workflows and parts.
  const workflows = (await parseInput()).workflows;

  let currentPart = {
    x: 1,
    m: 1,
    a: 1,
    s: 1,
  };

  const unprocessedRules: Rule[] = [];
  const endingFilters: EndingFilter[] = [];

  // Evaluate each part and make a list of the accepted parts.
  let numberOfAcceptablePartCombinations = 0;
  let ruleStack: RuleInstance[] = [];
  for (
    const workflow of workflows
  ) {
    // while (numberOfAcceptablePartCombinations < 3000 || finished < 3) {
    const rulesWithDestinationA = unprocessedRules.filter((rule) =>
      rule.destination === `A`
    );
    if (workflow.endDestination === `A`) {
      // Do something.
    }
    for (const finalRule of rulesWithDestinationA) {
      const workflow = workflows.find((workflow) =>
        workflow.name === finalRule.workflowName
      )!;
      const acceptablePartsRange: AcceptablePartsRange = {
        x: { min: 1, max: 4000 },
        m: { min: 1, max: 4000 },
        a: { min: 1, max: 4000 },
        s: { min: 1, max: 4000 },
      };
      for (let i = 0; i < finalRule.index; i++) {
        const rule = workflow.rules[i];
        switch (rule.comparison) {
          case ">":
            acceptablePartsRange[rule.category].max = rule.value;
            break;
          case "<":
            acceptablePartsRange[rule.category].min = rule.value;
            break;
        }
      }
      switch (finalRule.comparison) {
        case ">":
          acceptablePartsRange[finalRule.category].min = finalRule.value + 1;
          break;
        case "<":
          acceptablePartsRange[finalRule.category].max = finalRule.value - 1;
          break;
      }
      endingFilters.push({
        workflowName: workflow.name,
        index: finalRule.index,
        acceptablePartsRange,
      });
      unprocessedRules.splice(unprocessedRules.indexOf(finalRule), 1);
    }
    const result = myFunction(
      numberOfAcceptablePartCombinations,
      workflows,
      currentPart,
      ruleStack,
    );
    numberOfAcceptablePartCombinations =
      result.numberOfAcceptablePartCombinations;
    ruleStack = result.ruleStack;
    const ruleInstanceToPass = ruleStack.pop()!;
    currentPart = ruleInstanceToPass.partBeingProcessed;
    currentPart[ruleInstanceToPass.rule.category] =
      ruleInstanceToPass.rule.value;
    if (ruleInstanceToPass.rule.comparison === `>`) {
      currentPart[ruleInstanceToPass.rule.category] += 1;
    }
    console.log(numberOfAcceptablePartCombinations);
  }

  console.log(ruleStack);
  console.log(currentPart);

  // Get the sum of all parts' rating numbers added together.

  console.log(
    `Part 2: The number of distinct combinations of acceptable ratings is ${numberOfAcceptablePartCombinations}`,
  );

  return numberOfAcceptablePartCombinations;
})();
