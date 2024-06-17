'use client';

import {
    DocumentData,
    collection,
    getFirestore,
    onSnapshot,
    orderBy,
    query,
} from 'firebase/firestore';
import { app } from '../firebase';
import { useEffect, useState } from 'react';
import Comment from './Comment';

export default function Comments({ id }: { id: string }) {
    const db = getFirestore(app);
    const [comments, setComments] = useState<any>([]); // [1
    useEffect(() => {
        onSnapshot(
            query(
                collection(db, 'posts', id, 'comments'),
                orderBy('timestamp', 'desc')
            ),
            (snapshot) => {
                setComments(snapshot.docs);
            }
        );
    }, [db, id]);
    return (
        <div>
            {comments.map((comment: DocumentData) => {
                return (
                    <Comment
                        key={comment.id}
                        comment={comment.data()}
                        commentId={comment.id}
                        originalPostId={id}
                    />
                )
            })}
        </div>
    );
}