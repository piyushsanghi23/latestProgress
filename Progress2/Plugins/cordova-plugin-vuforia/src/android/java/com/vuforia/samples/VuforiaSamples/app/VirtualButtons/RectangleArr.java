package com.vuforia.samples.VuforiaSamples.app.VirtualButtons;

import android.opengl.GLES20;

import com.vuforia.ImageTargetResult;
import com.vuforia.Rectangle;
import com.vuforia.samples.SampleApplication.utils.CubeShaders;
import com.vuforia.samples.SampleApplication.utils.LineShaders;
import com.vuforia.samples.SampleApplication.utils.SampleUtils;

import java.nio.Buffer;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;

/**
 * Created by dsingh on 7/5/2016.
 */
public class RectangleArr {

    private Rectangle vbRectangle[] = null;
    float vbVertices[] = new float[4 * 24];

    private int shaderProgramID = 0;
    private int vertexHandle = 0;
    private int normalHandle = 0;
    private int textureCoordHandle = 0;
    private int mvpMatrixHandle = 0;
    private int texSampler2DHandle = 0;

    // OpenGL ES 2.0 specific (3D model):
    private int lineOpacityHandle = 0;
    private int lineColorHandle = 0;
    private int mvpMatrixButtonsHandle = 0;

    // OpenGL ES 2.0 specific (Virtual Buttons):
    private int vbShaderProgramID = 0;
    private int vbVertexHandle = 0;


    public RectangleArr(){
        vbRectangle = new Rectangle[4];
        vbRectangle[0] = new Rectangle(-28.0f, 0.0f, -15.0f,
                -10.0f);
        vbRectangle[1] = new Rectangle(-14.0f, 0.0f, -1.0f,
                -10.0f);
        vbRectangle[2] = new Rectangle(0.0f, 0.0f, 13.0f, -10.0f);
        vbRectangle[3] = new Rectangle(14.0f, 0.0f, 27.0f,
                -10.0f);

        shaderProgramID = SampleUtils.createProgramFromShaderSrc(
                CubeShaders.CUBE_MESH_VERTEX_SHADER,
                CubeShaders.CUBE_MESH_FRAGMENT_SHADER);

        vertexHandle = GLES20.glGetAttribLocation(shaderProgramID,
                "vertexPosition");
        normalHandle = GLES20.glGetAttribLocation(shaderProgramID,
                "vertexNormal");
        textureCoordHandle = GLES20.glGetAttribLocation(shaderProgramID,
                "vertexTexCoord");
        mvpMatrixHandle = GLES20.glGetUniformLocation(shaderProgramID,
                "modelViewProjectionMatrix");
        texSampler2DHandle = GLES20.glGetUniformLocation(shaderProgramID,
                "texSampler2D");

        // OpenGL setup for Virtual Buttons
        vbShaderProgramID = SampleUtils.createProgramFromShaderSrc(
                LineShaders.LINE_VERTEX_SHADER, LineShaders.LINE_FRAGMENT_SHADER);

        mvpMatrixButtonsHandle = GLES20.glGetUniformLocation(vbShaderProgramID,
                "modelViewProjectionMatrix");
        vbVertexHandle = GLES20.glGetAttribLocation(vbShaderProgramID,
                "vertexPosition");
        lineOpacityHandle = GLES20.glGetUniformLocation(vbShaderProgramID,
                "opacity");
        lineColorHandle = GLES20.glGetUniformLocation(vbShaderProgramID,
                "color");

    }

    public void draw(float[] modelViewProjection, ImageTargetResult imageTargetResult){

        short vbCounter = 0;

        // Iterate through this targets virtual buttons:
        for (int i = 0; i < 4; i++)
        {
            // We add the vertices to a common array in order to have one
            // single
            // draw call. This is more efficient than having multiple
            // glDrawArray calls
            vbVertices[vbCounter] = vbRectangle[i].getLeftTopX();
            vbVertices[vbCounter + 1] = vbRectangle[i]
                    .getLeftTopY();
            vbVertices[vbCounter + 2] = 0.0f;
            vbVertices[vbCounter + 3] = vbRectangle[i]
                    .getRightBottomX();
            vbVertices[vbCounter + 4] = vbRectangle[i]
                    .getLeftTopY();
            vbVertices[vbCounter + 5] = 0.0f;
            vbVertices[vbCounter + 6] = vbRectangle[i]
                    .getRightBottomX();
            vbVertices[vbCounter + 7] = vbRectangle[i]
                    .getLeftTopY();
            vbVertices[vbCounter + 8] = 0.0f;
            vbVertices[vbCounter + 9] = vbRectangle[i]
                    .getRightBottomX();
            vbVertices[vbCounter + 10] = vbRectangle[i]
                    .getRightBottomY();
            vbVertices[vbCounter + 11] = 0.0f;
            vbVertices[vbCounter + 12] = vbRectangle[i]
                    .getRightBottomX();
            vbVertices[vbCounter + 13] = vbRectangle[i]
                    .getRightBottomY();
            vbVertices[vbCounter + 14] = 0.0f;
            vbVertices[vbCounter + 15] = vbRectangle[i]
                    .getLeftTopX();
            vbVertices[vbCounter + 16] = vbRectangle[i]
                    .getRightBottomY();
            vbVertices[vbCounter + 17] = 0.0f;
            vbVertices[vbCounter + 18] = vbRectangle[i]
                    .getLeftTopX();
            vbVertices[vbCounter + 19] = vbRectangle[i]
                    .getRightBottomY();
            vbVertices[vbCounter + 20] = 0.0f;
            vbVertices[vbCounter + 21] = vbRectangle[i]
                    .getLeftTopX();
            vbVertices[vbCounter + 22] = vbRectangle[i]
                    .getLeftTopY();
            vbVertices[vbCounter + 23] = 0.0f;
            vbCounter += 24;
        }



        // We only render if there is something on the array
        if (vbCounter > 0)
        {
            // Render frame around button
            GLES20.glUseProgram(vbShaderProgramID);

            GLES20.glVertexAttribPointer(vbVertexHandle, 3,
                    GLES20.GL_FLOAT, false, 0, fillBuffer(vbVertices));

            GLES20.glEnableVertexAttribArray(vbVertexHandle);

            GLES20.glUniform1f(lineOpacityHandle, 1.0f);
            GLES20.glUniform3f(lineColorHandle, 1.0f, 1.0f, 1.0f);

            GLES20.glUniformMatrix4fv(mvpMatrixButtonsHandle, 1, false,
                    modelViewProjection, 0);

            // We multiply by 8 because that's the number of vertices per
            // button
            // The reason is that GL_LINES considers only pairs. So some
            // vertices
            // must be repeated.
            GLES20.glDrawArrays(GLES20.GL_LINES, 0,
                    imageTargetResult.getNumVirtualButtons() * 8);

            SampleUtils.checkGLError("VirtualButtons drawButton");

            GLES20.glDisableVertexAttribArray(vbVertexHandle);
        }
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
