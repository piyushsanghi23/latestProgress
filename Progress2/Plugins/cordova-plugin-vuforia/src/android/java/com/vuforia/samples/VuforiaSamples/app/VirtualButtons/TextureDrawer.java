package com.vuforia.samples.VuforiaSamples.app.VirtualButtons;

import android.app.Activity;
import android.opengl.GLES20;
import android.opengl.Matrix;
import android.util.DisplayMetrics;
import android.util.Log;

import com.vuforia.ImageTarget;
import com.vuforia.Matrix44F;
import com.vuforia.Rectangle;
import com.vuforia.Renderer;
import com.vuforia.Tool;
import com.vuforia.TrackableResult;
import com.vuforia.Vec2F;
import com.vuforia.Vec3F;
import com.vuforia.VirtualButton;
import com.vuforia.samples.SampleApplication.SampleApplicationSession;
import com.vuforia.samples.SampleApplication.utils.SampleMath;
import com.vuforia.samples.SampleApplication.utils.SampleUtils;
import com.vuforia.samples.SampleApplication.utils.Texture;

import java.nio.Buffer;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.Vector;

/**
 * Created by dsingh on 7/5/2016.
 */
public class TextureDrawer {

    private static final String LOGTAG = "TextureDrawer";

    public static final int NUM_TARGETS = 4;
    protected int keyframeShaderID = 0;
    protected int keyframeVertexHandle = 0;
    protected int keyframeNormalHandle = 0;
    protected int keyframeTexCoordHandle = 0;
    protected int keyframeMVPMatrixHandle = 0;
    protected int keyframeTexSampler2DHandle = 0;

    protected double quadVerticesArray[] = { -1.0f, -1.0f, 0.0f, 1.0f, -1.0f, 0.0f, 1.0f,
            1.0f, 0.0f, -1.0f, 1.0f, 0.0f };

    protected double quadTexCoordsArray[] = { 0.0f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f, 0.0f,
            1.0f };

    protected double quadNormalsArray[] = { 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, };

    protected short quadIndicesArray[] = { 0, 1, 2, 0, 2, 3 };

    protected float imageSize = 12.0f;

    protected float verticalShift = -7.0f;

    protected float[] offsets = {-1 * imageSize, verticalShift, 0.0f, imageSize, verticalShift, 0.0f, imageSize, (-2 * imageSize) + verticalShift, 0.0f, -1 * imageSize, (-2 * imageSize) + verticalShift, 0.0f};

    // These hold the aspect ratio of both the video and the
    // keyframe
    protected float keyframeQuadAspectRatio[] = new float[NUM_TARGETS];

    protected Buffer quadVertices, quadTexCoords, quadIndices, quadNormals;
    protected Vector<Texture> mTextures;

    // Needed to calculate whether a screen tap is inside the target
    protected Matrix44F modelViewMatrix[] = new Matrix44F[NUM_TARGETS];


    // Trackable dimensions
    protected Vec3F targetPositiveDimensions[] = new Vec3F[NUM_TARGETS];

    protected static int NUM_QUAD_INDEX = 6;

    public TextureDrawer(Vector<Texture> textures){
        mTextures = textures;
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

        for (int i = 0; i < NUM_TARGETS; i++)
            targetPositiveDimensions[i] = new Vec3F();


        keyframeQuadAspectRatio[0] = (float) mTextures.get(0).mHeight / (float) mTextures.get(0).mWidth;

        quadVertices = fillBuffer(quadVerticesArray);
        quadTexCoords = fillBuffer(quadTexCoordsArray);
        quadIndices = fillBuffer(quadIndicesArray);
        quadNormals = fillBuffer(quadNormalsArray);

        for (int i = 0; i < NUM_TARGETS; i++)
            modelViewMatrix[i] = new Matrix44F();
    }


