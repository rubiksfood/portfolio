Personal Project:
Build a 'playback-speed/time converter' as a single page web app.

Technologies: HTML, CSS, Bootstrap & JavaScript.

The app should:
- Take user input that details how long a video/podcast is.
- Feature a dropdown menu for the speed they wish to watch/listen to it.
- Display the resulting time taken to actually watch/listen to it.

- (Fixed) BUG / use-case: Selecting a speed less than 1.0x produces an incorrect result.
    Problem: The maths involved does not take into account multipliers less than 1. 
    Solution: Reversed the subtraction of the old and the new time within the function.

- (Fixed) BUG / use-case: Selecting 93 mins at 1.5x, calculates 'Time saved' incorrectly, (i.e. 91 minutes).
    Problem: 'New time taken' is calculated in hours and mins. This is subtracted from the user input, i.e. just minutes. There is no conversion overflow for 60+ minutes.
    Solution: Created a 'minutes'/'seconds overflow conditional within the function, which substracts 60 from one unit and adds 1 to the corresponding unit.

In addition, experiment with using Bootstrap / SASS to style it.

