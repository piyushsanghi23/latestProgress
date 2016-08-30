package com.vuforia.samples.VuforiaSamples.app.VirtualButtons.video;

import android.app.Activity;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.opengl.GLES11Ext;
import android.opengl.GLES20;
import android.opengl.Matrix;
import android.os.SystemClock;
import android.util.DisplayMetrics;

import com.vuforia.ImageTarget;
import com.vuforia.Matrix44F;
import com.vuforia.Rectangle;
import com.vuforia.State;
import com.vuforia.Tool;
import com.vuforia.TrackableResult;
import com.vuforia.Vec2F;
import com.vuforia.Vec3F;
import com.vuforia.samples.SampleApplication.SampleApplicationSession;
import com.vuforia.samples.SampleApplication.utils.SampleMath;
import com.vuforia.samples.SampleApplication.utils.SampleUtils;
import com.vuforia.samples.SampleApplication.utils.Texture;
import com.vuforia.samples.VuforiaSamples.app.VirtualButtons.VirtualButtonRenderer;

import java.nio.Buffer;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.Vector;

/**
 * Created by dsingh on 7/6/2016.
 */
public class VideoDrawer {

    public static final int NUM_TARGETS = 2;
    public static final int STONES = 0;
    public static final int CHIPS = 1;
    int targetOffset = 6;

    private boolean mWasPlaying[] = null;

    // A boolean to indicate whether we come from full screen:
    private boolean mReturningFromFullScreen = false;

    private boolean mPlayFullscreenVideo = false;

    // =================================== From Renderer :

    // Video Playback Rendering Specific
    private int videoPlaybackShaderID = 0;
    private int videoPlaybackVertexHandle = 0;
    private int videoPlaybackNormalHandle = 0;
    private int videoPlaybackTexCoordHandle = 0;
    private int videoPlaybackMVPMatrixHandle = 0;
    private int videoPlaybackTexSamplerOESHandle = 0;

    // Video Playback Textures for the two targets
    int videoPlaybackTextureID[] = new int[NUM_TARGETS];

    // Keyframe and icon rendering specific
    private int keyframeShaderID = 0;
    private int keyframeVertexHandle = 0;
    private int keyframeNormalHandle = 0;
    private int keyframeTexCoordHandle = 0;
    private int keyframeMVPMatrixHandle = 0;
    private int keyframeTexSampler2DHandle = 0;

    // We cannot use the default texture coordinates of the quad since these
    // will change depending on the video itself
    private float videoQuadTextureCoords[] = { 0.0f, 0.0f, 1.0f, 0.0f, 1.0f,
            1.0f, 0.0f, 1.0f, };

    // This variable will hold the transformed coordinates (changes every frame)
    private float videoQuadTextureCoordsTransformedStones[] = { 0.0f, 0.0f,
            1.0f, 0.0f, 1.0f, 1.0f, 0.0f, 1.0f, };

    private float videoQuadTextureCoordsTransformedChips[] = { 0.0f, 0.0f,
            1.0f, 0.0f, 1.0f, 1.0f, 0.0f, 1.0f, };

    // Trackable dimensions
    Vec3F targetPositiveDimensions[] = new Vec3F[NUM_TARGETS];

    static int NUM_QUAD_VERTEX = 4;
    static int NUM_QUAD_INDEX = 6;

    double quadVerticesArray[] = { -1.0f, -1.0f, 0.0f, 1.0f, -1.0f, 0.0f, 1.0f,
            1.0f, 0.0f, -1.0f, 1.0f, 0.0f };

    double quadTexCoordsArray[] = { 0.0f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 0.0f,
            1.0f };

    double quadNormalsArray[] = { 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, };

    short quadIndicesArray[] = { 0, 1, 2, 2, 3, 0 };

    Buffer quadVertices, quadTexCoords, quadIndices, quadNormals;

    public boolean mIsActive = false;

    private float[][] mTexCoordTransformationMatrix = null;
    private VideoPlayerHelper mVideoPlayerHelper[] = null;
    private String mMovieName[] = null;
    private VideoPlayerHelper.MEDIA_TYPE mCanRequestType[] = null;
    private int mSeekPosition[] = null;
    private boolean mShouldPlayImmediately[] = null;
    private long mLostTrackingSince[] = null;
    private boolean mLoadRequested[] = null;

    // Needed to calculate whether a screen tap is inside the target
    Matrix44F modelViewMatrix[] = new Matrix44F[NUM_TARGETS];

    private Vector<Texture> mTextures;

    boolean isTracking[] = new boolean[NUM_TARGETS];
    VideoPlayerHelper.MEDIA_STATE currentStatus[] = new VideoPlayerHelper.MEDIA_STATE[NUM_TARGETS];

    // These hold the aspect ratio of both the video and the
    // keyframe
    float videoQuadAspectRatio[] = new float[NUM_TARGETS];
    float keyframeQuadAspectRatio[] = new float[NUM_TARGETS];




// =======================================================
    // For VideoPlayer :

    private Activity mParentActivity = null;



