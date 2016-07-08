/*===============================================================================
Copyright (c) 2016 PTC Inc. All Rights Reserved.

Copyright (c) 2012-2014 Qualcomm Connected Experiences, Inc. All Rights Reserved.

Vuforia is a trademark of PTC Inc., registered in the United States and other 
countries.
===============================================================================*/

package com.vuforia.samples.VuforiaSamples.app.VirtualButtons;

import android.opengl.GLES20;
import android.opengl.GLSurfaceView;
import android.opengl.Matrix;
import android.util.Log;

import com.vuforia.ImageTargetResult;
import com.vuforia.Renderer;
import com.vuforia.State;
import com.vuforia.Tool;
import com.vuforia.TrackableResult;
import com.vuforia.VIDEO_BACKGROUND_REFLECTION;
import com.vuforia.Vuforia;
import com.vuforia.samples.SampleApplication.SampleApplicationSession;
import com.vuforia.samples.SampleApplication.utils.Texture;
import com.vuforia.samples.VuforiaSamples.app.VirtualButtons.video.VideoDrawer;

import java.util.Vector;

import javax.microedition.khronos.egl.EGLConfig;
import javax.microedition.khronos.opengles.GL10;


public class VirtualButtonRenderer implements GLSurfaceView.Renderer
{
    private static final String LOGTAG = "VirtualButtonRenderer";
    public static final String CURRENT_TARGET = "CURRENT_TARGET";

    private SampleApplicationSession vuforiaAppSession;
    
    public boolean mIsActive = false;
    
    private VirtualButtons mActivity;
    
    private Vector<Texture> mTextures;

    TextureDrawer textureDrawer = null;

    public static int currentTarget = 0;

    AgendaDrawer agendaDrawer = null;
    AgendaDrawer strDrawer = null;

    private VideoDrawer vDraw;


