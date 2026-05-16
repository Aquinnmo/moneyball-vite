# Redundancy Audit

This audit identifies parts of the site that may be redundant from a user-facing information architecture perspective, plus a small set of code-level redundancies that are no longer represented in the rendered site. Findings are organized by site section.

## Summary

The largest redundancy is on the game detail page, where the same model evidence is shown in several formats: headline cards, split meters, insight cards, team story cards, player story cards, and collapsible evidence tables. The repetition is useful for supporting the "data-first" direction, but it risks making the page feel like multiple summaries of the same game rather than a clear progression from outcome, to explanation, to supporting detail.

Recommended consolidation order:

1. Treat `GameStoryHeader` as the top-level narrative summary.
2. Treat `AdvancedGameAnalysis` as the primary model evidence section.
3. Move repeated `KeyInsights`, team, and player metrics into supporting or drill-down contexts when they duplicate the first two sections.
4. Remove or archive unused graph components and stale CSS once confirmed they are not planned for near-term reuse.

## Home / Schedule Page

Source: `src/App.tsx`

### Potentially Redundant

No major site-section redundancy found.

The home page currently has one clear job: choose a date and list games for that date. The date controls and game links do not duplicate another section.

### Minor Cleanup Candidates

- The heading "Welcome to Moneyball" and "Games for {currentDate}" are both broad framing labels. This is not problematic, but if the site moves toward a denser data-first schedule view, the welcome heading could be replaced by a more functional title such as "MLB Games".
- Each game link only shows away and home team names. There is no repeated game metadata here, so this is more sparse than redundant.

## Game Detail / Header

Source: `src/Game.tsx:52`

### Potentially Redundant

The page header shows the matchup and date/time, then `GameStoryHeader` immediately repeats the game context with final score and model outcome.

Related source:

- `src/Game.tsx:52`
- `src/components/GameStoryHeader.tsx:61`
- `src/components/GameStoryHeader.tsx:65`
- `src/components/GameStoryHeader.tsx:69`
- `src/components/GameStoryHeader.tsx:73`

### Why It May Be Redundant

The header and story header are both first-read summary elements. The current header answers "what game is this?", while `GameStoryHeader` answers "what happened and what did the model think?" They are adjacent and both use prominent heading treatment.

### Suggested Action

Keep both concepts, but reduce the page header's visual weight. Let `GameStoryHeader` be the primary game summary, and make the top page header a compact metadata row.

## Game Story Header

Source: `src/components/GameStoryHeader.tsx`

### Potentially Redundant

`GameStoryHeader` overlaps with several downstream sections:

- "Expected Win" repeats the main win probability also shown by `WinOMeter`.
- "Quality Adjusted Runs" repeats the quality edge also shown by `KeyInsights`, `AdvancedGameAnalysis`, and `TeamTable`.
- "Final Score" partially repeats the line score totals shown by `GameScoreboard`.

Related source:

- `src/components/GameStoryHeader.tsx:56`
- `src/components/GameStoryHeader.tsx:65`
- `src/components/GameStoryHeader.tsx:69`
- `src/components/GameStoryHeader.tsx:73`
- `src/components/WinOMeter.tsx:84`
- `src/components/AdvancedGameAnalysis.tsx:78`
- `src/components/TeamTable.tsx:100`

### Why It May Be Redundant

This section is useful as a concise story lead, but the evidence strip repeats exact categories that are expanded almost immediately below.

### Suggested Action

Keep the headline. Consider reducing the evidence strip to only the most important two proof points, or remove proof points that are shown in the next visible section.

## Win-O-Meter

Source: `src/components/WinOMeter.tsx`

### Potentially Redundant

The "Expected Win" row duplicates expected win information from `GameStoryHeader`, `KeyInsights`, and `AdvancedGameAnalysis`.

Related source:

- `src/components/WinOMeter.tsx:84`
- `src/components/GameStoryHeader.tsx:69`
- `src/components/KeyInsights.tsx:47`
- `src/components/AdvancedGameAnalysis.tsx:99`

### Why It May Be Redundant

The expected win probability appears in at least four places:

- The story headline percentage.
- The story header "Expected Win" evidence card.
- The Win-O-Meter "Expected Win" row.
- The advanced analysis "Expected result" split meter.

### Suggested Action

Either make `WinOMeter` the sole visual home for win probability, or fold its "Expected Win" row into `GameStoryHeader` and keep only the pitching and batting split rows here.

## Linescore

Source: `src/components/GameScoreboard.tsx`

