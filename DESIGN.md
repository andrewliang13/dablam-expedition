---
name: Mera Journey
description: Kai Mai's documentary about Nepal and Bhutan, played on a projection-black screen.
colors:
  ink: "#060606"
  bar: "#000000"
  paper: "#ece8e0"
  mute: "#aaa59b"
  dim: "#77736b"
  tungsten: "#d6a74f"
  line: "rgba(236, 232, 224, 0.16)"
  grade-slate: "#1e2c44"
  rec-lamp: "#d8452c"
  error: "#e0715b"
  error-text: "#f0a08f"
typography:
  display:
    fontFamily: "Gloock, 'Times New Roman', serif"
    fontSize: "clamp(3rem, 7.6vw, 6rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Gloock, 'Times New Roman', serif"
    fontSize: "clamp(2.2rem, 5vw, 4.25rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Gloock, 'Times New Roman', serif"
    fontSize: "clamp(1.5rem, 2.2vw, 2.1rem)"
    fontWeight: 400
    lineHeight: 1.05
  subtitle:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1.05rem, 1.55vw, 1.42rem)"
    fontWeight: 500
    lineHeight: 1.4
  body:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 400
    letterSpacing: "0.02em"
  timecode:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.78rem"
    fontWeight: 400
    letterSpacing: "0.08em"
    fontFeature: "tnum"
  slate:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.78rem"
    fontWeight: 400
    letterSpacing: "0.12em"
rounded:
  none: "0px"
  hairline: "2px"
spacing:
  bar-h: "clamp(54px, 8.5vh, 86px)"
  gutter: "clamp(20px, 4.5vw, 72px)"
  field-gap: "22px"
  slate-pad: "10px 14px"
components:
  button-primary:
    backgroundColor: "{colors.paper}"
    textColor: "#0a0a0a"
    typography: "{typography.body}"
    rounded: "{rounded.hairline}"
    padding: "0.85em 1.35em"
  button-primary-hover:
    backgroundColor: "{colors.tungsten}"
    textColor: "#0a0a0a"
  button-primary-big:
    backgroundColor: "{colors.paper}"
    textColor: "#0a0a0a"
    rounded: "{rounded.hairline}"
    padding: "1em 1.6em"
  button-bar:
    backgroundColor: "{colors.paper}"
    textColor: "#0a0a0a"
    rounded: "{rounded.hairline}"
    padding: "0.7em 1.1em"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    rounded: "{rounded.hairline}"
    padding: "0.85em 1.35em"
  letterbox-bar:
    backgroundColor: "{colors.bar}"
    textColor: "{colors.mute}"
    typography: "{typography.timecode}"
    height: "{spacing.bar-h}"
    padding: "0 {spacing.gutter}"
  scene-slate:
    backgroundColor: "rgba(0, 0, 0, 0.45)"
    textColor: "{colors.tungsten}"
    typography: "{typography.slate}"
    rounded: "{rounded.none}"
    padding: "{spacing.slate-pad}"
  field:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "10px 0 12px"
---

# Design System: Mera Journey

## Overview

**Creative North Star: "The Documentary"**

The site plays as Kai's film about Nepal, not a tour catalog. The screen is projection black. Two permanent letterbox bars frame everything: the top bar carries the wordmark and navigation, the bottom bar carries a running timecode, the current chapter, the current elevation and the film-white call to action. Between the bars sits footage: a real-terrain WebGL Himalaya keyed through dusk, night and dawn, and Kai's own photographs graded cool. Narration arrives as burned-in film-white subtitles. Wayfinding is tungsten gold: timecode, scene slates, shot slates, progress hairlines and focus rings. Gloock sets the title cards. Grain covers every frame.