    public VideoDrawer(Activity activity, Vector<Texture> textures){

        mParentActivity = activity;

        mVideoPlayerHelper = new VideoPlayerHelper[NUM_TARGETS];
        mSeekPosition = new int[NUM_TARGETS];
        mWasPlaying = new boolean[NUM_TARGETS];
        mMovieName = new String[NUM_TARGETS];

        mMovieName[0] = "www/targets/prgs/innovation.mp4";
        mMovieName[1] = "www/targets/prgs/annualparty.mp4";

        // From Renderer :-

        mCanRequestType = new VideoPlayerHelper.MEDIA_TYPE[NUM_TARGETS];
        mShouldPlayImmediately = new boolean[NUM_TARGETS];
        mLostTrackingSince = new long[NUM_TARGETS];
        mLoadRequested = new boolean[NUM_TARGETS];
        mTexCoordTransformationMatrix = new float[NUM_TARGETS][16];

        // Initialize the arrays to default values
        for (int i = 0; i < NUM_TARGETS; i++)
        {
            mCanRequestType[i] = VideoPlayerHelper.MEDIA_TYPE.ON_TEXTURE_FULLSCREEN;
            mSeekPosition[i] = 0;
            mShouldPlayImmediately[i] = false;
            mLostTrackingSince[i] = -1;
            mLoadRequested[i] = false;
        }

        for (int i = 0; i < NUM_TARGETS; i++)
        {
            mVideoPlayerHelper[i] = new VideoPlayerHelper();
            mVideoPlayerHelper[i].init();
            mVideoPlayerHelper[i].setActivity(mParentActivity);

            requestLoad(i, mMovieName[i], 0, false);
        }

        for (int i = 0; i < NUM_TARGETS; i++)
            targetPositiveDimensions[i] = new Vec3F();

        for (int i = 0; i < NUM_TARGETS; i++)
            modelViewMatrix[i] = new Matrix44F();

        // The renderer comes has the OpenGL context, thus, loading to texture
        // must happen when the surface has been created. This means that we
        // can't load the movie from this thread (GUI) but instead we must
        // tell the GL thread to load it once the surface has been created.

        for (int i = 0; i < NUM_TARGETS; i++)
        {
            float[] temp = { 0f, 0f, 0f };
            targetPositiveDimensions[i].setData(temp);
            videoPlaybackTextureID[i] = -1;
        }

        // Load any sample specific textures:
        mTextures = textures;

//                new Vector<Texture>();
//        loadTextures();

    }


    // We want to load specific textures from the APK, which we will later
    // use for rendering.
    private void loadTextures()
    {

    }

    public void onSurfaceCreated(){
        for (int i = 0; i < NUM_TARGETS; i++)
        {

            if (mVideoPlayerHelper[i] != null)
            {
                // The VideoPlayerHelper needs to setup a surface texture given
                // the texture id
                // Here we inform the video player that we would like to play
                // the movie
                // both on texture and on full screen
                // Notice that this does not mean that the platform will be able
                // to do what we request
                // After the file has been loaded one must always check with
                // isPlayableOnTexture() whether
                // this can be played embedded in the AR scene
                if (!mVideoPlayerHelper[i]
                        .setupSurfaceTexture(videoPlaybackTextureID[i]))
                    mCanRequestType[i] = VideoPlayerHelper.MEDIA_TYPE.FULLSCREEN;
                else
                    mCanRequestType[i] = VideoPlayerHelper.MEDIA_TYPE.ON_TEXTURE_FULLSCREEN;

                // And now check if a load has been requested with the
                // parameters passed from the main activity
                if (mLoadRequested[i])
                {
                    mVideoPlayerHelper[i].load(mMovieName[i],
                            mCanRequestType[i], mShouldPlayImmediately[i],
                            mSeekPosition[i]);
                    mLoadRequested[i] = false;
                }
            }
        }

    }

    public void onSurfaceChanged(){

        for (int i = 0; i < NUM_TARGETS; i++)
        {
            if (mLoadRequested[i] && mVideoPlayerHelper[i] != null)
            {
                mVideoPlayerHelper[i].load(mMovieName[i], mCanRequestType[i],
                        mShouldPlayImmediately[i], mSeekPosition[i]);
                mLoadRequested[i] = false;
            }
        }

    }

    public void onDrawFrame(){
        for (int i = 0; i < NUM_TARGETS; i++)
        {
            if (mVideoPlayerHelper[i] != null)
            {
                if (mVideoPlayerHelper[i].isPlayableOnTexture())
                {
                    // First we need to update the video data. This is a built
                    // in Android call
                    // Here, the decoded data is uploaded to the OES texture
                    // We only need to do this if the movie is playing
                    if (mVideoPlayerHelper[i].getStatus() == VideoPlayerHelper.MEDIA_STATE.PLAYING)
                    {
                        mVideoPlayerHelper[i].updateVideoData();
                    }

                    // According to the Android API
                    // (http://developer.android.com/reference/android/graphics/SurfaceTexture.html)
                    // transforming the texture coordinates needs to happen
                    // every frame.
                    mVideoPlayerHelper[i]
                            .getSurfaceTextureTransformMatrix(mTexCoordTransformationMatrix[i]);
                    setVideoDimensions(i,
                            mVideoPlayerHelper[i].getVideoWidth(),
                            mVideoPlayerHelper[i].getVideoHeight(),
                            mTexCoordTransformationMatrix[i]);
                }

                setStatus(i, mVideoPlayerHelper[i].getStatus().getNumericType());
            }
        }

    }