### Potentially Redundant

The final score columns repeat the final score already shown in `GameStoryHeader`.

Related source:

- `src/components/GameStoryHeader.tsx:65`
- `src/components/GameScoreboard.tsx`

### Why It May Be Redundant

This is acceptable redundancy because the sections serve different purposes. `GameStoryHeader` uses final score as narrative context; `GameScoreboard` provides inning-by-inning evidence and box-score totals.

### Suggested Action

Keep this section. If the page needs tightening, move `GameScoreboard` lower or make the final score in `GameStoryHeader` less prominent rather than removing the linescore.

## Key Insights

Source: `src/components/KeyInsights.tsx`

### Potentially Redundant

This is the most redundant user-facing section. Its cards summarize the same concepts shown by `GameStoryHeader`, `WinOMeter`, and `AdvancedGameAnalysis`.

Related source:

- `src/components/KeyInsights.tsx:47`
- `src/components/KeyInsights.tsx:64`
- `src/components/KeyInsights.tsx:77`
- `src/components/KeyInsights.tsx:92`
- `src/components/KeyInsights.tsx:107`
- `src/components/AdvancedGameAnalysis.tsx:71`
- `src/components/AdvancedGameAnalysis.tsx:78`
- `src/components/AdvancedGameAnalysis.tsx:85`
- `src/components/AdvancedGameAnalysis.tsx:99`

### Repeated Concepts

- "Expected edge" repeats expected win.
- "Quality edge" repeats quality-adjusted runs and QA run differential.
- "Contact edge" repeats hard-hit share.
- "Run creation" repeats expected runs.
- "Score vs quality" repeats the stolen-game interpretation already implied by final score versus expected win.

### Why It May Be Redundant

`KeyInsights` acts as a compact executive summary, but it sits after multiple summary elements and before a more complete "Why the model sees it this way" section. The user sees similar labels and metrics multiple times before reaching deeper team or player evidence.

### Suggested Action

Consider removing `KeyInsights` as a standalone section, or make it conditional:

- Show it only when there is a stolen game or a single standout contradiction.
- Move it above `GameStoryHeader` only if it becomes the primary summary.
- Fold the cards into `AdvancedGameAnalysis` as a compact top row.

## Advanced Game Analysis

Source: `src/components/AdvancedGameAnalysis.tsx`

### Potentially Redundant

The share meters duplicate several `KeyInsights` cards and some `TeamTable` story cards.

Related source:

- `src/components/AdvancedGameAnalysis.tsx:71`
- `src/components/AdvancedGameAnalysis.tsx:78`
- `src/components/AdvancedGameAnalysis.tsx:85`
- `src/components/AdvancedGameAnalysis.tsx:92`
- `src/components/AdvancedGameAnalysis.tsx:99`
- `src/components/TeamTable.tsx:66`
- `src/components/TeamTable.tsx:72`
- `src/components/TeamTable.tsx:78`
- `src/components/TeamTable.tsx:98`
- `src/components/TeamTable.tsx:100`

### Why It May Be Redundant

This section has the strongest claim to remain because it explains model evidence directly. The redundancy mainly comes from adjacent sections repeating its labels and metrics, not from this section itself.

### Suggested Action

Keep the share meters and leaderboards as the canonical model-evidence section. Remove or compress duplicate cards elsewhere. Consider keeping the differential details collapsed, as they currently are, because that protects the primary flow from too much repeated run-differential data.

## Team Stories

Source: `src/components/TeamTable.tsx`

### Potentially Redundant

Team story cards repeat game-level metrics from `GameStoryHeader`, `KeyInsights`, and `AdvancedGameAnalysis`, but scoped to each team.

Related source:

- `src/components/TeamTable.tsx:66`
- `src/components/TeamTable.tsx:72`
- `src/components/TeamTable.tsx:78`
- `src/components/TeamTable.tsx:84`
- `src/components/TeamTable.tsx:90`
- `src/components/TeamTable.tsx:98`
- `src/components/TeamTable.tsx:99`
- `src/components/TeamTable.tsx:100`
- `src/components/TeamTable.tsx:101`
- `src/components/TeamTable.tsx:102`

### Repeated Concepts

- "Scoring" repeats actual and expected runs.
- "Offense quality" repeats quality-adjusted runs.
- "Contact" repeats hard-hit metrics.
- "Run prevention" repeats expected runs allowed.
- Supporting metrics repeat xWin, expected run differential, QA run differential, contact advantage, and discipline advantage.

