'use client';

import { HiDotsHorizontal, HiHeart, HiOutlineHeart } from 'react-icons/hi';
import { useState, useEffect } from 'react';
import {
    getFirestore,
    onSnapshot,
    collection,
    setDoc,
    doc,
    serverTimestamp,
    deleteDoc,
} from 'firebase/firestore';
import { app } from '../firebase';
import { signIn, useSession } from 'next-auth/react';

export default function Comment({ comment, commentId, originalPostId }: {
    comment: any;
    commentId: string;
    originalPostId: string;
}) {
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [likes, setLikes] = useState<string[]>([]);
    const { data: session } = useSession<any>(); // Assuming you have an interface for Session
    const db = getFirestore(app);

    console.log(session);

    const likePost = async () => {
        if (session && session.user) { // Check if session and user exist
            const userId = session.user.uid; // Now you can access 'uid' type-safely

            if (isLiked) {
                await deleteDoc(
                    doc(
                        db,
                        'posts',
                        originalPostId,
                        'comments',
                        commentId,
                        'likes',
                        userId
                    )
                );
            } else {
                await setDoc(
                    doc(
                        db,
                        'posts',
                        originalPostId,
                        'comments',
                        commentId,
                        'likes',
                        userId
                    ),
                    {
                        username: session.user.username, // Assuming username exists
                        timestamp: serverTimestamp(),
                    }
                );
            }
        } else {
            signIn();
        }
    };

    useEffect(() => {
        onSnapshot(
            collection(db, 'posts', originalPostId, 'comments', commentId, 'likes'),
            (snapshot) => {
                setLikes(snapshot.docs);
            }
        );
    }, [db]);

    useEffect(() => {
        setIsLiked(
            likes.findIndex((like) => like.id === session?.user?.uid) !== -1
        );
    }, [likes]);

    return (
        <div className='flex p-3 border-b border-gray-200 hover:bg-gray-50 pl-10'>
            <img
                src={comment?.userImg}
                alt='user-img'
                className='h-9 w-9 rounded-full mr-4'
            />
            <div className='flex-1'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-1 whitespace-nowrap'>
                        <h4 className='font-bold text-sm truncate'>{comment?.name}</h4>
                        <span className='text-xs truncate'>@{comment?.username}</span>
                    </div>
                    <HiDotsHorizontal className='text-sm' />
                </div>

                <p className='text-gray-800 text-xs my-3'>{comment?.comment}</p>
                <div className='flex items-center'>
                    {isLiked ? (
                        <HiHeart
                            onClick={likePost}
                            className='h-8 w-8 cursor-pointer rounded-full  transition text-red-600 duration-500 ease-in-out p-2 hover:text-red-500 hover:bg-red-100'
                        />
                    ) : (
                        <HiOutlineHeart
                            onClick={likePost}
                            className='h-8 w-8 cursor-pointer rounded-full  transition duration-500 ease-in-out p-2 hover:text-red-500 hover:bg-red-100'
                        />
                    )}
                    {likes?.length > 0 && (
                        <span className={`text-xs ${isLiked && 'text-red-600'}`}>
                            {likes.length}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}