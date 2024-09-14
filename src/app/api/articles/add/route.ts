import { NextRequest, NextResponse } from "next/server";
import { auth } from '@/auth';
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';

const prisma = new PrismaClient();

function tagExists(allTags: Object[], tag: string) {
    for (var i of allTags) {
        if ((i as any).name === tag) return true;
    }
    return false;
}

function getTagId(allTags: Object[], tag: string) {
    if (tagExists(allTags, tag)) {
        for (var i of allTags) {
            if ((i as any).name == tag) return (i as any).id
        }
    }
    return null;
}

interface TagToConnect {
    id: string,
}

interface TagToCreate {
    name: string,
}


export async function POST(request: NextRequest) {
    const formData = await request.formData()
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const thumbnail = formData.get('thumbnail') as File | undefined
    const tags = formData.getAll('tags[]') as string[]
    let thumbnailName;
    prisma.$connect()

    const session = await auth();

    console.log(thumbnail,title,content)
    // if (thumbnail != undefined) {
    //     if (thumbnail.size > 512000) return;

    //     const buffer = Buffer.from(await thumbnail.arrayBuffer())
    //     thumbnailName = `${new Date().getDate()}_${new Date().getTime()}_${uuidv4()}_${path.extname(thumbnail.name)}`
    //     const thumbnailPath = path.join(process.cwd(), 'public', 'uploads', 'articles', 'thumbnails', thumbnailName)
    //     try {
    //         await fs.mkdir(path.dirname(thumbnailPath), { recursive: true })
    //         await fs.writeFile(thumbnailPath, buffer)
    //     } catch (error) {
    //         return NextResponse.json({ type: 'error', "error": error })
    //     }
    // }


    const newArticle = await prisma.article.create({
        data: {
            title: title,
            content: content,
            coverImage: `${thumbnailName}`,
            author: {
                connect: {
                    email: session?.user?.email as string
                }
            }
        },
    })

    for (var tag of tags) {
        const updateRes = await prisma.article.update({
            where: { id: newArticle.id },
            data: {
                tags: {
                    connectOrCreate: {
                        where: { name: tag },
                        create: { name: tag }
                    }
                }
            }
        })
    }

    prisma.$disconnect()
    return NextResponse.json({ type: 'success', article: newArticle })
}