---
name: dos-review
description: Stage 7. Critique a rendered draft against its brief and format, naming the three most important problems with concrete revisions, then produce the next version if asked. Use when asked to review, critique or check slides.
---

# Review a draft

Input: a draft ID.

1. Look at the exported slides in order, at phone size (scale to about 390 px wide). Read them first without the brief.
   - Can slide 1 be understood in under two seconds?
   - Does every slide add something?
   - Is each image doing useful work? Any crop cutting off information, letterboxing, or anything that looks like an accidental screenshot?
   - Is the text comfortable to read? Anything under the platform's UI overlays?
   - Does the ending pay off the opening?
2. Then compare against the brief, the format's review checklist and failure conditions, the product's factual constraints, and `used-content.md`. Look for repeated words across slides or openings, body copy that stops before giving an example, and headings that change the feel of the format.
3. Write the three most important problems in the draft's **Review** section. Each names the slide and element, what's wrong, and a revision someone can execute ("slide 4 body: add the resource's name and where to find it", not "make it clearer").
4. List anything that can't be judged from the supplied output.
5. Set `status: revise` (or `approved` if nothing important is left) and leave **Decision** for the user.
6. If the user asks for the revision: create `-v(n+1)` via `/dos-produce` steps, apply only the agreed changes, and review the new export the same way.
