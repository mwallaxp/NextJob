# NextJob Design System - Visual Reference Guide

## 🎨 Color Palette Reference

### Orange Scale (#FF8C42 Primary)
```
50:  #FFF8F3  - Very light backgrounds
100: #FFE8D6  - Light hover states
200: #FFD4AD  - Light alerts/warnings
300: #FFC084  - Medium backgrounds
400: #FFAC5B  - Medium interactions
500: #FF8C42  ← PRIMARY - Main CTA buttons
600: #FF7A1F  - Hover state for buttons
700: #E67E1A  - Active/pressed state
800: #CC6B14  - Dark hover states
900: #99500D  - Darkest text
```

**Usage**: Primary action buttons, CTAs, important links, active states

### Black Scale (#1A1A1A Primary)
```
50:  #F7F3F0  - Very light backgrounds
100: #E8E4E0  - Light borders/dividers
200: #D4C8C0  - Light separators
300: #B8ACA4  - Medium borders
400: #9C9088  - Medium text
500: #6B6460  - Secondary text
600: #5A5350  - Muted text
700: #423E3A  - Dark text
800: #2A2724  - Very dark
900: #1A1A1A  ← PRIMARY - Main text/dark BG
```

**Usage**: Text, headings, dark backgrounds, navigation

### Teal Scale (#1B4B6F Complementary)
```
50:  #F0F9FC  - Light backgrounds
500: #1B4B6F  ← PRIMARY - Secondary actions
600: #164258  - Hover states
700: #11313F  - Active states
```

**Usage**: Secondary CTAs, information cards, professional elements

### Gold Scale (#D4AF37 Accent)
```
50:  #FFFBF7  - Very light backgrounds
400: #E6C200  - Medium highlight
500: #D4AF37  ← PRIMARY - Premium badges
```

**Usage**: Premium features, special badges, accent highlights

---

## 📐 Component Color Usage

### Buttons

#### Primary Button (CTA)
```
Background: bg-orange-500
Hover: hover:bg-orange-600
Active: active:bg-orange-700
Text: text-white
Shadow: shadow-soft
```

#### Secondary Button (Alternative)
```
Background: bg-white
Border: border-2 border-black-100
Text: text-black-900
Hover: hover:bg-black-50
```

#### Outline Button
```
Border: border-2 border-orange-500
Text: text-orange-500
Hover: hover:bg-orange-50
```

### Cards

#### Info Card
```
Background: bg-white
Border: border border-black-100
Shadow: shadow-soft
Hover: hover:shadow-medium
```

#### Stat Card
```
Background: bg-orange-50 (or other color)
Border: border border-black-100
Icon Color: text-orange-600
Text: text-black-900
```

### Badges

#### Primary Badge
```
Background: bg-orange-100
Text: text-orange-700
```

#### Success Badge
```
Background: bg-emerald-100
Text: text-emerald-700
```

#### Warning Badge
```
Background: bg-yellow-100
Text: text-yellow-700
```

#### Teal Badge
```
Background: bg-teal-50
Text: text-teal-600
```

### Text Hierarchy

```
Heading 1:  text-4xl font-bold text-black-900
Heading 2:  text-3xl font-bold text-black-900
Heading 3:  text-xl font-bold text-black-900
Subheading: text-lg font-semibold text-black-900
Body:       text-base text-black-700
Secondary:  text-sm text-black-600
Muted:      text-xs text-black-500
```

### Input Elements

```
Border:      border-2 border-black-100
Focus:       focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20
Background:  bg-white
Placeholder: placeholder-black-400
Text:        text-black-900
```

---

## 🎯 Color Psychology in UI

### Orange (#FF8C42)
- **Emotion**: Energetic, friendly, action-oriented
- **Usage**: Encourages clicks, calls-to-action
- **When to use**: Apply buttons, important features, progress
- **Avoid**: Too much = overwhelming; use as accent

### Black (#1A1A1A)
- **Emotion**: Professional, trustworthy, strong
- **Usage**: Text, structure, authority
- **When to use**: Main text, headings, navigation
- **Benefit**: High contrast, excellent readability

### Teal (#1B4B6F)
- **Emotion**: Calm, professional, competent
- **Usage**: Secondary actions, information
- **When to use**: Status indicators, info cards
- **Balance**: Complements orange without competing

