<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- Document viewer chooses its layout per file format in src/components/elibrary/viewer-data.ts (viewerKindFor); add new formats there so controls stay format-appropriate.
- Learning Paths keeps mock modules and pure progress/filter helpers in learning-data.ts, with the screen isolated in LearningPathsView; module actions reuse the existing document viewer to avoid new processing or assignment logic.
- My Learning uses the assigned Claims Officer module records through my-learning-data.ts and an isolated MyLearningView; catalogue paths must not become employee assignments implicitly.
- The /sign-in visual prototype is isolated in SignInView and scoped signin-* styles; submission sends no credentials and creates no session, preserving approved public screen behavior.
