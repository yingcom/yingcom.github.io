---
date: "2021-04-23"
title: "CLI Tools for Digital Audio"
tags: ["CLI", "audio"]
preview: "Use FFmpeg, Rubberband and SoX for time stretching and pitch scaling"
---

Musician likes to experiment with the keys and tempos of musical works. If it's hard to adapt to a new key on acoustic instrument, you can try digital instrument that has built-in transpose function without changing the original way of playing. Sound engineer can raise or lower the pitch of a sound with a pitch shifter in recording, or transpose the soundtracks in a DAW in post production. For those who are comfortable with command line interface, FFmpeg and SoX are great companions for audio processing. This article introduces FFmpeg, Rubberband and SoX for audio playback, format conversion, and ultimately adjusting the tempo and the pitch to your taste in the terminal.

How will the Concerto in D Minor after Marcello (BWV 974) by J.S. Bach sound in C Minor? Check it out yourself after you finish reading. 😉


# What is FFmpeg, Rubberband and SoX?

> FFmpeg is the leading multimedia framework, able to decode, encode, transcode, mux, demux, stream, filter and play pretty much anything that humans and machines have created. It supports the most obscure ancient formats up to the cutting edge - https://www.ffmpeg.org/about.html

FFmpeg has a large suite of libraries and programs for processing audio, video and other multimedia files and streams. First released in 2000, FFmpeg has been used as a core module for handling multimedia in software applications such as YouTube, Chrome, iTunes, VLC media player, Handbrake, and Blender, just to name a few. If you are unfamiliar with FFmpeg, check out this [tutorial](https://slhck.info/ffmpeg-encoding-course/) for an introduction.

> Rubberband is an audio time-stretching and pitch-shifting library and utility program. It includes a simple (free) command-line utility program that you can use for fixed adjustments to the speed and pitch of existing audio files - https://breakfastquay.com/rubberband/

Rubberband is shipped in `md> librubberband` as an audio filter in FFmpeg. It also has a command-line interface independent of FFmpeg. For modifying the tempo or pitch of an audio, Rubberband is far better than low-level manipulation via the `md> aresample`, `md> atempo`, or `md> asetrate` filters in FFmpeg.

> SoX (Sound eXchange) is a cross-platform command-line utility for audio manipulation. It can read and apply effects to audio, particularly suited for quick, simple edits and batch processing.

SoX is almost a decade older than FFmpeg. Unlike FFmpeg which has encompassing libraries for both audio and video, SoX focuses on audio processing only. However, it includes most of the tools that you will also find in a DAW.


# Quality Control with Meta Data and Playback

Checking meta data is the first step in quality control. You can extract the meta data of a single audio file with the command `sh> ffprobe <input>` in FFmpeg, or use `sh> soxi <input1> [input2] [input3]` to display information for multiple audio files with SoX.

SoX only supports audio formats that are not patent-encumbered or of which the patent has expired. For example, it can process audio files with an extension of `md>mp3`, `md>wav`, `md>aiff`, `md>flac`, `md>vorbis`, `md>opus`, `md>ogg`, but cannot read the compatible audio bitstreams inside `md>webm`, `md>mp4`, `md>m4a` or `md>m4b` containers. For a complete list of the supported audio formats, please refer to the official [documentation](http://sox.sourceforge.net/soxformat.html). For files that cannot be processed by SoX, FFmpeg is here to rescue. It can transcode or transmux (changing containers without re-encoding) audio in almost any format with decent quality by default.

Playback is an intuitive way to check for potential problems. Both FFmpeg and Sox allows you to play audio with compatible formats in the terminal. FFmpeg ships a `sh> ffplay` command for multimedia playback. The `sh> -nodisp` flag is optional if you don't want the graphical display in playback.

```sh
ffplay input.wav -nodisp
```

The playback position can be controlled with a timestamp in `sh>[HH:]MM:SS[.m...]` or `sh> [-]S+[.m...][s|ms|us]` formats. You need to be mindful that FFmpeg doesn't always have an accurate position for playback. The seeking for transcoding is always accurate to the given timestamps though.

```sh
ffplay input.wav -ss <start> -t <duration>
```

SoX comes with a `sh> play` command for audio playback with no pop-up display. You can control the playback with an optional start via `sh> trim seconds`, an optional pause or end via `sh> trim =seconds`. You can even skip to a position measured from the end of a soundtrack via `sh> trim -seconds`. The `sh> play` command below basically says that it should play from 00:15 until 00:30, skip the rest with fast forward and resume playing the last 20 seconds till the end. The playback seeking is accurate in SoX.

```sh
play input.wav trim 00:15 =00:30 -20
```


# Transcoding and Generation Loss

You can convert an audio from one format into another as long as both formats are supported in the tool of your choice. FFmpeg is more suitable for this task thanks to its massive container library (libavformat) and codec library (libavcodec). You can check the supported containers with `sh> ffmpeg -formats` and the supported codecs with `sh> ffmpeg -codecs`.

Here are the commands for converting audio formats with SoX and FFmpeg respectively:

```sh
sox input.wav output.mp3        # format conversion with SoX
ffmpeg -i input.wav output.mp3  # format conversion with FFmpeg
```

Generation loss can be introduced in transcoding. The above command will re-encode the source audio with the target codec. If you just want to change containers (transmuxing) and the target codec is the same as the source codec, you really should just copy the original codec and avoid re-encoding. You can add the `sh> -c:a copy` flag, where `sh> -c:a` means the audio codec.

```sh
ffmpeg -i input.ogg -c:a copy output.webm
```


# Changing Tempo

You can pick SoX or FFmpeg for changing the tempo of an existing audio file. The trick is also called time stretching. SoX has a straight-forward command and a decent quality for the output. FFmpeg has a slightly more complicated command syntax, and if used with the right filter, it can produce a slightly better output.

In SoX you can change the tempo in playback with the command `sh> play <input> tempo [factor]` where `md> factor` is the ratio of new tempo to the old tempo, so 1.2 speeds up the tempo by 20% and 0.7 slows it down by 30%. Since the `md> tempo` effect uses the `md> rate` effect in SoX which changes the sampling rate, the bitrate drops in the output audio and the difference might be perceptible. Use the command below to save a copy.

```sh
sox <input> <output> tempo 1.2
```

An audio filter is required in FFmpeg for changing the tempo of a soundtrack. You can check the filters library in FFmpeg (libavfilter) via `sh> ffmpeg -filters`. FFmpeg accepts multiple filters, which can be daisy-chained by comma (see the command syntax below). The `sh> -af` flag is equivalent to `sh> -filter:a` for audio filter. Likewise the `sh> -vf` is a shorthand for `sh> -filter:v` for video filter. A filter can have multiple parameters with a set of default values. Parameters of a filter are joined by colon.

```sh
ffmpeg -i <input> -af "filter1,filter2,filter3" <output>
ffmpeg -i <input> -af "filter=param1=value1:param2=value2" <output>
```

I tried the `md> atempo` filter with `sh> ffplay <input> -af atempo=1.5` to increase the tempo by 1.5 times. The audio quality is so miserable that I don't recommend it. Another option is the `md> librubberband` in FFmpeg, where it uses Rubberband, a dedicated library for time stretching and pitch shifting. Rubberband can be used as an FFmpeg audio filter or an independent command-line utility.

The playback command via `md> librubberband` looks like this: `sh> ffplay <input> -af rubberband=tempo=1.5`. You can save a copy of the audio streamed at different playback speed with either command below.

```sh
ffmpeg -i <input> -af rubberband=tempo=1.5 <output>
rubberband --tempo 1.5 <input> <output>
```

Rubberband produces the best audio quality. SoX has a decent quality and its command is easy to remember. You probably should avoid the FFmpeg atempo filter at all cost for tempo adjustment.


# Shifting Pitch

SoX has a very good support for shifting pitch with `sh> pitch [-][shift]`, where the `sh> [shift]` indicates a shift value at 100th of a semitone, with an optional positive sign or a negative sign for the shift direction. The following commands show how to lower the pitch by 2 semitones.

```sh
play <input> pitch -200           # for playback
sox <input> <output> pitch -200   # for conversion
```

When it comes to Rubberband, the pitch shifting syntax is somewhat problematic. It depends on whether it's used as a command-line utility program or as an FFmpeg audio filter. Let's look at the command-line scenario first.

According to the [Rubberband command line utility help guide](https://breakfastquay.com/rubberband/usage.txt), which is also available via `sh> rubberband -h` in the terminal, you can lower the pitch by 2 semitones with the following command, where the `sh> --pitch` flag is interchangeable with `sh> -p`.

```sh
rubberband --pitch -2 <input> <ouptput>
```

If you want to use Rubberband as an FFmpeg audio filter, you need to be careful with the value for the scaled pitch. For instance, this command `sh> ffplay -i <input> -af rubberband=pitch=-2` will throw an out-of-range error, where the value for the pitch should fall somewhere between 0.01 and 100. Since a person normally can hear the sounds between 20 to 20,000 Hz, is this somehow related to the pitch value range in `md> librubberband`?

How about changing the command to `sh> ffplay -i <input> -af rubberband=pitch=2`? Will I get a shift of 2 semitones above the original key? It turns out it's one octave higher! Reducing the pitch value to 0.5 will end up with one octave lower than the original key. It's obvious that the pitch parameter in the FFmpeg audio filter is different from the Rubberband command-line utility program. How can I calculate the value for shifting the pitch down by 2 semitones with `sh> ffplay` then?

To answer this question, a bit of musical theory is needed. The calculation of a [semitone](https://en.wikipedia.org/wiki/Semitone) depends on the tuning system in use. In twelve-tone equal temperament, each semitone is equal to one twelfth of an octave. The ratio of the frequencies between two adjacent octaves is 2:1. The ratio of the frequencies between two adjacent semitones is [twelfth root of two](https://en.wikipedia.org/wiki/Twelfth_root_of_two) <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="34.359375" height="35.3125" style="width:34.359375px;height:35.3125px;font-family:Asana-Math, Asana;background:#FFF;"><g transform="matrix(1,0,0,1,2,17.9)"><path transform="matrix(0.0119,0,0,-0.0119,0,0)" d="M418 -3L418 27L366 30C311 33 301 44 301 96L301 700L60 598L67 548L217 614L217 96C217 44 206 33 152 30L96 27L96 -3C250 0 250 0 261 0C292 0 402 -3 418 -3ZM515 23L515 -3C702 -3 702 0 738 0C774 0 774 -3 967 -3L967 82C852 77 806 81 621 77L803 270C900 373 930 428 930 503C930 618 852 689 725 689C653 689 604 669 555 619L538 483L567 483L580 529C596 587 632 612 699 612C785 612 840 558 840 473C840 398 798 324 685 204Z" stroke="rgb(0,0,0)" stroke-opacity="1" stroke-width="8" fill="rgb(0,0,0)" fill-opacity="1"></path></g><g transform="matrix(1,0,0,1,19.625,30.3125)"><path transform="matrix(0.017,0,0,-0.017,0,0)" d="M16 23L16 -3C203 -3 203 0 239 0C275 0 275 -3 468 -3L468 82C353 77 307 81 122 77L304 270C401 373 431 428 431 503C431 618 353 689 226 689C154 689 105 669 56 619L39 483L68 483L81 529C97 587 133 612 200 612C286 612 341 558 341 473C341 398 299 324 186 204Z" stroke="rgb(0,0,0)" stroke-opacity="1" stroke-width="8" fill="rgb(0,0,0)" fill-opacity="1"></path></g><svg x="2.625" overflow="visible" y="11.3125" height="17" width="25.5"><polygon points="0.35,9.89 4.79,7.52 9.67,17.87 16.36,0.00 25.50,0.00 25.50,1.05 17.09,1.05 9.18,22.19 3.10,9.45 0.64,10.37" style="fill:rgb(0,0,0);fill-opacity:1;stroke-width:1px;stroke:none;stroke-opacity:1;"></polygon></svg><g transform="matrix(1,0,0,1,28.125,30.3125)"><path transform="matrix(0.017,0,0,-0.017,0,0)" d="" stroke="rgb(0,0,0)" stroke-opacity="1" stroke-width="8" fill="rgb(0,0,0)" fill-opacity="1"></path></g></svg>.

<!--
12 semitones (1 octave) higher: 2  
1 semitone higher: 2^(1/12) ≈ 1.0594630944  
1 semitone lower: 1 / 2^(1/12) ≈ 0.9438743127  
2 semitones higher: 2^(1/12) * 2^(1/12) ≈ 1.1224620483  
2 semitones lower: 1 / (2^(1/12) * 2^(1/12)) ≈ 0.8908987181
-->

<!--
12 semitones or 1 octave higher: 2<sup><span class="frac" role="math"><span class="num">12</span>⁄<span class="den">12</span></span></sup> = 2  
1 semitone higher: 2<sup><span class="frac" role="math"><span class="num">1</span>⁄<span class="den">12</span></span></sup> ≈ 1.0594630944  
2 semitones higher: 2<sup><span class="frac" role="math"><span class="num">1</span>⁄<span class="den">6</span></span></sup> ≈ 1.1224620483  
1 semitone lower: 1 ÷ 2<sup><span class="frac" role="math"><span class="num">1</span>⁄<span class="den">12</span></span></sup> ≈ 0.9438743127  
2 semitones lower: 1 ÷ 2<sup><span class="frac" role="math"><span class="num">1</span>⁄<span class="den">6</span></span></sup> ≈ 0.8908987181  
12 semitones or 1 octave lower: 1 ÷ 2<sup><span class="frac" role="math"><span class="num">12</span>⁄<span class="den">12</span></span></sup> = 0.5
-->

| Shift distance| Multiplier   | Ratio  |
|:--------------|:-------------|:-------|
| +12 semitones | 2 <sup><span class="frac" role="math"><span class="num">12</span>⁄<span class="den">12</span></span></sup> | 2 |
| +2 semitones  | 2<sup><span class="frac" role="math"><span class="num">1</span>⁄<span class="den">6</span></span></sup> | 1.1224620483 |
| +1 semitone   | 2 <sup><span class="frac" role="math"><span class="num">1</span>⁄<span class="den">12</span></span></sup> | 1.0594630944 |
| base          | 2 <sup><span class="frac" role="math"><span class="num">0</span>⁄<span class="den">12</span></span></sup> | 1 |
| -1 semitone   | 1 &divide; 2<sup><span class="frac" role="math"><span class="num">1</span>⁄<span class="den">12</span></span></sup> | 0.9438743127|
| -2 semitones  | 1 &divide; 2<sup><span class="frac" role="math"><span class="num">1</span>⁄<span class="den">6</span></span></sup> | 0.8908987181 |
| -12 semitones | 1 &divide; 2 <sup><span class="frac" role="math"><span class="num">12</span>⁄<span class="den">12</span></span></sup> | 0.5 |


If the original key is scaled to 1, the ratio for shifting the pitch down by 2 semitones is 0.8908987181. You can use the Rubberband audio filter in FFmpeg to achieve the transposition.

```sh
ffplay -i <input> -af rubberband=pitch=0.8908987181            # for playback
ffmpeg -i <input> -af rubberband=pitch=0.8908987181 <ouptput>  # for conversion
```

The syntaxes for pitch-shifting in SoX and the Rubberband CLI are more musician-friendly than the audio filter in FFmpeg. The audio quality from `md> librubberband` in FFmpeg is the least optimal. The Rubberband CLI produces the best audio quality and its syntax makes sense. The only problem is the absence of a playback command similar to the `sh> play <input>` in SoX. Therefore you can use SoX for a convenient playback and the Rubberband CLI for high quality conversion.

