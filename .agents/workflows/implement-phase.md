---
description: Implement a phase from the CLAUDE.md project specification
---

# Phase Implementation Workflow

Follow these steps when asked to implement a phase or build out features from the `CLAUDE.md` specification:

1. **Review Specification**: Use the `view_file` tool to read the `CLAUDE.md` file. Ensure you have a strong understanding of the required tech stack, mocks, and design direction.
2. **Identify Target Phase**: Look at the "Build Order" or current project state to determine the exact phase or list of features that need to be developed next.
3. **Draft a Plan**: Create a detailed, step-by-step implementation plan tracking the exact features, components, and functionalities needed for this phase. Create this as an artifact (e.g., `implementation_plan.md`). 
4. **Implement Step-by-Step**: Work through the implementation plan tasks one by one. Create or modify the necessary React components, routes, mock data, and styling as dictated by the plan.
5. **Track Progress**: As you complete tasks, update the `implementation_plan.md` artifact to check off completed items, taking note of any deviations or new requirements.
6. **Quality Assurance & Testing**: 
   - Start the local development server (e.g., `npm run dev`) using the `run_command` tool.
   - Wait for the build to succeed.
   - Use the `browser_subagent` or command line outputs to test UI functionality, verify that the styling meets the "Design Direction", and ensure that the implemented features match the exact requirements found in `CLAUDE.md`.
7. **Refinement**: Fix any bugs, errors, or visual inconsistencies spotted during the testing phase. Ensure everything works seamlessly before moving to the next phase.

uPDATE DOCS WHEN DONE AND CREATE DOCS WHEN YOU DO CERTIAN SKILLS/TASKS