### Why It May Be Redundant

The team section is useful as a team-scoped drill-down, but it arrives after the user has already seen the same concepts in game-level form. The card labels also mirror earlier labels closely, which can feel like another pass through the same story.

### Suggested Action

Keep `TeamTable` as a drill-down section, but make it less summary-like:

- Reduce the visible story cards to team-specific items that were not already covered above.
- Keep repeated model totals inside the collapsible supporting metrics.
- Rename the section from "Team Stories" to something more specific if it becomes evidence-only, such as "Team Evidence".

## Player Stories

Source: `src/components/PlayerDetailTables.tsx`

### Potentially Redundant

Player story cards repeat leaderboard concepts from `AdvancedGameAnalysis`.

Related source:

- `src/components/AdvancedGameAnalysis.tsx:109`
- `src/components/AdvancedGameAnalysis.tsx:114`
- `src/components/AdvancedGameAnalysis.tsx:119`
- `src/components/AdvancedGameAnalysis.tsx:124`
- `src/components/PlayerDetailTables.tsx:69`
- `src/components/PlayerDetailTables.tsx:70`
- `src/components/PlayerDetailTables.tsx:72`
- `src/components/PlayerDetailTables.tsx:169`
- `src/components/PlayerDetailTables.tsx:180`
- `src/components/PlayerDetailTables.tsx:187`

### Repeated Concepts

- "Best bat" overlaps with "Offense value".
- "Loudest contact" overlaps with "Loud contact".
- Pitcher whiff and command concepts overlap with "Missed bats".
- Pitcher expected runs allowed overlaps with "Run prevention".

### Why It May Be Redundant

`AdvancedGameAnalysis` already shows top-three player leaderboards for the key player-level concepts. The player story cards then nominate individual leaders again before revealing detailed tables.

### Suggested Action

Choose one primary player-summary pattern:

- Keep the leaderboards in `AdvancedGameAnalysis` and make `Player Stories` mostly detailed tables.
- Or remove player leaderboards from `AdvancedGameAnalysis` and let `Player Stories` own all player-level narrative.

Do not keep both as prominent visible summaries unless the labels and metrics are intentionally different.

## Legacy / Unused Graph Components

Source: `src/components/index.ts`

### Potentially Redundant

Several graph components are exported but not rendered by the current app routes.

Related source:

- `src/components/index.ts:3`
- `src/components/index.ts:4`
- `src/components/index.ts:5`
- `src/components/index.ts:6`
- `src/components/index.ts:7`
- `src/components/PlayerBarGraph.tsx`
- `src/components/CenterBarGraph.tsx`
- `src/components/PlayerMetricGraph.tsx`
- `src/components/PitcherMetricGraph.tsx`
- `src/components/CenteredMetricGraph.tsx`

### Why It May Be Redundant

Repository search shows these graph components are only exported or used by each other, not by `App` or `Game`. Their corresponding CSS files are therefore likely unused in the current site experience.

### Suggested Action

If these are not part of an upcoming graph view, remove them from the barrel export and delete the unused component/CSS files. If they are planned for reuse, move them into a clearly marked experimental or future-use location so they do not look like active site sections.

## Legacy / Unused CSS Selectors

Source: `src/Game.css` and `src/components/AdvancedGameAnalysis.css`

### Potentially Redundant

Some CSS selectors appear to support older table and graph layouts that are not currently rendered.

Related source:

- `src/Game.css:41`
- `src/Game.css:53`
- `src/Game.css:219`
- `src/Game.css:255`
- `src/components/AdvancedGameAnalysis.css:224`

### Why It May Be Redundant

Search results did not find active JSX using these classes:

- `.graphs-container`
- `.graphs-layout`
- `.clean-table`
- `.metric-grid`
- `.analysis-table`

### Suggested Action

Remove these selectors after confirming no pending branch or planned component depends on them. This will make the remaining CSS easier to reason about and reduce confusion between current and older table/graph patterns.

## Suggested Target Information Architecture

For a less repetitive game page, use this order:

1. Compact game metadata header.
2. `GameStoryHeader` as the single top-level summary.
3. `GameScoreboard` for actual scoring context.
4. `AdvancedGameAnalysis` as the canonical model evidence section.
5. Team drill-down with mostly collapsed repeated metrics.
6. Player drill-down with either detailed tables or player leaderboards, but not both in separate visible summaries.

This keeps the page data-first while reducing repeated expected-win, expected-runs, quality-adjusted-runs, and hard-hit-share callouts.