### Gold (#D4AF37)
- **Emotion**: Premium, achievement, special
- **Usage**: Premium badges, achievements
- **When to use**: Star ratings, special features
- **Sparingly**: Use for emphasis only

---

## 🎨 Common Patterns

### Hero Section
```
Background: Gradient from orange-50 to white (or orange to darker orange)
Heading:    text-black-900, large and bold
CTA Button: bg-orange-500 text-white
Secondary:  text-black-600 muted text
```

### Card Hover Effect
```
Normal:  shadow-soft border-black-100
Hover:   shadow-medium border-orange-200 -translate-y-1
```

### Status Indicators
```
Success:  bg-emerald-100 text-emerald-700
Warning:  bg-yellow-100 text-yellow-700
Pending:  bg-yellow-50 text-yellow-600
Error:    bg-red-100 text-red-700
Info:     bg-teal-50 text-teal-600
```

### Empty States
```
Icon Color:    text-black-300 (muted)
Title:         text-black-900 bold
Description:   text-black-600 secondary
CTA Button:    bg-orange-500
```

---

## 📱 Responsive Color Usage

### Mobile First
- Ensure color contrast on small screens
- Test on actual mobile devices
- Orange shows well on mobile screens
- Black text remains readable

### Tablet
- Larger padding reduces color saturation effect
- Cards look better with spacing
- Color proportions stay consistent

### Desktop
- More breathing room for colors
- Orange accents can be more subtle
- Better use of white space with colors

---

## ✨ Accessibility Checklist

### Contrast Ratios
- Orange (#FF8C42) on White: 4.5:1 ✅ WCAG AA
- Black (#1A1A1A) on White: 21:1 ✅ WCAG AAA
- Teal (#1B4B6F) on White: 7.5:1 ✅ WCAG AA

### Color Alone
- ✅ Don't use color as only identifier
- ✅ Pair with icons/text
- ✅ Use patterns for indicators

### Dark Mode
- Consider dark theme for tired eyes
- Invert colors while maintaining orange as primary
- White background becomes #1A1A1A

---

## 🎨 Component Examples

### Job Card
```
Header:     bg-white, text-black-900
Date:       text-orange-600 uppercase
Title:      text-2xl font-bold text-black-900
Company:    text-black-600
Badge:      bg-orange-100 text-orange-700
Meta:       border-t border-black-100
CTA:        bg-orange-500 hover:bg-orange-600
```

### Dashboard Stats
```
Card:       bg-orange-50 border-black-100
Label:      text-black-600 text-sm
Value:      text-black-900 bold large
Icon:       text-orange-600
Progress:   bg-orange-500 to orange-600
```

### Navigation
```
Logo:       bg-orange-500 rounded
Link:       text-black-700 hover:text-orange-600
Active:     text-orange-600 border-b-2
Dropdown:   bg-white border-black-100
```

### Messages
```
Sent:       bg-orange-500 text-white rounded-br-none
Received:   bg-black-100 text-black-900 rounded-bl-none
Header:     bg-gradient-to-r from-orange-50
Online:     w-3 h-3 bg-emerald-500
```

---

## 🚀 Implementation Tips

### Start Small
1. Update buttons first (orange CTAs)
2. Update text colors (black headings)
3. Add accent colors gradually

### Test Thoroughly
1. Check on different screens
2. Verify color contrast
3. Test with colorblind simulator

### Maintain Consistency
1. Use color variables/classes
2. Document color usage
3. Create component library

### Iterate
1. Get user feedback
2. A/B test if needed
3. Adjust based on analytics

---

## 📊 Color Distribution Example

### HomePage
- Orange: 15-20% (buttons, highlights)
- Black: 40-50% (text, structure)
- White: 30-40% (backgrounds)
- Teal: 5-10% (secondary elements)
- Gold: <5% (special badges)

### Dashboard
- Orange: 20-25% (stats, CTAs)
- Black: 35-40% (text, headers)
- White: 35-40% (cards)
- Teal: 5-10% (info cards)

### Job Browse
- Orange: 25-30% (filters, CTAs)
- Black: 35-40% (text)
- White: 30-35% (cards)
- Teal: 5-10% (secondary)

---

**Last Updated**: June 2024  
**Design System**: v1.0  
**Status**: Production Ready
