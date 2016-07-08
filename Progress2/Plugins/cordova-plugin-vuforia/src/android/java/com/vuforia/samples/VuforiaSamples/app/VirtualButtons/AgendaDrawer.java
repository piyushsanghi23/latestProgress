package com.vuforia.samples.VuforiaSamples.app.VirtualButtons;

import android.opengl.GLES20;
import android.opengl.Matrix;

import com.vuforia.ImageTarget;
import com.vuforia.Tool;
import com.vuforia.TrackableResult;
import com.vuforia.samples.SampleApplication.SampleApplicationSession;
import com.vuforia.samples.SampleApplication.utils.Texture;

import java.util.Vector;

/**
 * Created by dsingh on 7/6/2016.
 */
public class AgendaDrawer extends TextureDrawer {

    int textureID = 4;
    
    public AgendaDrawer(Vector<Texture> textures, int textureID) {
        super(textures);
        this.textureID = textureID;
    }

    public void draw(TrackableResult trackableResult, SampleApplicationSession vuforiaAppSession){


        float temp[] = { 0.0f, 0.0f, 0.0f };
        for (int i = 0; i < NUM_TARGETS; i++)
        {
            targetPositiveDimensions[0].setData(temp);
        }

        ImageTarget imageTarget = (ImageTarget) trackableResult.getTrackable();


        int currentTarget = 0;
        targetPositiveDimensions[currentTarget] = imageTarget.getSize();
            modelViewMatrix[0] = Tool.convertPose2GLMatrix(trackableResult.getPose());

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

        float ratio = 1.0f;
        if (mTextures.get(0).mSuccess)
            ratio = keyframeQuadAspectRatio[currentTarget];
        else
            ratio = targetPositiveDimensions[currentTarget].getData()[1]
                    / targetPositiveDimensions[currentTarget].getData()[0];

//            int offsetBase = currentTarget*3;
//            Matrix.translateM(modelViewMatrixKeyframe, 0, offsets[offsetBase], offsets[offsetBase + 1], offsets[offsetBase + 2]);

//            modelViewMatrix[currentTarget].setData(modelViewMatrixKeyframe);

            Matrix.scaleM(modelViewMatrixKeyframe, 0, targetPositiveDimensions[currentTarget].getData()[0], targetPositiveDimensions[currentTarget].getData()[0] * ratio, 1.0f);
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
            GLES20.glBindTexture(GLES20.GL_TEXTURE_2D, mTextures.get(textureID).mTextureID[0]);
            GLES20.glUniformMatrix4fv(keyframeMVPMatrixHandle, 1, false, modelViewProjectionKeyframe, 0);
            GLES20.glUniform1i(keyframeTexSampler2DHandle, 0);

            // Render
            GLES20.glDrawElements(GLES20.GL_TRIANGLES, NUM_QUAD_INDEX, GLES20.GL_UNSIGNED_SHORT, quadIndices);


            GLES20.glDisableVertexAttribArray(keyframeVertexHandle);
            GLES20.glDisableVertexAttribArray(keyframeNormalHandle);
            GLES20.glDisableVertexAttribArray(keyframeTexCoordHandle);

            GLES20.glUseProgram(0);



        // Finally we return the depth func to its original state
        GLES20.glDepthFunc(GLES20.GL_LESS);
        GLES20.glDisable(GLES20.GL_BLEND);

    }
}
