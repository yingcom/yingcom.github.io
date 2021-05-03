---
date: "2021-04-23"
title: "CLI Tools for Digital Audio"
tags: ["CLI", "audio"]
preview: "Use FFmpeg, Rubberband and SoX for time streching and pitch scaling"
---

Musician likes to experiment with the keys and tempos of musical works. If it's hard to improvise on an accoustic instrument, you can try digital instrument that has built-in transpose function without changing your normal way of playing. Sound engineer can raise or lower the pitch of a sound with a pitch shifter in recording, or tranpose the soundtracks in a DAW in post-production. For those who are more comfortable with command lines, FFmpeg and SoX are great companions for audio processing. This article introduces FFmpeg, Rubberband and SoX commands for playback, format conversion, and ultimately, adjusting the tempo (time stretching) and pitch of an audio (pitch scaling or pitch shifting) to your taste in the terminal.  

How will the Concerto in D Minor after Marcello by J.S. Bach (BWV 974) sound if it is played in C Minor? Check it out yourself after you finish reading. 😉


# What is FFmpeg, Rubberband and SoX?

> FFmpeg is the leading multimedia framework, able to decode, encode, transcode, mux, demux, stream, filter and play pretty much anything that humans and machines have created. It supports the most obscure ancient formats up to the cutting edge - https://www.ffmpeg.org/about.html

