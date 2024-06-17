import { DocumentData } from 'firebase/firestore'
import Link from 'next/link'
import React from 'react'
import { HiDotsHorizontal } from 'react-icons/hi'
import Icons from './Icons'

const Post = ({ post, id }: {
    post: DocumentData, id: string
}) => {
    //   console.log(post, id);

    return (
        <>
            <div className='flex p-3 border-b border-gray-300 hover:bg-gray-200 duration-100 '>
                <img src={post?.profileImg} alt="" className='h-11 w-11 rounded-full mr-2' />
                <div className='flex-1'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-1 whitespace'>
                            <h4 className='font-bold text-sm truncate'>
                                {post?.name}
                            </h4>
                            <span className='text-xs truncate'>
                                @{post?.username}
                            </span>
                        </div>
                        <HiDotsHorizontal className='text-sm' />
                    </div>
                    <Link href={`/posts/${id}`}>
                        <p className='text-gray-800 text-sm my-3'>{post?.text}</p>
                    </Link>
                    {post?.image &&
                        <Link href={`/posts/${id}`}>
                            <img src={post?.image} alt="pos-img" className='rounded-2xl mr-2 ' />
                        </Link>
                    }
                    <Icons id={id} uid={post?.uid} />
                </div>
            </div>
        </>
    )
}

export default Post