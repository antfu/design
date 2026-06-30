# @antfu/design

This is something in between a design system and a component library.

It's the collection of design/component/practice from the UI I built by hand pre-agent. Extracted, reorganized, and documented for reuse with agents.

The way I see programming is a series of design decisions, back then when we building by hand, we make decisions and re-verify every second, big decision to how things are architected, and small decisions to if use an else over early return, etc. Now with agents, we are still making decisions, but only the high-level ones up front, we no longer have the time to feel and verify every small decision. In a way, we delegate all those small decisions to the agents, wishing them to end up with something good. But we know that LLM relies a lot on randomness and the training data, which can't be perfectly aligned with our preferences/desire. It's always trade-offs, to get higher-level we have to sacrifice a certain level of fine-grained control, same before and after agents. The different is that LLM are not a human like tool authors who have their consistent taste and preferences you can trust with. To work with such uncertainty, we have to build tools around for it to build constraints and guardrails, provide good feedback loops, and make it easy to verify the output.

This repo is one of the experiments I'm trying, for agents to consume, reference, and learn from, so they can more consistently produce UI that is aligned with my design preferences.

The way to use it so intall `@antfu/design` with [`skills-npm`](https://github.com/antfu/skills-npm) and ask agents to use it and follow the design system and components in it.