    public void onDrawFrameAfter(){
        for (int i = 0; i < NUM_TARGETS; i++)
        {
            // Ask whether the target is currently being tracked and if so react
            // to it
            if (isTracking(i))
            {
                // If it is tracking reset the timestamp for lost tracking
                mLostTrackingSince[i] = -1;
            } else
            {
                // If it isn't tracking
                // check whether it just lost it or if it's been a while
                if (mLostTrackingSince[i] < 0)
                    mLostTrackingSince[i] = SystemClock.uptimeMillis();
                else
                {
                    // If it's been more than 2 seconds then pause the player
                    if ((SystemClock.uptimeMillis() - mLostTrackingSince[i]) > 2000)
                    {
                        if (mVideoPlayerHelper[i] != null)
                            mVideoPlayerHelper[i].pause();
                    }
                }
            }
        }

    }


    public void initRendering(){
        for (int i = 0; i < NUM_TARGETS; i++)
        {
            GLES20.glGenTextures(1, videoPlaybackTextureID, i);
            GLES20.glBindTexture(GLES11Ext.GL_TEXTURE_EXTERNAL_OES,
                    videoPlaybackTextureID[i]);
            GLES20.glTexParameterf(GLES11Ext.GL_TEXTURE_EXTERNAL_OES,
                    GLES20.GL_TEXTURE_MIN_FILTER, GLES20.GL_LINEAR);
            GLES20.glTexParameterf(GLES11Ext.GL_TEXTURE_EXTERNAL_OES,
                    GLES20.GL_TEXTURE_MAG_FILTER, GLES20.GL_LINEAR);
            GLES20.glBindTexture(GLES11Ext.GL_TEXTURE_EXTERNAL_OES, 0);
        }

        // The first shader is the one that will display the video data of the
        // movie
        // (it is aware of the GL_TEXTURE_EXTERNAL_OES extension)
        videoPlaybackShaderID = SampleUtils.createProgramFromShaderSrc(
                VideoPlaybackShaders.VIDEO_PLAYBACK_VERTEX_SHADER,
                VideoPlaybackShaders.VIDEO_PLAYBACK_FRAGMENT_SHADER);
        videoPlaybackVertexHandle = GLES20.glGetAttribLocation(
                videoPlaybackShaderID, "vertexPosition");
        videoPlaybackNormalHandle = GLES20.glGetAttribLocation(
                videoPlaybackShaderID, "vertexNormal");
        videoPlaybackTexCoordHandle = GLES20.glGetAttribLocation(
                videoPlaybackShaderID, "vertexTexCoord");
        videoPlaybackMVPMatrixHandle = GLES20.glGetUniformLocation(
                videoPlaybackShaderID, "modelViewProjectionMatrix");
        videoPlaybackTexSamplerOESHandle = GLES20.glGetUniformLocation(
                videoPlaybackShaderID, "texSamplerOES");

        // This is a simpler shader with regular 2D textures
        keyframeShaderID = SampleUtils.createProgramFromShaderSrc(
                KeyFrameShaders.KEY_FRAME_VERTEX_SHADER,
                KeyFrameShaders.KEY_FRAME_FRAGMENT_SHADER);
        keyframeVertexHandle = GLES20.glGetAttribLocation(keyframeShaderID,
                "vertexPosition");
        keyframeNormalHandle = GLES20.glGetAttribLocation(keyframeShaderID,
                "vertexNormal");
        keyframeTexCoordHandle = GLES20.glGetAttribLocation(keyframeShaderID,
                "vertexTexCoord");
        keyframeMVPMatrixHandle = GLES20.glGetUniformLocation(keyframeShaderID,
                "modelViewProjectionMatrix");
        keyframeTexSampler2DHandle = GLES20.glGetUniformLocation(
                keyframeShaderID, "texSampler2D");

        keyframeQuadAspectRatio[0] = (float) mTextures.get(0 + targetOffset).mHeight / (float) mTextures.get(0).mWidth;
        keyframeQuadAspectRatio[1] = (float) mTextures.get(1 + targetOffset).mHeight / (float) mTextures.get(1).mWidth;


        quadVertices = fillBuffer(quadVerticesArray);
        quadTexCoords = fillBuffer(quadTexCoordsArray);
        quadIndices = fillBuffer(quadIndicesArray);
        quadNormals = fillBuffer(quadNormalsArray);

    }

    boolean isTracking(int target)
    {
        return isTracking[target];
    }


    public void requestLoad(int target, String movieName, int seekPosition,
                            boolean playImmediately)
    {
        mMovieName[target] = movieName;
        mSeekPosition[target] = seekPosition;
        mShouldPlayImmediately[target] = playImmediately;
        mLoadRequested[target] = true;
    }

    public void onResume() {
        for (int i = 0; i < NUM_TARGETS; i++) {
            if (!mReturningFromFullScreen) {
                requestLoad(i, mMovieName[i], mSeekPosition[i],
                        false);
            } else {
                requestLoad(i, mMovieName[i], mSeekPosition[i],
                        mWasPlaying[i]);
            }
        }

        mReturningFromFullScreen = false;
    }


