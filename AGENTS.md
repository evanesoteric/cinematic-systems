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

## Architecture
- Keep the cinematic screen browser-only with a typed applet registry and shared runtime props; simulations must never perform real decryption or network operations.
- Accept applet, speed, duration, and loop through URL query arguments after hydration so screen configuration remains runtime-swappable without SSR mismatch.
- Define all screen visuals in the global semantic design system and use the shared Button variants for controls, ensuring the applet and its surrounding stage remain independently themed.