    public void draw(TrackableResult trackableResult, SampleApplicationSession vuforiaAppSession){


        float temp[] = { 0.0f, 0.0f, 0.0f };
        for (int i = 0; i < NUM_TARGETS; i++)
        {
            targetPositiveDimensions[i].setData(temp); // why is this in loop?
        }

        ImageTarget imageTarget = (ImageTarget) trackableResult.getTrackable();


        for(int currentTarget=0; currentTarget< NUM_TARGETS ; currentTarget++){
            targetPositiveDimensions[currentTarget] = imageTarget.getSize();
            modelViewMatrix[currentTarget] = Tool.convertPose2GLMatrix(trackableResult.getPose()); // why always setting it for zero?

            // The pose delivers the center of the target, thus the dimensions
            // go from -width/2 to width/2, same for height
            temp[0] = (targetPositiveDimensions[currentTarget].getData()[0] / 2.0f) ;
            temp[1] = targetPositiveDimensions[currentTarget].getData()[1] / 2.0f;

            targetPositiveDimensions[currentTarget].setData(temp);

            float[] modelViewMatrixKeyframe = Tool.convertPose2GLMatrix(trackableResult.getPose()).getData();
            float[] modelViewProjectionKeyframe = new float[16];
            // Matrix.translateM(modelViewMatrixKeyframe, 0, 0.0f, 0.0f,
            // targetPositiveDimensions[currentTarget].getData()[0]);

            // Here we use the aspect ratio of the keyframe since it
            // is likely that it is not a perfect square

//        float ratio = 1.0f;
//        if (mTextures.get(0).mSuccess)
//            ratio = keyframeQuadAspectRatio[currentTarget];
//        else
//            ratio = targetPositiveDimensions[currentTarget].getData()[1]
//                    / targetPositiveDimensions[currentTarget].getData()[0];

            int offsetBase = currentTarget*3;
            Matrix.translateM(modelViewMatrixKeyframe, 0, offsets[offsetBase], offsets[offsetBase + 1], offsets[offsetBase + 2] );

            modelViewMatrix[currentTarget].setData(modelViewMatrixKeyframe);

            Matrix.scaleM(modelViewMatrixKeyframe, 0, imageSize, imageSize, 1.0f);
            Matrix.multiplyMM(modelViewProjectionKeyframe, 0, vuforiaAppSession.getProjectionMatrix().getData(), 0, modelViewMatrixKeyframe, 0);


//        modelViewMatrix[0].setData(modelViewProjectionKeyframe);

            GLES20.glUseProgram(keyframeShaderID);

            // Prepare for rendering the keyframe
            GLES20.glVertexAttribPointer(keyframeVertexHandle, 3, GLES20.GL_FLOAT, false, 0, quadVertices);
            GLES20.glVertexAttribPointer(keyframeNormalHandle, 3, GLES20.GL_FLOAT, false, 0, quadNormals);
            GLES20.glVertexAttribPointer(keyframeTexCoordHandle, 2, GLES20.GL_FLOAT, false, 0, quadTexCoords);

            GLES20.glEnableVertexAttribArray(keyframeVertexHandle);
            GLES20.glEnableVertexAttribArray(keyframeNormalHandle);
            GLES20.glEnableVertexAttribArray(keyframeTexCoordHandle);

            GLES20.glActiveTexture(GLES20.GL_TEXTURE0);

            // The first loaded texture from the assets folder is the
            // keyframe
            GLES20.glBindTexture(GLES20.GL_TEXTURE_2D, mTextures.get(currentTarget).mTextureID[0]);
            GLES20.glUniformMatrix4fv(keyframeMVPMatrixHandle, 1, false, modelViewProjectionKeyframe, 0);
            GLES20.glUniform1i(keyframeTexSampler2DHandle, 0);

            // Render
            GLES20.glDrawElements(GLES20.GL_TRIANGLES, NUM_QUAD_INDEX, GLES20.GL_UNSIGNED_SHORT, quadIndices);


            GLES20.glDisableVertexAttribArray(keyframeVertexHandle);
            GLES20.glDisableVertexAttribArray(keyframeNormalHandle);
            GLES20.glDisableVertexAttribArray(keyframeTexCoordHandle);

            GLES20.glUseProgram(0);


        }

        // Finally we return the depth func to its original state
        GLES20.glDepthFunc(GLES20.GL_LESS);
        GLES20.glDisable(GLES20.GL_BLEND);

    }

    public Vec3F[] getTargetPositiveDimensions() {
        return targetPositiveDimensions;
    }

    public Matrix44F getModelViewMatrix(int target){
        return modelViewMatrix[target];
    }

    public float[] getTargetPositionOffsets(int target) {
        float[] targetOffsets = {offsets[target * 3], offsets[target * 3 + 1], offsets[target * 3 + 2]};
        return targetOffsets;
    }

//    protected int[] actionArray = {0,4,};

    public boolean isTap(SampleApplicationSession vuforiaAppSession, Activity mActivity, int target, float y, float x){
        // Here we calculate that the touch event is inside the target
        Vec3F intersection;
        // Vec3F lineStart = new Vec3F();
        // Vec3F lineEnd = new Vec3F();

        DisplayMetrics metrics = new DisplayMetrics();
        mActivity.getWindowManager().getDefaultDisplay().getMetrics(metrics);
        intersection = SampleMath.getPointToPlaneIntersection(SampleMath.Matrix44FInverse(vuforiaAppSession.getProjectionMatrix()),
                getModelViewMatrix(target), metrics.widthPixels, metrics.heightPixels,
                new Vec2F(x, y), new Vec3F(0, 0, 0), new Vec3F(0, 0, 1));

        // The target returns as pose the center of the trackable. The following
        // if-statement simply checks that the tap is within this range
        Vec3F[] targetPositiveDimensions = getTargetPositiveDimensions();
        float[] targetPositionOffsets = getTargetPositionOffsets(target);

        if(target>1){
            if ((intersection.getData()[0] >= ( targetPositionOffsets[0] - 12 ))
                    && (intersection.getData()[0] <= ( targetPositionOffsets[0] + 12))){
                VirtualButtonRenderer.currentTarget = target + 4;
                Log.d(LOGTAG, "Target hit :: " + target);
                Log.d(LOGTAG, "Current Target updated to :: " + VirtualButtonRenderer.currentTarget);
                return true;
            } else
                return false;
        }

        if ((intersection.getData()[0] >= ( targetPositionOffsets[0] - 12 ))
                && (intersection.getData()[0] <= ( targetPositionOffsets[0] + 12))
                && (intersection.getData()[1] >= (targetPositionOffsets[1] - 12))
                && (intersection.getData()[1] <= (targetPositionOffsets[1] + 12))){

            VirtualButtonRenderer.currentTarget = target + 4;
            Log.d(LOGTAG, "Target hit :: " + target);
            Log.d(LOGTAG, "Current Target updated to :: " + VirtualButtonRenderer.currentTarget);
            return true;
        }
        else {
            return false;
        }
            
    }


    //==============================================
    protected Buffer fillBuffer(double[] array)
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


    protected Buffer fillBuffer(short[] array)
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


    protected Buffer fillBuffer(float[] array)
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
