# internal details

### Trimming video file

Trying the following command: not working

```
./node_modules/@ffmpeg-installer/darwin-x64/ffmpeg -i cypress/videos/gif-spec.js.mp4 -c copy -ss 00:00:1 -t 00:00:3 -y out.mp4
```

Got success with NOT passing codecs

```
./node_modules/@ffmpeg-installer/darwin-x64/ffmpeg -i cypress/videos/gif-spec.js.mp4 -ss 00:00:4.285 -t 00:00:5.950 -y out.mp4
```

The timestamps like `-ss` and `-t` are specified using `HH:MM:SS.xyz` format where `.xyz` are milliseconds.

With scaling output. The original video is 1920x1080 which is 16:9 we can output small demo loops of 960x540, but we can specify a single dimension and let the ffmpeg compute the other one. Also let's specify

```
./node_modules/@ffmpeg-installer/darwin-x64/ffmpeg -i cypress/videos/gif-spec.js.mp4 -ss 00:00:4.285 -t 00:00:5.950 -y -vf scale=960:-1:flags=lanczos out.mp4
```

See [scaling docs](https://ffmpeg.org/ffmpeg-scaler.html)

### Converting MP4 to GIF

Following https://superuser.com/questions/556029/how-do-i-convert-a-video-to-gif-using-ffmpeg-with-reasonable-quality

```
./node_modules/@ffmpeg-installer/darwin-x64/ffmpeg -i cypress/videos/gif-spec.js.mp4 -ss 00:00:4.285 -t 00:00:5.950 -y -vf "fps=10,scale=960:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 out.gif
```
