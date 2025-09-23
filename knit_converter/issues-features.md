### Issues:

# PROBLEM 1: TODO
Any text converted is inserted as unformatted text in the new pdf.
This can make it difficult to understand what is written when it affects titles/sub-titles.

# Notes about Problem 1:
This may be a complex problem to fix, as editing PDFs is notoriously tricky...
When I changed the convert function to take into account 'runs' in the word doc conversion, I often lost images from the original pdf.
This was deemed less acceptable to the formatting issue, as images are important to understanding a knitting pattern (e.g. seeing the end product).

# PROBLEM 2: TODO
For some PDFs, extra (mostly blank) pages are added.
This is likely due to formatting issues related to switching out formatted text for unformatted text... [See Problem 1]

### Features:

# Feature 1: TODO
Create a simple program interface that runs the script.

This interface should have 1 input field for the source directory, 1 input field for the target directory and a 'Convert' button.
When this button is clicked, it should run the script with the relevant input/output variables assigned to the 2 input fields.

# Feature 2: TODO
If the folder is not already open, when the program is finished running, it should open the output directory.