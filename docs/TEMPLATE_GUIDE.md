# Resume Template Authoring Guide

Thank you for your interest in contributing a new resume template to BuildMyResume!

This guide explains how to create a robust, maintainable template for the BuildMyResume project.

---

## 1. Template Structure

- Each template is a React component (e.g., `src/templates/YourTemplate.tsx`).
- The component should accept a single prop: `{ data: ResumeData }`.
- Use only React (no external template engines or inline scripts).
- Use Tailwind CSS for layout, fonts, and colors if desired, but see the section below for visual-only elements.

**Example skeleton:**
```tsx
import { forwardRef } from "react";
import { ResumeData } from "@/contexts/ResumeContext";

const YourTemplate = forwardRef<HTMLDivElement, { data: ResumeData }>(({ data }, ref) => {
  return (
    <div ref={ref}>
      {/* Your template markup here */}
    </div>
  );
});

YourTemplate.displayName = "YourTemplate";
export default YourTemplate;
```

---

## 2. Visual-Only Elements: Use `data-preserve="true"`

**Any element that is purely for visual purposes (lines, bars, dividers, etc.) must include** `data-preserve="true"` **as an attribute.**

This ensures that our editor's cleaning logic will not remove these elements after formatting or saving.

### **Examples:**

**Divider line:**
```jsx
<div style={{ borderTop: '3px solid black', margin: '10px 0' }} data-preserve="true">&nbsp;</div>
```

**Section header line:**
```jsx
<div style={{ position: 'absolute', top: '50%', left: 0, width: '35%', height: 1, background: 'black', transform: 'translateY(-50%)' }} data-preserve="true">&nbsp;</div>
```

**Language proficiency bar segment:**
```jsx
<div
  style={{ height: '8px', width: '8%', background: 'black', display: 'inline-block', marginRight: '2px', borderRadius: '2px' }}
  data-preserve="true"
/>
```

**Why?**
- The editor removes empty elements unless they have `data-preserve`.
- This keeps your lines, bars, and other visual elements safe after formatting and export.

---

## 3. Best Practices

- **Do not use inline scripts or event handlers.**
- **Keep logic in the parent** (e.g., date formatting, data mapping).
- **Use only React and Tailwind CSS** (or inline styles for critical visual elements).
- **Test your template** in all modes: live preview, format/edit, and export.
- **Avoid using arbitrary Tailwind classes** for critical visual elements; use inline styles with `data-preserve` instead.
- **Keep your template accessible** (semantic HTML, proper heading levels, etc.).

---

## 4. Registering Your Template

- Add your template to `src/templates/index.ts` and `src/templates/config.ts`.
- Provide a unique `id`, a display `name`, and a preview image if possible.

---

## 5. Testing Your Template

- Test in the app:
  - Live preview (form editing)
  - Format mode (contentEditable editing)
  - Export (PDF/print)
- Ensure all lines, bars, and visual elements are preserved after formatting and export.
- Check for responsiveness and print layout.

---

## 6. Submitting Your Template

- Open a Pull Request with your new template file and config changes.
- Include a screenshot or preview image.
- Briefly describe your template's style and any special features.

---

## 7. Maintenance Notes

- If you update your template, ensure all `data-preserve` attributes are retained on visual elements.
- If you add new visual-only elements, always add `data-preserve="true"`.

---

Thank you for helping make BuildMyResume better! 

---

For more information, visit [BuildMyResume.live](https://BuildMyResume.live) 