Density follows film pacing. The open, voice-over, Lukla, summit and credits scenes pin for 230 to 480 viewport heights, and scroll scrubs one clock: camera, timecode, chapter, elevation and subtitles. The content sections (director's note, double feature, storyboard, Q&A, inquiry, end card) are ordinary flowing sections on the same black ground, separated by hairline rules. At the summit the frame tightens to a 2.39:1 matte and opens again for the director's note.

The world is built only from film devices. A section exists as a scene, a credit roll, a poster pair, a storyboard, a Q&A after the screening or an end card. It never appears as a photo hero, stat strip or trip-card grid.

**Key Characteristics:**
- Projection-black ground with fixed black letterbox bars top and bottom.
- Footage under a cool slate grade; type over footage is legible through scrims and burn-in shadows, never through boxes.
- Tungsten gold is reserved for wayfinding and state, never fill or decoration.
- One film-white primary action, everywhere.
- Gloock title cards, Hanken Grotesk subtitles and body, JetBrains Mono only for machine readouts.
- Animated grain over the whole viewport.

## Colors

A near-monochrome projection palette: black, warm film-white with two muted greys, one tungsten wayfinding hue, and a cold slate grade that lives in the footage rather than the interface.

### Primary
- **Film White** (paper): the subtitle and title-card color, all primary text, and the fill of the primary button. The primary action is a film-white button with near-black text, never a colored one.

### Secondary
- **Tungsten Gold** (tungsten): timecode digits, scene and shot slates, the playback progress line, the underline on "Plan your trip" and on poster links, credit-block headings, Q&A plus marks, the select chevron, the text caret, field focus, focus rings, link hover, text selection, and the primary button's hover fill. It marks where you are and what has focus.

### Tertiary
- **Slate Grade** (grade-slate): never a UI fill. It is the footage grade: a soft-light or normal-blend overlay at 28 to 32% opacity on every graded image and scrim top. With the WebGL dusk and night keys it gives the film its cold shadows.

### Neutral
- **Projection Black** (ink): page ground and every section background.
- **Letterbox Black** (bar): the two fixed bars, the full-screen mobile menu, and the 2.39:1 summit mattes. It is one step darker than ink, so the bars read as the edge of the frame.
- **Ash** (mute): secondary text, such as nav links at rest, captions, credit roles, Q&A answers and the bottom-bar readouts.
- **Smoke** (dim): tertiary text, such as legal lines, placeholders, optional-field hints and the form note.
- **Hairline** (line): 1px section rules, list dividers, storyboard frame borders and the menu button stroke.

### State
- **REC Lamp** (rec-lamp): only the 7px blinking record dot beside the timecode. It is a camera indicator, not an accent.
- **Error** (error / error-text): the invalid-field underline, and the error message below that field.

### Named Rules
**The No-Vermilion Rule.** No orange or red accent carries action, emphasis or decoration. The primary action is film white, and wayfinding is tungsten. The only red on screen is the 7px REC lamp and form error states.

**The Wayfinding-Only Gold Rule.** Tungsten never fills a surface or sets body copy. It appears as digits, slate strokes, 1px lines, focus, and the primary button's hover. If a gold element is not telling the viewer where they are or what has focus, it is wrong.

**The Graded Footage Rule.** Every photograph sits under the grade: desaturated to 0.74 (0.55 in the reel), contrast 0.96, with the slate overlay. Storyboard stills go further: full grayscale, contrast 1.35, brightness 0.62.

## Typography

**Display Font:** Gloock (with 'Times New Roman', serif)
**Body Font:** Hanken Grotesk (with system-ui, sans-serif)
**Label/Mono Font:** JetBrains Mono (with ui-monospace, monospace), for readouts only

**Character:** Gloock is a high-contrast title-card serif, set tight and large, at weight 400 only. Hanken Grotesk plays the subtitle track: plain, medium-weight, readable over moving footage.

### Hierarchy
- **Display** (title cards): the opening "Go where it's real.", the destination names (to 6rem, line-height 0.9, -0.03em), the summit "6,476 m", and the closing "Your film starts here." Shadowed when they sit over footage.
- **Headline** (.h2 scale): section title cards, such as Director's note, Not a catalog., Now showing, How it works and Questions after the screening.
- **Title**: storyboard shot names, credit-block headings in tungsten, credit values (1.2 to 1.6rem, line-height 1.25), destination highlight lists, and the form heading.
- **Voice-over** (Gloock, clamp(1.9rem, 4.3vw, 3.7rem), 1.16, max 25ch): the full-screen narration.
- **Subtitle**: burned-in narration over footage, centered and at most 44ch wide, with `text-shadow: 0 1px 2px rgba(0,0,0,.9), 0 2px 14px rgba(0,0,0,.65)`.
- **Body**: running text, often in mute, held to 34 to 60ch.
- **Label**: form field labels and fact terms in mute. Credit roles use uppercase at 0.92rem with 0.06em tracking, as film credits do.
- **Timecode**: the bottom bar (HH:MM:SS:FF at 24 fps, tabular figures), the chapter name in uppercase, and elevation in metres.
- **Slate** (uppercase, 0.12em): scene slates over footage ("Sc 05 · Mera Peak summit · 6,476 m") and storyboard shot slates (0.72rem, 0.14em).

### Named Rules
**The Readout-Only Mono Rule.** JetBrains Mono sets only timecode, chapter readouts, elevation figures, and scene or shot slates. Headings, labels, buttons, captions and facts are never mono.

**The No-Kicker Rule.** No eyebrow or kicker line sits above a heading. A scene is named by its slate or by the bottom-bar chapter, and a section by its title card alone.

## Layout

The viewport is a frame. Two fixed bars of height `bar-h` sit at top and bottom; the top bar is 58px at 760px and below. Content padding clears the bars with `calc(var(--bar-h) + Nvh)`. The horizontal gutter is `gutter` everywhere, including inside the bars, so the wordmark, slates and section text share one left edge.

Scenes are tall scroll containers with a sticky 100svh stage: open 250vh, voice-over 230vh, Lukla 320vh, reel 420vh, summit 480vh, credits 320vh. Each carries `data-chapter`, and optionally `data-elev`, for the bottom-bar readout. Content sections use vh padding (roughly 8 to 14vh) and split into asymmetric two-column grids: note 5fr/6fr, Q&A 5fr/7fr, destination body 7fr/4fr, start 1fr/1fr. The double feature is two 5:6 posters. The storyboard is four 16:10 panels, two at 960px and one at 760px. All grids collapse to one column at 760px.

The 2.39:1 matte is computed as `(innerHeight - innerWidth / 2.39) / 2 - bar-h`. It is applied as the `--matte` variable to two fixed black bands inside the letterbox, and subtitles and slates offset by it.

Breakpoints: 960px (storyboard 2-up, Q&A single column) and 760px (mobile menu, chapter readout hidden, single-column grids).

## Elevation & Depth

Depth comes from the film: footage, scrims, 3D transforms and grain, not stacked UI cards. Surfaces are flat black. Shadows appear only on poster frames and as text burn-in over footage.

### Shadow Vocabulary
- **Poster drop** (`box-shadow: 0 30px 60px -30px rgba(0,0,0,0.9)`; hover `0 50px 90px -30px rgba(0,0,0,1)`): the two double-feature posters, which also tilt in 3D under the pointer.
- **Subtitle burn-in** (`text-shadow: 0 1px 2px rgba(0,0,0,0.9), 0 2px 14px rgba(0,0,0,0.65)`): every subtitle over footage.
- **Title-card glow** (`text-shadow: 0 4px 40px rgba(0,0,0,0.5)`; summit `0 6px 50px rgba(0,0,0,0.35)`): display type over the WebGL scene.

### Named Rules
**The Scrim-Not-Box Rule.** Text over footage is carried by a bottom-weighted gradient scrim (to about 0.55 to 0.9 black) plus burn-in shadow. Slates are the only boxed element over footage.

**The Grain-On-Top Rule.** Grain is a fixed layer at z-index 60, above the bars, at 0.07 opacity, stepping through 6 positions every 0.9s. It stops under reduced motion.

## Shapes

The geometry is hard and rectangular, like a film frame. Buttons and focus rings take a 2px hairline corner. Footage frames, posters, storyboard frames, slates and fields have square corners. Borders are 1px: hairline rules, translucent tungsten slate strokes (0.4 to 0.6 alpha), and a 1px dashed inner safe-frame inset 10px on storyboard stills. The reel is a 3D drum of film cells with sprocket-hole strips (7px repeating gradient) along the top and bottom edges. The only round shape is the REC lamp.

## Components

### Buttons
Quiet and solid, like a projected card. The weight is 600.
- **Shape:** hairline corner (2px), 1px transparent border.
- **Primary:** film white with near-black text (#0a0a0a). It is the same button in the bottom bar, the hero, the mobile menu, the destination slate and the form submit. Big variant at 1.05rem; bar variant at 0.85rem.
- **Hover / Focus:** the fill shifts to tungsten over 0.35s on the system ease, and press nudges it 1px down. Focus is a 2px tungsten outline offset 3px.
- **Ghost:** transparent with a 45% film-white stroke. On hover the stroke goes full film white over a 6% wash. It is used only for the secondary "Send an inquiry".
- **Text links as actions:** film-white text with a 1px tungsten underline (poster "See the … cut", nav "Plan your trip"), or an underlined link that turns tungsten on hover.

### Inputs / Fields
- **Style:** underline only. A transparent ground, a 1px film-white bottom rule at 30%, square corners, and 10px 0 12px padding at 1.05rem. The label in mute sits above it.
- **Hover / Focus:** the rule rises to 55% on hover and turns tungsten on focus. The caret is tungsten. The select uses a CSS tungsten chevron.
- **Error:** an error-colored underline, with an error-text message (0.88rem) below.

### Navigation
- **Desktop:** the wordmark (Gloock, 1.45rem) sits left in the top bar and the links sit right (Hanken 500, 0.92rem). Links rest in mute and turn film white on hover or when current. "Plan your trip" stays film white with a tungsten underline.
- **Mobile (760px and below):** a hairline-stroked "Menu" button opens a full-screen letterbox-black sheet. Links there are Gloock at clamp(2.2rem, 10vw, 3.2rem), with the primary button at the foot.

### Letterbox Playback Bar (signature)
A fixed black bar at the bottom. A 1px progress line on top fills tungsten with page progress. Then in order come the blinking REC lamp, the tungsten timecode (HH:MM:SS:FF, 24 fps, mapped to a 22-minute runtime), the chapter name in uppercase film white, the elevation in mute, and the film-white button. At 760px and below the chapter is hidden and the button reads "Book a call".

### Scene Slate (signature)
A mono, uppercase, tungsten box with a 45% tungsten stroke over 45% black. It shows scene number, place in film white, and elevation. It sits top-left at the gutter, below the bar and matte. Storyboard shot slates are the smaller sibling ("Shot 1", at 86% black).

### Subtitle Track (signature)
Centered and capped at 44ch, it sits just above the bottom bar and matte. One line shows at a time. Each line fades in from a 6px blur over 0.6s, and lines are scrubbed to scene progress.

### Posters and Storyboard
- **Posters:** 5:6 graded frames with a bottom scrim, a display-size name, a Hanken tagline, a two-column fact list and a tungsten-underlined link. On hover they tilt in 3D and the image scales to 1.05.
- **Storyboard:** grayscale 16:10 frames with a hairline border, a dashed safe-frame, a shot slate, and a Gloock title over a scrim. Body copy sits below in mute. On hover the frame regains some color.

### Credit Roll
Centered blocks roll up through a masked window that fades at both bars. Each block has a tungsten Gloock heading and a definition list: uppercase mute roles right-aligned, Gloock values left-aligned. On mobile the list stacks and centers.

## Do's and Don'ts

### Do:
- **Do** keep both letterbox bars fixed on every page, and clear them with `calc(var(--bar-h) + …)` padding.
- **Do** tag every section with `data-chapter`, and with `data-elev` where altitude is true, so the playback bar names it.
- **Do** put every photograph under the grade (saturate 0.74, slate overlay), and every storyboard still in grayscale.
- **Do** use the film-white button for every primary action, with tungsten on hover.
- **Do** carry text over footage with a bottom scrim and the subtitle burn-in shadow.
- **Do** use cubic-bezier(0.16, 1, 0.3, 1) for state and reveal transitions, and drop pinned scenes to static layouts under `prefers-reduced-motion`.

### Don't:
- **Don't** use vermilion, orange or red as an accent or action color. The REC lamp and error states are the only reds.
- **Don't** set anything in JetBrains Mono except timecode, chapter and elevation readouts, and slates.
- **Don't** put an eyebrow or kicker line above any heading.
- **Don't** fill surfaces or set body copy in tungsten.
- **Don't** build a photo hero, stat strip or trip-card grid. Use a scene, poster pair, storyboard or credit roll.
- **Don't** round frames, slates or fields. Only buttons and focus rings take the 2px corner.
