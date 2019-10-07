# cypress-movie
> Exploring how one can generate product demo videos from Cypress tests

Example capturing video of the test run with additional message pop ups (using [tiny-toast](https://github.com/bahmutov/tiny-toast) library injected on `cy.visit`)

![Toasts](images/with-toasts.gif)

Cypress also computes the inner application iframe size and saves its json in `size.json` after the tests pass. Then you can clip and crop the entire video to only have the "demo" of the test in action.

Command `npm run crop` will use [ffmpeg to crop video](https://ffmpeg.org/ffmpeg-filters.html#crop) to only have the application area. First edit the `package.json` `crop` script command using application area dimensions from `size.json`.

```
# -filter:v 'crop=830:674:450:46'
# has 4 numbers:
# output width
# output height
# left edge to set output video
# top edge to set output video
npm run crop
```

Here is a cropped video example

![Cropped video](images/cropped.gif)

Then you can also clip the cropped video to the desired duration using `npm run clip`