    // Called when returning from the full screen player
    public void onActivityResult(int requestCode, int resultCode, Intent data)
    {
        if (requestCode == 1)
        {

            mParentActivity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);

            if (resultCode == mParentActivity.RESULT_OK)
            {
                // The following values are used to indicate the position in
                // which the video was being played and whether it was being
                // played or not:
                String movieBeingPlayed = data.getStringExtra("movieName");
                mReturningFromFullScreen = true;

                // Find the movie that was being played full screen
                for (int i = 0; i < NUM_TARGETS; i++)
                {
                    if (movieBeingPlayed.compareTo(mMovieName[i]) == 0)
                    {
                        mSeekPosition[i] = data.getIntExtra(
                                "currentSeekPosition", 0);
                        mWasPlaying[i] = false;
                    }
                }
            }
        }
    }


    public void onPause(){
        for (int i = 0; i < NUM_TARGETS; i++)
        {
            // If the activity is paused we need to store the position in which
            // this was currently playing:
            if (mVideoPlayerHelper[i].isPlayableOnTexture())
            {
                mSeekPosition[i] = mVideoPlayerHelper[i].getCurrentPosition();
                mWasPlaying[i] = mVideoPlayerHelper[i].getStatus() == VideoPlayerHelper.MEDIA_STATE.PLAYING ? true
                        : false;
            }

            // We also need to release the resources used by the helper, though
            // we don't need to destroy it:
            if (mVideoPlayerHelper[i] != null)
                mVideoPlayerHelper[i].unload();
        }

        mReturningFromFullScreen = false;

    }


    // Pause all movies except one
    // if the value of 'except' is -1 then
    // do a blanket pause
    private void pauseAll(int except)
    {
        // And pause all the playing videos:
        for (int i = 0; i < NUM_TARGETS; i++)
        {
            // We can make one exception to the pause all calls:
            if (i != except)
            {
                // Check if the video is playable on texture
                if (mVideoPlayerHelper[i].isPlayableOnTexture())
                {
                    // If it is playing then we pause it
                    mVideoPlayerHelper[i].pause();
                }
            }
        }
    }


    // Do not exit immediately and instead show the startup screen
    public void onBackPressed()
    {
        pauseAll(-1);
    }



    public void onDestroy(){

        for (int i = 0; i < NUM_TARGETS; i++)
        {
            // If the activity is destroyed we need to release all resources:
            if (mVideoPlayerHelper[i] != null)
                mVideoPlayerHelper[i].deinit();
            mVideoPlayerHelper[i] = null;
        }

    }

    public void draw(SampleApplicationSession vuforiaAppSession, State state){

        // Set the viewport
//        int[] viewport = vuforiaAppSession.getViewport();
//        GLES20.glViewport(viewport[0]-100, viewport[1]+100, viewport[2], viewport[3]);



        float temp[] = { 0.0f, 0.0f, 0.0f };
        for (int i = 0; i < NUM_TARGETS; i++)
        {
            isTracking[i] = false;
            targetPositiveDimensions[i].setData(temp);
        }

        // Did we find any trackables this frame?
        for (int tIdx = 0; tIdx < state.getNumTrackableResults(); tIdx++)
        {

            // Get the trackable:
            TrackableResult trackableResult = state.getTrackableResult(tIdx);

            ImageTarget imageTarget = (ImageTarget) trackableResult.getTrackable();

            int currentTarget = VirtualButtonRenderer.currentTarget - 5;
            if(currentTarget<0 || currentTarget>1){
                return;
            }


            // We store the modelview matrix to be used later by the tap
            // calculation

            modelViewMatrix[currentTarget] = Tool.convertPose2GLMatrix(trackableResult.getPose());

            isTracking[currentTarget] = true;

            targetPositiveDimensions[currentTarget] = imageTarget.getSize();

            // The pose delivers the center of the target, thus the dimensions
            // go from -width/2 to width/2, same for height
            temp[0] = targetPositiveDimensions[currentTarget].getData()[0] / 2.0f;
            temp[1] = targetPositiveDimensions[currentTarget].getData()[1] / 2.0f;
            targetPositiveDimensions[currentTarget].setData(temp);

            // If the movie is ready to start playing or it has reached the end
            // of playback we render the keyframe
            if ((currentStatus[currentTarget] == VideoPlayerHelper.MEDIA_STATE.READY)
                    || (currentStatus[currentTarget] == VideoPlayerHelper.MEDIA_STATE.REACHED_END)
                    || (currentStatus[currentTarget] == VideoPlayerHelper.MEDIA_STATE.NOT_READY)
                    || (currentStatus[currentTarget] == VideoPlayerHelper.MEDIA_STATE.ERROR))
            {
                float[] modelViewMatrixKeyframe = Tool.convertPose2GLMatrix(trackableResult.getPose()).getData();
                float[] modelViewProjectionKeyframe = new float[16];
                // Matrix.translateM(modelViewMatrixKeyframe, 0, 0.0f, 0.0f,
                // targetPositiveDimensions[currentTarget].getData()[0]);

                // Here we use the aspect ratio of the keyframe since it
                // is likely that it is not a perfect square

                float ratio = 1.0f;
                if (mTextures.get(currentTarget + targetOffset).mSuccess)
                    ratio = keyframeQuadAspectRatio[currentTarget];
                else
                    ratio = targetPositiveDimensions[currentTarget].getData()[1]
                            / targetPositiveDimensions[currentTarget].getData()[0];

                Matrix.scaleM(modelViewMatrixKeyframe, 0,
                        targetPositiveDimensions[currentTarget].getData()[0],
                        targetPositiveDimensions[currentTarget].getData()[0]
                                * ratio,
                        targetPositiveDimensions[currentTarget].getData()[0]);
                Matrix.multiplyMM(modelViewProjectionKeyframe, 0,
                        vuforiaAppSession.getProjectionMatrix().getData(), 0,
                        modelViewMatrixKeyframe, 0);

                GLES20.glUseProgram(keyframeShaderID);

                // Prepare for rendering the keyframe
                GLES20.glVertexAttribPointer(keyframeVertexHandle, 3,
                        GLES20.GL_FLOAT, false, 0, quadVertices);
                GLES20.glVertexAttribPointer(keyframeNormalHandle, 3,
                        GLES20.GL_FLOAT, false, 0, quadNormals);
                GLES20.glVertexAttribPointer(keyframeTexCoordHandle, 2,
                        GLES20.GL_FLOAT, false, 0, quadTexCoords);

                GLES20.glEnableVertexAttribArray(keyframeVertexHandle);
                GLES20.glEnableVertexAttribArray(keyframeNormalHandle);
                GLES20.glEnableVertexAttribArray(keyframeTexCoordHandle);

                GLES20.glActiveTexture(GLES20.GL_TEXTURE0);

                Rectangle vbRectangle = new Rectangle(-100f, -50f, 100f,
                        50f);

                // The first loaded texture from the assets folder is the
                // keyframe
                GLES20.glBindTexture(GLES20.GL_TEXTURE_2D,
                        mTextures.get(currentTarget + targetOffset).mTextureID[0]);
                GLES20.glUniformMatrix4fv(keyframeMVPMatrixHandle, 1, false,
                        modelViewProjectionKeyframe, 0);
                GLES20.glUniform1i(keyframeTexSampler2DHandle, 0);

                // Render
                GLES20.glDrawElements(GLES20.GL_TRIANGLES, NUM_QUAD_INDEX,
                        GLES20.GL_UNSIGNED_SHORT, quadIndices);

                GLES20.glDisableVertexAttribArray(keyframeVertexHandle);
                GLES20.glDisableVertexAttribArray(keyframeNormalHandle);
                GLES20.glDisableVertexAttribArray(keyframeTexCoordHandle);

                GLES20.glUseProgram(0);
            } else
            // In any other case, such as playing or paused, we render
            // the actual contents
            {
                float[] modelViewMatrixVideo = Tool.convertPose2GLMatrix(
                        trackableResult.getPose()).getData();
                float[] modelViewProjectionVideo = new float[16];
                // Matrix.translateM(modelViewMatrixVideo, 0, 0.0f, 0.0f,
                // targetPositiveDimensions[currentTarget].getData()[0]);

                // Here we use the aspect ratio of the video frame
                Matrix.scaleM(modelViewMatrixVideo, 0,
                        targetPositiveDimensions[currentTarget].getData()[0],
                        targetPositiveDimensions[currentTarget].getData()[0]
                                * videoQuadAspectRatio[currentTarget],
                        targetPositiveDimensions[currentTarget].getData()[0]);
                Matrix.multiplyMM(modelViewProjectionVideo, 0,
                        vuforiaAppSession.getProjectionMatrix().getData(), 0,
                        modelViewMatrixVideo, 0);

                GLES20.glUseProgram(videoPlaybackShaderID);

                // Prepare for rendering the keyframe
                GLES20.glVertexAttribPointer(videoPlaybackVertexHandle, 3,
                        GLES20.GL_FLOAT, false, 0, quadVertices);
                GLES20.glVertexAttribPointer(videoPlaybackNormalHandle, 3,
                        GLES20.GL_FLOAT, false, 0, quadNormals);

                if (imageTarget.getName().compareTo("progress_white") == 0 || imageTarget.getName().compareTo("progress_black") == 0)
                    GLES20.glVertexAttribPointer(videoPlaybackTexCoordHandle,
                            2, GLES20.GL_FLOAT, false, 0,
                            fillBuffer(videoQuadTextureCoordsTransformedStones));
                else
                    GLES20.glVertexAttribPointer(videoPlaybackTexCoordHandle,
                            2, GLES20.GL_FLOAT, false, 0,
                            fillBuffer(videoQuadTextureCoordsTransformedChips));

                GLES20.glEnableVertexAttribArray(videoPlaybackVertexHandle);
                GLES20.glEnableVertexAttribArray(videoPlaybackNormalHandle);
                GLES20.glEnableVertexAttribArray(videoPlaybackTexCoordHandle);

                GLES20.glActiveTexture(GLES20.GL_TEXTURE0);

                // IMPORTANT:
                // Notice here that the texture that we are binding is not the
                // typical GL_TEXTURE_2D but instead the GL_TEXTURE_EXTERNAL_OES
                GLES20.glBindTexture(GLES11Ext.GL_TEXTURE_EXTERNAL_OES,
                        videoPlaybackTextureID[currentTarget]);
                GLES20.glUniformMatrix4fv(videoPlaybackMVPMatrixHandle, 1,
                        false, modelViewProjectionVideo, 0);
                GLES20.glUniform1i(videoPlaybackTexSamplerOESHandle, 0);

                // Render
                GLES20.glDrawElements(GLES20.GL_TRIANGLES, NUM_QUAD_INDEX,
                        GLES20.GL_UNSIGNED_SHORT, quadIndices);

                GLES20.glDisableVertexAttribArray(videoPlaybackVertexHandle);
                GLES20.glDisableVertexAttribArray(videoPlaybackNormalHandle);
                GLES20.glDisableVertexAttribArray(videoPlaybackTexCoordHandle);

                GLES20.glUseProgram(0);

            }

            // The following section renders the icons. The actual textures used
            // are loaded from the assets folder

            if ((currentStatus[currentTarget] == VideoPlayerHelper.MEDIA_STATE.READY)
                    || (currentStatus[currentTarget] == VideoPlayerHelper.MEDIA_STATE.REACHED_END)
                    || (currentStatus[currentTarget] == VideoPlayerHelper.MEDIA_STATE.PAUSED)
                    || (currentStatus[currentTarget] == VideoPlayerHelper.MEDIA_STATE.NOT_READY)
                    || (currentStatus[currentTarget] == VideoPlayerHelper.MEDIA_STATE.ERROR))
            {
                // If the movie is ready to be played, pause, has reached end or
                // is not
                // ready then we display one of the icons
                float[] modelViewMatrixButton = Tool.convertPose2GLMatrix(
                        trackableResult.getPose()).getData();
                float[] modelViewProjectionButton = new float[16];

                GLES20.glDepthFunc(GLES20.GL_LEQUAL);

                GLES20.glEnable(GLES20.GL_BLEND);
                GLES20.glBlendFunc(GLES20.GL_SRC_ALPHA,
                        GLES20.GL_ONE_MINUS_SRC_ALPHA);

                // The inacuracy of the rendering process in some devices means
                // that
                // even if we use the "Less or Equal" version of the depth
                // function
                // it is likely that we will get ugly artifacts
                // That is the translation in the Z direction is slightly
                // different
                // Another posibility would be to use a depth func "ALWAYS" but
                // that is typically not a good idea
                Matrix
                        .translateM(
                                modelViewMatrixButton,
                                0,
                                0.0f,
                                0.0f,
                                targetPositiveDimensions[currentTarget].getData()[1] / 10.98f);
                Matrix
                        .scaleM(
                                modelViewMatrixButton,
                                0,
                                (targetPositiveDimensions[currentTarget].getData()[1] / 2.0f),
                                (targetPositiveDimensions[currentTarget].getData()[1] / 2.0f),
                                (targetPositiveDimensions[currentTarget].getData()[1] / 2.0f));
                Matrix.multiplyMM(modelViewProjectionButton, 0,
                        vuforiaAppSession.getProjectionMatrix().getData(), 0,
                        modelViewMatrixButton, 0);

                GLES20.glUseProgram(keyframeShaderID);

                GLES20.glVertexAttribPointer(keyframeVertexHandle, 3,
                        GLES20.GL_FLOAT, false, 0, quadVertices);
                GLES20.glVertexAttribPointer(keyframeNormalHandle, 3,
                        GLES20.GL_FLOAT, false, 0, quadNormals);
                GLES20.glVertexAttribPointer(keyframeTexCoordHandle, 2,
                        GLES20.GL_FLOAT, false, 0, quadTexCoords);

                GLES20.glEnableVertexAttribArray(keyframeVertexHandle);
                GLES20.glEnableVertexAttribArray(keyframeNormalHandle);
                GLES20.glEnableVertexAttribArray(keyframeTexCoordHandle);

                GLES20.glActiveTexture(GLES20.GL_TEXTURE0);

                // Depending on the status in which we are we choose the
                // appropriate
                // texture to display. Notice that unlike the video these are
                // regular
                // GL_TEXTURE_2D textures
                switch (currentStatus[currentTarget])
                {
                    case READY:
                        GLES20.glBindTexture(GLES20.GL_TEXTURE_2D,
                                mTextures.get(2 + targetOffset).mTextureID[0]);
                        break;
                    case REACHED_END:
                        GLES20.glBindTexture(GLES20.GL_TEXTURE_2D,
                                mTextures.get(2 +targetOffset).mTextureID[0]);
                        break;
                    case PAUSED:
                        GLES20.glBindTexture(GLES20.GL_TEXTURE_2D,
                                mTextures.get(2 + targetOffset).mTextureID[0]);
                        break;
                    case NOT_READY:
                        GLES20.glBindTexture(GLES20.GL_TEXTURE_2D,
                                mTextures.get(3 + targetOffset).mTextureID[0]);
                        break;
                    case ERROR:
                        GLES20.glBindTexture(GLES20.GL_TEXTURE_2D,
                                mTextures.get(4 + targetOffset).mTextureID[0]);
                        break;
                    default:
                        GLES20.glBindTexture(GLES20.GL_TEXTURE_2D,
                                mTextures.get(3 + targetOffset).mTextureID[0]);
                        break;
                }
                GLES20.glUniformMatrix4fv(keyframeMVPMatrixHandle, 1, false,
                        modelViewProjectionButton, 0);
                GLES20.glUniform1i(keyframeTexSampler2DHandle, 0);

                // Render
                GLES20.glDrawElements(GLES20.GL_TRIANGLES, NUM_QUAD_INDEX,
                        GLES20.GL_UNSIGNED_SHORT, quadIndices);

                GLES20.glDisableVertexAttribArray(keyframeVertexHandle);
                GLES20.glDisableVertexAttribArray(keyframeNormalHandle);
                GLES20.glDisableVertexAttribArray(keyframeTexCoordHandle);

                GLES20.glUseProgram(0);

                // Finally we return the depth func to its original state
                GLES20.glDepthFunc(GLES20.GL_LESS);
                GLES20.glDisable(GLES20.GL_BLEND);
            }

            SampleUtils.checkGLError("VideoDrawer renderFrame");
        }

        GLES20.glDisable(GLES20.GL_DEPTH_TEST);
    }


    public boolean onTap(float x, float y, SampleApplicationSession vuforiaAppSession){

        boolean isSingleTapHandled = false;
        for (int i = 0; i < NUM_TARGETS; i++)
        {
            // Verify that the tap happened inside the target
            if (isTapOnScreenInsideTarget(i, x, y, vuforiaAppSession))
            {
                // Check if it is playable on texture
                if (mVideoPlayerHelper[i].isPlayableOnTexture())
                {
                    // We can play only if the movie was paused, ready
                    // or stopped
                    if ((mVideoPlayerHelper[i].getStatus() == VideoPlayerHelper.MEDIA_STATE.PAUSED)
                            || (mVideoPlayerHelper[i].getStatus() == VideoPlayerHelper.MEDIA_STATE.READY)
                            || (mVideoPlayerHelper[i].getStatus() == VideoPlayerHelper.MEDIA_STATE.STOPPED)
                            || (mVideoPlayerHelper[i].getStatus() == VideoPlayerHelper.MEDIA_STATE.REACHED_END))
                    {
                        // Pause all other media
                        pauseAll(i);

                        // If it has reached the end then rewind
                        if ((mVideoPlayerHelper[i].getStatus() == VideoPlayerHelper.MEDIA_STATE.REACHED_END))
                            mSeekPosition[i] = 0;

                        mVideoPlayerHelper[i].play(mPlayFullscreenVideo,
                                mSeekPosition[i]);
                        mSeekPosition[i] = VideoPlayerHelper.CURRENT_POSITION;
                    } else if (mVideoPlayerHelper[i].getStatus() == VideoPlayerHelper.MEDIA_STATE.PLAYING)
                    {
                        // If it is playing then we pause it
                        mVideoPlayerHelper[i].pause();
                    }
                } else if (mVideoPlayerHelper[i].isPlayableFullscreen())
                {
                    // If it isn't playable on texture
                    // Either because it wasn't requested or because it
                    // isn't supported then request playback fullscreen.
                    mVideoPlayerHelper[i].play(true,
                            VideoPlayerHelper.CURRENT_POSITION);
                }

                isSingleTapHandled = true;

                // Even though multiple videos can be loaded only one
                // can be playing at any point in time. This break
                // prevents that, say, overlapping videos trigger
                // simultaneously playback.
                break;
            }
        }

        return isSingleTapHandled;
    }


    boolean isTapOnScreenInsideTarget(int target, float x, float y, SampleApplicationSession vuforiaAppSession)
    {
        // Here we calculate that the touch event is inside the target
        Vec3F intersection;
        // Vec3F lineStart = new Vec3F();
        // Vec3F lineEnd = new Vec3F();

        DisplayMetrics metrics = new DisplayMetrics();
        mParentActivity.getWindowManager().getDefaultDisplay().getMetrics(metrics);
        intersection = SampleMath.getPointToPlaneIntersection(SampleMath
                        .Matrix44FInverse(vuforiaAppSession.getProjectionMatrix()),
                modelViewMatrix[target], metrics.widthPixels, metrics.heightPixels,
                new Vec2F(x, y), new Vec3F(0, 0, 0), new Vec3F(0, 0, 1));

        // The target returns as pose the center of the trackable. The following
        // if-statement simply checks that the tap is within this range
        if ((intersection.getData()[0] >= -(targetPositiveDimensions[target]
                .getData()[0]))
                && (intersection.getData()[0] <= (targetPositiveDimensions[target]
                .getData()[0]))
                && (intersection.getData()[1] >= -(targetPositiveDimensions[target]
                .getData()[1]))
                && (intersection.getData()[1] <= (targetPositiveDimensions[target]
                .getData()[1])))
            return true;
        else
            return false;
    }


    void setStatus(int target, int value)
    {
        // Transform the value passed from java to our own values
        switch (value)
        {
            case 0:
                currentStatus[target] = VideoPlayerHelper.MEDIA_STATE.REACHED_END;
                break;
            case 1:
                currentStatus[target] = VideoPlayerHelper.MEDIA_STATE.PAUSED;
                break;
            case 2:
                currentStatus[target] = VideoPlayerHelper.MEDIA_STATE.STOPPED;
                break;
            case 3:
                currentStatus[target] = VideoPlayerHelper.MEDIA_STATE.PLAYING;
                break;
            case 4:
                currentStatus[target] = VideoPlayerHelper.MEDIA_STATE.READY;
                break;
            case 5:
                currentStatus[target] = VideoPlayerHelper.MEDIA_STATE.NOT_READY;
                break;
            case 6:
                currentStatus[target] = VideoPlayerHelper.MEDIA_STATE.ERROR;
                break;
            default:
                currentStatus[target] = VideoPlayerHelper.MEDIA_STATE.NOT_READY;
                break;
        }
    }

    void setVideoDimensions(int target, float videoWidth, float videoHeight,
                            float[] textureCoordMatrix)
    {
        // The quad originaly comes as a perfect square, however, the video
        // often has a different aspect ration such as 4:3 or 16:9,
        // To mitigate this we have two options:
        // 1) We can either scale the width (typically up)
        // 2) We can scale the height (typically down)
        // Which one to use is just a matter of preference. This example scales
        // the height down.
        // (see the render call in renderFrame)
        videoQuadAspectRatio[target] = videoHeight / videoWidth;

        float mtx[] = textureCoordMatrix;
        float tempUVMultRes[] = new float[2];

        if (target == 0)
        {
            tempUVMultRes = uvMultMat4f(
                    videoQuadTextureCoordsTransformedStones[0],
                    videoQuadTextureCoordsTransformedStones[1],
                    videoQuadTextureCoords[0], videoQuadTextureCoords[1], mtx);
            videoQuadTextureCoordsTransformedStones[0] = tempUVMultRes[0];
            videoQuadTextureCoordsTransformedStones[1] = tempUVMultRes[1];
            tempUVMultRes = uvMultMat4f(
                    videoQuadTextureCoordsTransformedStones[2],
                    videoQuadTextureCoordsTransformedStones[3],
                    videoQuadTextureCoords[2], videoQuadTextureCoords[3], mtx);
            videoQuadTextureCoordsTransformedStones[2] = tempUVMultRes[0];
            videoQuadTextureCoordsTransformedStones[3] = tempUVMultRes[1];
            tempUVMultRes = uvMultMat4f(
                    videoQuadTextureCoordsTransformedStones[4],
                    videoQuadTextureCoordsTransformedStones[5],
                    videoQuadTextureCoords[4], videoQuadTextureCoords[5], mtx);
            videoQuadTextureCoordsTransformedStones[4] = tempUVMultRes[0];
            videoQuadTextureCoordsTransformedStones[5] = tempUVMultRes[1];
            tempUVMultRes = uvMultMat4f(
                    videoQuadTextureCoordsTransformedStones[6],
                    videoQuadTextureCoordsTransformedStones[7],
                    videoQuadTextureCoords[6], videoQuadTextureCoords[7], mtx);
            videoQuadTextureCoordsTransformedStones[6] = tempUVMultRes[0];
            videoQuadTextureCoordsTransformedStones[7] = tempUVMultRes[1];
        }
        // textureCoordMatrix = mtx;
    }


    // Multiply the UV coordinates by the given transformation matrix
    float[] uvMultMat4f(float transformedU, float transformedV, float u,
                        float v, float[] pMat)
    {
        float x = pMat[0] * u + pMat[4] * v /* + pMat[ 8]*0.f */+ pMat[12]
                * 1.f;
        float y = pMat[1] * u + pMat[5] * v /* + pMat[ 9]*0.f */+ pMat[13]
                * 1.f;
        // float z = pMat[2]*u + pMat[6]*v + pMat[10]*0.f + pMat[14]*1.f; // We
        // dont need z and w so we comment them out
        // float w = pMat[3]*u + pMat[7]*v + pMat[11]*0.f + pMat[15]*1.f;

        float result[] = new float[2];
        // transformedU = x;
        // transformedV = y;
        result[0] = x;
        result[1] = y;
        return result;
    }
    // =================== PRIVATE ================


    private Buffer fillBuffer(double[] array)
    {
        // Convert to floats because OpenGL doesnt work on doubles, and manually
        // casting each input value would take too much time.
        ByteBuffer bb = ByteBuffer.allocateDirect(4 * array.length); // each
        // float
        // takes 4
        // bytes
        bb.order(ByteOrder.LITTLE_ENDIAN);
        for (double d : array)
            bb.putFloat((float) d);
        bb.rewind();

        return bb;

    }


    private Buffer fillBuffer(short[] array)
    {
        ByteBuffer bb = ByteBuffer.allocateDirect(2 * array.length); // each
        // short
        // takes 2
        // bytes
        bb.order(ByteOrder.LITTLE_ENDIAN);
        for (short s : array)
            bb.putShort(s);
        bb.rewind();

        return bb;

    }


    private Buffer fillBuffer(float[] array)
    {
        // Convert to floats because OpenGL doesnt work on doubles, and manually
        // casting each input value would take too much time.
        ByteBuffer bb = ByteBuffer.allocateDirect(4 * array.length); // each
        // float
        // takes 4
        // bytes
        bb.order(ByteOrder.LITTLE_ENDIAN);
        for (float d : array)
            bb.putFloat(d);
        bb.rewind();

        return bb;

    }


}