FFmpeg has an large suite of libraries and programs for processing audio, video and other multimedia files and streams. First released in 2000, FFmpeg has been used as a core module for handling multimedia in applications such as YouTube, Chrome, iTunes, VLC player, Handbrake, and Blender, just to name a few. If you are unfamiliar with FFmpeg, check out this [tutorial](https://slhck.info/ffmpeg-encoding-course/) for a general introduction.

> Rubberband is an audio time-stretching and pitch-shifting library and utility program. It includes a simple (free) command-line utility program that you can use for fixed adjustments to the speed and pitch of existing audio files - https://breakfastquay.com/rubberband/

Rubberband is shipped with FFmpeg via `md> librubberband` as an audio filter. For modifying pitch or the time scale of an andio, Rubberband is far better than low-level manipulation via the `md> aresample`, `md> atempo`, or `md> asetrate` filters in FFmpeg.

> SoX (Sound eXchange) is a cross-platform command-line utility for audio manipulation. It can read and apply effects to audio, particularly suited for quick, simple edits and batch processing.

SoX is almost a decade older than FFmpeg. Unlike FFmpeg which has encompassing libraries for both audio and video, SoX focuses on audio processing only. However, it includes most of the tools that you will also find in a DAW.


# Quality Control with Meta Data and Playback

Checking meta data is the first step for quality control. You can extract the meta data of a single audio file with the command `sh> ffprobe <input>` in FFmpeg, or use `sh> soxi <input1> [input2] [input3]` to display information for multiple audio files with SoX.

SoX only supports audio formats that are not patent-encumbered or of which the patent has expired. For exmple, it can process audio files with an extension of `md>mp3`, `md>wav`, `md>aiff`, `md>flac`, `md>vorbis`, `md>opus`, `md>ogg`, but cannot read the compatible audio bitstreams inside `md>webm`, `md>mp4`, `md>m4a` or `md>m4b` containers. Please refer to the official [documentation](http://sox.sourceforge.net/soxformat.html) for a complete list of the supported formats. For files that cannot be handled by SoX, FFmpeg is here to rescue. It can transcode or transmux (changing containers without re-encoding) almost any audio with decent quality by default.

Playback is an intuitive way to check for potential problems. Both FFmpeg and Sox allows you to play audio in the terminal, as long as the format is supported.

FFmpeg ships a `sh> ffplay` command for multimedia playback. The `sh> -nodisp` flag is optional if you don't want a graphical display for the playback.

```sh
ffplay input.wav -nodisp
```

You can control the start and duration for the playback with the following syntax. The unit can be specified in seconds, or follow the `sh>[HH:]MM:SS[.m...]` or `sh> [-]S+[.m...][s|ms|us]` format. You need to be mindful that FFmpeg doesn't always have an accurate position for playback seeking. The seeking is always accurate to the given timestamps for re-encoding though.

```sh
ffplay input.wav -ss start -t duration
```

SoX comes with a `sh> play` command for audio playback with no pop-up display. You can control the playback with an optional start via `sh> trim seconds`, an optional pause or end via `sh> trim =seconds`. You can even skip to a position counting from the end of the soundtrack via `sh> trim -seconds`. The `sh> play` command below basically says that it should play from 00:15 until 00:30, skip the rest with fast foward and resume playing the last 20 seconds till the end. The playback seeking is accurate in SoX.

```sh
play input.wav trim 00:15 =00:30 -20
```


# Transcoding and Generation Loss

You can convert an audio from one format into another as long as both formats are supported in the tool of your choice. FFmpeg is more suitable for this task thanks to its massive container library (libavformat) and codec library (libavcodec). You can check the supported containers with `sh> ffmpeg -formats` and the supported codec with `sh> ffmpeg -codecs`.

Here are the commands for converting audio formats with SoX and FFmpeg respectively:

```sh
sox input.wav output.mp3        # format conversion with SoX
ffmpeg -i input.wav output.mp3  # format conversion with FFmpeg
```

Generation loss can be introduced in the transcoding process. The above command will re-encode the source audio with the target codec. If you just want to change containers (transmuxing) and the target codec is the same as the source codec, you really should just copy the original codec and avoid re-encoding. You can use the `sh> -c:a copy` flag, where `sh> -c:a` means the codec of the audio.

```sh
ffmpeg -i input.ogg -c:a copy output.webm
```


# Changing Tempo

You can pick SoX or FFmpeg for changing the tempo of an existing audio file. It is also called time stretching. SoX has a straigh-forward syntax and a decent quality for the output. FFmpeg has a slightly more complicated syntax, and if used with the right filter, it can produce a slightly better output.

In SoX you can change the tempo in playback with the command `sh> play <input> tempo [factor]` where the `md> factor` is the ratio of new tempo to the old tempo, so 1.2 speeds up the tempo by 20% and 0.5 slows it down by 50%. Since the `md> tempo` effect uses the `md> rate` effect which changes the audio sampling rate, the audio bitrate drops after conversion and the difference might be perceptible. Use the command below to save a copy.

```sh
sox <input> <output> tempo 1.2
```

An audio filter is required in FFmpeg for changing tempo of an audio. You can check the filters library in FFmpeg (libavfilter) via `sh> ffmpeg -filters`. FFmpeg accepts multiple filters, which can be daisy-chained by comma (see the syntax summary below). `sh> -af` is equivalent to `sh> -filter:a` for audio filter. Similarly `sh> -vf` is a shorthand for `sh> -filter:v` for video filter. A filter can have multiple parameters with a set of default values. Parameters of a filter are joined by colon.

```sh
ffmpeg -i <input> -af "filter1,filter2,filter3" <output>
ffmpeg -i <input> -af "filter=param1=value1:param2=value2" <output>
```

I tried the `md> atempo` filter with `sh> ffplay <input> -af atempo=1.5` to increase the tempo by 1.5 times. The audio quality is so miserable that I don't recommend it. Another option is the `md> librubberband` in FFmpeg, where it uses Rubberband, an dedicated library for time stretching and pitch shifting. Rubberband can be used as an FFmpeg audio filter or an independent command-line utility.

The playback command looks like this: `sh> ffplay <input> -af rubberband=tempo=1.5`. You can save a copy of the audio streamed at different playback speed with either command below.

```sh
ffmpeg -i <input> -af rubberband=tempo=1.5 <output>
rubberband --tempo 1.5 <input> <output>
```

Rubberband produces the best audio quality. SoX has a decent quality and its syntax is easy to remember. You probably should avoid the FFmpeg atempo filter at all cost for time stretching purpose.


# Shifting Pitch

SoX has a very good support for shifting pitch with `sh> pitch [-][shift]`, where the `sh> [shift]` indicates a shift value at 100th of a semitone, and a negative or positive sign for the shift direction. The following examples shows how to lower the pitch by 2 semitones. 

```sh
play <input> pitch -200           # for playback
sox <input> <output> pitch -200   # for conversion
```

When it comes to Rubberband, the pitch shifting syntax is somewhat problematic. It depends on whether it's used as an independent command or as an FFmpeg audio filter. Let's look at the command line scenario first. 

According to the [Rubberband command line utility help guide](https://breakfastquay.com/rubberband/usage.txt), which is also available via `sh> rubberband -h` in the terminal, you can lower the pitch by 2 semitones with the command below, where the `sh> --pitch` flag is interchangeable with `sh> -p`.

```sh
rubberband --pitch -2 <input> <ouptput>
```

If you want to use Rubberband as an FFmpeg audio filter, you need to be careful with the value for the scaled pitch. For instance, this command `sh> ffplay -i <input> -af rubberband=pitch=-2` will throw an out-of-range error, where the value for the pitch parameter should fall somewhere between 0.01 and 100. Since a person normally can hear the sounds between 20 to 20,000 Hz, is this somehow related to the pitch value range in `md> librubberband`?

How about changing the command to this: `sh> ffplay -i <input> -af rubberband=pitch=2`? Will I get a shift of 2 semitones above the original key? It turns out it's one octave higher! Reducing the pitch value to 0.5 will end up with one octave lower than the original key. It's obvious that the pitch parameter in the FFmpeg audio filter is different from the Rubberband command line scenario. How can I calculate the value for shifting down by 2 semitones with `sh> ffplay` then?

To answer this question, a bit of musical theory is needed. The calculation of a [semitone](https://en.wikipedia.org/wiki/Semitone) depends on the tuning system in use. In twelve-tone equal temperament, each semitone is equal to one twelfth of an octave. The ratio of the frequencies between two adjacent octaves is 2:1. The ratio of the frequencies between two adjacent semitones is [twelfth root of two](https://en.wikipedia.org/wiki/Twelfth_root_of_two).

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
-->

| Shift distance| Multiplier   | Ratio  |
|:--------------|:-------------| :------|
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

The syntaxes for pitch-shifting in SoX and the Rubberband CLI are more musician-friendly than the audio filter in FFmpeg. The audio quality from `md> librubberband` in FFmpeg is the least optimal. Rubberband CLI produces the best audio quality and its syntax makes sense. The only problem is the absence of a playback command similar to the `sh> play <input>` command in SoX. Therefore you can use SoX for a convenient playback and the Rubberband CLI for high quality conversion.