    public VirtualButtonRenderer(VirtualButtons activity,
        SampleApplicationSession session)
    {
        mActivity = activity;
        vuforiaAppSession = session;
    }
    
    
    // Called when the surface is created or recreated.
    @Override
    public void onSurfaceCreated(GL10 gl, EGLConfig config)
    {
        Log.d(LOGTAG, "GLRenderer.onSurfaceCreated");
        
        // Call function to initialize rendering:
        initRendering();
        
        // Call Vuforia function to (re)initialize rendering after first use
        // or after OpenGL ES context was lost (e.g. after onPause/onResume):
        vuforiaAppSession.onSurfaceCreated();

        vDraw.onSurfaceCreated();
    }
    
    
    // Called when the surface changed size.
    @Override
    public void onSurfaceChanged(GL10 gl, int width, int height)
    {
        Log.d(LOGTAG, "GLRenderer.onSurfaceChanged");
        
        // Call Vuforia function to handle render surface size changes:
        vuforiaAppSession.onSurfaceChanged(width, height);

        if(mActivity.isVideo())
            vDraw.onSurfaceChanged();

    }
    
    
    // Called to draw the current frame.
    @Override
    public void onDrawFrame(GL10 gl)
    {
        if (!mIsActive)
            return;

        if(mActivity.isVideo()){
            vDraw.onDrawFrame();
        }
        // Call our function to render content
        renderFrame();

        if(mActivity.isVideo()){
            vDraw.onDrawFrameAfter();
        }
    }
    
    
    private void initRendering()
    {
        Log.d(LOGTAG, "VirtualButtonsRenderer.initRendering");
        
        // Define clear color
        GLES20.glClearColor(0.0f, 0.0f, 0.0f, Vuforia.requiresAlpha() ? 0.0f
            : 1.0f);
        
        // Now generate the OpenGL texture objects and add settings
        for (Texture t : mTextures)
        {
            GLES20.glGenTextures(1, t.mTextureID, 0);
            GLES20.glBindTexture(GLES20.GL_TEXTURE_2D, t.mTextureID[0]);
            GLES20.glTexParameterf(GLES20.GL_TEXTURE_2D,
                GLES20.GL_TEXTURE_MIN_FILTER, GLES20.GL_LINEAR);
            GLES20.glTexParameterf(GLES20.GL_TEXTURE_2D,
                GLES20.GL_TEXTURE_MAG_FILTER, GLES20.GL_LINEAR);
            GLES20.glTexImage2D(GLES20.GL_TEXTURE_2D, 0, GLES20.GL_RGBA,
                t.mWidth, t.mHeight, 0, GLES20.GL_RGBA,
                GLES20.GL_UNSIGNED_BYTE, t.mData);
        }

        // Now we create the texture for the video data from the movie
        // IMPORTANT:
        // Notice that the textures are not typical GL_TEXTURE_2D textures
        // but instead are GL_TEXTURE_EXTERNAL_OES extension textures
        // This is required by the Android SurfaceTexture

//        rectArr = new RectangleArr();
        vDraw.initRendering();

        textureDrawer = new TextureDrawer(mTextures);
        agendaDrawer = new AgendaDrawer(mTextures, 4);
        strDrawer = new AgendaDrawer(mTextures, 5);
    }
    
    
    private void renderFrame()
    {
        // Clear color and depth buffer
        GLES20.glClear(GLES20.GL_COLOR_BUFFER_BIT | GLES20.GL_DEPTH_BUFFER_BIT);
        
        // Get the state from Vuforia and mark the beginning of a rendering
        // section
        State state = Renderer.getInstance().begin();
        
        // Explicitly render the Video Background
        Renderer.getInstance().drawVideoBackground();
        
        GLES20.glEnable(GLES20.GL_DEPTH_TEST);
        
        // We must detect if background reflection is active and adjust the
        // culling direction.
        // If the reflection is active, this means the post matrix has been
        // reflected as well,
        // therefore counter standard clockwise face culling will result in
        // "inside out" models.
        GLES20.glEnable(GLES20.GL_CULL_FACE);
        GLES20.glCullFace(GLES20.GL_BACK);
        if (Renderer.getInstance().getVideoBackgroundConfig().getReflection() == VIDEO_BACKGROUND_REFLECTION.VIDEO_BACKGROUND_REFLECTION_ON)
            GLES20.glFrontFace(GLES20.GL_CW); // Front camera
        else
            GLES20.glFrontFace(GLES20.GL_CCW); // Back camera

        // Set the viewport
        int[] viewport = vuforiaAppSession.getViewport();
        GLES20.glViewport(viewport[0], viewport[1], viewport[2], viewport[3]);

        // Did we find any trackables this frame?
        if (state.getNumTrackableResults() > 0)
        {
            // Get the trackable:
            TrackableResult trackableResult = state.getTrackableResult(0);
            float[] modelViewMatrix = Tool.convertPose2GLMatrix(trackableResult.getPose()).getData();
            
            // The image target specific result:
            assert (trackableResult.getType() == ImageTargetResult.getClassType());
            ImageTargetResult imageTargetResult = (ImageTargetResult) trackableResult;

            // Set transformations:
            float[] modelViewProjection = new float[16];
            Matrix.multiplyMM(modelViewProjection, 0, vuforiaAppSession.getProjectionMatrix().getData(), 0, modelViewMatrix, 0);


            // Set the texture used for the teapot model:
//            int textureIndex = 0;


//            rectArr.draw(modelViewProjection, imageTargetResult);

            if(currentTarget<4)
                textureDrawer.draw(trackableResult, vuforiaAppSession);
            else if(currentTarget==4)
                agendaDrawer.draw(trackableResult, vuforiaAppSession);
            else if(currentTarget == 5 || currentTarget == 6) {
                vDraw.draw(vuforiaAppSession, state);
            } else if (currentTarget ==7){
                strDrawer.draw(trackableResult, vuforiaAppSession);
            } else {
                textureDrawer.draw(trackableResult, vuforiaAppSession);
            }

            
            // Assumptions:
//            assert (textureIndex < mTextures.size());
//            Texture thisTexture = mTextures.get(textureIndex);
            
            // Scale 3D model
//            float[] modelViewScaled = modelViewMatrix;
//            Matrix.scaleM(modelViewScaled, 0, kTeapotScale, kTeapotScale,
//                kTeapotScale);
//
//            float[] modelViewProjectionScaled = new float[16];
//            Matrix.multiplyMM(modelViewProjectionScaled, 0, vuforiaAppSession
//                .getProjectionMatrix().getData(), 0, modelViewScaled, 0);
//
//            // Render 3D model
//            GLES20.glUseProgram(shaderProgramID);
            
//            GLES20.glVertexAttribPointer(vertexHandle, 3, GLES20.GL_FLOAT,
//                false, 0, mTeapot.getVertices());
//            GLES20.glVertexAttribPointer(normalHandle, 3, GLES20.GL_FLOAT,
//                false, 0, mTeapot.getNormals());
//            GLES20.glVertexAttribPointer(textureCoordHandle, 2,
//                GLES20.GL_FLOAT, false, 0, mTeapot.getTexCoords());
            
//            GLES20.glEnableVertexAttribArray(vertexHandle);
//            GLES20.glEnableVertexAttribArray(normalHandle);
//            GLES20.glEnableVertexAttribArray(textureCoordHandle);
//
//            GLES20.glActiveTexture(GLES20.GL_TEXTURE0);
//            GLES20.glBindTexture(GLES20.GL_TEXTURE_2D,
//                thisTexture.mTextureID[0]);
//            GLES20.glUniformMatrix4fv(mvpMatrixHandle, 1, false,
//                modelViewProjectionScaled, 0);
//            GLES20.glUniform1i(texSampler2DHandle, 0);
//            GLES20.glDrawElements(GLES20.GL_TRIANGLES,
//                mTeapot.getNumObjectIndex(), GLES20.GL_UNSIGNED_SHORT,
//                mTeapot.getIndices());
            
//            GLES20.glDisableVertexAttribArray(vertexHandle);
//            GLES20.glDisableVertexAttribArray(normalHandle);
//            GLES20.glDisableVertexAttribArray(textureCoordHandle);
            
//            SampleUtils.checkGLError("VirtualButtons renderFrame");
            
        }
        
        GLES20.glDisable(GLES20.GL_DEPTH_TEST);
        
        Renderer.getInstance().end();
        
    }


    boolean isTapOnScreenInsideTarget(float x, float y)
    {
        if (currentTarget < 4) {
            boolean ishandled = false;
            for (int i = 0; i < TextureDrawer.NUM_TARGETS; i++) {
                ishandled = textureDrawer.isTap(vuforiaAppSession, mActivity, i, y, x);
                if(ishandled == true){
                    break;
                }
            }
            Log.d(LOGTAG, "Button detected : " + ishandled);
            return ishandled;
        } else if(currentTarget == 4) {

        } else if(mActivity.isVideo()){
            vDraw.onTap(x, y, vuforiaAppSession);
        }

        return false;
    }
    
    

    public void setTextures(Vector<Texture> textures)
    {
        mTextures = textures;
        
    }

    public void setVDraw(VideoDrawer VDraw) {
        this.vDraw = VDraw;
    }
}
