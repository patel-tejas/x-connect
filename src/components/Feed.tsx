import React from 'react'
import { DocumentData, collection, getDocs, getFirestore,  orderBy, query } from 'firebase/firestore'

import {app}from '../firebase'

import Post from './Post'

const Feed = async () => {
    const db = getFirestore(app)
    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'))
    const querySnapshot = await getDocs(q)
    let data: DocumentData[] = []
    querySnapshot.forEach((doc) => {
        data.push({id:doc.id, ...doc.data()})
    })
    // console.log(data)
  return (
    <div className=''>
        {data.map((post: DocumentData) => (
            <Post key={post.id} id={post.id} post={post} />
        ))}
    </div>
  )
}

export default Feed