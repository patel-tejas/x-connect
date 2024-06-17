"use client"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useSession } from 'next-auth/react';
import React, { useEffect, useRef, useState } from 'react'
import { HiOutlinePhotograph } from 'react-icons/hi';
import { app } from "../firebase"
import { addDoc, collection, getFirestore, serverTimestamp } from 'firebase/firestore';

const Input = () => {
    const { data: session } = useSession<any>();
    const imagePickRef = useRef<any>(null);
    const [imageFileUrl, setImageFileUrl] = useState<string | null>(null)
    const [selectedFile, setSelectedFile] = useState<string | null>(null)
    const [imageFileUploading, setImageFileUploading] = useState(false)
    const [text, setText] = useState<string>('')
    const [postLoading, setPostLoading] = useState<boolean>(false);
    const db = getFirestore(app);

    useEffect(() => {
        if (selectedFile) {
            uploadImageToStorage();
            const storage = getStorage(app)
        }


    }, [selectedFile])

    const addImageToPost = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file)
            const url: string = URL.createObjectURL(file)
            if (url){
                console.log(url);
                
                setImageFileUrl(url)
            }
            else{
                setImageFileUrl(null)
            }
        }
    }

    const uploadImageToStorage = () => {
        setImageFileUploading(true)
        const storage = getStorage(app)
        const fileName = new Date().getTime() + '-' + selectedFile.name
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, selectedFile)



        uploadTask.on(
            'state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        break;
                }
                alert("Error while uploading image: Please make sure your file size is less than 2 MB")
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL)
                    setImageFileUploading(false)
                });
            }
        );
    }

    const handleSubmit = async () => {
        if (!session || !session.user){
            return
        }
        setPostLoading(true)
        const docRef = await addDoc(collection(db, 'posts'), {
            uid: session.user.uid,
            name: session.user.name,
            username: session.user.username,
            text,
            profileImg: session.user.image,
            timestamp: serverTimestamp(),
            image: imageFileUrl,
        })
        location.reload()
        setPostLoading(false)
        setText('')
        setSelectedFile(null)
        setImageFileUrl(null)
    }

    if (!session) {
        return null
    }

    if (session) {

        return (
            <div className='flex border-b border-gray-200 p-3 space-x-3 w-full'>
                <img
                    src={session?.user?.image || "/pfp.jpg"}
                    alt='user-img'
                    className='h-11 w-11 rounded-full cursor-pointer hover:brightness-95'
                />
                <div className='w-full divide-y divide-gray-200'>
                    <textarea
                        className='w-full border-none outline-none tracking-wide min-h-[50px] text-gray-700 '
                        placeholder='Whats happening'
                        rows={2}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    >

                    </textarea>
                    {selectedFile && (
                        <img
                            src={imageFileUrl}
                            alt='image'
                            className={`w-full max-h-[250px] object-cover cursor-pointer
            ${imageFileUploading ? 'animate-pulse' : ''}`}
                        />
                    )}

                    <div className='flex items-center justify-between pt-2.5'>
                        <HiOutlinePhotograph className='h-10 w-10 rounded-full p-2 text-sky-500 hover:bg-sky-100'
                            onClick={() => imagePickRef.current.click()}
                        />
                        <input
                            type="file"
                            // className='hidden'
                            ref={imagePickRef}
                            accept='image/*'
                            onChange={addImageToPost}
                            hidden
                        />

                        <button
                            className='bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50'
                            disabled={text.trim() === '' || postLoading || imageFileUploading}
                            onClick={handleSubmit}
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Input