const fs = require('fs');

// Check the regex in update_programs.js:
// One of the replacements had `[\s\S]*?` that spanned across img tags!
// Specifically:
// `We laten niets aan het toeval over. Daarom monitoren we your progressie en sturen we waar nodig bij[\s\S]*?\./`
// Or:
// `Op basis van de informatie die tijdens het assessment verzameld hebben, gaan we aan de slag. We ontw[\s\S]*?plan`
// If `plan` or `.` matched across an `<img>` tag, it wiped out the img tag!

console.log("Found the reason: greedy [\\s\\S]*? across tags");
