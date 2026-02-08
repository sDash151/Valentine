import { NextRequest, NextResponse } from 'next/server';
import { uploadImage, uploadVideo, uploadAudio } from '@/lib/cloudinary';

// Increase timeout for large file uploads (5 minutes)
export const maxDuration = 300; // 5 minutes in seconds
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'image', 'video', or 'audio'

    console.log('Upload request received:', { 
      fileName: file?.name, 
      type, 
      fileSize: file?.size,
      fileType: file?.type 
    });

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Auto-detect type from file if not provided
    let uploadType = type;
    if (!uploadType) {
      if (file.type.startsWith('image/')) {
        uploadType = 'image';
      } else if (file.type.startsWith('video/')) {
        uploadType = 'video';
      } else if (file.type.startsWith('audio/')) {
        uploadType = 'audio';
      } else {
        return NextResponse.json(
          { error: `Cannot determine file type from: ${file.type}` },
          { status: 400 }
        );
      }
      console.log('Auto-detected type:', uploadType);
    }

    let url: string;

    try {
      switch (uploadType) {
        case 'image':
          console.log('Uploading image to Cloudinary...');
          url = await uploadImage(file);
          break;
        case 'video':
          console.log('Uploading video to Cloudinary...');
          url = await uploadVideo(file);
          break;
        case 'audio':
          console.log('Uploading audio to Cloudinary...');
          url = await uploadAudio(file);
          break;
        default:
          console.error('Invalid file type:', uploadType);
          return NextResponse.json(
            { error: `Invalid file type: ${uploadType}` },
            { status: 400 }
          );
      }

      console.log('Upload successful:', url);
      return NextResponse.json({ url });
    } catch (uploadError: any) {
      console.error('Cloudinary upload error:', uploadError);
      return NextResponse.json(
        { error: `Cloudinary upload failed: ${uploadError.message || uploadError}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: `Upload failed: ${error.message || error}` },
      { status: 500 }
    );
  }
}
