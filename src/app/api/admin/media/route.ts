'use server';

import { NextRequest, NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import path from 'path';
import { writeFile } from 'fs/promises';
import { v4 as uuid } from 'uuid';

const UPLOAD_ROOT = path.join(process.cwd(), 'public', 'uploads', 'blog');

export async function GET() {
  try {
    const files = await readdir(UPLOAD_ROOT, { withFileTypes: true });
    const assets = await Promise.all(
      files
        .filter((entry) => entry.isFile())
        .map(async (entry) => {
          const fullPath = path.join(UPLOAD_ROOT, entry.name);
          const fileStat = await stat(fullPath);
          return {
            id: entry.name,
            filename: entry.name,
            url: `/uploads/blog/${entry.name}`,
            size: fileStat.size,
            type: entry.name.match(/\.(mp4|webm)$/i) ? 'video' : 'image',
            createdAt: fileStat.birthtime.toISOString(),
          };
        })
    );

    return NextResponse.json(assets, { status: 200 });
  } catch (error) {
    console.error('GET /api/admin/media error', error);
    return NextResponse.json({ error: 'Failed to list media assets' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'File missing' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ext = path.extname(file.name) || '.png';
    const filename = `blog-${uuid()}${ext}`;
    const diskPath = path.join(UPLOAD_ROOT, filename);

    await writeFile(diskPath, buffer);

    return NextResponse.json({
      success: true,
      asset: {
        id: filename,
        filename,
        url: `/uploads/blog/${filename}`,
        size: buffer.length,
        type: ext.match(/\.(mp4|webm)$/i) ? 'video' : 'image',
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('POST /api/admin/media error', error);
    return NextResponse.json({ error: 'Failed to upload asset' }, { status: 500 });
  }
}

