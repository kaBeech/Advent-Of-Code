import parseInput from "./parseInput.ts";
import { AcceptablePartsRange, EndingFilter, Rule } from "./types.ts";

export default (async function (): Promise<number> {
  // Parse the input into workflows and parts.
  const workflows = (await parseInput()).workflows;

  const unprocessedRules: Rule[] = [];
  const endingFilters: EndingFilter[] = [];

  // Evaluate each part and make a list of the accepted parts.
  let numberOfAcceptablePartCombinations = 0;
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

    console.log(numberOfAcceptablePartCombinations);
  }

  // Get the sum of all parts' rating numbers added together.

  console.log(
    `Part 2: The number of distinct combinations of acceptable ratings is ${numberOfAcceptablePartCombinations}`,
  );

  return numberOfAcceptablePartCombinations;
})();
