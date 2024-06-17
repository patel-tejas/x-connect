"use client"

import { collection, deleteDoc, doc, getFirestore, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore'
import { signIn, useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { HiHeart, HiOutlineChat, HiOutlineHeart, HiOutlineTrash } from 'react-icons/hi'
import { app } from "../firebase"
import { useRecoilState } from 'recoil'
import { modalState, postIdState } from '@/atom/modalAtom'

const db = getFirestore(app)
const Icons = ({ id, uid }: { id: string, uid: string }) => {
    const [isLiked, setIsLiked] = useState<boolean>(false)
    const [likes, setLikes] = useState<any>([])
    const [comments, setComments] = useState<any>([])
    const { data: session } = useSession()
    const [open, setOpen] = useRecoilState(modalState)
    const [postId, setPostId] = useRecoilState(postIdState)

    

    useEffect(() => {
        onSnapshot(collection(db, 'posts', id, "likes"), (snapshot) => {
            setLikes(snapshot.docs)
        })

    }, [db, isLiked])

    useEffect(() => {
        setIsLiked(likes.findIndex((like: any) => like?.id === session?.user?.uid) !== -1)

    }, [likes, setIsLiked])

    useEffect(()=>{
        const comments = onSnapshot(collection(db, 'posts', id, "comments"), (snapshot) => {
            setComments(snapshot.docs)
        })

        return () => comments()
    }, [db, id])

    const likePost = async () => {
        if (session) {

            if (isLiked) {
                await deleteDoc(doc(db, 'posts', id, "likes", session?.user?.uid))
                setIsLiked(false)
            }
            else {
                await setDoc(doc(db, 'posts', id, "likes", session?.user?.uid), {
                    username: session?.user?.username,
                    timeStamp: serverTimestamp()
                })
            }

        } else {
            signIn()
        }
    }

    const handleDeletePost = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            if(session?.user?.uid === uid){
                await deleteDoc(doc(db, 'posts', id))
                window.location.reload()
            }
            else{
                alert('You are not authorized to delete this post')
            }
        }
    }

    return (
        <div className='flex gap-5 p-1 text-gray-500'>
            <div className='flex items-center text-xs'>

            <HiOutlineChat className='h-8 w-8 cursor-pointer rounded-full  p-2 transition duration-500 ease-in-out hover:text-sky-500 hover:bg-sky-200' 
            onClick={()=> {
                if (!session){
                    signIn()
                }else{
                    setPostId(id)
                    setOpen(!open)
                }
            }}
            />
            {
                comments.length > 0 && (
                    <span className='text-xs mt-[2px]'>{comments.length}</span>
                )
            }
            </div>

            <div className='flex items-center text-xs'>

                {isLiked ? (
                    <HiHeart className='h-8 w-8 cursor-pointer rounded-full  p-2 transition duration-500 ease-in-out text-red-500 hover:text-red-500 hover:bg-red-200' onClick={likePost} />
                ) : (
                    <HiOutlineHeart className='h-8 w-8 cursor-pointer rounded-full  p-2 transition duration-500 ease-in-out hover:text-red-500 hover:bg-red-200' onClick={likePost} />
                )}
                {likes.length > 0 && (
                    <span className={`text-xs mt-[2px] ${isLiked ? 'text-red-500' : 'text-gray-500'}`}>{likes.length}</span>
                )}
            </div>
            {
                session?.user?.uid === uid &&
                <HiOutlineTrash className='h-8 w-8 cursor-pointer rounded-full  p-2 transition duration-500 ease-in-out hover:text-red-500 hover:bg-red-200'
                    onClick={handleDeletePost} />
            }
        </div>
    )
}
export default Icons