# Automatically generated by configure - do not modify!
shared=yes
build_suffix=
prefix=/home/devin/IntelWebrtc4.1/Release-v4.1/audio_agent/ffmpeg_libfdkaac_src
libdir=${prefix}/lib
incdir=${prefix}/include
rpath=
source_path=.
LIBPREF=lib
LIBSUF=.a
extralibs_avutil="-pthread -lm"
extralibs_avcodec="-pthread -lm -lz -L/home/devin/IntelWebrtc4.1/Release-v4.1/audio_agent/ffmpeg_libfdkaac_src/lib -lfdk-aac"
extralibs_avformat="-lm -lz"
extralibs_avdevice="-lm -lxcb -lxcb-shm -lxcb-shape -lxcb-xfixes -lSDL2"
extralibs_avfilter="-pthread -lm"
extralibs_avresample="-lm"
extralibs_postproc="-lm"
extralibs_swscale="-lm"
extralibs_swresample="-lm"
avcodec_deps="swresample avutil"
avdevice_deps="avfilter swscale avformat avcodec swresample avutil"
avfilter_deps="swscale avformat avcodec swresample avutil"
avformat_deps="avcodec swresample avutil"
avresample_deps="avutil"
avutil_deps=""
postproc_deps="avutil"
swresample_deps="avutil"
swscale_deps="avutil"
